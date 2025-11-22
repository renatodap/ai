# AI Daily - Velara

AI-curated daily news reader with real-time web search capabilities.

## Project Structure

```
ai-daily/
├── velara/          # Main Velara app
│   ├── api/         # Vercel serverless functions
│   ├── src/         # React frontend
│   ├── docs/        # Documentation
│   └── ...
└── vercel.json      # Root Vercel configuration
```

## Deployment

This project is configured for Vercel deployment with the app located in the `velara` subdirectory.

### Environment Variables Required

```env
OPENROUTER_API_KEY=sk-or-your-key-here
CRON_SECRET=your-secure-random-string
```

### Deploy to Vercel

1. Import repository: https://github.com/renatodap/ai.git
2. **Important**: Set Root Directory to `velara` in Vercel project settings
3. Add environment variables
4. Deploy!

Alternatively, the root `vercel.json` handles the subdirectory automatically.

## Features

- ✅ Real-time AI news via web search (not AI-generated)
- ✅ `openai/o3-deep-research` for always-on web search
- ✅ Fallback to `perplexity/sonar-pro-search`
- ✅ Daily cron updates at midnight UTC
- ✅ Swiss-Cyber aesthetic design
- ✅ React 19 + Vite + Tailwind CSS

## Documentation

See `velara/docs/WEB_SEARCH_UPGRADE.md` for technical details.

## Local Development

```bash
cd velara
npm install
npm run dev
```

## License

MIT
