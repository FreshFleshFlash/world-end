var browser = (function () {
    var type = "";
    var wordGap = 0;
    var arrowWidth = 0;

    var detect = function () {
        var info = navigator.userAgent;

        if (/(chrome|safari)/i.test(info)) {
            type = 'webkit';
            wordGap = 5;
        } else if (/trident/i.test(info)) {
            type = 'ms';
            arrowWidth = 30;
            $('#bg').addClass("ie");
        } else if (/firefox/i.test(info)) {
            type = 'firefox';
            alert('Sorry. Firefox version is under repair.\nPlease use Chrome, Safari, or Opera browser.');
        } else {
            type = 'others';
            alert('Sorry. This browser version is under repair.\nPlease use Chrome, Safari, or Opera browser.');
        }
    };

    detect();

    return {
        type: type,
        arrowWidth: arrowWidth,
        wordGap: wordGap
    };
})();