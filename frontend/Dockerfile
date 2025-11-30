FROM node:20-alpine

WORKDIR /app

# Copy workspace root package.json
COPY package*.json ./

# Copy packages/i18n
COPY packages ./packages

# Copy frontend package.json
COPY frontend/package*.json ./frontend/

# Install all workspace dependencies
RUN npm install

# Copy frontend source code
COPY frontend ./frontend

# Set working directory to frontend
WORKDIR /app/frontend

# Expose port
EXPOSE 3000

# Development mode with hot reload
CMD ["npm", "run", "dev"]
