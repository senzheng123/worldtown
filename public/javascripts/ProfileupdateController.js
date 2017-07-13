angular.module('caknow',[])
      .controller('updateUser', function($scope, $http){
            $scope.check = function(email, phonenumber){
            console.log( $scope.email);

            	$http({
            		url: '/checkUnique',
            		method: "GET",
            		params: {email : email, phonenumber : phonenumber}
            	}).then(function(res){
            		console.log(res);
            	});



            }



      })