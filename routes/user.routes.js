const router = require('express').Router();
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const uploadController = require("../controllers/upload.controller");
const multer = require('multer');  // pour le traitement de l'image, instal version 2 mini
const upload = multer();


// auth
router.post("/register", authController.signUp)
router.post("/login", authController.signIn)
router.get("/logout", authController.logout)


// user DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put("/follow/:id", userController.follow);
router.put('/unfollow/:id', userController.unFollow);


// chargement fichiers
router.post('/upload', upload.single('file'), uploadController.uploadProfil)



module.exports = router;