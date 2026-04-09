FROM node:24-bookworm-slim

WORKDIR /workspace

ENV NODE_PATH=/workspace/node_modules
ENV PATH=/workspace/node_modules/.bin:$PATH
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

RUN npm install \
  @typespec/compiler \
  @typespec/http \
  @typespec/rest \
  @typespec/openapi3

WORKDIR /workspace/project

ENTRYPOINT ["tsp", "compile", "docs/calendar.tsp", "--config", "/workspace/project/tspconfig.yaml"]
