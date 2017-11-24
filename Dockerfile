FROM node:8.3.0-slim
LABEL maintainer="Bartosz Majsak <bartosz.majsak@gmail.com>"

ENV NODE_PATH="/usr/local/share/.config/yarn/global/node_modules:${NODE_PATH}"

ADD ./package.json .
ADD ./faker.js .

RUN yarn && yarn cache clean

ENTRYPOINT [ "node", "faker.js"]
CMD []