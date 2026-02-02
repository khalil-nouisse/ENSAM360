FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies safely inseat of npm install
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]