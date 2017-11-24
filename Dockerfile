FROM node:8.3.0-slim

ENV NODE_PATH="/usr/local/share/.config/yarn/global/node_modules:${NODE_PATH}"

ADD ./package.json .
ADD ./faker.js .

RUN yarn && yarn cache clean

ENTRYPOINT [ "node", "faker.js"]
CMD []