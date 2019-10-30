var config = require ('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require ('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('users');
db.bind('cancel');
db.bind('teachers');
db.bind('pupils');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.cancelBus = cancelBus;
service.add_pupil = add_pupil;
service.GetPupil = GetPupil;

module.exports = service;

function authenticate (username, password, loginPerson){
    var deferred = Q.defer();

    if (loginPerson === 'teacher') {
        db.teachers.findOne({username: username}, function(err, user){
            if (err) deferred.reject(err);

            if(user && bcrypt.compareSync(password, user.hash)){
                deferred.resolve(jwt.sign({sub: user._id}, config.secret));
            } else {
                deferred.resolve();
            }
        });
    }
    else {
        db.users.findOne({username: username}, function(err, user){
            if (err) deferred.reject(err);

            if(user && bcrypt.compareSync(password, user.hash)){
                deferred.resolve(jwt.sign({sub: user._id}, config.secret));
            } else {
                deferred.resolve();
            }
        });
    }

    return deferred.promise;
}


function getById(_id){
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user){
        if (err) deferred.reject(err);

        if (user) {
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}



function GetPupil(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user){
        if (err) deferred.reject(err);

        get_pupil(user.identifier_for_parents);

    });


    function get_pupil(identifier_for_parents){
        db.pupils.find({identifier_for_parents: identifier_for_parents}).toArray(function(err, pupil) {
            if (err) deferred.reject(err);

            if (pupil) {
                deferred.resolve(pupil);
            }
        });
    }

    return deferred.promise;
}



function create (userParam) {
    var deferred = Q.defer();

    db.users.findOne(
        {username: userParam.username},
        function(err, user){
            if (err) deferred.reject(err);

            if (user){
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser(){
        var user = _.omit(userParam, 'password');
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(user, function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
    }

    return deferred.promise;
}

function update (_id, userParam){
    var deferred = Q.defer();

    var set = {
        firstname: userParam.firstname,
        lastname: userParam.lastname,
        homeaddress: userParam.homeaddress
    };

    db.pupils.update(
        {_id: mongo.helper.toObjectID(_id)},
        {$set: set},
        function (err, doc){
            if (err) deferred.reject(err);
            deferred.resolve();
        });

    return deferred.promise;
}

function _delete (_id){
    var deferred = Q.defer();
     db.users.remove(
         {_id: mongo.helper.toObjectID(_id)},
         function (err){
             if (err) deferred.reject (err);

             deferred.resolve();
         });
    return deferred.promise;
}

function cancelBus(cancelParam){
    var deferred = Q.defer();

    var set = {
        homeaddress: cancelParam.homeaddress,
        cancelfrom: cancelParam.cancelfrom,
        cancelto: cancelParam.cancelto,
        cancelkidsnumber: cancelParam.cancelkidsnumber
    };

    db.cancel.insert(
        set,
        function (err, doc){
            if (err) deferred.reject(err);
            deferred.resolve();
        }
    );

    return deferred.promise;
}

function add_pupil(pupil_details){
    var deferred = Q.defer();

    var set = {
        firstname: pupil_details.firstname,
        lastname: pupil_details.lastname,
        homeaddress: pupil_details.homeaddress,
        identifier_for_parents: pupil_details.identifier_for_parents

    };

    db.pupils.insert(
        set,
        function (err, doc){
            if (err) deferred.reject(err);
            deferred.resolve();
        }
    );

    return deferred.promise;
}
