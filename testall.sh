#!/bin/bash

## start in the directory containing automated-chrome-profiling  (see https://github.com/paulirish/automated-chrome-profiling)

npm start &

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless  --silent-launch  --remote-debugging-port=9222 --user-data-dir=$TMPDIR/chrome-profiling --no-default-browser-check  &

directory=`date +%Y%m%d-%H%M%S`

sleep 3

node get-timeline-trace.js http://google.com $directory
node log-trace-metrics.js $directory
## kill the process



process=`ps -ef | grep remote-debugging-port |grep Chrome | awk '{print $2}'`
sleep 3
echo 'Stopping all the processes'
echo '-- Stopping  npm '
processhttpster=`ps -ef | grep httpster | grep chrome | awk '{print $2}'`
kill -9 $processhttpster
echo '-- Killing  Chrome '
kill -9 $process
echo 'Done.'
