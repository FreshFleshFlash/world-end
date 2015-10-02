var trainSound = new Audio('asset/train.mp3');
trainSound.loop = true;

var os = "";
var browser = "";

var nightHour = 25;
var dayHour = 6;

var fontSize = 20;

var tweets = [];
var tweetCount = 0;

var thumbLeft = 0;
var thumbWidth = 0;

var testStr = "Fusce leo augue, lacinia non lectus vel, bibendum ultricies enim. Nullam elementum urna sed ligula molestie auctor. Curabitur quis elit leo. Maecenas pretium condimentum leo ac dictum. Ut ultricies, arcu vitae egestas scelerisque, tellus sem faucibus metus, ac ultrices diam magna auctor mauris. Mauris ut turpis aliquam tortor pellentesque semper. Vestibulum tincidunt magna at ex ornare fermentum. Mauris a ultrices ligula. Fusce vitae erat sem. Suspendisse nec semper tellus. Pellentesque finibus, nulla vitae pharetra pharetra, nibh ligula blandit ex, quis tincidunt est magna quis eros. Suspendisse eget erat eu nulla ornare efficitur fringilla eu lectus.";

$(document).ready(function() {
	$('body').css('font-size', fontSize);

	detectBrowser();
	
	autoScroll();

	$(window).scroll(function() {
		getThumbInfo();
		animateSmoke();

		if($(document).scrollLeft()+ $(window).width() >= $(document).width()) {
			$('body').append(testStr);
		}
	});

	if(new Date().getHours() >= nightHour || new Date().getHours() < dayHour) nightTrain();
});

function autoScroll() {
	$(document).scrollLeft(0);
	setInterval(function() {
		var preScroll = $(document).scrollLeft();
		$(document).scrollLeft(preScroll + 2);
	}, 10);
}

function animateSmoke() {
	$('#chimney').css('left', thumbLeft + thumbWidth - 12);
	$('#smokeCanvas').css('left', thumbLeft + thumbWidth - $('#smokeCanvas').width());

	var canvas = document.getElementById('smokeCanvas');
    var context = canvas.getContext('2d');
}

function detectBrowser() {
	var info = navigator.userAgent.toLowerCase();

	if(info.indexOf("macintosh") >= 0) {
		os = "MACINTOSH";

		if(info.indexOf("chrome") >= 0) browser = "CHROME"
		else if(info.indexOf("safari") >= 0) browser = "SAFARI";
		else if(info.indexOf("firefox") >= 0) browser = "FIREFOX";
	} 

	console.log(info + "\n" + os + "\n" + browser);
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

var twitterConfig = {	//==>왜 안 되지??
	baseUrl: 'https://api.twitter.com/1.1/',
	consumerKey: 'SEWOpNtRl8aI6ICNqv8Cg',
	consumerSecret: 'LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo',
	accessToken: '632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb',
	tokenSecret: 'dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H'
};

function twitter(api, params, callback) {
	if(!api.match(/\.json$/)) api += '.json';

	// 파라미터 기본세팅
	params.oauth_cversion = '1.0';
	params.oauth_signature_method = 'HMAC-SHA1';
	params.oauth_consumer_key = 'SEWOpNtRl8aI6ICNqv8Cg'; //twitterConfig.consumerKey; 
	params.oauth_token = '632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb'; //twitterConfig.accessToken;

	// callback을 직접 지정하지 않고 무기명 함수로 줄 경우 자동 생성한다.
	if (!params.callback && callback) { 
		params.callback = 'ssh'+(Math.random()+'').replace('0.','');
		window[params.callback] = callback;
	}

	var oauthMessage = {
		method: 'GET',
		action: 'https://api.twitter.com/1.1/' + api,//twitterConfig.baseUrl+api,
		parameters: params
	};

	// Oauth 인증관련
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: 'LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo',//twitterConfig.consumerSecret,
		tokenSecret: 'dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H'//twitterConfig.tokenSecret
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

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
  		window.setTimeout(callback, 1000 / 60);
	};
})();
















