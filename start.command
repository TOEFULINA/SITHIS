#!/bin/bash
# Double-click this file to open a terminal, install dependencies if needed,
# and launch the dev server (opens http://localhost:5173 automatically).

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

npm run dev
