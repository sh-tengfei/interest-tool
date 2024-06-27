#!/bin/bash

npm install --production
npm run build
# tar -zcvf ./release.tgz --exclude={node_modules,.DS_Store,.git,.github,.vscode,README.md,release.tgz,deploy.sh} .

# 先全发文件后期在调整
# echo '\n删除原文件-------start \n\n'
# ssh root@119.3.187.4 'rm -rf /home/www/interest-prod/ &&\
# mkdir /home/www/interest-prod/'

# scp ./release.tgz root@119.3.187.4:/home/www/interest-prod/

# ssh root@119.3.187.4 'cd /home/www/interest-prod/ &&\
# tar -xf release.tgz &&\
# npm i &&\
# npm run stop &&\
# npm run start'

ssh root@119.3.187.4 'cd /home/www/interest-prod/ &&\
git pull &&\
npm i &&\
npm run restart'

