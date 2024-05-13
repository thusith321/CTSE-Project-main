FROM node

WORKDIR /app/blog

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4004

CMD ["npm", "start"]cd