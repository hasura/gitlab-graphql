#!/bin/sh

docker stop nginx-gitlab-proxy
docker rm nginx-gitlab-proxy
docker run --name nginx-gitlab-proxy -p 80:80 -d hasura/gitlab-proxy-nginx:0.1
