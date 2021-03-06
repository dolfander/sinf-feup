var express = require('express');
var request = require('request');
var router = express.Router();

var User = require('../models/user');

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


router.get('/profile/:userID',tokenMiddleware(), function(req,res){
  let userID = req.params.userID;
  let query = 'SELECT Nome, Fac_Mor, Fac_Local, Fac_Cp, NumContrib FROM Clientes WHERE Clientes.Cliente=' + '\'' + userID + '\'';

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
      User.getUserById(userID, function (err, user) {
        var client = body.DataSet.Table[0];
        var email = user.email;
        res.render('profile', {client, email} );
      });
    }
  });
});

router.get('/history/:userID',tokenMiddleware(), function(req,res){
  let userID = req.params.userID;
  let query = ' SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.DataCarga, cd.NomeFac, cd.Id, cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc WHERE cd.Entidade=' + '\'' + userID + '\' AND cd.TipoDoc=' + '\'' + "ECL" + '\'';

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
        var orders = body.DataSet.Table; 
        res.render('user/history', {orders} );
    
    }
  });
});

router.get('/history/:userID/order/:orderID',tokenMiddleware(), function(req,res){

  let orderID = req.params.orderID;
  let query = 'SELECT cd.TotalDocumento, cd.NumContribuinte, cd.TotalIva, cd.Morada, cd.Localidade, cd.CodPostal, ld.TaxaIva, ld.descricao, ld.quantidade, ld.PrecUnit, ld.PrecoLiquido, ld.TaxaIva, ld.TotalIva FROM LinhasDoc as ld INNER JOIN CabecDoc as cd ON ld.IdCabecDoc = cd.Id WHERE ld.IdCabecDoc =' + '\'' + orderID + '\'';

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
        var products = body.DataSet.Table; 
        console.log(products);
        res.render('user/order', {products} );
    
    }
  });
});



router.post('/update/:userID',tokenMiddleware(), function(req, res) {
 
    let idUser = req.params.userID;
    let data=  {

        CodigoTabLog: "Cliente",
        ChaveLog: "Cliente",
        Cliente: req.params.userID,
        Nome: req.body.user,
        Morada: req.body.address,
        Localidade: req.body.city,
        LocalidadeCodigoPostal: req.body.city,
        CodigoPostal:  req.body.zip,
        NumContribuinte: req.body.nif,
        Moeda: "EUR",
        Pais: "PT",
        CondPag: 2,
        EmModoEdicao: true

    };

    console.log(data);
  
    let options = {
      method: 'post',
      body: data,
      json: true,
      url: 'http://localhost:2018/WebApi/Base/Clientes/Actualiza',
      headers: {'Authorization': 'Bearer ' + res.token}
    };
  
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
            
        res.redirect('/user/profile/' +  idUser);
             
      }
    });
 
});

router.get('/:userID',tokenMiddleware(), function(req,res){
  let userID = req.params.userID;
  let query = 'SELECT Fac_Mor, Fac_Local, Fac_Cp, NumContrib FROM Clientes WHERE Clientes.Cliente=' + '\'' + userID + '\'';

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
        var client = body.DataSet.Table[0];
       res.send(client);
    }
  });
});



module.exports = router;