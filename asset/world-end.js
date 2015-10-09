var trainSound = new Audio('asset/train.mp3');
trainSound.loop = true;
trainSound.volume = 0;

var canvas, context;

var trainSpeed = 1;

var os = "";
var browser = "";

var nightHour = 24;
var dayHour = -6;

var fontSize;
var gap;

var thumbLeft = 0;
var thumbWidth = 0;

var loading = false;

var maxQueryCount = 10;

var lastQueryTime;
var keyword = 'world end';
var koreanKeyword = encodeURI("세상");

$(window).on('beforeunload', function(){
	$(document).scrollLeft(0);
});

$(document).ready(function() {
	//$('#remocon').modal();

	console.log($(window).height());

	dayOrNight();
	detectBrowser();
	resizeSpace();

	canvas = document.getElementById('smokeCanvas');
	context = canvas.getContext('2d');
	
	//render();

	initTweets();
	autoScroll();
	trainSound.play();

	$(window).scroll(function() {
		getThumbInfo();

		$('#chimney').removeClass('hide');
		$('#chimney').addClass('show');

		$('#chimney').css('left', thumbLeft + thumbWidth);
		$('#smokeCanvas').css('left', thumbLeft + thumbWidth - $('#smokeCanvas').width());
		
		if($(document).scrollLeft()+ $(window).width() >= $(document).width()) {
			if(!loading) {
				loadTweets();
				startSpinner();
				trainSound.pause();
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

function detectBrowser() {
	var info = navigator.userAgent.toLowerCase();

	if(info.indexOf("macintosh") >= 0) {
		os = "MACINTOSH";

		if(info.indexOf("chrome") >= 0) browser = "CHROME"
		else if(info.indexOf("safari") >= 0) browser = "SAFARI";
		else if(info.indexOf("firefox") >= 0) browser = "FIREFOX";
	} 

	//console.log(info + "\n" + os + "\n" + browser);
}

function getThumbInfo() {
	var arrowWidth = 10;
	var scrollbarArea = $(window).width() - arrowWidth * 2;
	
	thumbLeft = math_map($(document).scrollLeft(), 0, $(document).width(), 0, $(window).width());
	thumbWidth = scrollbarArea * $(window).width() / $(document).width();
}

function math_map(value, input_min, input_max, output_min, output_max) {
	return output_min + (output_max - output_min) * (value - input_min) / (input_max - input_min);
}

function dayOrNight() {
	var isNight = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour) ? true : false;	

	if(isNight) {
		$('body').css('background-color', 'black');
		$('body').css('color', 'white');		
	} else {
		$('body').css('background-color', 'white');
		$('body').css('color', 'black');		
	}
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

function displayTweets(tweets, first) {
	console.log(tweets.length);

	var lines = [];
	for(var i = 0; i < maxQueryCount; i++) {
		lines[i] = gap + i * gap*2;
	}

	var startingTime = new Date(parseDate(tweets[0].created_at)).getTime();
	var startingLeft = (first) ? 100 : $(document).width() + 100;

	for(var i = 0; i < tweets.length; i++) {		
		var id = tweets[i].id_str;

		var user = tweets[i].user.screen_name;
		user = '<a href = "http://twitter.com/' + user + '" target="_blank">' + user + '</a>';
		
		var text = tweets[i].text;
		text = text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi, '<a href="$1" target="_blank">$1</a>');			
		text = text.replace(/#(\w+)/gi, '<a href="http://twitter.com/search?q=%23$1" target="_blank">#$1</a>');				
		text = text.replace(/@(\w+)/gi, '<a href="http://twitter.com/$1" target="_blank">@$1</a>');

		var time = new Date(parseDate(tweets[i].created_at));
		time = time.toString();
		time = time.split("(")[0];

		text = time+ " " + user + " " + text;

		var interval = new Date(parseDate(tweets[i].created_at)).getTime() - startingTime;
		var left = startingLeft + interval / 10;
		// var left = 100;

		var lineId = Math.floor(Math.random() * lines.length);
		var top = lines[lineId];
		lines.splice(lineId, 1);

		var t = new Tweet(id, text, left, top);
	
		$('body').append(t.html());
	}

	if(!($(document).width() > $(window).width())) {
		console.log("append");
		$('body').append('<p style="left:' + ($(window).width() * 1.1) + 'px">&nbsp</p>');
	}

	if(first) {
		first = false;
	} else {
		stopSpinner();
		trainSound.play();
	}

	loading = false;
}

function parseDate(strDate) {
 	var v = strDate.split(' ');
  	return Date.parse(v[1] + " " + v[2] + ", " + v[5] + " " + v[3] + " UTC");
} 

function resizeSpace() {
	gap = $(window).height() / (maxQueryCount * 2 + 1);
	fontSize = gap * 0.8;
    $('body').css('font-size', fontSize);
};

function timeFormat(time) {
	var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var hour = (time.getHours() < 12) ? time.getHours() : time.getHours() - 12;
	var minute = (time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes();
	var second = time.getSeconds();
	var ampm = (time.getHours() < 12) ? "AM" : "PM";

	var day = time.getDate();
	var month = time.getMonth() + 1;// = monthArray[time.getMonth()];
	var year = time.getFullYear();

	//return hour + ":" + minute + " " + ampm + " - " + day + " " + month + " " + year;

	return year + "/" + month + "/" + day;
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

	// 파라미터 기본세팅
	params.oauth_cversion = '1.0';
	params.oauth_signature_method = 'HMAC-SHA1';
	params.oauth_consumer_key = myTwitterConfig.consumerKey; 
	params.oauth_token = myTwitterConfig.accessToken;

	// callback을 직접 지정하지 않고 무기명 함수로 줄 경우 자동 생성한다.
	if (!params.callback && callback) { 
		params.callback = 'ssh'+(Math.random()+'').replace('0.','');
		window[params.callback] = callback;
	}

	var oauthMessage = {
		method: 'GET',
		action: myTwitterConfig.baseUrl + api,
		parameters: params
	};

	// Oauth 인증관련
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: myTwitterConfig.consumerSecret,
		tokenSecret: myTwitterConfig.tokenSecret
	});

	// Oauth 인증하여 URL리턴(json type)
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

