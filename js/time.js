var time = (function () {
    var dayHour = 0;
    var nightHour = 18;
    var isNight, preIsNight;

    var detect = function () {
        isNight = (new Date().getHours() >= nightHour || new Date().getHours() < dayHour) ? true : false;

        if (isNight == preIsNight) {
            return {
                isNight: isNight
            };
        } else {
            preIsNight = isNight;
            colorSky();
            return {
                isNight: isNight
            };
        }
    };

    var colorSky = function () {
        if (isNight) {
            $('#bg').addClass('night');
            $('#chimney').addClass('night');

            smokeColor = 'white';
            $('#bg').css('background-color', 'black').css('color', 'white');
        } else {
            smokeColor = 'black';
            $('#bg').css('background-color', 'white').css('color', 'black');
        }
    };

    detect();

    return {
        detect: detect
    };
})();