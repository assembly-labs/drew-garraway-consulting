#!/bin/bash

echo "=== Netlify Deployment Test Script ==="
echo "Time: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test the production endpoint
echo "Testing production Claude API..."
echo "URL: https://librarian-llm.netlify.app/.netlify/functions/claude-chat"
echo ""

response=$(curl -X POST https://librarian-llm.netlify.app/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello"}],"systemPrompt":"You are a helpful assistant. Just say hello back."}' \
  -s -w "\n===HTTP_STATUS===%{http_code}")

http_status=$(echo "$response" | grep "===HTTP_STATUS===" | sed 's/.*===HTTP_STATUS===//')
body=$(echo "$response" | sed '/===HTTP_STATUS===/d')

echo "Response Body:"
echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
echo ""
echo "HTTP Status: $http_status"
echo ""

# Check if successful
if [ "$http_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS! Claude API is working${NC}"
    echo "Model: claude-3-haiku-20240307"
elif [[ "$body" == *"not_found_error"* ]] && [[ "$body" == *"model"* ]]; then
    echo -e "${RED}❌ ERROR: Model not found${NC}"
    echo "The API key may not have access to this model"
    echo "Try checking your API key at: https://console.anthropic.com"
elif [[ "$body" == *"authentication"* ]] || [[ "$body" == *"401"* ]]; then
    echo -e "${RED}❌ ERROR: Authentication failed${NC}"
    echo "API key is invalid or not set correctly in Netlify"
elif [ "$http_status" = "500" ]; then
    echo -e "${RED}❌ ERROR: Server error${NC}"
    echo "Check Netlify function logs for details"
else
    echo -e "${YELLOW}⚠️  Unexpected response${NC}"
fi

echo ""
echo "=== Test Complete ==="