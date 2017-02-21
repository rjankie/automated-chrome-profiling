#!/bin/bash

## start in the directory containing automated-chrome-profiling  (see https://github.com/paulirish/automated-chrome-profiling)
## usage : ./testall.sh <nr_of_iterations>
## A directory will be created with the start-time of the script 
## In that directory the tracefiles will be created. For each iteration the stats will be collected.
## the output format of the directory is:
## profile-yyyymmdd-HHMMss   (e.g. profile-20170216-110609)
## The trace files will be like: 
## profile-20170221-144433.1.devtools.trace  (first iteration) (raw data) (can be opened in Chrome DevTools)
## profile-20170221-144433.1.devtools.trace.summary.json  (first iteration) (summary info)


if [ -z "$1" ]
  then
    echo "No argument supplied. Provide the nr_of_iterations e.g. 10, 100,etc."
    exit;
fi
directory=`date +%Y%m%d-%H%M%S`

sleep 3
iterations=$1

for ((c=1;c<=$1;c++))
do
    echo "$c"
    npm start &
    
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless  --silent-launch  --remote-debugging-port=9222 --user-data-dir=$TMPDIR/chrome-profiling --no-default-browser-check  &
    sleep 3
    node get-timeline-trace.js http://google.com $directory $c
#node log-trace-metrics.js $directory $c
    ## kill the process

    
    echo 'Stopping all the processes'
    echo '-- Stopping  npm '
    processhttpster=`ps -ef | grep httpster | grep chrome | awk '{print $2}'`
    kill -9 $processhttpster
    echo '-- Killing  Chrome '
    process=`ps -ef | grep remote-debugging-port |grep Chrome | awk '{print $2}'`
    kill -9 $process
    sleep 3
done



echo 'Done.'
