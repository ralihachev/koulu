(function(){
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service ($http, $q){
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAllPupils = GetAllPupils;
        service.Update = Update;
        service.add_pupil = add_pupil;
        service.add_pupils_from_file = add_pupils_from_file;
        service.add_timetable = add_timetable;

        return service;

        function GetCurrent (){
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAllPupils (){
            return $http.get('/api/users/allPupils').then(handleSuccess, handleError);
        }

        function Update (pupil){
            return $http.put('/api/users/' + pupil._id, pupil).then(handleSuccess, handleError);
        }

        function add_pupil(details){
            return $http.post('/api/users/addPupil', details).then(handleSuccess, handleError)
        }

        function add_pupils_from_file(file){

            var fd = new FormData();
            fd.append('file', file);
            console.log('Uploading file');

            return $http.post('/api/users/addPupilFromFile', fd,
                {transformRequest: angular.identity,
                headers: {'Content-Type': undefined}}).then(handleSuccess, handleError)
        }

        function add_timetable(file){
            var fd = new FormData();
            fd.append('file', file);
            console.log('Uploading timetable file');

            return $http.post('/api/users/addTimetable', fd,
                {transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}}).then(handleSuccess, handleError)
        }

        function handleSuccess (res){
            return res.data;
        }

        function handleError (res){
            return $q.reject(res.data);
        }
    }
})();