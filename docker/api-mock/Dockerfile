FROM node:24-bookworm-slim

WORKDIR /opt/prism

ENV PATH=/opt/prism/node_modules/.bin:$PATH
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

RUN npm install @stoplight/prism-cli@5.14.2

WORKDIR /app

EXPOSE 4010

CMD ["prism", "mock", "-h", "0.0.0.0", "/app/docs/openapi.yaml"]
