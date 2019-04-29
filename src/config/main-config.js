require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
const logger = require("morgan");


module.exports = {
  init(app,express){

    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressValidator());
    app.use(flash());


  }
};
