/* Run npm install request@2.74.0 websocket@1.0.23 flatten-source-map@0.0.2*/

// To toggle debugger in Android
// adb shell am broadcast -a "com.rnapp.RELOAD_APP_ACTION" --ez jsproxy true


var PACKAGER = 'localhost:8081';

var vm = require('vm');
var url = require('url');
var path = require('path');
var fs = require('fs');

var request = require('request'); // request@2.74.0
var WebSocket = require('websocket').w3cwebsocket; //websocket@1.0.23
var flattenSourceMap = require('flatten-source-map'); //flatten-source-map@0.0.2

function importScripts(scriptUrlStr, cb) {
  var scriptUrl = url.parse(scriptUrlStr);
  console.log('Fetching script from ', scriptUrl.href);
  request(scriptUrl.href, function (error, response, scriptBody) {
    if (!error && response.statusCode == 200) {
      var sourceMapUrl = sourceMapUtil.getSourceMapURL(scriptUrl, scriptBody);

      console.log('Fetching SourceMaps from ', sourceMapUrl.href);
      request(sourceMapUrl.href, function (err, resp, sourceMapBody) {

        scriptBody = sourceMapUtil.updateScriptPaths(scriptBody, sourceMapUrl);
        sourceMapBody = sourceMapUtil.updateSourceMapFile(sourceMapBody, scriptUrl);

        fs.writeFileSync(path.join(__dirname, scriptUrl.pathname), scriptBody);
        fs.writeFileSync(path.join(__dirname, sourceMapUrl.pathname), sourceMapBody);
        try {
          console.log('Injecting Script   at ', path.join(__dirname, scriptUrl.pathname));
          vm.runInThisContext(scriptBody, {
            filename: path.join(__dirname, scriptUrl.pathname)
          });
        }
        catch (e) { console.log(e); }
        finally {
          cb();
        }
      });
    }
  });
}

(function start() {
  console.log('trying to start debugger');
  var ws = new WebSocket('ws://' + PACKAGER + '/debugger-proxy?role=debugger&name=Custom');
  ws.onclose = function () { setTimeout(start, 10000) };
  ws.onopen = function () { console.log('Connection established'); };
  ws.onmessage = function (e) {
    var message = JSON.parse(e.data);

    if (message.$event === 'client-disconnected' || message.method === '$disconnected') {
      console.log('Client disconnected, quitting');
      process.exit(0);
    }

    // Quitting if App goes in background
    if (message.arguments && message.arguments.length === 3 && message.arguments[2].length === 2 && typeof message.arguments[2][1] === 'object' && message.arguments[2][1].app_state === "background") {
      console.log('Client went to background, quitting');
      process.exit(0);
    }

    if (!message.method) {
      return;
    }

    //console.log('Executing', message.method);
    var sendReply = function (result) {
      ws.send(JSON.stringify({ replyID: message.id, result: result }));
    };
    switch (message.method) {
      case 'prepareJSRuntime':
        sendReply();
        break;
      case 'executeApplicationScript':
        for (var key in message.inject) {
          global[key] = JSON.parse(message.inject[key]);
        }
        message.url = message.url.replace('localhost:8081', PACKAGER);
        importScripts(message.url, function () { sendReply() });
        break;
      default:
        var returnValue = [[], [], [], 0];
        try {
          if (typeof __fbBatchedBridge === 'object' && typeof __fbBatchedBridge[message.method] === 'function') {
            returnValue = __fbBatchedBridge[message.method].apply(null, message.arguments);
          }
        } finally {
          sendReply(JSON.stringify(returnValue));
        }
    }
  }
}());


// Needed to make sourcemaps work with VSCode
var sourceMapUtil = {
  SourceMapURLRegex: /\/\/(#|@) sourceMappingURL=(.+?)\s*$/m,
  getSourceMapURL: function (scriptUrl, scriptBody) {
    var sourceMappingRelativeUrl = scriptBody.match(this.SourceMapURLRegex); // sourceMappingRelativeUrl = "/index.ios.map?platform=ios&dev=true"
    if (sourceMappingRelativeUrl) {
      var sourceMappingUrl = url.parse(sourceMappingRelativeUrl[2]);
      sourceMappingUrl.protocol = scriptUrl.protocol;
      sourceMappingUrl.host = scriptUrl.host;
      return url.parse(url.format(sourceMappingUrl)); // parse() repopulates all the properties of the URL
    }
    return null;
  },
  updateScriptPaths: function (scriptBody, sourceMapUrl) {
    return scriptBody
      .replace(/GLOBAL/g, '__XX__')
      .replace(this.SourceMapURLRegex, "//# sourceMappingURL=" + sourceMapUrl.pathname.substr(1));
  },
  updateSourceMapFile: function (sourceMapBody, scriptUrl) {
    var sourcesRootPath = __dirname;
    var sourceMap = JSON.parse(sourceMapBody);
    if (sourceMap.sections) {
      sourceMap.sections = sourceMap.sections.filter(function (value, index, array) {
        return value.map != null;
      });
      sourceMap = flattenSourceMap(sourceMap);
    }

    if (sourceMap.sources) {
      sourceMap.sources = sourceMap.sources.map(function (sourcePath) {
        return path.posix.join.apply(null, path.relative(sourcesRootPath, sourcePath).split(path.sep));
      });
    }

    delete sourceMap.sourcesContent;
    sourceMap.sourceRoot = "";
    sourceMap.file = scriptUrl.pathname.substr(1);
    return JSON.stringify(sourceMap);
  }
}

process.on('exit', function () {
  if (typeof emitTTDLog === 'function') {
    emitTTDLog(path.join(__dirname, 'logs'));
  }
});