$(window).on('beforeunload', function () {
    $('#bg').scrollLeft(0);
});

$(document).ready(function () {
    if (browser.type == 'firefox' || browser.type == 'others') {
        return;
    }

    tweets.callAPI(true);
    smoke.render();
    tip.attach();
    sound.control();

    setInterval(function () {
        time.detect();
    }, 1000);

    $('#bg').scroll(function () {
        thumb.getValue();
        chimney.move();
        smoke.move();

        if (!titleFlag) {
            titleFlag = true;
            title.disappear();

            setTimeout(function () {
                tip.appear();
                tipFlag = true;
                wordFlag = true;
            }, 1000);

        } else {
            $('.tweet').css('visibility', 'visible');
        }

        if (wordFlag) {
            tip.control();
        }

        if ($('#bg').scrollLeft() + $(window).width() >= $('#bg')[0].scrollWidth) {
            if (!loading) {
                tweets.load();
                spinner.start();
            }
        }

        sound.addCount();
    });

    $(window).bind('mousewheel', function (e) {
        var preScroll = $('#bg').scrollLeft();
        $('#bg').scrollLeft(preScroll - e.originalEvent.wheelDeltaX);

        return false;
    });

    if (browser.type == 'webkit') {
        $(window).mousemove(function (e) {
            chimney.detectMouseOver(e);
        });

        $(window).mouseleave(function () {
            $('#chimney').removeClass('over');
        });
    }

    $(window).keypress(function (e) {
        if (e.which == 32) {
            if (tipFlag) {
                tipFlag = false;
                $('#tip').animate({opacity: 0}, 2000, function () {
                    wordFlag = false;
                    tip.disappear($(this));
                });
            }

            autoFlag = !autoFlag;

            if (autoFlag) {
                autoTrainInterval = setInterval(function () {
                    auto.move();
                }, 10);
            } else {
                clearInterval(autoTrainInterval);
            }
        }
    });
});