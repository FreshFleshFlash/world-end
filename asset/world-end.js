var doc_width = $(window).width();
var doc_height = $(window).height();
var tweets = [];
	
loadTweets();

// $(window).scroll(function() {
// 	if($(window).scrollLeft() + $(window).width() == $(document).width()) {

// 	}
// });
 
function loadTweets(q, callback) {

	twitter("search/tweets", {q: q||"end world", count: 50}, function(result){		

		var data = result.statuses;

		var top = 0;
		
		for (var i = data.length - 1; i >= 0; i--) {	
		
			var id_str = data[i].id_str;
			var text = data[i].user.screen_name + " " + data[i].text;
			
			var t = new Tweet(id_str, top, text);
			tweets.push(t);	
				
			console.log(t); 
			$("body").append(t.html());

			top += 20;
		}
	});
}

function Tweet(id, top, text) {
	this.id = id;
	this.top = top;
	this.text = text;
	
	this.html = function() {
		var source = $("#div-template").html();
		var template = Handlebars.compile(source);
		var context = {div_id: this.id, div_top: this.top, div_text: this.text};
		var html = template(context);
		return html;
	}
}

// twitter api 활용하기
var twitterConfig = {	//==>왜 안되지??
	baseUrl: "https://api.twitter.com/1.1/",
	consumerKey: "SEWOpNtRl8aI6ICNqv8Cg",
	consumerSecret: "LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo",
	accessToken: "632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb",
	tokenSecret: "dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H"
};

function twitter(api, params, callback) {
	
	if (!api.match(/\.json$/)) api += ".json";

	// 파라미터 기본세팅
	params.oauth_version = "1.0";
	params.oauth_signature_method = "HMAC-SHA1";
	params.oauth_consumer_key = "SEWOpNtRl8aI6ICNqv8Cg";//twitterConfig.consumerKey; 
	params.oauth_token = "632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb";//twitterConfig.accessToken;
	
	if (!params.callback && callback) { // callback을 직접 지정하지 않고 무기명 함수로 줄 경우 자동 생성한다.
		params.callback = "ssh"+(Math.random()+"").replace("0.","");
		window[params.callback] = callback;
	}
	
	var oauthMessage = {
		method: "GET",
		action: "https://api.twitter.com/1.1/" + api,//twitterConfig.baseUrl+api,
		parameters: params
	};

	// Oauth 인증관련
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: "LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo",//twitterConfig.consumerSecret,
		tokenSecret: "dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H"//twitterConfig.tokenSecret
	});

	// Oauth 인증하여 URL리턴(json type)
	var jsonUrl = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);
	$.ajax({
		type: oauthMessage.method,
		url: jsonUrl,
		dataType: "jsonp",
		jsonp: false,
		cache: true
	}).fail(function(xhr){});
}