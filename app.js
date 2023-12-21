var gplay = require('google-play-scraper');
const express = require("express");
const cors = require('cors');
const getIP = require('external-ip')();
const port = 3000
console.log('meu teste deu bao karai');

const app = express()

app.get('/', (req, res) =>{
	gplay.app({appId: 'com.hrs.flutter.minhasanotacoesextended'})
	.then((value) =>{
		res.send(value);
	});
});

app.listen(port, () => {

getIP((err, ip) => {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log(`App running into ${ip}`);
});

  console.log(`Example app listening on port ${port}`)
})

var moment = require('moment');
var date = moment().format("LL");

console.log(date);