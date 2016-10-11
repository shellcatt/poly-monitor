console.log("started ...");

var port = process.argv[2]; // 9080
if( ! process.argv[2] || isNaN(process.argv[2]) ){
    console.log('Please specify a port number!');
    process.exit(1);
}

var http = require('http')
        , sys = require('sys')
        , exec = require('child_process').exec
        , util = require('util')
        , Routing = require('director');
;

var cmd = {
    'xrandr-list': "xrandr -q | grep \" connected\" | awk '{print $1;}'",
    'xrandr-brightnesses': "xrandr --verbose | egrep Brightness | awk '{print $'${1:-2}'}'",
    'xrandr-gammas': "xrandr --verbose | grep Gamma | awk '{print $2}'",
    'xrandr-set-one': 'xrandr --output %s --%s %s',
    'xrandr-set-all': 'xrandr --output %s --brightness %s --gamma %s',
};

var router = new Routing.http.Router();

router.get('/', function() {
    var self = this;
    self.res.writeHead(200, {'Content-Type': 'text/plain'});

    var monitors = [];
    exec(cmd['xrandr-list'], function(err, stdout, stderr) {
        if (err) {
            self.res.end(err + '\n' + stderr);
        } else {
            var rows = stdout.split("\n");
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].length) {
                    monitors[i] = {"name": rows[i]};
                }
            }
//            console.log(JSON.stringify(monitors));

            exec(cmd['xrandr-brightnesses'], function(err, stdout, stderr) {
                if (err) {
                    self.res.end(err + '\n' + stderr);
                } else {
                    var rows = stdout.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].length) {
                            monitors[i].brightness = rows[i];
                        }
                    }
//                    console.log(JSON.stringify(monitors));
                    exec(cmd['xrandr-gammas'], function(err, stdout, stderr) {
                        if (err) {
                            self.res.end(err + '\n' + stderr);
                        } else {
                            var rows = stdout.split("\n");
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].length) {
                                    monitors[i].gamma = rows[i];
                                    var colors = monitors[i].gamma.split(':');
                                    monitors[i].red = colors[0];
                                    monitors[i].green = colors[1];
                                    monitors[i].blue = colors[2];
                                }
                            }
                        }
//                        console.log(JSON.stringify(monitors));
                        self.res.end(
                            JSON.stringify(monitors
//                                .slice(0, 1)
                            )
                        );
                    });
                }
            });
        }
    });
});

router.get('/set/:output/:setting/:value', function(output, setting, value) {
    var self = this;
    self.res.writeHead(200, {'Content-Type': 'text/plain'});
    value = value.split('-').join(':');
    var ex = util.format(cmd['xrandr-set-one'], output, setting, value);
//        self.res.end(''+ex);
//        return;
    console.log(ex);
    
    exec(ex, function(err, stdout, stderr) {
        if (err) {
            self.res.end(err + '\n' + stderr);
        } else {
            self.res.end(
                'done.'
            );
        }
    });
});

router.get('/set/:output/brightness/:brightness/gamma/:gamma', function(output, brightness, gamma) {
    var self = this;
    self.res.writeHead(200, {'Content-Type': 'text/plain'});
    gamma = gamma.split('-').join(':');
    var ex = util.format(cmd['xrandr-set-all'], output, brightness, gamma);
//        self.res.end(''+ex);
//        return;
    console.log(ex);
    
    exec(ex, function(err, stdout, stderr) {
        if (err) {
            self.res.end(err + '\n' + stderr);
        } else {
            self.res.end(
                'done.'
            );
        }
    });
});

http.createServer(function(req, res) {
    router.dispatch(req, res, function(err) {
        if (err) {
            res.writeHead(404);
            res.end();
        }
    });
}).listen(port, "");

