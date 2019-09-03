FROM node:10

# Setting working directory. All the path will be relative to WORKDIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY src/ ./src

EXPOSE 8080

# Running the app
ENTRYPOINT [ "npm", "run", "dev" ]
