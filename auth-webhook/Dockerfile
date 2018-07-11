FROM node:8

WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install

COPY ./ /app/

CMD ["node", "server.js"]
