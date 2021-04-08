FROM node

RUN apt-get update

RUN mkdir -p /src
WORKDIR /src
COPY package.json .
RUN npm install

COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY icons/ ./icons
COPY favicons/ ./favicons
COPY launch-screens/ ./launch-screens
COPY manifest.json .
COPY start.js .
COPY config.xml .

EXPOSE 8181

ENTRYPOINT ["npm", "start"]
