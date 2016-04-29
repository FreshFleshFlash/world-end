var title = (function () {
    var disappear = function () {
        $('#title').animate({opacity: 0}, 1000, function () {
            $(this).remove();
        });

        $('.tweet, #chimney, #smokeCanvas').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 2000);
    };

    return {
        disappear: disappear
    };
})();