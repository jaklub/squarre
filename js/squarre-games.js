	'use strict';
	//var app = angular.module("squarre", ["ui.bootstrap","firebase"]);
	//angular.module("squarre", ['ui.bootstrap',"firebase"]);
	// var app = angular.module("squarre", ['ui.bootstrap', "firebase"])
	var squarre = angular.module("squarre", ['firebase', 'infinite-scroll','ngAnimate']);
	squarre.factory("GamesService", ["$firebase", "$rootScope", "$timeout",  function($firebase, $rootScope, $timeout) {
			var gamesRef = new Firebase("https://squarre.firebaseio.com/games");
			var gamesWithLimitRef = new Firebase("https://squarre.firebaseio.com/games");
			var playersRef = new Firebase("https://squarre.firebaseio.com/players");
			var playersNameRef = new Firebase("https://squarre.firebaseio.com/players");
			return {
				getGames: function() {
					var games = [];
					gamesRef.on("child_added", function(snapshot) {
						games.push(snapshot.val());
						// console.log(JSON.stringify(snapshot.val(),null,2));
					});
					return $firebase(gamesRef);
				},
				getGamesWithLimit: function(limit) {
					// gamesWithLimitRef.on("child_added", function(snapshot) {
					// 	games.push(snapshot.val());
					// 	// console.log(JSON.stringify(snapshot.val(),null,2));
					// });
					return $firebase(gamesRef.limit(limit));
				},
				addGame: function(game) {
					gamesRef.push(game);
				},
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
		.controller("GamesController", ["$scope", "GamesService",
			function($scope, service) {
				$scope.players = service.getPlayers();
				$scope.gamesLimit = 10;
				$scope.gamesWithLimit = service.getGamesWithLimit($scope.gamesLimit);
				$scope.games = service.getGames();
				$scope.pointsArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];				
				$scope.gameUpdateId ="";

					$scope.updatePlayer1Id = "";
					$scope.updatePlayer2Id = "";
					$scope.updatePlayer1Points = "";
					$scope.updatePlayer2Points = "";

				$scope.saveGame = function(e) {
					var newDateTime = getDateTime();
					var newId = -1;
					var player1 = $scope.player1Id;
					var player2 = $scope.player2Id;
					var points1 = $scope.player1Points;
					var points2 = $scope.player2Points;

					var newGame = {
						"id": newId,
						"dateTime": newDateTime,
						"players": [{
							"id": player1,
							"points": points1
						}, {
							"id": player2,
							"points": points2
						}]
					};

					console.log("saveGame(), player1: " + player1 + ", player2:" + player2);
					console.log(console.log(JSON.stringify(newGame, null, 2)));

					$scope.games.$add(newGame);

				}		

				$scope.limitClick = function(e) {		
					$scope.gamesWithLimit = service.getGamesWithLimit($scope.gamesLimit);
				}
				$scope.loadMoreGames  = function(e) {
					$scope.gamesLimit = $scope.gamesLimit + 5;		
					$scope.gamesWithLimit = service.getGamesWithLimit($scope.gamesLimit);
				}
				$scope.updateGame  = function(gameId) {
					var temp = "";
					if($scope.gameUpdateId === gameId){
						$scope.gameUpdateId = "";
					}
					else{
						$scope.gameUpdateId = gameId;

						var updateGame = $scope.games[gameId];
						$scope.$parent.updatePlayer1Id = updateGame.players[0].id;
						$scope.$parent.updatePlayer2Id = updateGame.players[1].id;
						$scope.$parent.updatePlayer1Points = updateGame.players[0].points;
						$scope.$parent.updatePlayer2Points = updateGame.players[1].points;
					}


					var temp = "";

				}
				$scope.saveUpdateGame  = function(gameId) {
					var updateGame = $scope.games.$child(gameId);
					var updatePlayers = updateGame.$child("players");
					var player1 = $scope.$parent.updatePlayer1Id;
					var player2 = $scope.$parent.updatePlayer2Id;
					var points1 = $scope.$parent.updatePlayer1Points;
					var points2 = $scope.$parent.updatePlayer2Points;					

					var newPlayers = [{
								"id": player1,
								"points": points1
							}, {
								"id": player2,
								"points": points2
							}]
						
					updatePlayers.$set(newPlayers);

					var temp = "";
					$scope.gameUpdateId ="";
				}
				$scope.cancelUpdateGame  = function(gameId) {
					$scope.gameUpdateId = "";
				}
				$scope.evalWinnerCSS = function(playerPoints, oponentPoints){
					if(playerPoints === oponentPoints){
						return "draw";
					}
					else if(playerPoints>oponentPoints){
						return "won";
					}
					else if(playerPoints<oponentPoints){
						return "lost";
					}

				}
			}
		]);
