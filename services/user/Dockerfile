FROM node:lts-alpine

WORKDIR /srv

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i

COPY . .

CMD ["node", "index.js"]
