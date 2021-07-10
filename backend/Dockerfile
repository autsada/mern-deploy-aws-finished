# Base image
FROM node:14-alpine as base

# Build stage
FROM base as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.d.ts ./node_modules/@types/mongoose/
COPY . .
RUN npm run build

# Final stage
FROM base
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./
RUN npm install --only=production
EXPOSE 5000
CMD ["index.js"]