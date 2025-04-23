const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(searchController.search));

module.exports = router;