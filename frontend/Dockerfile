# Stage 1: Build React 18 Application
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build production distribution
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx Alpine
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
