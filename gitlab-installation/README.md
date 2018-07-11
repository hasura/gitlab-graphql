## Prerequisites

1. docker
2. docker-compose

## Gitlab Installation

Change your current working directory to `run-gitlab`

The default configuration looks like below

```
web:
  image: 'gitlab/gitlab-ce:latest'
  restart: always
  hostname: 'localhost'
  environment:
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'http://localhost'
  ports:
    - '80:80'
    - '443:443'
    - '2022:22'
  volumes:
    - '/srv/gitlab/config:/etc/gitlab'
    - '/srv/gitlab/logs:/var/log/gitlab'
    - '/srv/gitlab/data:/var/opt/gitlab'
```

Change the `hostname` and the `external_url` if required

### Install Gitlab

`
$ docker-compose up -d
`

After gitlab starts successfully, visit [http://localhost](http://localhost) to view the default gitlab screen

## Postgres installation

Change your current working directory to `run-postgres`

Please note that postgres will listen on port 7432 on your host according to the configuration as below

```
#!/bin/sh

docker stop postgresql-db
docker rm postgresql-db
docker run --name postgresql-db -p 172.17.0.1:7432:5432 -d postgres
```

If you want it to listen on a different port, it can be changed accordingly

### Install postgres

`
$ ./postgres.sh
`

### Verify the installation

Run `docker ps` to verify whether the postgres container is running or not

## Initialize postgres to connect with gitlab

Gitlab can be configured to use external postgres, given that it has the following configurations in place

SSH into the container using the command below

```
$ docker ps
5426ea03d387        postgres                               "docker-entrypoint.s…"   13 hours ago        Up About an hour             172.17.0.1:7432->5432/tcp                                        postgresql-db

# Copy the container id ( 5426ea03d387 ) from the above

$ docker exec -ti 5426ea03d387 /bin/bash
root@5426ea03d387:/#

# Connect to your postgresql client using the command below

root@5426ea03d387:/# psql -U postgres
psql (10.4 (Debian 10.4-2.pgdg90+1))
Type "help" for help.

postgres=#
```

Run the following commands

```
postgres=# -- Create a user called `gitlab`
CREATE ROLE gitlab with LOGIN;

-- Add privilege permission to `gitlab` user so that it can add extensions
ALTER ROLE gitlab SUPERUSER;

-- Create a database called `gitlabhq_production`

CREATE database gitlabhq_production;
```

### Verify the configuration

Run `\du` to list the users and the output should match the output below

```
postgres=# \du
                                   List of roles
 Role name |                         Attributes                         | Member
 of
-----------+------------------------------------------------------------+-------
----
 gitlab    | Superuser                                                  | {}
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

postgres=#

```

## Connect `gitlab` to use `postgres`

Configure gitlab to use the postgres running outside the `gitlab` container

Move to `/srv/gitlab/config` and add the following lines to `gitlab.rb`

```
...
...
###! Changing any of these settings requires a restart of postgresql.
###! By default, reconfigure reloads postgresql if it is running. If you
###! change any of these settings, be sure to run `gitlab-ctl restart postgresql`
###! after reconfigure in order for the changes to take effect.
postgresql['enable'] = false
# postgresql['listen_address'] = nil
# postgresql['port'] = 5432
# postgresql['data_dir'] = "/var/opt/gitlab/postgresql/data"
gitlab_rails['db_adapter'] = 'postgresql'
gitlab_rails['db_encoding'] = 'utf8'
gitlab_rails['db_host'] = '172.17.0.1'
gitlab_rails['db_port'] = 7432
...
...

```

### Reconfigure gitlab

SSH into the gitlab container as below

```
$ docker ps

3aa9bfd0058e        gitlab/gitlab-ce:latest                "/assets/wrapper"        13 hours ago        Up About an hour (healthy)   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp, 0.0.0.0:2022->22/tcp   root_web_1

# SSH into the container

$ docker exec -ti 3aa9bfd0058e /bin/bash

# Reconfigure gitlab

$ gitlab-ctl reconfigure

...
Recipe: gitlab::deprecate-skip-auto-migrations
  * file[/etc/gitlab/skip-auto-reconfigure] action create (skipped due to only_if)
  * ruby_block[skip-auto-migrations deprecation] action run (skipped due to only_if)

Running handlers:
Running handlers complete
Chef Client finished, 2/441 resources updated in 07 seconds
gitlab Reconfigured!
```

## GraphQL Engine Installation

Change your current working directory to `run-graphql`

Please note that graphql-engine will listen on port 8090 on your host according to the configuration as below

```
#! /bin/bash
docker run -p 8090:8080 \
         hasura/graphql-engine:v1.0.0-alpha04 \
         graphql-engine \
         --database-url postgres://gitlab:@172.17.0.1:7432/gitlabhq_production \
         serve --enable-console
```

Run `./docker-run.sh` to install graphql-engine

### Verify installation

After graphql engine starts successfully, visit [http://localhost:8090](http://localhost:8090/console/api-explorer) to view the graphql explorer
