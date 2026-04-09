FROM node:24-bookworm-slim

WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

EXPOSE 5173

CMD ["sh", "-lc", "npm install && npm run dev -- --host 0.0.0.0 --port 5173"]
