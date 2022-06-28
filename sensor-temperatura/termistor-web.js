var five = require("johnny-five");
var fs = require('fs');
var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var arduino = new five.Board(); 
var temp = 0.0;

var servidor = app.listen(8080, function() { 
    var porta = servidor.address().port;
    console.log("Servidor executando na porta %s", porta);
 });

app.use(express.static("public"));
app.get('/', function (req, res) {
    fs.readFile('termistor.html', function(erro, dado) { res.writeHead(200, {'Content-Type': 'text/html'}); 
    res.write(dado);
    res.end();
    });
 });

app.post('/obter/temperatura', function(req, res){ 
    res.writeHead(200, {'Content-Type': 'text/plain'}); 
    res.write(temp.toFixed(1)); 
    res.end();
    });

arduino.on("ready", function() { 
    var A0 = new five.Sensor("A0");
    A0.on("change", function() { 
    temp = getTemperatura(this.value);
    });
 });

function getTemperatura(volts) { 
    var tempK, tempC;
    tempK = Math.log(10000.0 * (1024.0 / volts - 1)); 
    tempK = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * tempK * tempK)) * tempK);
    tempC = tempK - 273.15;
    return tempC;
    } 

var mariadb = require('mariadb');
var pool = mariadb.createPool({ 
    host: 'localhost',
    database: 'iot',
    user:'usuario',
    password: 'senha'
}); 

function inserir(valor) { 
    pool.getConnection() 
    .then(con => {
    var agora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    con.query("INSERT INTO temperatura VALUES (?, ?)", [valor, agora]) 
    .then((res) => { 
        console.log(res); 
        con.end();
    }) 
    .catch(erro => {
    console.log("Erro comando: " + erro);
    con.end();
    });
 })
    .catch(erro => { 
        console.log("Erro conexão:" + erro); 
    });
 }


 app.post('/obter/temperatura', 
 function(req, res){ res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(temp.toFixed(1));
  res.end();
  inserir(temp.toFixed(1));
 }); 

 window.setTimeout(atualizar, 10000);