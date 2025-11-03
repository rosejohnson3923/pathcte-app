#!/bin/bash

# PathCTE Durable Functions - Endpoint Testing Script
# Run this AFTER starting the Functions with ./test-local.sh

BASE_URL="http://localhost:7071/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================"
echo "PathCTE Durable Functions - API Tests"
echo "======================================"
echo ""

# Test 1: Initialize Game
echo -e "${BLUE}Test 1: Initialize Game${NC}"
echo "POST $BASE_URL/game/initialize"
echo ""

INIT_RESPONSE=$(curl -s -X POST "$BASE_URL/game/initialize" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-001",
    "questionSetId": "test-qset-001",
    "questions": [
      {
        "id": "q1",
        "question_text": "What is 2+2?",
        "options": [
          {"text": "3", "is_correct": false},
          {"text": "4", "is_correct": true},
          {"text": "5", "is_correct": false}
        ],
        "points": 100,
        "time_limit_seconds": 30
      },
      {
        "id": "q2",
        "question_text": "What is the capital of France?",
        "options": [
          {"text": "London", "is_correct": false},
          {"text": "Paris", "is_correct": true},
          {"text": "Berlin", "is_correct": false}
        ],
        "points": 100,
        "time_limit_seconds": 30
      }
    ],
    "progressionControl": "manual",
    "allowLateJoin": false,
    "players": [
      {
        "id": "player-001",
        "userId": "user-001",
        "displayName": "Test Player 1"
      },
      {
        "id": "player-002",
        "userId": "user-002",
        "displayName": "Test Player 2"
      }
    ]
  }' 2>&1)

echo "$INIT_RESPONSE" | jq '.' 2>/dev/null || echo "$INIT_RESPONSE"
echo ""

if echo "$INIT_RESPONSE" | grep -q '"success":true\|"runtimeStatus":"Running"'; then
    echo -e "${GREEN}✓ Game initialized successfully${NC}"
else
    echo -e "${RED}✗ Game initialization failed${NC}"
fi

echo ""
echo "Press Enter to continue to next test..."
read

# Test 2: Start Question
echo -e "${BLUE}Test 2: Start Question${NC}"
echo "POST $BASE_URL/game/startQuestion"
echo ""

START_Q_RESPONSE=$(curl -s -X POST "$BASE_URL/game/startQuestion" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-001",
    "questionIndex": 0
  }' 2>&1)

echo "$START_Q_RESPONSE" | jq '.' 2>/dev/null || echo "$START_Q_RESPONSE"
echo ""

if echo "$START_Q_RESPONSE" | grep -q '"success":true\|"runtimeStatus":"Running"'; then
    echo -e "${GREEN}✓ Question started successfully${NC}"
else
    echo -e "${RED}✗ Question start failed${NC}"
fi

echo ""
echo "Press Enter to continue to next test..."
read

# Test 3: Get Timer State
echo -e "${BLUE}Test 3: Get Timer State${NC}"
echo "GET $BASE_URL/game/timerState/test-session-001"
echo ""

TIMER_RESPONSE=$(curl -s "$BASE_URL/game/timerState/test-session-001" 2>&1)

echo "$TIMER_RESPONSE" | jq '.' 2>/dev/null || echo "$TIMER_RESPONSE"
echo ""

if echo "$TIMER_RESPONSE" | grep -q '"questionIndex"\|"runtimeStatus":"Running"'; then
    echo -e "${GREEN}✓ Timer state retrieved${NC}"
else
    echo -e "${YELLOW}⚠ Timer state may not be ready yet (orchestrator still running)${NC}"
fi

echo ""
echo "Press Enter to continue to next test..."
read

# Test 4: Submit Answer
echo -e "${BLUE}Test 4: Submit Answer${NC}"
echo "POST $BASE_URL/game/submitAnswer"
echo ""

ANSWER_RESPONSE=$(curl -s -X POST "$BASE_URL/game/submitAnswer" \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player-001",
    "sessionId": "test-session-001",
    "questionIndex": 0,
    "questionId": "q1",
    "selectedOptionIndex": 1,
    "submittedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "question": {
      "options": [
        {"is_correct": false},
        {"is_correct": true},
        {"is_correct": false}
      ],
      "points": 100,
      "time_limit_seconds": 30
    }
  }' 2>&1)

echo "$ANSWER_RESPONSE" | jq '.' 2>/dev/null || echo "$ANSWER_RESPONSE"
echo ""

if echo "$ANSWER_RESPONSE" | grep -q '"success":true\|"isCorrect":true\|"runtimeStatus":"Running"'; then
    echo -e "${GREEN}✓ Answer submitted successfully${NC}"
else
    echo -e "${RED}✗ Answer submission failed${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}Testing Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Check Azurite storage tables (if Functions are still running):"
echo "     - Open Azure Storage Explorer"
echo "     - Connect to Local Emulator"
echo "     - Check Tables for DurableFunctionsHub* entries"
echo ""
echo "  2. Check Functions logs in the terminal where you ran ./test-local.sh"
echo ""
echo "  3. If tests failed with 'orchestrator still running', that's normal!"
echo "     Durable Functions use async processing. Check status URLs in response."
echo ""
