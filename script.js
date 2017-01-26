var game = {

	scenes: ['start', 'main-game', 'win', 'lose'],
	activeScene: 'start',
	render: {
		game: null,
		boxes: null,
		numerator: null,
		denominator: null,
		result: null,
	},
	boxPosition: 70,
	number: 0,
	factors: {},
	factorsFound: {},
	result: 0,
	primes: [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],
	stepTimer: null,

	init: function() {
		game.render.game = $('#game');
		game.render.boxes = $('#boxes');
		game.render.numerator = $('#numerator .numbers');
		game.render.denominator = $('#denominator .numbers');
		game.render.result = $('#result');
		game.generateBoxes();
		game.updateBoxes();
		game.setInterface();
	},

	step: function() {
		game.boxPosition = game.boxPosition - 1;
		game.updateBoxes();
		game.loseCheck();
	},

	generateBoxes: function() {
		var boxes = '';
		$.each(game.primes, function(i, p) {
			boxes = boxes + '<div class="box factor" data-number="' + p + '"><span class="prime">' + p + '</span></div>';
		});
		game.render.boxes.html(boxes);
	},

	updateBoxes: function() {
		game.render.boxes.css('left', game.boxPosition + '%');
	},

	setInterface: function() {
		// Start Button(s)
		game.render.game.on('click', 'a.start', game.startGame);

		// Factoring buttons
		game.render.game.on('click', '.factor', function(){
			game.factorCheck($(this).data('number'));
		});
	},

	startGame: function() {
		game.pickNumber();
		game.boxPosition = 70;
		game.updateBoxes();
		game.gotoScene('main-game');
		game.stepTimer = setInterval(game.step, 100);
	},

	stopGame: function() {
		clearInterval(game.stepTimer);
	},

	gotoScene: function(newScene) {
		$('.scene-' + game.activeScene).removeClass('active');
		$('.scene-' + newScene).addClass('active');
		game.activeScene = newScene;
	},

	pickNumber: function() {
		exponentSum = Math.floor(Math.random() * 2) + 4;
		exponentRemaining = exponentSum;

		exponentTwo = Math.floor(Math.random() * exponentRemaining);
		exponentRemaining -= exponentTwo;
		exponentThree = Math.floor(Math.random() * exponentRemaining);
		exponentRemaining -= exponentThree;
		exponentFive = exponentRemaining;

		extraPrimes = [7,11,13,17];
		extraPrimeKey = Math.floor(Math.random() * 4);
		extraPrime = extraPrimes[extraPrimeKey];

		game.number = Math.pow(2, exponentTwo) * Math.pow(3, exponentThree) * Math.pow(5, exponentFive) * extraPrime;
		game.result = game.number;
		game.factors = {
			2: exponentTwo,
			3: exponentThree,
			5: exponentFive,
			extraPrime: 1
		};
		game.factorsFound = {};

		game.updateNumbers();
	},

	factorCheck: function(factor) {
		if (game.result % factor == 0) {
			game.result = game.result / factor;
			if (typeof game.factorsFound[factor] == 'undefined') {
				game.factorsFound[factor] = 1;
			}
			else {
				game.factorsFound[factor]++;
			}

			game.updateNumbers();

			if (game.result == 1) {
				game.endGame(true);
			}
			else {
				game.boxPosition += 20;
				if (game.boxPosition > 70) {
					game.boxPosition = 70;
				}
			}

			return true;
		}
		else {
			game.boxPosition -= 5;
			game.loseCheck();
			return false;
		}
	},

	updateNumbers: function() {
		game.render.numerator.html(game.number);
		game.render.result.html(game.result);

		var denominator = '';
		$.each(game.factorsFound, function(x,y) {
			denominator = denominator + '<div class="number factor" data-number="' + x + '">' + x;
			if (y > 1) {
				denominator = denominator + '<sup>' + y + '</sup>';
			}
			denominator = denominator + '</div>';
		});
		game.render.denominator.html(denominator);

		if (game.result == 1) {
			game.render.result.removeClass('factor');
			game.render.result.addClass('finished');
		}
		else if ($.inArray(game.result, game.primes) > -1) {
			game.render.result.addClass('factor');
			game.render.result.data('number', game.result);
		}
	},

	endGame: function(won) {
		if (won) {
			game.stopGame();
			game.gotoScene('win');
		}
	},

	loseCheck: function() {
		if (game.boxPosition <= 0) {
			game.stopGame();
			game.gotoScene('lose');
		}
	}
}


$(document).ready(function(){
	game.init();
});




