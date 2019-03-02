var express=require("express");
var router=express();
var Event=require("../models/events");
var mongoose =require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//UsersAuth  Schema 

var UserSchema=new mongoose.Schema({
    username:String,
    password:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User", UserSchema);