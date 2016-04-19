var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

var ready = 0;

btSerial.on('found', function(address, name) {
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('connected');

            //btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
            //    if (err) console.log(err);
            //});

            process.stdin.resume();
            process.stdin.setEncoding('utf8');

            process.stdin.on('data', function (data) {
                btSerial.write(new Buffer(data, 'utf-8'), function(err, bytesWritten) {
                    if (err) console.log(err);
                });
            });

            setInterval(function(){
                if (ready) {
                    var temperatura = Math.random() * (90 - 80) + 80;
                    var milliseconds = (new Date).getTime();
                    var msg = 'R|1|' + temperatura + '|' + Math.round(milliseconds/1000);
                    btSerial.write(new Buffer(msg, 'utf-8'), function(err, bytesWritten) {
                        if (err) console.log(err);
                        console.log('→ ' + msg + ' → (' + bytesWritten + ') bytes written' );
                    });
                }
            }, 2000);

            btSerial.on('data', function(buffer) {
                console.log('.');
                var cmd = buffer.toString('utf-8');
                var resposta = "";
                console.log(cmd);
                switch (cmd[0]) {
                    case 'M':
                        resposta = "M|1|3|1445125085";
                        ready = 1;
                        break;
                    default:
                        resposta = "";
                        break;
                }
                if (resposta) {
                    btSerial.write(new Buffer(resposta, 'utf-8'), function(err, bytesWritten) {
                        if (err) console.log(err);
                        console.log('→ ' + resposta + ' → (' + bytesWritten + ') bytes written' );
                    });
                }
            });

        }, function () {
            console.log('cannot connect');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('found nothing');
    });
});

btSerial.inquire();