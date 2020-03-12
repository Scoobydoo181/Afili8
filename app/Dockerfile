FROM node:alpine

WORKDIR /usr/afili8/

COPY backend backend/
COPY public public/
COPY views views/
COPY package.json .
COPY server.js .

RUN npm install

EXPOSE 3000

CMD ["node", "-r", "esm", "server.js"]