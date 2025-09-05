# Frontend Dockerfile - Multi-stage build for React
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the React app for production
RUN npm run build

# Production stage - Use Nginx to serve static files
FROM nginx:alpine AS production

# Copy custom nginx config and entrypoint script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add labels for better container management
LABEL maintainer="aws-restart-student"
LABEL version="1.0.0"
LABEL description="Weather Dashboard Frontend - React App"

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]