FROM node:12-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . ./

ARG NODE_ENV
ARG REACT_APP_API_URL

RUN if [ "$NODE_ENV" = "production" ]; then REACT_APP_API_URL=${REACT_APP_API_URL} npm run-script build; fi

CMD [ "npx", "serve", "-s", "build/", "-l", "3000" ]
