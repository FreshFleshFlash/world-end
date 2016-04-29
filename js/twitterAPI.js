var twitterAPI = (function () {
    var config = {
        baseUrl: 'https://api.twitter.com/1.1/',
        consumerKey: 'tiFWoSb7UgXZajgnrrpYg',
        consumerSecret: '0Dm49AxaHuzAItiJ2BC0FZuzvnlm5uldNjvTo9CfV8',
        accessToken: '2197815084-Zg2BiICtp2sxmPExOg0wAtbzEUQsog78vaDSINt',
        tokenSecret: 'cD7f2mpSLpbMme9oxPiZN631AW5Tfug7B6Ciad7Sz7eJy'
    };

    var use = function (api, params, callback) {
        if (!api.match(/\.json$/)) api += '.json';

        params.oauth_cversion = '1.0';
        params.oauth_signature_method = 'HMAC-SHA1';
        params.oauth_consumer_key = config.consumerKey;
        params.oauth_token = config.accessToken;

        if (!params.callback && callback) {
            params.callback = 'ssh' + (Math.random() + '').replace('0.', '');
            window[params.callback] = callback;
        }

        var oauthMessage = {
            method: 'GET',
            action: config.baseUrl + api,
            parameters: params
        };

        OAuth.setTimestampAndNonce(oauthMessage);
        OAuth.SignatureMethod.sign(oauthMessage, {
            consumerSecret: config.consumerSecret,
            tokenSecret: config.tokenSecret
        });

        var jsonUrl = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);

        $.ajax({
            type: oauthMessage.method,
            url: jsonUrl,
            dataType: 'jsonp',
            jsonp: false,
            cache: true
        }).fail(function ($xhr) {
        });
    }

    return {
        use: use
    };
})();