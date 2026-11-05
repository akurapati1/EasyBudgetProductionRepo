FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 5001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:5001/health || exit 1
CMD ["node", "server.js"]
