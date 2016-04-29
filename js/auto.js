var auto = (function () {
    var move = function () {
        var autoTrainSpeed = $(window).width() / 753;
        var preScroll = $('#bg').scrollLeft();
        $('#bg').scrollLeft(preScroll + autoTrainSpeed);
    };

    return {
        move: move
    };
})();