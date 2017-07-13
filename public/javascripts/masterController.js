angular.module('caknow',[])
       .controller('requsetController', function requsetController($scope){
           /*
             For the filter by year the default year begin is the 2014 and 
             the year end is the 2017


             For Filter by make the default make is empty : []

             For Filter by catalog the default value is also empty: []

             For sort we dont really do default for them and we will have one function for the sort: requestSort(param, order) == >

             new array of object 
           */

           //request demo data : JSON File

           //mock data starts
            var data = [{
              "year" : 2014, "make" : "BMW", "model": "X5","issue":["Brake", "Engine"], "quote" : [], "distance" : [34.1496764, -118.0787828],
               "time" : "11/2/2016", "description" : "this the a demo", "request_status" : 1, "requoted" : 2, "scheduled" : "", "service_reciever" : ObjectId("590fc4f8f276d09f135a873c"),
               "service_creator" : ObjectId("59083916e5413d813d5e99a9")
            }];
           //mock data ends


           $scope.filterByyear = [2014, 2017]; // filter by year

           $scope.filterBymake = []; //filter by make

           $scope.filerBycatalog = []; //filter by catalog

           $scope.requestSort = function(param, order) {
              // we use quick sort for this so ..... 
              

           };

           
       });
