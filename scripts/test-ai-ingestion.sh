#!/usr/bin/env bash
set -euo pipefail

API_KEY="${INTEGRATION_API_KEY:-pathwise-local-dev}"
BASE_URL="http://localhost:3001"

echo "Using API key: $API_KEY"

CREATE_PAYLOAD='{
  "program_id": "housing",
  "client_ref": "david_thompson",
  "stage": "Housing Search & Applications",
  "task": "Assist with housing applications",
  "status": "in_progress",
  "notes": "Assisted Frank with housing applications today.",
  "evidence": [
    {
      "source": "slack",
      "permalink": "https://example.slack.com/archives/C000/p000",
      "author": "Ryan",
      "timestamp": "2026-03-04T22:19:00Z"
    }
  ],
  "confidence": 0.74,
  "requires_review": true
}'

echo "Creating extraction..."
EXTRACTION_ID=$(curl -sS -X POST "$BASE_URL/integrations/slack/extractions" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "$CREATE_PAYLOAD" | sed -E 's/.*"id":"([^"]+)".*/\1/')

echo "Extraction ID: $EXTRACTION_ID"

echo "Approving extraction..."
curl -sS -X PATCH "$BASE_URL/integrations/slack/extractions/$EXTRACTION_ID/approve" \
  -H "x-api-key: $API_KEY"

echo

echo "Done."
