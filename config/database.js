const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@twitterclonecluster.ufrex.mongodb.net/mern",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connexion à la DB reussie"))
  .catch((err) => console.log("Connexion à la DB echouée ", err));
