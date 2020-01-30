(function(){
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;

        vm.pupils = null;
        vm.add_pupil = add_pupil;
        vm.files = [];
        vm.doFileChange = doFileChange;

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



        function doFileChange(){
            console.log(vm.files[0]);
            UserService.add_pupils_from_file(vm.files[0])
                .then(function(){
                    FlashService.Success('The pupls from file were added');
                    vm.files = []
                })
                .catch(function(error){
                    FlashService.Error(error)
                })
        }

    }

    angular
        .module('app')
        .directive('input', function(){
            return {
                restrict: 'E',
                scope: {
                    ngModel: '=',
                    ngChange: '&',
                    type: '@'
                }, link: function (scope, element, attrs){
                    if (scope.type.toLowerCase()!='file'){
                        return;
                    }
                    element.bind('change', function(){
                        var files = element[0].files;
                        scope.ngModel = files;
                        scope.$apply();
                        scope.ngChange();
                    })
                }
            }
        })

})();
