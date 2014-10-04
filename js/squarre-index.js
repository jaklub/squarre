	'use strict';
	var squarre = angular.module("squarre", ['firebase']);
	squarre.factory("IndexService", ["$firebase", "$rootScope", "$timeout",  function($firebase, $rootScope, $timeout) {
            var nextGameRef = new Firebase("https://squarre.firebaseio.com/nextgame");
			return {
                getNextGame: function() {
                    var nextGame = [];
                    nextGameRef.on("child_added", function (snapshot) {
                        //var obj = {snapshot.name().toString():snapshot.val().toString()};
                        var obj = {};
                        obj[snapshot.name()] = snapshot.val();
                        nextGame.push(obj);
                        console.log(JSON.stringify(obj,null,2));
                    });
                    return $firebase(nextGameRef);
                }
			}
		}])
		.controller("IndexController", ["$scope", "IndexService",
			function($scope, service) {
                $scope.nextGame = service.getNextGame();

				
				$scope.saveNextGame = function(e) {
                    var temp = "";
				}
			}
		]);
