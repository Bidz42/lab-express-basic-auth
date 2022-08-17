const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

//signup routes
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
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
      const createdUser = await User.create({
    username,
    password: hashedPassword,
  });
      res.redirect("/login");
  } catch (err) {
      console.log(err);
  }
});

//login routes
router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.render("auth/login", {
			errorMessage: "Provide an email and password !",
		});
	}

	try {
		const foundUser = await User.findOne({ username });

		if (!foundUser) {
			return res.render("auth/login", {
				errorMessage: "Details do not match, try again !",
			});
		}

		const checkPassword = bcrypt.compareSync(password, foundUser.password);
        if (!checkPassword) {
			res.render("auth/login", {
				errorMessage: "Details do not match, try again !",
			});
		}
        if (checkPassword && foundUser) {    
          res.redirect("/profile");
        }
	} catch (err){
      console.log(err);
  }
});


module.exports = router;
