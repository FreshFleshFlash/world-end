/*14-06-09 Kwon Daye*/
/*last modified: 16-04-09*/
var browserType = "";
var gap;

var nightHour = 18;
var dayHour = 6;
var isNight;

var loading = false;

var maxQueryCount = 10;
var lastQueryTime;

var aFlag = false;
var autoTrainInterval;
var sCount = 0;

var canvas = $('#smokeCanvas')[0];
var context = canvas.getContext('2d');
canvas.width = $(window).width();
canvas.height = $(window).height() - 17;

var particles = [];
var lastGeneratingTime = new Date().getTime();
var smokeX, smokeY, smokeR, smokeColor;

var thumbLeft;
var thumbWidth;

var tFlag = false;
var tipFlag = false;
var wordFlag = false;

var wordGap = 0;

$(window).on('beforeunload', function () {
    $('#chimney').css('display', 'none');
    $('#bg').scrollLeft(0);
});

$(document).ready(function () {
    var bgSound = new Audio('data/loco.mp3');
    bgSound.volume = 1.0;
    bgSound.loop = true;

    thumbLeft = 0;
    thumbWidth = getThumbInfo()['thumbWidth'];

    dayOrNight();
    resizeSpace();
    detectBrowser();
    attachTip();
    callAPI(true);
    callAudio(bgSound);

    $('#bg').scroll(function () {
        if (!tFlag) {
            tFlag = true;

            $('#title').animate({opacity: 0}, 1000, function () {
                $(this).remove();
            });

            $('.tweet, #chimney, #smokeCanvas').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 2000);

            setTimeout(function () {
                $('span').filter(function (index) {
                    return !(parseInt($(this).css('left')) > thumbLeft + thumbWidth - wordGap || parseInt($(this).css('left')) + parseInt($(this).css('width')) < thumbLeft + wordGap);
                }).css('visibility', 'hidden');

                $('span').filter(function (index) {
                    return parseInt($(this).css('left')) > thumbLeft + thumbWidth - wordGap || parseInt($(this).css('left')) + parseInt($(this).css('width')) < thumbLeft + wordGap;
                }).css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 2000);

                tipFlag = true;
                wordFlag = true;
            }, 7000);
        } else {
            $('.tweet').css('visibility', 'visible');
        }

        thumbLeft = getThumbInfo()['thumbLeft'];
        thumbWidth = getThumbInfo()['thumbWidth'];

        controlChimney();
        sCount++;

        if ($('#bg').scrollLeft() + $(window).width() >= $('#bg')[0].scrollWidth) {
            if (!loading) {
                loadTweets();
                startSpinner();
            }
        }
    });

    $(window).bind('mousewheel', function (e) {
        var preScroll = $('#bg').scrollLeft();
        $('#bg').scrollLeft(preScroll - e.originalEvent.wheelDeltaX);

        return false;
    });

    $(window).keypress(function (e) {
        var code = e.which;
        if (code == 32) {
            if (tipFlag) {
                tipFlag = false;
                $('#tip').animate({opacity: 0}, 2000, function () {
                    wordFlag = false;
                    $(this).remove();
                });
            }

            aFlag = !aFlag;
            if (aFlag) {
                autoTrainInterval = setInterval(function () {
                    var autoTrainSpeed = $(window).width() / 753;
                    var preScroll = $('#bg').scrollLeft();
                    $('#bg').scrollLeft(preScroll + autoTrainSpeed);
                }, 10);
            } else {
                clearInterval(autoTrainInterval);
            }
        }
    });

    $(window).mousemove(function (e) {
        if ((e.clientY >= $(window).height() - 17) && (e.clientY <= $(window).height()) && (e.clientX >= thumbLeft) && (e.clientX <= thumbLeft + thumbWidth)) {
            $('#chimney').addClass('over');
        } else {
            $('#chimney').removeClass('over');
        }
    });

    $(window).mouseleave(function () {
        $('#chimney').removeClass('over');
    });
});

var preSCount = 0;

function callAudio(bgSound) {
    setInterval(function () {
        if (sCount != preSCount) {
            bgSound.play();
            preSCount = sCount;
        }
        else {
            bgSound.pause();
            bgSound.currentTime = 0;
        }
    }, 100);
}

function controlChimney() {
    var thumbLeft = getThumbInfo()['thumbLeft'];
    var thumbWidth = getThumbInfo()['thumbWidth'];

    var chimneyWidth = thumbWidth * 0.04;
    if (chimneyWidth > $(window).width() * 0.01) chimneyWidth = $(window).width() * 0.01;

    $('#chimney').css('left', thumbLeft + thumbWidth - 5 - chimneyWidth * 1.6).css('width', chimneyWidth);
    $('#smokeCanvas').css('left', thumbLeft + thumbWidth - canvas.width);
    smokeR = chimneyWidth * 0.2;
    smokeX = canvas.width - chimneyWidth * 1.6 - 5;
    smokeY = canvas.height - $('#chimney').height() - smokeR * 2.5;

    if (wordFlag) {
        $('span').filter(function (index) {
            return !(parseInt($(this).css('left')) > thumbLeft + thumbWidth - wordGap|| parseInt($(this).css('left')) + parseInt($(this).css('width')) < thumbLeft + wordGap);
        }).css('visibility', 'hidden');

        $('span').filter(function (index) {
            return parseInt($(this).css('left')) > thumbLeft + thumbWidth - wordGap || parseInt($(this).css('left')) + parseInt($(this).css('width')) < thumbLeft + wordGap;
        }).css('visibility', 'visible');
    }
}

function dayOrNight() {
    isNight = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour) ? true : false;
    var preIsNight = isNight;

    if (isNight) {
        $('#bg').addClass('night');
        $('#chimney').addClass('night');

        smokeColor = 'white';
        $('#bg').css('background-color', 'black').css('color', 'white');
    } else {
        smokeColor = 'black';
        $('#bg').css('background-color', 'white').css('color', 'black');
    }

    setInterval(function () {
        isNight = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour) ? true : false;

        if (preIsNight == isNight) return;

        preIsNight = isNight;

        if (isNight) {
            $('#bg').addClass('night');
            $('#chimney').addClass('night');

            smokeColor = 'white';
            $('#bg').css('background-color', 'black').css('color', 'white');
        } else {
            smokeColor = 'black';
            $('#bg').css('background-color', 'white').css('color', 'black');
        }
    }, 1000);
}

function detectBrowser() {
    var info = navigator.userAgent;

    if (/(chrome|safari|trident)/i.test(info)) {
        if (/(chrome|safari)/i.test(info)) {
            browserType = "webkit";
            wordGap = 5;
        }
        else if (/trident/i.test(info)) browserType = "ms";

        $('#chimney').css('display', 'block');
        renderSmoke();
    } else {
        browserType = "others";
    }

    //console.log(info + "\n" + browserType);
}

function displayTweets(tweets, first) {
    //console.log(tweets.length);

    var lines = [];
    for (var i = 0; i < maxQueryCount; i++) {
        lines[i] = gap * 2 + i * gap * 2;
    }

    var startingTime = new Date(parseDate(tweets[0].created_at)).getTime();
    var startingLeft = (first) ? 100 : $('#bg')[0].scrollWidth + 100;

    for (var i = 0; i < tweets.length; i++) {
        var id = tweets[i].id_str;

        var user = tweets[i].user.screen_name;
        user = '<a href = "http://twitter.com/' + user + '"target="_blank"><b>' + user + '</b></a>';

        var text = tweets[i].text;
        text = text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi, '<a href="$1" target="_blank"><b>$1</b></a>');
        text = text.replace(/#(\w+)/gi, '<a href="http://twitter.com/search?q=%23$1" target="_blank"><b>#$1</b></a>');
        text = text.replace(/@(\w+)/gi, '<a href="http://twitter.com/$1" target="_blank"><b>@$1</b></a>');

        if (text[text.length - 1] == "…") text = text.slice(0, text.length - 1);

        var time = new Date(parseDate(tweets[i].created_at));
        time = time.toString();
        time = time.split("(")[0];

        text = time + " " + user + " " + text;

        var interval = new Date(parseDate(tweets[i].created_at)).getTime() - startingTime;
        var left = startingLeft + interval / 20;

        var lineId = Math.floor(Math.random() * lines.length);
        var top = lines[lineId];
        lines.splice(lineId, 1);

        var t = new Tweet(id, text, left, top);

        $('#bg').append(t.html());
    }

    if (!($('#bg')[0].scrollWidth > $(window).width())) {
        //console.log("append blank");
        $('#bg').append('<p class="blank" style="left:' + ($(window).width() * 1.1) + 'px">&nbsp</p>');
    }

    if (first) {
        first = false;
    } else {
        stopSpinner();
    }

    controlChimney();

    loading = false;
}

function getThumbInfo() {
    var arrowWidth;

    if (browserType == "webkit") arrowWidth = 0;
    else if (browserType == "ms") {
        arrowWidth = 30;
        $('#bg').addClass("ie");
    }
    else arrowWidth = 0;

    var scrollbarArea = $(window).width() - arrowWidth * 2;

    var thumbInfo = {
        'thumbLeft': math_map($('#bg').scrollLeft(), 0, $('#bg')[0].scrollWidth, arrowWidth, $(window).width() - arrowWidth),
        'thumbWidth': scrollbarArea * $(window).width() / $('#bg')[0].scrollWidth
    };

    return thumbInfo;
}

var prePos = 0;
var trainSpeed;

function getTrainSpeed() {
    //var thumbLeft = getThumbInfo()['thumbLeft'];
    var currentPos = thumbLeft;
    trainSpeed = Math.abs(currentPos - prePos);
    if ($('#bg').scrollLeft() + $(window).width() >= $('#bg')[0].scrollWidth) trainSpeed = 1;
    prePos = currentPos;
}

function loadTweets() {
    loading = true;

    var currentTime = new Date().getTime();

    var delayTime = (currentTime < lastQueryTime + 5000) ? (lastQueryTime + 5000 - currentTime) : 0;

    setTimeout(function () {
        callAPI(false);
    }, delayTime);
}

var callCount = 0;
var tweets = [];
var tempTweets = [];

function callAPI(first) {
    //console.log("callAPI " + callCount++);

    var sinceId = (first) ? 0 : tweets[tweets.length - 1].id_str;

    twitterAPI('search/tweets', {q: 'world end', count: maxQueryCount, since_id: sinceId}, function (result) {
        lastQueryTime = new Date().getTime();

        tempTweets = result.statuses;

        var idx = 0;
        var userName = "";
        var text = "";
        var pureText = "";

        while (idx < tempTweets.length) {
            userName = tempTweets[idx].user.screen_name;
            text = tempTweets[idx].text;
            pureText = text.replace(/@(\w+)/gi, "");

            if (!((/world/i.test(pureText)) && (/world/i.test(pureText)))) {
                //console.log(userName + " " + text);
                tempTweets.splice(idx, 1);
            } else {
                idx++;
            }
        }

        if (tempTweets.length == 0) {
            setTimeout(function () {
                callAPI(first);
            }, 5000);
        } else {
            tweets = tempTweets.reverse();
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
    gap = $(window).height() / (maxQueryCount * 2 + 3);
    var fontSize = gap * 0.5;
    $('#bg').css('font-size', fontSize + "px");


    var title = '<div id="title">' +
        '\'Where is the end of the world?\'<br/><br/><br/>' +
        'A train bound for the end of endless world<br/><br/><br/>' +
        'Infinite Scroll + Real-time Tweets<br/><br/><br/><br/><br/>' +
        'Night Train Service 18:00 - 5:59<br/><br/><br/>' +
            //'For automatic operation, press Space Bar<br/><br/><br/>' +
        'Railway created by <a href="mailto:pharmacystic@gmail.com" target="_blank"><i><b>Kwon Daye</b></i></a>' +
        '</div>';

    $('#bg').append(title);

    var question = "This is the end?";
    var questionDivSize = question.length * fontSize * 0.8;
    $('#question').css('width', questionDivSize + "px")
        .css('height', questionDivSize + "px")
        .css('line-height', questionDivSize + "px")
        .css('margin-top', -questionDivSize * 0.5 + "px")
        .css('margin-left', -questionDivSize * 0.5 + "px");

    var spinnerSize = questionDivSize * 0.45;

    dayOpts = {
        lines: 20, // The number of lines to draw
        length: spinnerSize * 0.6,//40, // The length of each line
        width: 12, // The line thickness
        radius: spinnerSize,//50, // The radius of the inner circle
        corners: 3, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: 'black',
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

    nightOpts = {
        lines: 20, // The number of lines to draw
        length: spinnerSize * 0.6,//40, // The length of each line
        width: 12, // The line thickness
        radius: spinnerSize,//50, // The radius of the inner circle
        corners: 3, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: 'white',
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
}

function timeFormat(time) {
    var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var hour = (time.getHours() < 10) ? "0" + time.getHours() : time.getHours();
    var minute = time.getMinutes();
    minute = Number(minute);
    minute = (minute < 10) ? "0" + minute : minute;
    var second = (time.getSeconds() < 10) ? "0" + time.getSeconds() : time.getSeconds();

    var day = time.getDate();
    var month = monthArray[time.getMonth()];
    var year = time.getFullYear();

    return hour + ":" + minute + ":" + second + " - " + day + " " + month + " " + year;
}

function Tweet(id, text, left, top) {
    this.id = id;
    this.text = text;
    this.top = top;
    this.left = left;
    this.html = function () {
        return '<div id="' + this.id + '" class="tweet" style="top:' + this.top + 'px; left:' + this.left + 'px">' + this.text + '</div>';
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
    if (!api.match(/\.json$/)) api += '.json';

    // �좎럥��옙�덉쾵榮먮굛�� �リ옇�∽옙占쎌삕榮먮굝��
    params.oauth_cversion = '1.0';
    params.oauth_signature_method = 'HMAC-SHA1';
    params.oauth_consumer_key = myTwitterConfig.consumerKey;
    params.oauth_token = myTwitterConfig.accessToken;

    if (!params.callback && callback) {
        params.callback = 'ssh' + (Math.random() + '').replace('0.', '');
        window[params.callback] = callback;
    }

    var oauthMessage = {
        method: 'GET',
        action: myTwitterConfig.baseUrl + api,
        parameters: params
    };

    OAuth.setTimestampAndNonce(oauthMessage);
    OAuth.SignatureMethod.sign(oauthMessage, {
        consumerSecret: myTwitterConfig.consumerSecret,
        tokenSecret: myTwitterConfig.tokenSecret
    });

    var jsonUrl = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);

    $.ajax({
        type: oauthMessage.method,
        url: jsonUrl,
        dataType: 'jsonp',
        jsonp: false,
        cache: true
    }).fail(function (xhr) {
    });
}

var spinner;
var opts, dayOpts, nightOpts;
var spinnerInterval;

function startSpinner() {
    if (isNight) opts = nightOpts;
    else opts = dayOpts;

    spinner = new Spinner(opts);

    spinner.spin($('#bg')[0]);
    $('#question').css('display', 'block');

    var preIsNight = isNight;

    spinnerInterval = setInterval(function () {	// 밤 되면 스피너 색깔 바꾸기 위한 부분
        if (preIsNight != isNight) {
            preIsNight = isNight;
            spinner.stop();

            opts = (preIsNight) ? nightOpts : dayOpts;
            spinner = new Spinner(opts);
            spinner.spin($('body')[0]);
        }
    }, 100);
}

function stopSpinner() {
    clearInterval(spinnerInterval);
    spinner.stop();
    $('#question').css('display', 'none');
}

function renderSmoke() {
    var alpha = 1;

    context.clearRect(0, 0, canvas.width, canvas.height);
    generateParticle(smokeX, smokeY);

    for (var i = 0; i < particles.length; i++) {
        if (particles[i].y < 100) {
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

    requestAnimFrame(function () {
        renderSmoke()
    });
}

function generateParticle(x, y) {
    getTrainSpeed();
    if (new Date().getTime() > lastGeneratingTime + 200 / Math.sqrt(trainSpeed)) {
        lastGeneratingTime = new Date().getTime();
        particles.push(new Particle(smokeX, smokeY));
    }
}

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.toX = Math.random() * (-8) - 1;
    this.toY = -2.5;
    this.radius = smokeR;
    this.toRadius = Math.random() * 0.6 + 0.1;
    this.alpha = 1;
}

Particle.prototype.animateParticle = function () {
    this.x += this.toX;
    this.y += this.toY;
    this.radius += this.toRadius;
    this.alpha -= 0.005;
}

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function attachTip() {
    var tip = "A tip for you - to start and stop automatic operation, press space bar!";
    var widthSum = (browserType == "ms") ? 35 : $(window).width() * 0.005;
    var thisWidth = 0;

    for (var i in tip) {
        var html = '<span class="tip' + i + '" style="left: ' + widthSum + 'px;">' + tip[i] + '</span>';
        $('#tip').append(html);
        thisWidth = ($('.tip' + i).width() == 0) ? 2 : $('.tip' + i).width();
        widthSum += thisWidth;
    }
}