FROM node:18-alpine

# Install git
RUN apk add --no-cache git

WORKDIR /app

# Clone the backend repository
# Replace <backend-repo-url> with your actual backend repository URL
RUN git clone <backend-repo-url> .

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"] 