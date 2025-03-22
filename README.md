# Resume Suggestion Tool

An AI-powered tool that analyzes job descriptions and provides targeted resume optimization suggestions.

## Features

- Job description analysis
- Automatic keyword extraction
- Benefits identification
- Resume optimization suggestions
- LaTeX resume generation

## Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/resume-suggestion-tool.git
cd resume-suggestion-tool
```

2. Install dependencies
Create `.env` file with required environment variables
`REACT_APP_API_URL=https://resume-backend-b1fj.onrender.com`

## Development

Start the development server:
`npm start`

Build for production:
`npm run build`

## Local Development

1. Create `.env.development.local`:
```properties
REACT_APP_API_URL=http://localhost:5001
```

### Development Mode

The application includes a development mode with enhanced logging and a dev tools panel.

**To run in development mode:**

```bash
# Using npm script
npm run dev

# Or with environment variables directly
REACT_APP_DEV_MODE=true REACT_APP_LOG_LEVEL=debug npm start
```

### Development Mode Features

1. **Dev Tools Panel:** Access by clicking the "Show Dev Tools" button in the top-right corner
2. **Detailed Logging:** Check the browser console for detailed logs
3. **Application State Monitoring:** See current state, API calls, and performance metrics
4. **Testing Tools:** Simulate errors, clear local storage, etc.

### Log Levels

You can adjust the logging level in the Dev Tools panel or by setting the environment variable:

- `debug` - All logs (detailed, verbose)
- `info` - Informational messages, warnings and errors
- `warn` - Only warnings and errors
- `error` - Only errors

Example:
```bash
REACT_APP_LOG_LEVEL=debug npm start
```

### Full Development Environment Variables

Create a `.env.development` file with the following variables:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEV_MODE=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_VERSION=0.1.0-dev
```

## Deployment
This application is configured for deployment on Vercel.

- Technologies
- React 18
- OpenAI API (backend)
- Vercel (hosting)
- LaTeX (resume generation)

### Version
Current version: 0.1.0-alpha.1

### License
Private repository - All rights reserved