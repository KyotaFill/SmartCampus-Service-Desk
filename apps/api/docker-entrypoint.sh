#!/bin/sh

set -eu

npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed

exec node --watch src/server.js
