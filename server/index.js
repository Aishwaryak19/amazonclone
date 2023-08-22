const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const router = require("./routes/router")
const cookieParser  = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const Products = require("./models/productsSchema");

const DefaultData = require("./defaultdata")



require('dotenv').config()


const PORT = process.env.port || 5000

app.use(express.json());
app.use(cookieParser(""));
app.use(cors())
app.use(router);


mongoose
.connect(process.env.DATABASE)
.then(()=> console.log(`Connected To MongoDB...`))
.catch((err)=> console.log(err))



app.listen(PORT,() => console.log(`Listening on: ${PORT}`))


DefaultData();