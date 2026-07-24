#!/bin/bash
set -e

# Start dev server if not running
curl -s http://localhost:3000 > /dev/null 2>&1 || (
  cd /home/z/my-project
  npx next dev -p 3000 > /tmp/next-dev.log 2>&1 &
  sleep 20
)

# Take screenshots
agent-browser open http://localhost:3000
agent-browser wait 8000
agent-browser screenshot /home/z/my-project/public/screenshot-home.png --full
agent-browser wait 2000
agent-browser screenshot /home/z/my-project/public/screenshot-features.png --full
agent-browser close
echo "Done!"