var config = require ('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require ('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('users');
db.bind('cancel');


var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.cancelBus = cancelBus;

module.exports = service;

function authenticate (username, password){
    var deferred = Q.defer();

    db.users.findOne({username: username}, function(err, user){
        if (err) deferred.reject(err);

        if(user && bcrypt.compareSync(password, user.hash)){
            deferred.resolve(jwt.sign({sub: user._id}, config.secret));
        } else {
            deferred.resolve();
        }
    });

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

        db.users.insert(
            user, function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update (_id, userParam){
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            db.users.findOne(
                {username: userParam.username},
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        deferred.reject('Username "' + req.body.username + '" is already taken');
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });


    function updateUser(){
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username
        };

        if (userParam.password){
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            {_id: mongo.helper.toObjectID(_id)},
            {$set: set},
            function (err, doc){
                if (err) deferred.reject(err);
                deferred.resolve();
            });
    }

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
