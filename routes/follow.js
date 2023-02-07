const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");

// Route

router.get("/prueba-follow", FollowController.pruebaFollow);

// Route Export

module.exports = router;