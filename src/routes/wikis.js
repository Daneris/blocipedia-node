const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");
const validation = require("./validation");
//wikiController.wiki is for the public wikis
router.get("/wikis", wikiController.wiki);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", validation.validateWikis, wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", validation.validateWikis, wikiController.update);



module.exports = router;
