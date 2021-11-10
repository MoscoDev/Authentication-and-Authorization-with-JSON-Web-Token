const express=require("express") ;
const {users} =require('./model/database');
const {getSingleUser, getAllUsers, createNewUser, updateUser, deleteUser, signUp, signIn, getprofile} = require('./controllers/users');
const app = express();
const multer =require('multer');
const {upload} = require('./config');
const authorization = require('./middlewares/authorization')

app.use(express.json({urlEncoded: false}))


// signup user
app.post("/signup", signUp)




// signIn user
app.post("/login", signIn)

app.post("/profile", authorization, getprofile)


app.get("/users", getAllUsers);

// get single users by id
app.get("/users/:id", getSingleUser)

/* create a new user*/
app.post("/users", createNewUser);

/* Update a user*/

app.put("/users/:id", upload.single('image'), updateUser);

/* Delete a user*/

app.delete("/users/:id", deleteUser)

        
app.listen(3000, ()=>{console.log("running on port 3000")
});