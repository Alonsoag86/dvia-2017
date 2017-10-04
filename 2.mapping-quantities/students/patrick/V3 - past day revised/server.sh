#!/bin/bash
#
# A dead-simple webserver for running p5 scripts locally. This may be necessary since
# many browsers will refuse to load files when run frome a file:// url.
#
# usage:
#   server.sh <port-number>

# file root should be location of script, not cwd
ROOT=`dirname "$0"`
cd "$ROOT"

# use default port if called without args
PORT=5100
if [[ $1 =~ ^[0-9]+$ ]]
  then PORT=$1
fi

# report in-use ports since we're swallowing python's stderr
if nc -z localhost $PORT 2> /dev/null ; then
  echo "Server already running on port $PORT"
  exit 1
fi

echo ""
echo "Starting local http server (ctrl-c to exit)"
echo "  http://localhost:$PORT"
(sleep 1 && open "http://localhost:$PORT")&
python -m SimpleHTTPServer $PORT > /dev/null 2>&1