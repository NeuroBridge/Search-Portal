# Build environment
###################
FROM node:17-alpine3.14 AS builder

# Create and set working directory
RUN mkdir /src
WORKDIR /src

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

# Install and cache app dependencies
RUN apk add git
COPY package*.json /src/
RUN npm ci
# Copy in source files
COPY . /src

# Build app
RUN npm run build

# Production environment
########################
FROM bitnami/nginx:latest
COPY --from=builder /src/dist /opt/bitnami/nginx/html/
COPY ./server.conf /opt/bitnami/nginx/conf/server_blocks/server.conf
CMD ["nginx", "-g", "daemon off;"]
