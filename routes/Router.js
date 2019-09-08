const express = require('express');
const Router = express.Router();
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const Events = require('../models/eventModel');

var iden;
// set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + 
        path.extname(file.originalname));
    }
}); 

//init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 2},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Image Only!');
    }
}

//------------------ image post ---------------------
Router.route('/img/imgUpload').get( function (req, res) {
    res.render('imgUpload');
});

Router.post('/img/imgUpload', function(req, res){
    upload(req, res, (err) => {
        if(err){
            res.render('imgUpload', {msg: err} );
        }else{
            if(req.file == undefined ){
                res.render('imgUpload', {msg: 'Error: No File Seleected!'} );
            }else{
                console.log(req.file);
                res.render('imgUpload',
                 { msg: 'File uploaded', file: '/uploads/' + req.file.filename });
            }
        }
    });
});

// Router.route('/img/events/:id').get( function (req, res) {
//     res.render('imgUpload');
// });


//------------------------- event post ---------------------------

Router.route('/img/events').get( function (req, res) {
    res.render('imagesTitle');
});

Router.post('/img/events/', function(req, res){
    const events = new Events();

    events.titleOfEvent = req.body.titleOfEvent
    events.descOfEvent = req.body.descOfEvent
    events.flink = req.body.flink
    events.ilink = req.body.ilink

    events.save()
        .then( events => {
            const id = events._id;
            res.redirect('/img/events/' + id + '/upload');
        })
        .catch( err => {
            res.status(400).send("unable to save to database");
        });
});

Router.route('/img/events/:id/upload').get( function(req, res){
    iden = req.params.id;
    Events.findById(iden, function( err, event ){
        res.render('eventDetail', {'event': event});
    });
});

Router.route('/img/events/:id').get( function(req, res){
    id = req.params.id;
    Events.findById(id, function( err, event ){
        res.render('eventMain', {'event': event});
    });
});

Router.post('/img/events/:id/upload', function(req, res){
    id = req.params.id;
    upload(req, res, (err) => {
        if(err){
            res.render('eventDetail', { 'msg': err } );
        }else{
            if(req.file == undefined ){
                res.render('eventDetail', {'msg': 'Error: No File Seleected!' } );
            }else{
                console.log(req.file);
                var image = { name: req.file.filename, captionOfEvent: req.body.captionOfEvent };
                Events.findById(id, function( err, events ){
                    events.images.push(image);
                    events.save()
                        .then( events => {
                            const id = events._id;
                            res.redirect('/img/events/' + id + '/upload');
                        })
                        .catch( err => {
                            res.status(400).send("unable to save to database");
                        });
                });
            }
        }
    });
});

//----------------------------------------------------------

module.exports = Router;
