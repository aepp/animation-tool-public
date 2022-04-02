#!/usr/bin/env bash
KEEP_RELEASES=3
APP_ROOT=/usr/docker/containers/at.epps-apps.com
RELEASE_NAME=$(date '+%Y_%m_%d_%H_%M_%S')
DEPLOY_SERVER_URL=epps-apps.com
TEMP_DIR=temp
RELEASES_DIR=releases

ssh-keyscan -H ${DEPLOY_SERVER_URL} >> ~/.ssh/known_hosts

ssh deploy@${DEPLOY_SERVER_URL} "mkdir -p ${APP_ROOT}/${TEMP_DIR}"

rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress \
    ${ARTIFACT_TAR_NAME_FINAL}.tar.gz deploy@${DEPLOY_SERVER_URL}:${APP_ROOT}/${TEMP_DIR}

ssh deploy@${DEPLOY_SERVER_URL} "\
    mkdir -p $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME; \
    tar -xvzf $APP_ROOT/${TEMP_DIR}/${ARTIFACT_TAR_NAME_FINAL}.tar.gz -C $APP_ROOT/${TEMP_DIR}
    tar -xvzf $APP_ROOT/${TEMP_DIR}/${ARTIFACT_TAR_NAME_JSDOC}.tar.gz -C $APP_ROOT/${TEMP_DIR}
    tar -xvzf $APP_ROOT/${TEMP_DIR}/${ARTIFACT_TAR_NAME_BUILD}.tar.gz -C $APP_ROOT/${TEMP_DIR}
    rm $APP_ROOT/${TEMP_DIR}/*.tar.gz
    shopt -s dotglob
    mv $APP_ROOT/${TEMP_DIR}/* $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME; \
    cp -r $APP_ROOT/${RELEASES_DIR}/$RELEASE_NAME/* $APP_ROOT/root/; \
    cd $APP_ROOT/${RELEASES_DIR} && ls -1tr | head -n -$KEEP_RELEASES | xargs -d '\n' rm -rf --; \
    cd $APP_ROOT/root && docker-compose up -d --build; \
    rm -rf -- ${APP_ROOT}/${TEMP_DIR}; \
    docker image prune -af; \
    docker container prune -f \
"
