	//var app = angular.module("squarre", ["ui.bootstrap","firebase"]);
	//angular.module("squarre", ['ui.bootstrap',"firebase"]);
	var app = angular.module("squarre", ['ui.bootstrap', "firebase"]);

	function GamesController($scope, $firebase) {
		var playersRef = new Firebase("https://squarre.firebaseio.com/players");
		var gamesRef = new Firebase("https://squarre.firebaseio.com/games");


/*
		var auth = new FirebaseSimpleLogin(gamesRef, function(error, user) {
			if (error) {
				// an error occurred while attempting login
				alert(error);
			} else if (user) {
				// user authenticated with Firebase
				console.log('User ID: ' + user.id + ', Provider: ' + user.provider + ', e-mail: ' + user.email);
			} else {
				auth.login('google');
			}
		});

		var auth = new FirebaseSimpleLogin(playersRef, function(error, user) {
			if (error) {
				// an error occurred while attempting login
				alert(error);
			} else if (user) {
				// user authenticated with Firebase
				console.log('User ID: ' + user.id + ', Provider: ' + user.provider + ', e-mail: ' + user.email);
			} else {
				auth.login('google');
			}
		});
*/
		// attempt to log the user in with your preferred authentication provider
		//auth.logout();
		$scope.players = $firebase(playersRef);
		$scope.games = $firebase(gamesRef);

		$scope.pointsArrayp1 = [{"name":"0","value":"0"},{"name":"1","value":"1"}];
		$scope.pointsArrayp2 = [{"name":"0","value":"0"},{"name":"1","value":"1"}];

		$scope.score1 = $scope.pointsArrayp1[0];

		$scope.pointsArray = [0,1,2,3];
		//$scope.point = $scope.pointsArray[0];

		//$scope.userInfo = 'User ID: ' + user.id + ', Provider: ' + user.provider + ', e-mail: ' + user.email;

		$scope.player1Id = $scope.players[0];
		


		$scope.oneAtATime = true;
		$scope.status = {
			isFirstOpen: false,
			isFirstDisabled: false
		};

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

			//$scope.games.$add(newGame);

		}

		$scope.cancelSaveGame = function(e) {
			console.log(cancelSaveGame());
		}

	}


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