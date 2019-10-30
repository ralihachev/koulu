var mongo = require ('mongoskin');

var db = mongo.db("mongodb://localhost:27017/koulu", {native_parser: true});
db.bind('teachers');

var set = {
    username: 'teacher',
    hash: '$2y$10$X/s.SaJAn3hkSzbNRit/iOsAGSOTYdiewJkog3r2d8fWS8WMTROi.'
};

db.teachers.insert(set, function(err){
    if (err) throw err;
    console.log('inserted')
});

