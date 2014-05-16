	//var app = angular.module("squarre", ["ui.bootstrap","firebase"]);
	//angular.module("squarre", ['ui.bootstrap',"firebase"]);
	// var app = angular.module("squarre", ['ui.bootstrap', "firebase"])
	var squarre = angular.module("squarre", ['firebase']);
	squarre.factory("GamesService", function() {
			var gamesRef = new Firebase("https://squarre.firebaseio.com/games");
			var playersRef = new Firebase("https://squarre.firebaseio.com/players");
			return {
				getGames: function() {
					var games = [];
					gamesRef.on("child_added", function(snapshot) {
						games.push(snapshot.val());
						console.log(JSON.stringify(snapshot.val(),null,2));
					});
					return games;
				},
				addGame: function(game) {
					gamesRef.push(game);
				},
				getPlayers: function() {
					var players = [];
					playersRef.on("child_added", function(snapshot) {
						players.push(snapshot.val());
						console.log(JSON.stringify(snapshot.val(),null,2));
					});
					return players;
				}				
			}
		})
		.controller("GamesController", ["$scope", "GamesService",
			function($scope, service) {
				// $scope.user = "Guest " + Math.round(Math.random() * 101);
				$scope.games = service.getGames();
				$scope.players = service.getPlayers();
				$scope.pointsArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];				
				// $scope.$apply();		
			}
		]);



	function getDateTime() {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		if (month.toString().length == 1) {
			var month = '0' + month;
		}
		if (day.toString().length == 1) {
			var day = '0' + day;
		}
		if (hour.toString().length == 1) {
			var hour = '0' + hour;
		}
		if (minute.toString().length == 1) {
			var minute = '0' + minute;
		}
		if (second.toString().length == 1) {
			var second = '0' + second;
		}
		var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		return dateTime;
	}