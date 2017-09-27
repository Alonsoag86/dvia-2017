#!/bin/bash
#
# A dead-simple webserver for running p5 scripts locally. This may be necessary since
# many browsers will refuse to load files when run frome a file:// url.
#
# usage:
#   server.sh <port-number>

# use default port if called without args
PORT=5100
if [[ $1 =~ ^[0-9]+$ ]]
  then PORT=$1
fi

echo ""
echo "Starting local http server (ctrl-c to exit)"
echo "  http://localhost:$PORT"
(sleep 1; open "http://localhost:$PORT")
python -m SimpleHTTPServer $PORT > /dev/null 2>&1