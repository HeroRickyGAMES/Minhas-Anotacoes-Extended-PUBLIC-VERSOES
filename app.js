var gplay = require('google-play-scraper');
const express = require("express");
const cors = require('cors');
const port = 8080
console.log('meu teste deu bao karai');
const IpMonitor = require('ip-monitor');

const ipMonitor = new IpMonitor({
    pollingInterval: 36000,
    verbose: true,
    externalIp: {
        timeout: 1000,
        getIP: 'parallel',
        services: ['http://icanhazip.com/'],
        replace: true,
        verbose: true
    }
});

ipMonitor.on('change', (prevIp, newIp) => {
    console.log(`IP changed from ${prevIp} to ${newIp}`);

    const app = express()

      console.log(`ip monitor ${ipMonitor}`);

    app.get('/', (req, res) =>{
    	gplay.app({appId: 'com.hrs.flutter.minhasanotacoesextended'})
    	.then((value) =>{
    		res.send(value);
    	});
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

    var moment = require('moment');
    var date = moment().format("LL");

    console.log(date);

});

ipMonitor.on('error', (error) => {
    console.error(error);
});

ipMonitor.start();
