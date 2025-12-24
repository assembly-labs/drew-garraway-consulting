#!/bin/bash
echo "Testing production Claude API..."
curl -X POST https://librarian-llm.netlify.app/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"systemPrompt\":\"You are a test assistant. Just say hello.\"}" \
  -s -w "\nHTTP Status: %{http_code}\n"