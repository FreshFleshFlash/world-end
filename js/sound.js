var sound = (function () {
    var bg = $('#sound')[0];
    var count = 0;
    var preCount = 0;

    var play = function () {
        bg.play();
    };

    var pause = function () {
        bg.pause();
    };

    var addCount = function () {
        count++;
    };

    var control = function () {
        setInterval(function () {
            if (count != preCount) {
                play();
                preCount = count;
            } else {
                pause();
                bg.currentTime = 0;
            }
        }, 100);
    };

    return {
        play: play,
        pause: pause,
        addCount: addCount,
        control: control
    };
})();