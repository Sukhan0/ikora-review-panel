FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
ENV PORT=10000
ENV REVIEW_USER=apple
ENV REVIEW_PASS=ReviewIkora2026
EXPOSE 10000
CMD ["node", "server.js"]
