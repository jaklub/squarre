	var app = angular.module("squarre", ["firebase"]);
	function GamesController($scope, $firebase) {
		var ref = new Firebase("https://squarre.firebaseio.com/games");
		$scope.games = $firebase(ref);

	}

	function PlayersController($scope, $firebase) {
		var playersRef = new Firebase("https://squarre.firebaseio.com/players");
		$scope.players = $firebase(playersRef);
		var gamesRef = new Firebase("https://squarre.firebaseio.com/games");
		$scope.games = $firebase(gamesRef);

		$scope.saveGame = function(e){
			var newDateTime = getDateTime();
			var newId = -1;
			var player1 = $scope.player1;
			var player2 = $scope.player2;
			var points1 = $scope.score1;
			var points2 = $scope.score2;

			var newGame =
				{
					"id": newId,
					"dateTime": newDateTime,
					"players": [
					{
						"id": player1,
						"points": points1
					},
					{
						"id": player2,
						"points": points2
					}        
					]
				};

			console.log("saveGame(), player1: " + player1 + ", player2:" + player2);
			console.log(console.log(JSON.stringify(newGame,null,2)));

			$scope.games.$add(newGame);

		}
	}      


	function getDateTime() {
		var now     = new Date(); 
		var year    = now.getFullYear();
		var month   = now.getMonth()+1; 
		var day     = now.getDate();
		var hour    = now.getHours();
		var minute  = now.getMinutes();
		var second  = now.getSeconds(); 
		if(month.toString().length == 1) {
			var month = '0'+month;
		}
		if(day.toString().length == 1) {
			var day = '0'+day;
		}   
		if(hour.toString().length == 1) {
			var hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
			var minute = '0'+minute;
		}
		if(second.toString().length == 1) {
			var second = '0'+second;
		}   
		var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
		return dateTime;
	}