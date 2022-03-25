/*
    this file combines all other routes and is required by server.js
*/

const express = require("express");
const router = express.Router();
/*
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require("../config/auth");

//welcome page
router.get('/', forwardAuthenticated, (req, res) => {
	console.log('Here')
    res.redirect('/home');
});
*/

module.exports = (unsplash) => {
  router.use("/api/login", require("./login")(unsplash));
  router.use("/api/register", require("./register")(unsplash));
  return router;
};
