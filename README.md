# YouTube ► LLM | Transcript Summarizer

A full-stack application that extracts YouTube video transcripts and generates AI-powered summaries using OpenAI's GPT models.

## 🏗️ Architecture

This project is structured as a monorepo:

```
YouTube_transcript/
├── server/          # Express.js API backend
├── client/          # Frontend (HTML + Tailwind CSS)
├── shared/          # Shared TypeScript types
├── render.yaml      # Render.com deployment config
└── package.json     # Root coordination scripts
```

## ✨ Features

- **Instant Processing**: Paste a YouTube URL and get an AI summary
- **Smart Caching**: Avoid reprocessing the same videos
- **Recent History**: Quick access to previously processed videos
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Production Ready**: PostgreSQL support and Render deployment

## 🚀 Quick Start

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd YouTube_transcript
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your OpenAI API key
   ```

3. **Initialize database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```
   This runs both the API server and Tailwind CSS watcher concurrently.

### Production Build

```bash
npm run build
npm start
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both server and client development
- `npm run build` - Build both client and server for production
- `npm start` - Start production server
- `npm run install:all` - Install dependencies for all packages

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:deploy` - Deploy migrations (production)

## 🌐 Deployment

### Render.com (Recommended)

1. **Connect your GitHub repository** to Render
2. **Use the included `render.yaml`** for automatic deployment
3. **Set environment variables** in Render dashboard:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - Database URL is automatically configured

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up PostgreSQL database** and update `DATABASE_URL`

3. **Run database migrations:**
   ```bash
   npm run db:deploy
   ```

4. **Start the server:**
   ```bash
   npm start
   ```


## 📝 Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode
- `CORS_ORIGIN` - CORS origin for production

## 🛠️ Tech Stack

### Current
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: Prisma
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **AI**: OpenAI GPT API


## 📋 API Endpoints

- `POST /api/process` - Process a YouTube URL
- `GET /api/status/:id` - Check processing status
- `GET /api/list` - List recent transcripts
- `GET /health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
