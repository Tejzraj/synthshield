# SynthShield — Artificial User

> Privacy-preserving synthetic data pipeline for AI testing

SynthShield generates realistic synthetic user personas and populates a virtual "Data Tank" with fake emails, calendar events, and app logs — so AI systems can be tested without ever touching real user data.

## How it works

- **Layer 01 — Knowledge Acquisition**: Differential Privacy (ε-DP) analysis of behavioural patterns
- **Layer 02 — Persona Generation**: Claude AI generates a vivid synthetic user profile
- **Layer 03 — Data Tank**: Claude AI fills a virtual device with matching emails, calendar events, and app logs

## Tech Stack

- Frontend: React + Vite
- AI: Claude Sonnet 4 (Anthropic API)
- Privacy: Differential Privacy (ε-DP)

## Getting Started

1. Clone the repo
   git clone https://github.com/Tejzraj/synthshield.git
   cd synthshield

2. Install dependencies
   npm install

3. Set up your API key
   cp .env.example .env
   Then open .env and paste your Anthropic API key

4. Run the app
   npm run dev

5. Open http://localhost:5173

## Team

RVCE SynthShield — RV College of Engineering
Likhith Raj · Simran S Patil · Parinitha BS · Venkumahanthi Taniya
