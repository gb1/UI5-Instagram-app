var koa = require("koa");
var route = require("koa-route");
var monk = require("monk");
var wrap = require("co-monk");
var parse = require("co-body");
var cors = require("koa-cors");
var fs = require('fs');
var https = require('https');

var app = koa();
var db = monk("localhost/koa_users");
var pics = wrap(db.get("pics"));

app.use(cors());
app.use(route.get("/", listPics));
app.use(route.post("/pic", savePic));
app.use(route.get("/pics/:id", getPic));

function *listPics(){

    var options = { "limit": 20, "sort": [["created_at", "desc"]]};

    var picsList = yield pics.find({}, options);
    this.body = {"pics": picsList};
}

function *savePic(){

    var picFromRequest = yield parse(this);
    picFromRequest.created_at = new Date();
    var pic = yield pics.insert(picFromRequest);

    this.body = pic;
    this.set("Location", "/pic/" + pic._id);
    this.status = 201; //CREATED OK
}

function *getPic(id){
    var pic = yield pics.findById(id);

    this.body = pic;
    this.status = 200; //OK
}

app.listen(3000);
