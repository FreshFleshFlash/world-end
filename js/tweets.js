var tweets = (function () {
    var callCount = 0;
    var lastQueryTime;
    var tweets = [];
    var tempTweets = [];
    var maxQueryCount = constVar.maxQueryCount;

    var load = function () {
        loading = true;

        var currentTime = new Date().getTime();
        var delayTime = (currentTime < lastQueryTime + 5000) ? (lastQueryTime + 5000 - currentTime) : 0;

        setTimeout(function () {
            callAPI(false);
        }, delayTime);
    };

    var callAPI = function (first) {
        var sinceId = (first) ? 0 : tweets[tweets.length - 1].id_str;

        twitterAPI.use('search/tweets', {
            q: 'world end',
            count: maxQueryCount,
            since_id: sinceId
        }, function (result) {
            lastQueryTime = new Date().getTime();

            tempTweets = result.statuses;

            var id = 0;
            var user = "";
            var pureText = "";

            while (id < tempTweets.length) {
                user = tempTweets[id].user.screen_name;
                pureText = tempTweets[id].text.replace(/@(\w+)/gi, "");

                if (!((/world/i.test(pureText)) && (/end/i.test(pureText)))) {
                    tempTweets.splice(id, 1);
                } else {
                    id++;
                }
            }

            if (tempTweets.length == 0) {
                setTimeout(function () {
                    callAPI(first);
                }, 5000);
            } else {
                tweets = tempTweets.reverse();
                display(tweets, first);
            }
        });
    };

    var display = function (tweets, first) {
        var lines = [];
        for (var i = 0; i < maxQueryCount; i++) {
            lines[i] = size.leading * 2 + i * size.leading * 2;
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

            if (text[text.length - 1] == "…") {
                text = text.slice(0, text.length - 1);
            }

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
            $('#bg').append('<p class="blank" style="left:' + ($(window).width() * 1.1) + 'px">&nbsp</p>');
        }

        if (first) {
            first = false;
        } else {
            spinner.stop();
        }

        thumb.getValue();
        chimney.move();
        smoke.move();

        loading = false;
    };

    function Tweet(id, text, left, top) {
        this.id = id;
        this.text = text;
        this.top = top;
        this.left = left;
        this.html = function () {
            return '<div id="' + this.id + '" class="tweet" style="top:' + this.top + 'px; left:' + this.left + 'px">' + this.text + '</div>';
        };
    }

    var parseDate = function (strDate) {
        var v = strDate.split(' ');
        return Date.parse(v[1] + " " + v[2] + ", " + v[5] + " " + v[3] + " UTC");
    }

    return {
        load: load,
        callAPI: callAPI
    };
})();