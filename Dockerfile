FROM node:11.14-alpine

# Setting working directory. All the path will be relative to WORKDIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json next.config.js ./
RUN npm install

# Copying source files
COPY src/ ./src

EXPOSE 8080

# Running the app
ENTRYPOINT [ "npm", "run", "dev" ]
