# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app
ARG API_URL=http://localhost:8080
ARG INTERNAL_API_URL=http://localhost:8080
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN echo "export const environment = { production: true, apiUrl: '${API_URL}', internalApiUrl: '${INTERNAL_API_URL}' };" > src/environments/environment.prod.ts
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /app/dist/eventos-web ./dist/eventos-web
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/eventos-web/server/server.mjs"]
