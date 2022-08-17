
   const isLoggedIn =  (req, res, next) => {
      if (req.session.currentUser) {
        next();
      } else {
        res.render("auth/login");
      }
    }


const isLoggedOut = (req, res, next) => {
        if (req.session.currentUser) {
        return res.redirect('/');
        } else {
            next ();
        }
    }

    module.exports = {isLoggedIn, isLoggedOut}


