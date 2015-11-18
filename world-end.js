/*15-10-13 Kwon Daye*/
var bgSound;

var trainSpeed = 1;

var os = "";
var browser = "";
var browserType = "";

var nightHour = 18;
var dayHour = 6;

var fontSize;
var gap;

var thumbLeft = 0;
var thumbWidth = 0;

var loading = false;
var stop = false;

var maxQueryCount = 10;
var lastQueryTime;
var keyword = 'world end';

var chimneyWidth, chimneyHeight;
var mastWidth, sailWidth;

var particles = [];
var lastGeneratingTime = new Date().getTime();
var smokeX, smokeY, smokeR, smokeColor;

$(window).on('beforeunload', function(){
	$(document).scrollLeft(0);
});

$(document).ready(function() {
	$('#myModal').modal();

	dayOrNight();
	resizeSpace();
	detectBrowser();

	if(browserType == "webkit") {
		var canvas = document.getElementById('smokeCanvas');
		var context = canvas.getContext('2d');
		canvas.width = $('body').width();
		canvas.height = $('body').height();
		
		renderSmoke(canvas, context);

		bgSound = new Audio('asset/train.mp3');
		bgSound.volume = 0.6;
		bgSound.play();
		bgSound.loop = true;
		
		$('.modal-header').append("<h4>From&nbsp&nbsp&nbsp&nbsp0</h4>");
		$('.modal-header').append("<h4>To&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspTHE END OF THE WORLD</h4>");
		$('.modal-body').append("<p>- 알림: 시설 현대화 작업 중 / 열차 정상 운행<br/>- 알림: 모바일 버전 증축 공사 중<br/><br/>- be sure you're full of NETWORK<br/>- Night Train Service 18:00 - 5:59<br/>- Transfer Available on the BLUE spot<br/><br/>- If you prefer to take a boat, please use INTERNET EXPLORER</p>");
		$('.modal-footer').append("<p>stationmaster <a href='https://vimeo.com/freshfleshflash' target='_blank'>Kwon Daye</a></p>");
	} else if(browserType == "ms") {
		bgSound = new Audio('asset/boat.mp3');
		bgSound.volume = 0.6;
		bgSound.play();
		bgSound.loop = true;
		
		$('.modal-header').append("<h4>From&nbsp&nbsp&nbsp&nbsp0</h4>");
		$('.modal-header').append("<h4>To&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspTHE END OF THE WORLD</h4>");
		$('.modal-body').append("<p>- 알림: 시설 현대화 작업 중 / 열차 정상 운행<br/>- 알림: 모바일 버전 증축 공사 중<br/><br/>- be sure you're full of NETWORK<br/>- Night Boat Service 18:00 - 5:59<br/>- Why don't you visit some BLUE islands?<br/><br/>- If you prefer to take a train, please use CHROME, OPERA or SAFARI</p>");
		$('.modal-footer').append("<p>captain <a href='https://vimeo.com/freshfleshflash' target='_blank'>Kwon Daye</a></p>");
	} else {
		$('.modal-header').append("<h4>From&nbsp&nbsp&nbspFIREFOX</h4>");
		$('.modal-header').append("<h4>To&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspCHROME / IE / OPERA / SAFARI</h4>");
		$('.modal-body').append("<p>Firefox version is not ready yet.<br/><br/>Please use CHROME, IE, OPERA or SAFARI browser.</p>");
		$('.modal-footer').append("<p>captain <a href='https://vimeo.com/freshfleshflash' target='_blank'>Kwon Daye</a></p>");
	}

	initTweets();
	autoScroll();

	$(window).scroll(function() {
		getThumbInfo();
	
		if(browserType == "webkit") {
			$('#chimney').removeClass('hide');
			$('#chimney').addClass('show');
		} else if(browserType == "ms") {
			$('#mast').removeClass('hide');
			$('#mast').addClass('show');
			$('.sail').removeClass('hide');
			$('.sail').addClass('show');
		}

		chimneyWidth = thumbWidth * 0.05;
		chimneyHeight = chimneyWidth * 1.5;
		mastWidth = thumbWidth * 0.03;
		sailWidth = thumbWidth * 0.35;

		$('#mast').css('width', mastWidth);
		$('#mast').css('left', thumbLeft + thumbWidth/2 - mastWidth/2);

		$('.sail').css('top', $('#mast').offset().top);
		$('#leftSail').css('border-left', sailWidth + "px solid transparent");
		$('#leftSail').css('left', thumbLeft + thumbWidth/2 - sailWidth - mastWidth*1.5);

		$('#rightSail').css('border-right', sailWidth + "px solid transparent");
		$('#rightSail').css('left', thumbLeft + thumbWidth/2 + mastWidth*1.5);

		$('#chimney').css('width', chimneyWidth);
		$('#chimney').css('height', chimneyHeight);
		$('#chimney').css('left', thumbLeft + thumbWidth - chimneyWidth - 5);

		$('#smokeCanvas').css('left', thumbLeft + thumbWidth - canvas.width);
		smokeR = chimneyWidth * 0.2;
		smokeX = canvas.width - chimneyWidth;
		smokeY = canvas.height - chimneyHeight - smokeR;

		if($(document).scrollLeft()+ $(window).width() >= $(document).width()) {
			if(!loading) {
				loadTweets();
				startSpinner();
				bgSound.pause();
			}
		}
	});
});

function autoScroll() {	
	setInterval(function() {
		var preScroll = $(document).scrollLeft();
		$(document).scrollLeft(preScroll + trainSpeed);
	}, 10);
}

function dayOrNight() {
	var isNight = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour) ? true : false;	

	if(isNight) {
		$('body').addClass('night');
		$('#chimney').addClass('night');
		smokeColor = 'white';

		$('body').css('background-color', 'black');
		$('body').css('color', 'white');
		$('.modal-content').css('background-color', 'white');
		$('.modal-content').css('color', 'black');	
	} else {
		smokeColor: 'black';
		$('body').css('background-color', 'white');
		$('body').css('color', 'black');	
		$('.modal-content').css('background-color', 'white');
		$('.modal-content').css('color', 'black');	
	}
}

function detectBrowser() {
	var info = navigator.userAgent.toLowerCase();

	if(info.indexOf("chrome") >= 0 || info.indexOf("safari") >= 0) browserType = "webkit";
	else if(info.indexOf("trident") >= 0) browserType = "ms";
	else browserType = "others";

	console.log(info + "\n" + browserType);
}

function displayTweets(tweets, first) {
	console.log(tweets.length);

	var lines = [];
	for(var i = 0; i < maxQueryCount; i++) {
		lines[i] = gap + i * gap * 2;
	}

	var startingTime = new Date(parseDate(tweets[0].created_at)).getTime();
	var startingLeft = (first) ? 100 : $(document).width() + 100;

	for(var i = 0; i < tweets.length; i++) {		
		var id = tweets[i].id_str;

		var user = tweets[i].user.screen_name;
		user = '<a href = "http://twitter.com/' + user + '"target="_blank" onclick="stopTrain()">' + user + '</a>';
		
		var text = tweets[i].text;
		text = text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi, '<a href="$1" target="_blank" onclick="stopTrain()">$1</a>');			
		text = text.replace(/#(\w+)/gi, '<a href="http://twitter.com/search?q=%23$1" target="_blank" onclick="stopTrain()">#$1</a>');				
		text = text.replace(/@(\w+)/gi, '<a href="http://twitter.com/$1" target="_blank" onclick="stopTrain()">@$1</a>');

		var time = new Date(parseDate(tweets[i].created_at));
		time = time.toString();
		time = time.split("(")[0];

		text = time+ " " + user + " " + text;

		var interval = new Date(parseDate(tweets[i].created_at)).getTime() - startingTime;
		var left = startingLeft + interval / 20;

		var lineId = Math.floor(Math.random() * lines.length);
		var top = lines[lineId];
		lines.splice(lineId, 1);

		var t = new Tweet(id, text, left, top);
	
		$('body').append(t.html());
	}

	if(!($(document).width() > $(window).width())) {
		console.log("append");
		$('body').append('<p class="blank" style="left:' + ($(window).width() * 1.1) + 'px">&nbsp</p>');
	}

	if(first) {
		first = false;
	} else {
		stopSpinner();
		bgSound.play();
	}

	loading = false;
}

function getThumbInfo() {
	var arrowWidth;

	if(browserType == "webkit") arrowWidth = 0;
	else if(browserType == "ms") arrowWidth = 30;
	else arrowWidth = 0;

	var scrollbarArea = $(window).width() - arrowWidth * 2;
	
	thumbLeft = math_map($(document).scrollLeft(), 0, $(document).width(), arrowWidth, $(window).width() - arrowWidth);
	thumbWidth = scrollbarArea * $(window).width() / $(document).width();
}

function initTweets() {
	callAPI(true);
}

function loadTweets() {
	loading = true;

	var currentTime = new Date().getTime();

	var delayTime = (currentTime < lastQueryTime + 5000) ? (lastQueryTime + 5000 - currentTime) : 0;

	setTimeout(function() {
		callAPI(false);
	}, delayTime);
}

var callCount = 0;
var tweets = [];

function callAPI(first) {
	console.log("callAPI " + callCount++);

	var sinceId = (first) ? 0 : tweets[tweets.length-1].id_str;

	twitterAPI('search/tweets', {q: keyword, count: maxQueryCount, since_id: sinceId}, function(result) {
		lastQueryTime = new Date().getTime();

		if(result.statuses.length == 0) {
			setTimeout(function() {
				callAPI(first);
			}, 5000);
		} else {
			tweets = result.statuses.reverse();
			displayTweets(tweets, first);
		}
	});
}

function math_map(value, input_min, input_max, output_min, output_max) {
	return output_min + (output_max - output_min) * (value - input_min) / (input_max - input_min);
}

function parseDate(strDate) {
 	var v = strDate.split(' ');
  	return Date.parse(v[1] + " " + v[2] + ", " + v[5] + " " + v[3] + " UTC");
} 

function resizeSpace() {
	gap = $(window).height() / (maxQueryCount * 2 + 1);
	fontSize = gap * 0.6;
    $('body').css('font-size', fontSize);
};

function stopTrain() {
	//trainSpeed = 0;
}

function timeFormat(time) {
	var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var hour = (time.getHours() < 12) ? time.getHours() : time.getHours() - 12;
	var minute = (time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes();
	var second = time.getSeconds();
	var ampm = (time.getHours() < 12) ? "AM" : "PM";

	var day = time.getDate();
	var month = monthArray[time.getMonth()];
	var year = time.getFullYear();

	return hour + ":" + minute + " " + ampm + " - " + day + " " + month + " " + year;
}

function Tweet(id, text, left, top) {
	this.id = id;
	this.text = text;
	this.top = top;
	this.left = left;
	this.html = function() {
		return '<div id="'+this.id+'" class="tweet" style="top:'+this.top+'px; left:'+this.left+'px">'+this.text+'</div>';
	};
}

var myTwitterConfig = {	
	baseUrl: 'https://api.twitter.com/1.1/',
	consumerKey: 'tiFWoSb7UgXZajgnrrpYg',
	consumerSecret: '0Dm49AxaHuzAItiJ2BC0FZuzvnlm5uldNjvTo9CfV8',
	accessToken: '2197815084-Zg2BiICtp2sxmPExOg0wAtbzEUQsog78vaDSINt',
	tokenSecret: 'cD7f2mpSLpbMme9oxPiZN631AW5Tfug7B6Ciad7Sz7eJy'
};

function twitterAPI(api, params, callback) {
	if(!api.match(/\.json$/)) api += '.json';

	// �뚮씪誘명꽣 湲곕낯�명똿
	params.oauth_cversion = '1.0';
	params.oauth_signature_method = 'HMAC-SHA1';
	params.oauth_consumer_key = myTwitterConfig.consumerKey; 
	params.oauth_token = myTwitterConfig.accessToken;

	// callback�� 吏곸젒 吏��뺥븯吏� �딄퀬 臾닿린紐� �⑥닔濡� 以� 寃쎌슦 �먮룞 �앹꽦�쒕떎.
	if (!params.callback && callback) { 
		params.callback = 'ssh'+(Math.random()+'').replace('0.','');
		window[params.callback] = callback;
	}

	var oauthMessage = {
		method: 'GET',
		action: myTwitterConfig.baseUrl + api,
		parameters: params
	};

	// Oauth �몄쬆愿���
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: myTwitterConfig.consumerSecret,
		tokenSecret: myTwitterConfig.tokenSecret
	});

	// Oauth �몄쬆�섏뿬 URL由ы꽩(json type)
	var jsonUrl = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);

	$.ajax({
		type: oauthMessage.method,
		url: jsonUrl,
		dataType: 'jsonp',
		jsonp: false,
		cache: true
	}).fail(function(xhr) {});
}

var optsColor = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour)? 'white' : 'black';

var opts = {
	lines: 20, // The number of lines to draw
	length: 40, // The length of each line
	width: 10, // The line thickness
	radius: 50, // The radius of the inner circle
	corners: 3, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	color: optsColor, 
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: '50%', // Top position relative to parent in px
	left: '50%', // Left position relative to parent in px
	position: 'fixed' // Element positioning
};

var spinner = new Spinner(opts);

function startSpinner() {
	spinner.spin($('body')[0]);
}

function stopSpinner() {
	spinner.stop();
}

function renderSmoke(canvas, context) {
	var smokeX = canvas.width - 15;
	var smokeY = canvas.height - 40;
	var alpha = 1;

	context.clearRect(0, 0, canvas.width, canvas.height);
	generateParticle(smokeX, smokeY);

	for(var i = 0; i < particles.length; i++) {
	 	if(particles[i].y < 100) {
	 		particles.splice(i, 1);
	 	} else {
			alpha = (particles[i].alpha > 0) ? particles[i].alpha : 0;	

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2 * Math.PI, false);
			context.fillStyle = smokeColor;
			context.fill();
			context.restore();

          	particles[i].animateParticle();
    	}
	 }

	requestAnimFrame(function() {
    	renderSmoke(canvas, context)
    });
}

function generateParticle(x, y) {
	if(new Date().getTime() > lastGeneratingTime + 500) {
		lastGeneratingTime = new Date().getTime();
		particles.push(new Particle(smokeX, smokeY));
	}
}

function Particle(x, y) {
	this.x = x; 
	this.y = y;
	this.toX = -3;
	this.toY = -2;
	this.radius = smokeR;
	this.alpha = 1;
}

Particle.prototype.animateParticle = function() {
	this.x += this.toX;
	this.y += this.toY;
	this.radius += 0.2;
	this.alpha -= 0.005;
}

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    	window.setTimeout(callback, 1000 / 60);
    };
})();