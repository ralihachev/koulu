(function(){
    'use strict';
    angular
        .module('app')
        .controller('Timetable.IndexController', Controller);

    function Controller(){
        var vm = this;
        vm.timetable_info = null;
        vm.addTimetable = addTimetable;

        initController();

        function initController(){
            // Here will go the initilizetion of the controller by getting the timetable info from the db
        }
    }
});