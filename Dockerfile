FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--open"]