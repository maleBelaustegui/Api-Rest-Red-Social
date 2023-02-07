//importar dependencia y modulos
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");

//test
const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from controllers/user.js",
    usuario: req.user,
  });
};

// metodo de registro de usuarios

const register = (req, res) => {
  //recoger datos
  let params = req.body;

  //comprobar q llegan y validar..

  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      message: "Faltan datos",
      status: "error",
    });
  }

  //control usuarios duplicados, si existe el mismo no lo guarda podria convertirl el fin en una funcion async...
  User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "error en la consulta de usuarios" });
    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "success",
        message: "el usuario ya existe",
      });
    }

    // cifrar la password con la libreria bcrypt

    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    //crear objeto de usuario

    let user_to_save = new User(params);

    // guardar usuario en la bd
    user_to_save.save((error, userStored) => {
      if (error || !userStored)
        return res
          .status(500)
          .send({ status: "error", message: "error al guardar el usuario" });

      //devolver resultado
      return res.status(200).json({
        status: "success",
        message: "Usuario registrado correctamente",
        user: userStored,
      });
    });
  });
};
const login = (req, res) => {
  //recoger params del body
  let params = req.body;
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "faltan datos por enviar",
    });
  }
  //buscar en la bd si existe el usuario o email
  User.findOne({ email: params.email })
    //.select({ password: 0 })
    .exec((error, user) => {
      if (error || !user)
        return res
          .status(404)
          .send({ status: "error", message: "No existe el usuaruio" });

      //comprobar su psw con compare de la lib de bcrypt

      const pwd = bcrypt.compareSync(params.password, user.password);

      if (!pwd) {
        return res.status(400).send({
          status: "error",
          message: "no te has identificado correctamente",
        });
      }

      //Conseguir el token
      const token = jwt.createToken(user);

      //devuelve los datos de usurio

      return res.status(200).send({
        status: "success",
        message: "Te has identificado correctamente",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
        },
        token,
      });
    });
};

const profile = (req, res) => {
  //recibir el parametro de id de usuario por la url
  const id = req.params.id;

  //consulta para sacar los datos del usuario

  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec((error, userProfile) => {
      if (error || !userProfile) {
        return res.status(404).send({
          status: "error",
          message: "el user no existe o hay un error",
        });
      }
      // devolver el resultado
      // desp devolver info de follows
      return res.status(200).send({
        status: "success",
        user: userProfile,
      });
    });
};

const list = (req, res) => {
  //controlar en que pagina estamos
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  page = parseInt(page);

  // hacer la consulta con mongoose paginate
  let itemsPerPage = 5;

  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage, (error, users, total) => {
      if (error || !users) {
        return res.status(504).send({
          status: "error",
          message: "no hay usuarios disponibles",
          error,
        });
      }

      //devolver resultado (luego info de follows)

      return res.status(200).send({
        status: "success",
        users,
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
      });
    });
};

const update = (req, res) => {
  //recoger indo del usuario
  let userIdentity = req.user;
  let userToUpdate = req.body;

  //eliminar campos sobrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  //comprobar si el user ya existe - nick- email

  User.find({
    $or: [{ email: userToUpdate.email }, { nick: userToUpdate.nick }],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "error en la consulta de usuarios" });

    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) userIsset = true;
    });

    if (userIsset) {
      return res.status(200).send({
        status: "success",
        message: "el usuario ya existe",
      });
    }

    // cifrar la password con la libreria bcrypt
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }
    //actualizar

    User.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true },

      (error, userUpdated) => {
        if (error || !userUpdated) {
          return res
            .status(500)
            .json({ status: "error", message: "error al actualizar usuario" });
        }

        //devolver usuario actualizado
        return res.status(200).send({
          status: "success",
          message: "metodo de actualizar usuario",
          user: userUpdated,
        });
      }
    );
  });
};

//export

module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
};
