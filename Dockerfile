FROM node:latest

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

ADD .yarn_cache /usr/local/share/.cache/yarn/v2/

WORKDIR /usr/src/app

ADD ./package.json ./yarn.* ./docker-cmd.sh ./
RUN yarn install --production

RUN chmod +x ./docker-cmd.sh

EXPOSE 3000
CMD ["/bin/bash", "/usr/src/app/docker-cmd.sh"]

