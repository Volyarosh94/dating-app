FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN ls -al

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

CMD [ "npm", "uninstall", "bcrypt" ]
CMD [ "npm", "install", "bcrypt" ]
CMD [ "npm", "i", "bcrypt", "--unsafe-perm=true", "--allow-root", "--save" ]
CMD [ "yarn", "start:dev" ]
