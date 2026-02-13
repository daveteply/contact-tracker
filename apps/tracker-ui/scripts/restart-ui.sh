#!/bin/bash
echo "Stopping existing UI processes..."
# Kill by port and by name
fuser -k 3000/tcp || true
pkill -f "next" || true
pkill -f "nx" || true

echo "Cleaning cache..."
rm -rf apps/tracker-ui/.next

npx nx reset
npx nx build rxdb-schema
npx nx dev tracker-ui --skip-nx-cache -- --hostname 0.0.0.0