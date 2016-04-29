var chimney = (function () {
    var width;

    var getValue = function () {
        width = thumbWidth * 0.04;
        if (width > $(window).width() * 0.01) {
            width = $(window).width() * 0.01;
        }

        return {
            'width': width
        };
    };

    var move = function () {
        getValue();
        $('#chimney').css('left', thumbLeft + thumbWidth - 5 - width * 1.6).css('width', width);
    };

    var detectMouseOver = function (e) {
        if ((e.clientY >= $(window).height() - 17) && (e.clientY <= $(window).height()) && (e.clientX >= thumbLeft) && (e.clientX <= thumbLeft + thumbWidth)) {
            $('#chimney').addClass('over');
        } else {
            $('#chimney').removeClass('over');
        }
    };

    return {
        move: move,
        getValue: getValue,
        detectMouseOver: detectMouseOver
    };
})();