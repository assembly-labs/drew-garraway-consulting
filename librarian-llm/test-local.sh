#!/bin/bash
echo "Testing local Claude API with Haiku model..."
curl -X POST http://localhost:8888/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Say hello\"}],\"systemPrompt\":\"You are a test assistant. Just say hello back.\"}" \
  -s -w "\nHTTP Status: %{http_code}\n"