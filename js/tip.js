var tip = (function () {
    var attach = function () {
        var tip = 'A tip for you - to start and stop automatic operation, press space bar!';
        var widthSum = (browser.type == "ms") ? 35 : $(window).width() * 0.005;
        var thisWidth = 0;

        for (var i in tip) {
            var html = '<span class="tip' + i + '" style="left: ' + widthSum + 'px;">' + tip[i] + '</span>';
            $('#tip').append(html);
            thisWidth = ($('.tip' + i).width() == 0) ? 2 : $('.tip' + i).width();
            widthSum += thisWidth;
        }
    };

    var appear = function () {
        $('span').filter(function (index) {
            return isHidden($(this));
        }).css('visibility', 'hidden');

        $('span').filter(function (index) {
            return !isHidden($(this));
        }).css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 2000);
    };

    var disappear = function ($this) {
        $this.remove();
    };

    var control = function () {
        $('span').filter(function (index) {
            return isHidden($(this));
        }).css('visibility', 'hidden');

        $('span').filter(function (index) {
            return !isHidden($(this));
        }).css('visibility', 'visible');

    };

    var isHidden = function ($this) {
        return !(parseInt($this.css('left')) > thumbLeft + thumbWidth - browser.wordGap || parseInt($this.css('left')) + parseInt($this.css('width')) < thumbLeft + browser.wordGap);
    };

    return {
        attach: attach,
        appear: appear,
        disappear: disappear,
        control: control
    };
})();