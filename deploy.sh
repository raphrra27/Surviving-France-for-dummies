#!/usr/bin/env bash
# Build the frontend here, push site + API to the server and restart it.
# Usage: ./deploy.sh            (override the target with DEPLOY_HOST=user@host)
set -euo pipefail

HOST="${DEPLOY_HOST:-erwann@100.100.39.64}"
DIR="surviving-france" # relative to the remote home, must match the .service file

cd "$(dirname "$0")"

# Same origin in production: the Express server serves both the site and the API
(cd surviving-france-for-dummies && VITE_API_URL=/ npm run build)

ssh "$HOST" "mkdir -p $DIR/server $DIR/surviving-france-for-dummies/dist .config/systemd/user"
# tar over ssh: the server has no rsync. server/.env stays on the server, it
# holds that machine's own settings.
ssh "$HOST" "rm -rf $DIR/surviving-france-for-dummies/dist && mkdir -p $DIR/surviving-france-for-dummies/dist"
tar -C surviving-france-for-dummies/dist -cz . | ssh "$HOST" "tar -xz -C $DIR/surviving-france-for-dummies/dist"
tar -C server --exclude=node_modules --exclude=.env -cz . | ssh "$HOST" "tar -xz -C $DIR/server"
scp -q deploy/surviving-france.service "$HOST:.config/systemd/user/"

ssh "$HOST" "cd $DIR/server && PATH=\$HOME/.local/bin:\$PATH npm ci --omit=dev \
  && systemctl --user daemon-reload \
  && systemctl --user enable surviving-france \
  && systemctl --user restart surviving-france \
  && sleep 2 && systemctl --user --no-pager --lines=5 status surviving-france"
