var size = (function () {
    var leading, fontSize;

    var resize = function () {
        leading = $(window).height() / (constVar.maxQueryCount * 2 + 3);
        fontSize = leading * 0.5;
        $('#bg').css('font-size', fontSize + "px");
    };

    resize();

    return {
        leading: leading,
        fontSize: fontSize
    };
})();