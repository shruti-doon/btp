# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install serve package
RUN npm install -g serve

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/build .

# Expose port 80
EXPOSE 80

# Start the server
CMD ["serve", "-s", ".", "-l", "80"]
