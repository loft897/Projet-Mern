const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// checker(token) si le user est connecté a chaque requette effectuée
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        // console.log('decoded token' + decodedToken)
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        // console.log(res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// checker a chaque authen si le user(deja connu dans la db) a le bon token ou checker l'authen quand un user deja connecté revient sur le site
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
          console.log(err)
      } else {
          console.log(decodedToken.id);
          next();
      }
    });
  } else {
      console.log('No token');
  }
};
