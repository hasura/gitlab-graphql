#! /bin/bash

docker run -d -p 8090:8080 \
  hasura/graphql-engine:v1.0.0-alpha04 \
  graphql-engine \
  --database-url postgres://gitlab:@172.17.0.1:7432/gitlabhq_production \
  serve --enable-console
