#!/bin/sh

docker stop postgresql-db
docker rm postgresql-db
docker run --name postgresql-db -p 172.17.0.1:7432:5432 -d postgres
