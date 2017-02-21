const filename = 'profile-'+process.argv[2]+'/profile-'+process.argv[2]+'.'+process.argv[3]+'.devtools.trace'
var events = require('fs').readFileSync(filename, 'utf8')

var DevtoolsTimelineModel = require('devtools-timeline-model');
// events can be either a string of the trace data or the JSON.parse'd equivalent
var model = new DevtoolsTimelineModel(events)

// tracing model
model.tracingModel()
// timeline model, all events
model.timelineModel()
// interaction model, incl scroll, click, animations
model.interactionModel()
// frame model, incl frame durations
model.frameModel()
// filmstrip model, incl screenshots
model.filmStripModel()
// topdown tree
model.topDown()
// bottom up tree
model.bottomUp()
// bottom up tree, grouped by URL
console.log('Top down tree total time:\n', model.topDown.totalTime);
console.log("Finished processing file " + filename);
