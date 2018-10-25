FROM node:8

WORKDIR /app-test

COPY package.json /app-test

RUN npm install

COPY . /app-test

EXPOSE 3000

CMD [ "npm", "start" ]