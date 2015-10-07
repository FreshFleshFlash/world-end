var trainSound = new Audio('asset/train.mp3');
trainSound.loop = true;

var os = "";
var browser = "";

var nightHour = 20;
var dayHour = -6;

var fontSize = 20;
var gap = fontSize;

var thumbLeft = 0;
var thumbWidth = 0;

var twitterConfig = {	
	baseUrl: 'https://api.twitter.com/1.1/',
	consumerKey: 'SEWOpNtRl8aI6ICNqv8Cg',
	consumerSecret: 'LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo',
	accessToken: '632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb',
	tokenSecret: 'dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H'
};

var twitterConfig2 = {	
	baseUrl: 'https://api.twitter.com/1.1/',
	consumerKey: 'tiFWoSb7UgXZajgnrrpYg',
	consumerSecret: '0Dm49AxaHuzAItiJ2BC0FZuzvnlm5uldNjvTo9CfV8',
	accessToken: '2197815084-Zg2BiICtp2sxmPExOg0wAtbzEUQsog78vaDSINt',
	tokenSecret: 'cD7f2mpSLpbMme9oxPiZN631AW5Tfug7B6Ciad7Sz7eJy'
};

var canvas, context;

$(window).on('beforeunload', function(){
	$(document).scrollLeft(0);
});

$(document).ready(function() {
	canvas = document.getElementById('smokeCanvas');
	context = canvas.getContext('2d');

	detectBrowser();
	autoScroll();

	loadTweets(100, true);

	$(window).scroll(function() {
		$('#chimney').removeClass('hide');
		$('#chimney').addClass('show');
		
		getThumbInfo();

		$('#chimney').css('left', thumbLeft + thumbWidth - 12);
		$('#smokeCanvas').css('left', thumbLeft + thumbWidth - $('#smokeCanvas').width());

		if($(document).scrollLeft()+ $(window).width() >= $(document).width()) {
			loadTweets($(document).width() + 100, false);
		}
	});

	if(new Date().getHours() >= nightHour || new Date().getHours() < dayHour) nightTrain();
});

function autoScroll() {	
	setInterval(function() {
		var preScroll = $(document).scrollLeft();
		$(document).scrollLeft(preScroll + 2);
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
	var arrowWidth = 0;
	var scrollbarArea = $(window).width() - arrowWidth * 2;
	
	thumbLeft = math_map($(document).scrollLeft(), 0, $(document).width(), 0, $(window).width());
	thumbWidth = scrollbarArea * $(window).width() / $(document).width();
}

function math_map(value, input_min, input_max, output_min, output_max) {
	return output_min + (output_max - output_min) * (value - input_min) / (input_max - input_min);
}

function nightTrain() {
	$('body').css('background-color', 'black');
	$('body').css('color', 'white');
}	

function Tweet(id, text, left, top) {
	this.id = id;
	this.text = text;
	this.top = top;
	this.left = left;
	this.html = function() {
		return '<div id="'+this.id+'" class="tweet" style="top:'+this.top+'px; left:'+this.left+'px; font-size:'+fontSize+'pt">'+this.text+'</div>';
	};
}

var tweets = [];
var data = [];
var gotNext = true;

var count = 0;

function displayTweets(data, startingLeft) {
	var lines = [];
	for(var i = 0; i < 5; i++) {
		lines[i] = gap + i * 140;
	}

	var startingTime = new Date(data[0].created_at).getTime();

	for(var i = 0; i < data.length; i++) {		
		var id = data[i].id_str;

		var user = data[i].user.screen_name;
		user = '<a href = "http://twitter.com/' + user + '">' + user + '</a>';
		
		var text = data[i].text;
		text = text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi, '<a href="$1">$1</a>');			
		text = text.replace(/#(\w+)/gi, '<a href="http://twitter.com/search?q=%23$1">#$1</a>');				
		text = text.replace(/@(\w+)/gi, '<a href="http://twitter.com/$1">@$1</a>');

		var time = new Date(data[i].created_at);
		time = timeFormat(time);

		text = time+ " " + user + " " + text;

		var interval = new Date(data[i].created_at).getTime() - startingTime;
		var left = startingLeft + interval / 10;

		var lineId = Math.floor(Math.random() * lines.length);
		var top = lines[lineId];
		lines.splice(lineId, 1);

		var t = new Tweet(id, text, left, top);
	
		$('body').append(t.html());
	}
}

function loadTweets(startingLeft, first) {		
	twitterAPI('search/tweets', {q: 'world end', count: 5}, function(result) {
		if(!first) {
			if(result.statuses[0].id_str <= data[4].id_str) {
				console.log("hmm " + count++);
				gotNext = false;
				loadTweets(startingLeft, false);				
			} else gotNext = true;
		} 

		if(gotNext) {
			data = result.statuses.reverse();
			displayTweets(data, startingLeft);
		}
	});
}

function timeFormat(time) {
	var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var hour = (time.getHours() < 12) ? time.getHours() : time.getHours() - 12;
	var minute = time.getMinutes();
	var second = time.getSeconds();
	var ampm = (time.getHours() < 12) ? "AM" : "PM";

	var day = time.getDate();
	var month = monthArray[time.getMonth()];
	var year = time.getFullYear();

	return hour + ":" + minute + " " + ampm + " - " + day + " " + month + " " + year;
}

function twitterAPI(api, params, callback) {
	if(!api.match(/\.json$/)) api += '.json';

	// 파라미터 기본세팅
	params.oauth_cversion = '1.0';
	params.oauth_signature_method = 'HMAC-SHA1';
	params.oauth_consumer_key = twitterConfig2.consumerKey; 
	params.oauth_token = twitterConfig2.accessToken;

	// callback을 직접 지정하지 않고 무기명 함수로 줄 경우 자동 생성한다.
	if (!params.callback && callback) { 
		params.callback = 'ssh'+(Math.random()+'').replace('0.','');
		window[params.callback] = callback;
	}

	var oauthMessage = {
		method: 'GET',
		action: twitterConfig2.baseUrl + api,
		parameters: params
	};

	// Oauth 인증관련
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: twitterConfig2.consumerSecret,
		tokenSecret: twitterConfig2.tokenSecret
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