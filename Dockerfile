# Step 1: Build the application
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy package management files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm ci

# Copy the entire source tree
COPY . .

# Run the build (Vite compilation of UI & Esbuild bundle of Express server)
RUN npm run build

# Step 2: Create the production-ready tiny runner image
FROM node:20-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Install production-only dependencies
RUN npm ci --only=production

# Expose port (Cloud Run will override process.env.PORT at runtime)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
