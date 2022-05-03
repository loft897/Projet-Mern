const mongoose = require('mongoose');
const { isEmail } = require('validator');  // renvoie true ou false, validator permet la validation d'email
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    } 
  },
  {
    timestamps: true,
  }
);

// fonction qui va permettre le crypatge du mdp avant l'envoie des donnees à la db

userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();  //gensalt permet le salage du mdp
  this.password = await bcrypt.hash(this.password, salt);
  next(); // permet de passer a la suite apres l'action
});


// on crypte le password lors du login pour le comparer avec le pswd crypté present dans la db
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};



const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;