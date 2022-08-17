const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require('../middleware/checker');

//signup routes
router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup");
  });
  
  router.post("/signup", isLoggedOut, async (req, res) => {
    const { username, password } = req.body;
  
    if (!password || !username) {
        const errorMessage = `Username or password invalid !`;
        res.render("auth/signup", { errorMessage });
        return;
    }
  
    try {
        const foundUser = await User.findOne({ username });
        if (foundUser) {
            const errorMessage = `Already registered !`;
            res.render("auth/signup", { errorMessage });
            return;
        }
  
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
      username,
      password: hashedPassword,
    });
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
  });
  
  //login routes
  router.get("/login", isLoggedOut,  (req, res) => {
      res.render("auth/login");
  });
  
  router.post("/login", isLoggedOut, async (req, res) => {
      const { username, password } = req.body;
  
      if (!username || !password) {
          return res.render("auth/login", {
              errorMessage: "Provide an email and password !",
          });
      }
  
      try {
          const findUser = await User.findOne({ username });
  
          if (!findUser) {
              return res.render("auth/login", {
                  errorMessage: "Details do not match, try again !",
              });
          }
  
          const checkPassword = bcrypt.compareSync(password, findUser.password);
          if (!checkPassword) {
              res.render("auth/login", {
                  errorMessage: "Details do not match, try again !",
              });
          }
          if (checkPassword) {    
            req.session.currentUser = findUser;
            res.redirect("/auth/profile");
          }
      } catch (err){
        console.log(err);
    }
  });

  
  router.post("/logout", isLoggedIn, (req, res) => {
        res.clearCookie('connect.sid');
        req.session.destroy(() => res.redirect("/auth/login"));
  });

//   router.post('/logout', isLoggedIn, (req, res) => {
//     res.clearCookie('connect.sid')
//     req.session.destroy(() => res.redirect('/auth/login'))
//   })
  
  
  router.get("/profile", isLoggedIn, (req, res) => {
        const findUser = req.session.currentUser;
      res.render("auth/private", {findUser});
  });
  
  router.get("/profile", isLoggedOut, async (req, res, next) => {
    try {
      await req.session.user;
      res.render("auth/main");
    } catch (err) {
        next(err);
    }})

module.exports = router