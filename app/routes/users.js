var express = require('express');
var request = require('request');
var router = express.Router();

/* GET user page. */
router.get('/', function(req, res) {
    res.render('user');
  });


function tokenMiddleware() {
  return (req, res, next) => {
    let params ={
      username: 'FEUP',
      password: 'qualquer1',
      company: 'TECH4U',
      instance: 'DEFAULT',
      grant_type: 'password',
      line: 'professional'
    };

    request.post({url: 'http://localhost:2018/WebApi/token', form:params}, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
        res.token = JSON.parse(body).access_token;
        next();
      }
    });
  }
}

/*
* Error in var context = body.DataSet.Table[0];
* Running on index.js
*/


/* 
router.get('/:userID',tokenMiddleware(), function(req,res){
  let query = 'SELECT Nome, Fac_Mor, Fac_Local, Fac_Cp, Fac_Tel, NumContrib, Pais, Moeda FROM Clientes WHERE Clientes.Cliente=' + '\'' + req.params.userID + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    } else {
      var context = body.DataSet.Table[0];
      res.render('user', context);
    }
  });
});*/



module.exports = router;