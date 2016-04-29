var thumb = (function () {
    var arrowWidth = browser.arrowWidth;
    var scrollbarArea = $(window).width() - arrowWidth * 2;

    var getValue = function () {
        thumbLeft = math_map($('#bg').scrollLeft(), 0, $('#bg')[0].scrollWidth, arrowWidth, $(window).width() - arrowWidth);
        thumbWidth = scrollbarArea * $(window).width() / $('#bg')[0].scrollWidth;
    };

    var math_map = function (value, input_min, input_max, output_min, output_max) {
        return output_min + (output_max - output_min) * (value - input_min) / (input_max - input_min);
    };

    return {
        getValue: getValue
    };
})();