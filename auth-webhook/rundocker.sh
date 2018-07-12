#!/bin/sh

docker stop graphql-hook
docker rm graphql-hook
docker run --name graphql-hook -e GITLAB_DOMAIN=http://178.128.180.80 -e PORT=8080 -p 172.17.0.1:10000:8080 -d hasura/simple-auth-graphqlhook:0.3.4
