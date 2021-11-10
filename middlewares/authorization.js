const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log(req.headers)
    let token = req.headers.authorization.split(" ")[1];
    token = jwt.verify(token, "Jesus_secret");
    res.locals.id = token.id;
   
    next()
  } catch (error) {
    console.log(error);
    res.status(401).json('session expired please login again')
  }
};
