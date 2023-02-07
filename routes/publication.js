const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");

// Route

router.get("/prueba-publication", PublicationController.pruebaPublication);

// Route Export

module.exports = router;