(function(){
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;

        vm.pupils = null;
        vm.add_pupil = add_pupil;
        vm.uploadFile = uploadFile;

        function add_pupil(){
            UserService.add_pupil(vm.pupils)
                .then(function(){
                    FlashService.Success('The pupil is added');
                    vm.pupils = null;
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
        }

        function uploadFile(){
            var file = vm.myFile;
            UserService.add_pupils_from_file(file)
                .then(function(){
                    FlashService.Success('The pupils from file were added');
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
