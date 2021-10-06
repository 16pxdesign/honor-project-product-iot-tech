FROM node

# Create app directory
RUN mkdir -p /usr/src/production/app
WORKDIR /usr/src/production/app

# Install app dependencies
COPY ./SERVICES/package.json /usr/src/production/app/

RUN npm install

RUN mkdir -p /usr/src/production/app/build/
RUN mkdir -p /usr/src/production/escore/build/

# Bundle app source
COPY ./escore/build /usr/src/production/escore/build/
COPY ./SERVICES/build /usr/src/production/app/build/
COPY ./SERVICES/.env /usr/src/production/app/



EXPOSE 3000
CMD [ "node", "./build/server.js" ]
