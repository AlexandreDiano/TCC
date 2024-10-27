#!/bin/bash
if [ -e tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle

bundle exec rails db:create

bundle exec rails db:migrate

bundle exec rails db:seed

exec "$@"
