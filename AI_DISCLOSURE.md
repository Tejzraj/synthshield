# AI Disclosure — SynthShield

Team: RVCE_SynthShield
Project: Artificial User

## AI Tools & Models Used

### 1. Claude Sonnet 4 (Anthropic)
- **Where**: Core of the pipeline — called twice per run
- **How**: 
  - First call generates a synthetic user persona (name, age, job, habits, apps) as structured JSON
  - Second call generates matching Data Tank artifacts (emails, calendar events, app logs) as structured JSON
- **API**: Anthropic /v1/messages endpoint
- **Model string**: claude-sonnet-4-20250514

### 2. Claude.ai (Anthropic)
- **Where**: Development assistance
- **How**: Used to help build and debug the React frontend, Node.js backend, and architecture design

### 3. Differential Privacy (ε-DP)
- **Where**: Layer 01 of the pipeline
- **How**: Privacy budget parameter (ε) is passed to the AI prompt to control how realistic vs private the generated data is. Lower ε = more noise = stronger privacy guarantee.

## What AI does NOT do in this project
- AI does not access or process any real user data
- AI does not store any generated personas
- All generation happens in-memory and is discarded after the session
