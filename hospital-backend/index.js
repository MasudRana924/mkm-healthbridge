const express = require('express');
const connectDatabase = require('./config/connection');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require('cors');
require('dotenv').config();
const cloudinary = require("cloudinary");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

const port = process.env.PORT || 5000;
connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const routes = require('./route/routes');
app.use("/api", routes);

const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});

module.exports = server;