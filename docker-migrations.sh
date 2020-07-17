#!/usr/bin/env bash
yarn run db:setup
yarn run typeorm migration:run

# start server to notify rancher we are good
nc -vlkp 5555 -e echo "up"
