var fs = require('fs');
var Chrome = require('chrome-remote-interface');
var summary = require('./util/browser-perf-summary')

var TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];

var rawEvents = [];

Chrome(function (chrome) {
    with (chrome) {

        process.argv.forEach(function (val, index, array) {
           console.log(index + ': ' + val);
        });

        /// Setup phase
        host = process.argv[2]; //get host first argument
        count = process.argv[4]; // get the count
        filenameindicator= process.argv[3]
        outputDirectory = 'profile-'+filenameindicator;

        fs.mkdir(outputDirectory, (err, fd) => {
            if (err) {
                if (err.code === "EEXIST") {
                    console.error('myfile already exists');
                } else {
                throw err;
                }
            } 
       } );

       
        Page.enable();
        Tracing.start({
            "categories":   TRACE_CATEGORIES.join(','),
            "options":      "sampling-frequency=10000"  // 1000 is default and too slow.
        });

        Page.navigate({'url': host})
        Page.loadEventFired(function () {
        Tracing.end()
        });

        Tracing.tracingComplete(function () {
            var file =outputDirectory +  '/profile-' + filenameindicator+'.' + count +'.devtools.trace';
            fs.writeFileSync(file, JSON.stringify(rawEvents, null, 2));
            console.log('Trace file: ' + file);
            console.log('You can open the trace file in DevTools Timeline panel. (Turn on experiment: Timeline tracing based JS profiler)\n')

            summary.report(file); // superfluous

            chrome.close();
        });

        Tracing.dataCollected(function(data){
            var events = data.value;
            rawEvents = rawEvents.concat(events);

            // this is just extra but not really important
            summary.onData(events)
        });
    }

}).on('error', function (e) {
    console.error('Cannot connect to Chrome', e);
});