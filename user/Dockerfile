FROM node

WORKDIR /app/user

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm", "start"]cd