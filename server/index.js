require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;
const { register, login, logout } = authCtrl;
const {
  dragonTreasure,
  getUserTreasure,
  addMyTreasure,
  getAllTreasure
} = treasureCtrl;
const { usersOnly, adminsOnly } = auth;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db hit");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/logout", logout);
app.get("/api/treasure/dragon", dragonTreasure);
app.get("/api/treasure/user", usersOnly, getUserTreasure);
app.post("/api/treasure/user", usersOnly, addMyTreasure);
app.get("/api/treasure/all", usersOnly, adminsOnly, getAllTreasure);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
