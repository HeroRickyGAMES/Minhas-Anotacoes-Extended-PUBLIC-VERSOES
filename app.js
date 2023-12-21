var gplay = require('google-play-scraper');
const express = require("express");
const cors = require('cors');
const getIP = require('external-ip')();
const extIP = require('external-ip');
const port = 8080
console.log('meu teste deu bao karai');

const app = express()

app.get('/', (req, res) =>{
	gplay.app({appId: 'com.hrs.flutter.minhasanotacoesextended'})
	.then((value) =>{
		res.send(value);
	});
});

app.listen(port, () => {

let getIP = extIP({
    replace: true,
    services: ['https://ipinfo.io/ip', 'http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
    timeout: 600,
    getIP: 'parallel',
    userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
});

console.log(`ip used $getIP`);

getIP((err, ip) => {
    if (err) {
        throw err;
    }
    console.log(ip);
});

  console.log(`Example app listening on port ${port}`)
})

var moment = require('moment');
var date = moment().format("LL");

console.log(date);