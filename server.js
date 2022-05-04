const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/database");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors"); // donne l'acces aux elements exterriers

const app = express();

// app.use(cors());  // donner l'acces à tout le monde
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// jwt
app.get("*", checkUser); // declenchement du checking à chaque requette
app.get("/jwtid", requireAuth, (req, res) => {
  // checker l'authen quand un user deja connecté revient sur le site
  res.status(200).send(res.locals.user._id);
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Server
app.listen(process.env.PORT, () => {
  console.log(`server listerning on port ${process.env.PORT}`);
});
