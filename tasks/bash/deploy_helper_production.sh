#!/usr/bin/env bash

KEEP_RELEASES=3
APP_ROOT=/usr/docker/containers/at.epps-apps.com
RELEASE_NAME=$(date '+%Y_%m_%d_%H_%M_%S')
DEPLOY_SERVER_URL=epps-apps.com
TEMP_DIR=temp
RELEASES_DIR=releases
APP_DIST_DIR=build
SERVER_DIR=server
JSDOC_DIR=out

ssh-keyscan -H ${DEPLOY_SERVER_URL} >> ~/.ssh/known_hosts

ssh deploy@${DEPLOY_SERVER_URL} "mkdir -p ${APP_ROOT}/${TEMP_DIR}"

rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress \
    ${APP_DIST_DIR} deploy@${DEPLOY_SERVER_URL}:${APP_ROOT}/${TEMP_DIR}
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress \
    ${SERVER_DIR} deploy@${DEPLOY_SERVER_URL}:${APP_ROOT}/${TEMP_DIR}
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress \
    ${JSDOC_DIR} deploy@${DEPLOY_SERVER_URL}:${APP_ROOT}/${TEMP_DIR}

ssh deploy@${DEPLOY_SERVER_URL} "\
    mkdir -p $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME; \
    mv $APP_ROOT/${TEMP_DIR}/* $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME; \
    rm -rf $APP_ROOT/${TEMP_DIR}; rm -rf $APP_ROOT/root/${APP_DIST_DIR}/*; \
    cp -r $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME/* $APP_ROOT/root/; \
    cd $APP_ROOT/${RELEASES_DIR} && ls -1tr | head -n -$KEEP_RELEASES | xargs -d '\n' rm -rf --; \
    cd $APP_ROOT/root && docker-compose up -d --build; \
    rm -rf ${APP_ROOT}/${TEMP_DIR}\
"
