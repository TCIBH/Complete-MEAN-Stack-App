const express = require("express");
const bodyParser = require("body-parser");
const postRoutes=require('./routes/posts');
const userRoutes=require("./routes/user");
var cors = require('cors');
const path=require('path');
const mongoose=require('mongoose');
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/gallerydb')
.then(()=>{
  console.log("Connected to database");
}).catch((error)=>{
console.log("Failed to connect to database",error);
})
//DulMTiGgcyqtugWl
//EIDXYWjD3dLIB3KY usee sachin123
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join("backend/images")))
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH,PUT, DELETE, OPTIONS"
//   );
//   next();
// });
app.use(cors());
app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);



module.exports = app;
