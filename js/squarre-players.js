	'use strict';
	//var app = angular.module("squarre", ["ui.bootstrap","firebase"]);
	//angular.module("squarre", ['ui.bootstrap',"firebase"]);
	// var app = angular.module("squarre", ['ui.bootstrap', "firebase"])
	var squarre = angular.module("squarre", ['firebase']);
	squarre.factory("PlayersService", ["$firebase", "$rootScope", "$timeout",  function($firebase, $rootScope, $timeout) {
			var playersRef = new Firebase("https://squarre.firebaseio.com/players");
			return {
				getPlayers: function() {
					var players = [];
					playersRef.on("child_added", function(snapshot) {
						players.push(snapshot.val());
						// console.log(JSON.stringify(snapshot.val(),null,2));
					});
					return $firebase(playersRef);				
				}
			}
		}])
		.controller("PlayersController", ["$scope", "PlayersService",
			function($scope, service) {
				$scope.players = service.getPlayers();

				
				$scope.savePlayer = function(e) {
					var playerName = $scope.playerName;

					var newPlayer = {
						"name": playerName,
					};				
					console.log("savePlayer(), playerName: " + playerName);
					console.log(console.log(JSON.stringify(newPlayer, null, 2)));

					$scope.players.$add(newPlayer);

				}
			}
		]);
