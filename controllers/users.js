const { users } = require("../model/database");
const multer = require("multer");
const Joi = require("joi");
// const {db: users} =require('./model/database');

var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/* SIGN UP user
validate the inputS {USERNAME, PASSWORD} of the user using joi
encrypt the password using bcrypt and 
issue a user token with jwt

*/
exports.signUp = async function (req, res) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),

    repeat_password: Joi.ref("password"),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  try {
    const data = await schema.validateAsync(req.body);
    let { username, email, password } = data;
    password = bcrypt.hashSync(password, 10);
    // Store hash in your password DB.
    const user = {
      username,
      password,
      email,
      id: uuidv4(),
      profile: {
        username,
        accountid:user.id,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: uuidv4(),
        status: "pending"
      },
    };
    // const profile= {
    //   username,
    //   createdAt: new Date().toISOString(),
    //   email,
    //   updatedAt: new Date().toISOString(),
    //   id : uuidv4()
    // }

    users.push(user);
    res.send({
      message: "signup successful",
      users,
    });
  } catch (error) {
    res.json({ error });
  }
};

/* SIGN IN user 
Check if user exits ,
then encrypt the password to verify the firstly encypted password in the db
then log user in send user authenticated in the console and serve a static page to the user
*/

exports.signIn = async function (req, res) {
  const schema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  try {
    const data = await schema.validateAsync(req.body);
    // console.log(data)
    const email = data.email;
    const password = data.password;

    const user = users.find((user) => {
      if (user.email === email) {
        // console.log(data)
        const isPassword = bcrypt.compareSync(password, user.password);

        if (isPassword) {
          const token = jwt.sign({ id: user.id }, "Jesus_secret", {
            expiresIn: "2d",
          });
          res
            .status(200)
            .json({
              okay: true,
              token: `Bearer ${token}`,
              message: "logged in successfully",
            });
          // console.log(isPassword);
        } else {
          res.status(401).json({ okay: false, message: "invalid password" });
        }
        
      }
      // else {res.status(404).json({okay:false, message:'user not found'})
      // }
    });
  } catch (err) {
    res.status(422).json({ okay: false, message: err.message });
  }
  // res.json(users)
};

exports.getAllUsers = function (req, res) {
  res.json(users);
};

exports.getSingleUser = function (req, res) {
  const user = users.find((user) => {
    if (user.id === req.params.id) {
      return user;
    } else {
    }
  });

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send("user not found");
  }

  return res;
};

exports.createNewUser = function (req, res) {
  users.push({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    id: (Number(users[users.length - 1].id) + 1).toString(),
  });
  res.send(users);
};

exports.updateUser = function (req, res) {
  const user = users.find((user) => {
    if (user.id === req.params.id) {
      return user;
    } else {
    }
  });
  if (user) {
    console.log(req.file.path);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.photo = req.file.filename;
    user.profile.updatedAt = new Date().toISOString();
    res.status(400).json(users);
  } else {
    res.status(200).json("no user found");
  }
};

exports.deleteUser = function (req, res) {
  const user = users.find((user) => {
    if (user.id === req.params.id) {
      return user;
    } else {
    }
  });
  if (user) {
    console.log();
    users.splice(users.indexOf(user), 1);
    res.status(200).send(users);
  } else {
    res.status(404).send("user not found");
  }
};
exports.getprofile = async function (req, res) {
  const user = users.find((user) => {
    if (user.id === res.locals.id) {
      return user;
    } else {
    }
  });
  if (user) {
    // console.log(user)
   res.status(200).json({okay:true, data:user.profile})
  } else {
    res.status(404).send({okay: false, message: 'user not found'});
  }
  // console.log(res.locals.id)
};
