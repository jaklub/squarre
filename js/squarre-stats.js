	'use strict';
	//var app = angular.module("squarre", ["ui.bootstrap","firebase"]);
	//angular.module("squarre", ['ui.bootstrap',"firebase"]);
	// var app = angular.module("squarre", ['ui.bootstrap', "firebase"])
	var squarre = angular.module("squarre", ['firebase']);
	squarre.factory("StatsService", ["$firebase", "$rootScope", "$timeout",  function($firebase, $rootScope, $timeout) {
			var gamesRef = new Firebase("https://squarre.firebaseio.com/games");
			var gamesWithLimitRef = new Firebase("https://squarre.firebaseio.com/games");
			var playersRef = new Firebase("https://squarre.firebaseio.com/players");
			var playersNameRef = new Firebase("https://squarre.firebaseio.com/players");
			return {
				getGames: function() {
					var deferred = new jQuery.Deferred()
					var games = [];
					gamesRef.on("value", function(snapshot) {
						games.push(snapshot.val());
						// console.log(JSON.stringify(snapshot.val(),null,2));
						deferred.resolve(games);
					});

					return deferred.promise();

				},
				getPlayers: function() {
					var deferred = new jQuery.Deferred()
					var players = [];
					playersRef.on("value", function(snapshot) {
						players.push(snapshot.val());
						// console.log(JSON.stringify(snapshot.val(),null,2));
						deferred.resolve(players);
					});

					return deferred.promise();

				}

			}
		}])
		.controller("StatsController", ["$scope", "StatsService",
			function($scope, service) {
				// $scope.players = service.getPlayers();
				defineExtensionMethods();
				$scope.games = [];
				$scope.players = [];
				var requests = [];

				requests[0] = service.getGames();
				requests[1] = service.getPlayers();

				$.when(service.getGames(),service.getPlayers()).then(function(games,players){
					$scope.games = $.makeArray(games[0]);
					$scope.players = players;
					console.log("then!!!");
					var data = processData(games,players);

					        // series: [{
						       //    	  name: 'Jakob',
						       //      data: [1200, 1250, 1150, 1000, 1100]
						       //  }, {
						       //      name: 'Niklas',
						       //      data: [1200, 1150, 1220, 1600, 1400]
						       //  }, {
						       //      name: 'Olof',
						       //      data: [1200, 1400, 1200, 1100, 1700]
						       //  }]
					var series = [];						        
					$.each(players[0],function(index,player){
						series.push({
							"name": player.name,
							"data": data.timeRatings[index]
						});

					});						        

					setChartData("container-elo",{},data.time,series)

				});



			}
		]);


function processData(games,players){
	var dates=[0];
	var ratings={};

	$.each(players[0],function(index,value){
		ratings[index] = [1200];
		// ratings[index].push(0);
	});


	var win = {rating:2100};
	var lose = {rating:200};

	$.each(games[0],function(index,game){
		var player1 = game.players[0];
		var player2 = game.players[1];

		if(player1.id !== player2.id){

			dates.push(game.dateTime);

			player1.rating = ratings[player1.id].last();
			player2.rating = ratings[player2.id].last();

			calcELO(player1, player2);


			ratings[player1.id].push(player1.newRating);
			ratings[player2.id].push(player2.newRating);

			$.each(players[0],function(index,player){
				if(index !== player1.id && index !== player2.id){
					ratings[index].push(ratings[index].last());
				}
			});						


		}

		var temp = game;


	});

	dates.splice(0, 1);
	$.each(ratings,function(index,rating){
		rating.splice(0, 1);
	});	

	return {"time": dates, "timeRatings": ratings}

}

function calcELO(player1, player2){

	var kFactor = 32;

	if(player1.rating == null || player1.rating == 0){
		player1.rating = 1200;
	}
	if(player2.rating == null || player2.rating == 0){
		player2.rating = 1200;
	}


	var ratingDifference = Math.abs(player1.rating - player2.rating);
	var expectedScoreWinner = 1 / ( 1 + Math.pow(10, ratingDifference/400) );

	var e = kFactor * (1 - expectedScoreWinner);

	if(player1.points>player2.points){
		player1["newRating"] = Math.round(player1.rating + e);
		player2["newRating"] = Math.round(player2.rating - e);

	}else if(player1.points<player2.points){
		player1["newRating"] = Math.round(player1.rating - e);
		player2["newRating"] = Math.round(player2.rating + e);

	}else{
		player1["newRating"] = Math.round(player1.rating);
		player2["newRating"] = Math.round(player2.rating);
	}
}

// elo(win, lose);

function setChartData(containerId, options, categories , series){
	if(options.length===0 || options == null || Object.keys(options).length === 0){
		options = {
	        chart: {
	            type: 'spline'
	        },
	        title: {
	            text: 'ELO rating'
	        },
	        xAxis: {
	                categories: []
	        },
	        yAxis: {
	            title: {
	                text: 'Rating'
	            },
	            // min: 0
	        },
			tooltip: {
	                valueSuffix: 'points'
	            },
	       	plotOptions: {
	             spline: {
	                lineWidth: 4,
	                states: {
	                    hover: {
	                   		lineWidth: 5
	                   	}
	                },
	                marker: {
	                	enabled: false
	                }
	            }
	        },
	        series: []	                
	    }


	}
	// $.extend(options,xAxis,yAxis);	
	options.xAxis.categories = categories;
	options.series = series;
    $('#' + containerId).highcharts(options);


}



$(function () { 
    $('#container-test').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'ELO rating'
        },
        xAxis: {
                // type: 'datetime',
                // labels: {
                //     overflow: 'justify'
                // }
                categories: ['2014-01-01', '2014-01-07', '2014-01-14', '2014-01-21', '2014-01-28']
        },
        yAxis: {
            title: {
                text: 'Rating'
            },
            min: 500
        },
		tooltip: {
                valueSuffix: 'points'
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    // pointInterval: 3600000, // one hour
                    // pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
                }
            },        
        series: [{
            name: 'Jakob',
            data: [1200, 1250, 1150, 1000, 1100]
        }, {
            name: 'Niklas',
            data: [1200, 1150, 1220, 1600, 1400]
        }, {
            name: 'Olof',
            data: [1200, 1400, 1200, 1100, 1700]
        }]
    });
});


$(function () { 
    $('#container-example').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
});
