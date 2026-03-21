# Build stage
FROM node:20-alpine AS builder

ARG VITE_API_URL=http://api:8000/

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Create .env file with the API URL
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
