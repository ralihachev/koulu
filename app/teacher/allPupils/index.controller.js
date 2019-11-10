(function(){
    'use strict';

    angular
        .module('app')
        .controller('allPupils.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;

        vm.pupils = null;
        vm.search = search;

        initController();

        function initController(){
            UserService.GetAllPupils().then(function(pupils){
                var date = new Date('1970-01-01T04:30:00.000Z');
                vm.pupils = pupils;
            });
        }

        function search() {

            var input, filter, table, tr, td_school, td_id, i, txtValue;

            input = document.getElementById("search");
            filter = input.value.toUpperCase();
            table = document.getElementById("pupil_table");
            tr = table.getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++) {
                td_school = tr[i].getElementsByTagName("td")[2];
                if (td_school) {
                    txtValue = td_school.textContent || td_school.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }

    }

})();
