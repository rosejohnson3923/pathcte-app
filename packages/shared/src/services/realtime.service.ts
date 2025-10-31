/**
 * Realtime Service
 * =================
 * Supabase real-time subscriptions for live game updates
 */

import { supabase } from '../config/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { GameSession, GamePlayer } from '../types/database.types';

export type GameEventType =
  | 'player_joined'
  | 'player_left'
  | 'game_started'
  | 'game_ended'
  | 'question_changed'
  | 'score_updated'
  | 'player_answered';

export interface GameEvent {
  type: GameEventType;
  payload: any;
  timestamp: string;
}

export type GameEventCallback = (event: GameEvent) => void;

/**
 * Realtime Service
 * Manages Supabase real-time subscriptions for live game functionality
 */
export const realtimeService = {
  // Active channels map
  channels: new Map<string, RealtimeChannel>(),

  /**
   * Subscribe to a game session
   */
  subscribeToGame(
    sessionId: string,
    callbacks: {
      onGameUpdate?: (session: GameSession) => void;
      onPlayerJoined?: (player: GamePlayer) => void;
      onPlayerLeft?: (player: GamePlayer) => void;
      onPlayerUpdate?: (player: GamePlayer) => void;
      onScoreUpdate?: (player: GamePlayer) => void;
    }
  ) {
    // Create channel for this game
    const channelName = `game:${sessionId}`;

    // Remove existing channel if any
    if (this.channels.has(channelName)) {
      this.unsubscribeFromGame(sessionId);
    }

    const channel = supabase.channel(channelName);

    // Subscribe to game_sessions changes
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_sessions',
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        if (callbacks.onGameUpdate) {
          callbacks.onGameUpdate(payload.new as GameSession);
        }
      }
    );

    // Subscribe to game_players INSERT (player joined)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_players',
        filter: `game_session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (callbacks.onPlayerJoined) {
          callbacks.onPlayerJoined(payload.new as GamePlayer);
        }
      }
    );

    // Subscribe to game_players UPDATE (score changes, disconnects, etc.)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_players',
        filter: `game_session_id=eq.${sessionId}`,
      },
      (payload) => {
        const newPlayer = payload.new as GamePlayer;
        const oldPlayer = payload.old as GamePlayer;

        // Check if player disconnected
        if (oldPlayer.is_connected && !newPlayer.is_connected && callbacks.onPlayerLeft) {
          callbacks.onPlayerLeft(newPlayer);
        }

        // Check if score updated
        if (oldPlayer.score !== newPlayer.score && callbacks.onScoreUpdate) {
          callbacks.onScoreUpdate(newPlayer);
        }

        // General player update callback
        if (callbacks.onPlayerUpdate) {
          callbacks.onPlayerUpdate(newPlayer);
        }
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to game ${sessionId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to game ${sessionId}`);
      } else if (status === 'TIMED_OUT') {
        console.error(`Timed out subscribing to game ${sessionId}`);
      } else if (status === 'CLOSED') {
        console.log(`Channel closed for game ${sessionId}`);
      }
    });

    // Store channel
    this.channels.set(channelName, channel);

    return channel;
  },

  /**
   * Unsubscribe from a game session
   */
  async unsubscribeFromGame(sessionId: string) {
    const channelName = `game:${sessionId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Unsubscribed from game ${sessionId}`);
    }
  },

  /**
   * Subscribe to presence (who's online in a game)
   */
  subscribeToPresence(
    sessionId: string,
    userId: string,
    displayName: string,
    callbacks: {
      onJoin?: (userId: string, metadata: any) => void;
      onLeave?: (userId: string) => void;
      onSync?: (presenceState: any) => void;
    }
  ) {
    const channelName = `presence:game:${sessionId}`;

    // Remove existing channel if any
    const existingChannel = this.channels.get(channelName);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
      this.channels.delete(channelName);
    }

    const channel = supabase.channel(channelName);

    // Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        if (callbacks.onSync) {
          callbacks.onSync(state);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (callbacks.onJoin) {
          newPresences.forEach((presence: any) => {
            callbacks.onJoin!(key, presence);
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (callbacks.onLeave) {
          leftPresences.forEach(() => {
            callbacks.onLeave!(key);
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track this user's presence
          await channel.track({
            user_id: userId,
            display_name: displayName,
            online_at: new Date().toISOString(),
          });
        }
      });

    this.channels.set(channelName, channel);

    return channel;
  },

  /**
   * Send a custom event to all players in a game (using broadcast)
   */
  async broadcastGameEvent(sessionId: string, event: GameEvent) {
    const channelName = `game:${sessionId}`;
    const channel = this.channels.get(channelName);

    if (!channel) {
      // This is OK - means we're relying on Postgres changes only
      // Broadcast is supplementary to database real-time subscriptions
      console.debug(`No active channel for game ${sessionId}, using Postgres changes only`);
      return { success: false, error: 'Channel not found' };
    }

    // Check if channel is subscribed
    if (channel.state !== 'joined') {
      console.debug(`Channel not ready for game ${sessionId} (state: ${channel.state}), using Postgres changes only`);
      return { success: false, error: 'Channel not ready' };
    }

    try {
      await channel.send({
        type: 'broadcast',
        event: event.type,
        payload: event.payload,
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error broadcasting event:', error);
      return { success: false, error };
    }
  },

  /**
   * Subscribe to broadcast events
   */
  subscribeToBroadcast(
    sessionId: string,
    eventType: GameEventType,
    callback: (payload: any) => void
  ) {
    const channelName = `game:${sessionId}`;
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
    }

    channel.on('broadcast', { event: eventType }, ({ payload }) => {
      callback(payload);
    });

    // Subscribe if not already subscribed
    if (channel.state !== 'joined') {
      channel.subscribe();
    }

    return channel;
  },

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll() {
    const promises = Array.from(this.channels.values()).map((channel) =>
      supabase.removeChannel(channel)
    );

    await Promise.all(promises);
    this.channels.clear();
    console.log('Unsubscribed from all channels');
  },

  /**
   * Get current presence state for a game
   */
  getPresenceState(sessionId: string) {
    const channelName = `presence:game:${sessionId}`;
    const channel = this.channels.get(channelName);

    if (!channel) {
      return null;
    }

    return channel.presenceState();
  },

  /**
   * Update presence metadata
   */
  async updatePresence(sessionId: string, metadata: any) {
    const channelName = `presence:game:${sessionId}`;
    const channel = this.channels.get(channelName);

    if (!channel) {
      console.warn(`No active presence channel for game ${sessionId}`);
      return { success: false, error: 'Channel not found' };
    }

    try {
      await channel.track(metadata);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating presence:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify host that a player is ready
   */
  async notifyPlayerReady(sessionId: string, playerId: string, displayName: string) {
    return this.broadcastGameEvent(sessionId, {
      type: 'player_joined',
      payload: {
        player_id: playerId,
        display_name: displayName,
      },
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Notify all players that game is starting
   */
  async notifyGameStarting(sessionId: string) {
    return this.broadcastGameEvent(sessionId, {
      type: 'game_started',
      payload: {},
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Notify all players of question change
   */
  async notifyQuestionChanged(sessionId: string, questionIndex: number, questionId: string) {
    return this.broadcastGameEvent(sessionId, {
      type: 'question_changed',
      payload: {
        question_index: questionIndex,
        question_id: questionId,
      },
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Notify all players that game has ended
   */
  async notifyGameEnded(sessionId: string) {
    return this.broadcastGameEvent(sessionId, {
      type: 'game_ended',
      payload: {},
      timestamp: new Date().toISOString(),
    });
  },
};
