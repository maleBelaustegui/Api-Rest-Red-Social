// import dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// import clave secreta

const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//Middleware - func de autenticacion

exports.auth = (req, res, next) => {

  // comprobar si me llega la cabecera de autenticacion
    if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "la peticion no tiene la cabecerea de autenticacion",
    });
  }

  //  token -primero saco las comillas...lo limpio-
  let token = req.headers.authorization.replace(/['"]+/g, '');

  //decodificar el token
  try {
    let payload = jwt.decode(token, secret);

    //comprobar expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "token expirado",
        error,
      });
    }
     // agregar datos de user a la request
  req.user = payload;
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "token invalido",
      error,
    });
  }
 

  // pasar a la ejecucion de la accion next

  next();
}

