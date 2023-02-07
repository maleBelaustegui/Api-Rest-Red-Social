// import dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta para generar el token - extra de seguridad -
const secret = "MALENI_1979";

// crear una func para generar token
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    Image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  //devuelvo jwt token codificado
  return jwt.encode(payload, secret);
};

module.exports = {
  secret,
  createToken,
};
