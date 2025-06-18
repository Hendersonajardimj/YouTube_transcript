FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all dependencies
RUN npm run install:all

# Copy Prisma schema and generate client
COPY server/prisma ./server/prisma/
RUN cd server && npx prisma generate

# Copy source code
COPY server/ ./server/
COPY client/ ./client/
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Create data directory for potential SQLite fallback
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"] 