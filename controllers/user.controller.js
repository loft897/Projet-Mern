const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// recuperer toutes les infos des users mais sans renvoyer le password
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// recup des infos d'un user par son ID
module.exports.userInfo = (req, res) => {
  //  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    // on verifie si l'ID existe
    return res.status(400).send("ID inconnu : " + req.params.id);
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID inconnu : " + err);
  }).select("-password"); // on ignore le password pendant la recup
};

// mettre a jour la bio d'un user
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      // on trouve le user et on le met a jour
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }, // config obligatoire quand on fait un put ou patch
      (err, docs) => {
        if (err) return res.status(500).send({ message: err });
        if (!err) return res.send(docs);
      }
    );
  } catch (err) {
    // return res.status(500).json({ message: err });
  }
};

// supprimer un user
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec(); // on le supprime
    res.status(500).send({ message: "Suppression reussie. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// follow un user
module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID inconnu : " + req.params.id);
  UserModel.findByIdAndUpdate(
    // ajouter à la following list
    req.params.id,
    { $push: { following: req.body.idToFollow } },
    { new: true, upsert: true },
    (err, docs) => {
      if (err) return res.status(400).json({ error: err });

      UserModel.findByIdAndUpdate(
        // ajouter à la followers list
        req.body.idToFollow,
        { $push: { followers: req.params.id } },
        { new: true, upsert: true }
      )
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    }
  );
};

// unfollow un user
module.exports.unFollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID inconnu : " + req.params.id);
  UserModel.findByIdAndUpdate(
    // retirer à la following list
    req.params.id,
    { $pull: { following: req.body.idToUnfollow } },
    { new: true, upsert: true },
    (err, docs) => {
      if (err) return res.status(400).json({ error: err });

      UserModel.findByIdAndUpdate(
        // retirer à la followers list
        req.body.idToUnfollow,
        { $pull: { followers: req.params.id } },
        { new: true, upsert: true }
      )
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    }
  );
};
