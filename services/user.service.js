var config = require ('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require ('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var formidable = require('formidable');
var csv = require ('convert-csv-to-json');

var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('users');
db.bind('cancel');
db.bind('teachers');
db.bind('pupils');
db.bind('timetable');
var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.cancelBus = cancelBus;
service.add_pupil = add_pupil;
service.GetPupil = GetPupil;
service.GetAllPupils = GetAllPupils;
service.add_pupils_from_file = add_pupils_from_file;
service.add_timetable = add_timetable;

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
    else if (loginPerson === 'parent') {
        db.users.findOne({username: username}, function(err, user){
            if (err) deferred.reject(err);

            if(user && bcrypt.compareSync(password, user.hash)){
                deferred.resolve(jwt.sign({sub: user._id}, config.secret));
            } else {
                deferred.resolve();
            }
        });
    }
    else {
        deferred.reject('Please select who is logging in')
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

        get_pupil(user.phone_number);

    });

    function get_pupil(phone_number){
        db.pupils.find({
            "$or":[{parent_one_phone: phone_number}, {parent_two_phone: phone_number}]}).toArray(function(err, pupil) {
            if (err) deferred.reject(err);

            if (pupil) {

                deferred.resolve(pupil);
            }
        });
    }

    return deferred.promise;
}

function GetAllPupils () {
    var deferred = Q.defer();

    db.pupils.find({}).toArray(function(err, pupils){
        if (err) deferred.reject(err);
        deferred.resolve(pupils)
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
        address_from: userParam.address_from,
        school_name: userParam.school_name,
        pupil_class: userParam.pupil_class
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

function cancelBus(cancelParam){
    var deferred = Q.defer();
    var date = new Date ();
    var time_of_cancellation = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+', '+date.getHours()+':'+date.getMinutes();

    var set = {
        pupil_id: cancelParam.pupil_id,
        address_from: cancelParam.address_from,
        number_of_days: cancelParam.number_of_days,
        time_of_cancellation: time_of_cancellation
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

    db.pupils.findOne(
        {pupil_id: pupil_details.pupil_id},
        function(err, user){
            if (err) deferred.reject(err);

            if (user){
                deferred.reject('Pupil ID "' + pupil_details.pupil_id + '" is already taken');
            } else {
                addPupil();
            }
        });

    function addPupil(){
        var set = {
            pupil_id: pupil_details.pupil_id,
            address_from: pupil_details.address_from,
            school_name: pupil_details.school_name,
            extra_info: pupil_details.extra_info,
            parent_one_phone: pupil_details.parent_one_phone,
            parent_two_phone: pupil_details.parent_two_phone,
            teacher_contact: pupil_details.teacher_contact,
            pupil_class: pupil_details.pupil_class

        };

        db.pupils.insert(
            set,
            function (err, doc){
                if (err) deferred.reject(err);
                deferred.resolve();
            }
        );
    }


    return deferred.promise;
}

function add_pupils_from_file(file){
    var deferred = Q.defer();

    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.encoding = 'utf-8';
    form.parse(file);

    form.on('file', function(name, file, err){
        if (err) {
            console.log('Error uploading file');
            deferred.reject(err)
        }
        else {
            var json = csv.getJsonFromCsv(file.path);

            db.pupils.insertMany(json, function(err, res){
                if (err) deferred.reject();
                console.log('Inserted from file');
                deferred.resolve();
            });
        }

    });

    return deferred.promise;
}

function add_timetable(file){
    var deferred = Q.defer();

    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.encoding = 'utf-8';
    form.parse(file);

    form.on('file', function(name, file, err){
        if (err){
            console.log('Error uploading the timetable file');
            deferred.reject(err);
        } else {
            var json = csv.getJsonFromCsv(file.path);

            db.timetable.insertMany(json, function(err, res){
                if (err) deferred.reject();
                console.log('Inserting timetable from file');
                deferred.resolve();
            })
        }
    })

    return deferred.promise;
}