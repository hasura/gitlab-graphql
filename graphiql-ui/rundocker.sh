#!/bin/sh

docker stop gitlab-graphiql
docker rm gitlab-graphiql
docker run --name gitlab-graphiql -p 10001:8080 -d hasura/gitlab-graphiql:0.1
