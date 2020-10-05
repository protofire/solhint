FROM node:12

WORKDIR /app
COPY . .

RUN npm pack

RUN npm i -g solhint*tgz

WORKDIR /app/e2e

RUN npm i

CMD npm test
