FROM node:8.11.4-alpine

WORKDIR /brooklyn-client

COPY package*.json /brooklyn-client/
RUN npm install

COPY . /brooklyn-client/

EXPOSE 3000
EXPOSE 35729

CMD ["npm", "start"]
