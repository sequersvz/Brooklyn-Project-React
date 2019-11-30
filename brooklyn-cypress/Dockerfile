FROM cypress/base:8
# FROM cypress/browsers:chrome67

WORKDIR /brooklyn-cypress

COPY package*.json /brooklyn-cypress/
RUN npm install

CMD ["npm", "run", "cy:wait-and-run"]