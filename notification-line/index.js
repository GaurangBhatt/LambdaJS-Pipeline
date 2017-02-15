var https = require('https');
var util = require('util');

exports.handler = function(event, context) {
    var postData = {
        "channel": "#serverless-delivery",
        "username": "pipeline-bot",
        "text": "*" + event.Subject + "*",
        "icon_emoji": ":ghost:"
    };

    var message = event.Message;
    var severity = "good";
    var dangerMessages = [
        " but with errors",
        "Failed to deploy application",
        "Failed to deploy configuration",
        "has failed"
    ];

    var warningMessages = [
        "is currently running"
    ];

    for(var dangerMessagesItem in dangerMessages) {
        if (message.indexOf(dangerMessages[dangerMessagesItem]) != -1) {
            severity = "danger";
            break;
        }
    }

    // Only check for warning messages if necessary
    if (severity == "good") {
        for(var warningMessagesItem in warningMessages) {
            if (message.indexOf(warningMessages[warningMessagesItem]) != -1) {
                severity = "warning";
                break;
            }
        }
    }

    postData.attachments = [
        {
            "color": severity,
            "text": message
        }
    ];

    var options = {
        method: 'POST',
        hostname: 'hooks.slack.com',
        port: 443,
        path: '/services/T45NDKME3/B454PF3LM/eVMdzfOIGKy1b4LQQuyTYkmP'
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log(chunk);
        context.succeed();
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      context.fail();
    });

    req.write(util.format("%j", postData));
    req.end();
};
