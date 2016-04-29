var smoke = (function () {
    var canvas = $('#smokeCanvas')[0];
    var context = canvas.getContext('2d');
    canvas.width = $(window).width();
    canvas.height = $(window).height() - 17;

    var move = function () {
        $('#smokeCanvas').css('left', thumbLeft + thumbWidth - canvas.width);
    };

    var prePos = 0;

    var getTrainSpeed = function () {
        var currentPos = thumbLeft;
        var trainSpeed = Math.abs(currentPos - prePos);
        if ($('#bg').scrollLeft() + $(window).width() >= $('#bg')[0].scrollWidth) {
            trainSpeed = 1;
        }
        prePos = currentPos;

        return trainSpeed;
    };

    var particles = [];
    var lastGeneratingTime = new Date().getTime();

    var render = function () {
        var alpha = 1;

        context.clearRect(0, 0, canvas.width, canvas.height);

        var chimneyWidth = chimney.getValue().width;

        var r = chimneyWidth * 0.2;
        var x = canvas.width - chimneyWidth * 1.6 - 5;
        var y = canvas.height - $('#chimney').height() - r * 2.5;

        generateParticle(x, y, r);

        for (var i = 0; i < particles.length; i++) {
            if (particles[i].y < 100) {
                particles.splice(i, 1);
            } else {
                alpha = (particles[i].alpha > 0) ? particles[i].alpha : 0;

                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2 * Math.PI, false);
                context.fillStyle = smokeColor;
                context.fill();
                context.restore();

                particles[i].animateParticle();
            }
        }

        requestAnimFrame(function () {
            render();
        });
    }

    var generateParticle = function (x, y, r) {
        if (new Date().getTime() > lastGeneratingTime + 200 / Math.sqrt(getTrainSpeed())) {
            lastGeneratingTime = new Date().getTime();
            particles.push(new Particle(x, y, r));
        }
    }

    function Particle(x, y, r) {
        this.x = x;
        this.y = y;
        this.toX = Math.random() * (-8) - 1;
        this.toY = -2.5;
        this.radius = r;
        this.toRadius = Math.random() * 0.6 + 0.1;
        this.alpha = 1;
    }

    Particle.prototype.animateParticle = function () {
        this.x += this.toX;
        this.y += this.toY;
        this.radius += this.toRadius;
        this.alpha -= 0.005;
    }

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    return {
        move: move,
        render: render
    };
})();