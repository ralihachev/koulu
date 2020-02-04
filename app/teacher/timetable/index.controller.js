(function(){
    'use strict';

    angular
        .module('app')
        .controller('Timetable.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;
        vm.addTimetable = addTimetable;

        function addTimetable(){
            var file = vm.myFile;
            UserService.add_timetable(file)
                .then(function(){
                    FlashService.Success('The timetable from file was added');
                })
                .catch(function(error){
                    FlashService.Error(error)
                })
        }
    }

    angular
        .module('app')
        .directive('fileModel', ['$parse', function($parse){
            return {
                restrict: 'A',
                link: function(scope, element, attrs){
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        })
                    })
                }
            }
        }])

})();
