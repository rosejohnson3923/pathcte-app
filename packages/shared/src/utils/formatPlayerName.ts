/**
 * Format player name as "First Name + Last Initial"
 * Examples:
 *   - "Isaiah Hopson" -> "Isaiah H."
 *   - "John" -> "John"
 *   - "student1" -> "student1"
 */
export function formatPlayerName(displayName: string): string {
  if (!displayName || displayName.trim() === '') {
    return 'Player';
  }

  const parts = displayName.trim().split(' ');

  if (parts.length === 1) {
    // Single name, return as-is
    return parts[0];
  }

  // Multiple parts - use first name + last initial
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';

  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

/**
 * Format player name from separate first and last name fields
 */
export function formatPlayerNameFromParts(firstName?: string | null, lastName?: string | null): string {
  if (!firstName) {
    return 'Player';
  }

  if (!lastName) {
    return firstName;
  }

  const lastInitial = lastName[0]?.toUpperCase() || '';
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}
