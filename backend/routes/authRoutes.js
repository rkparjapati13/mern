const express = require("express");
const { login } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
// router.get("/login", (req, res) => {
//   res.oidc.login({
//     returnTo: "/users",
//   });
// });

// router.get("/logout", (req, res) => {
//   res.oidc.logout({
//     returnTo: "/",
//   });
// });

module.exports = router;
