var viewer = document.querySelector("canvas"),
    painter = viewer.getContext("2d"),
    linkingdom = {
        start: function() {
            var movement = this.viewer.position.movement;
            viewer.addEventListener("mousewheel", function(event) {
                console.log(event);
            });
            viewer.addEventListener("touchstart", function(event) {
                var touch_point = event.touches[0];
                movement.start(touch_point.clientX, touch_point.clientY);
            });
            viewer.addEventListener("touchmove", function(event) {
                var touch_point = event.touches[0];
                movement.move(touch_point.clientX, touch_point.clientY);
            });
            viewer.addEventListener("touchend", function() { movement.end(); });
            viewer.addEventListener("touchcancel", function() { movement.end(); });
            viewer.addEventListener("mousedown", function(event) {
                if (event.which != 1) return;
                var mouse_point = event;
                movement.start(mouse_point.clientX, mouse_point.clientY);
            });
            viewer.addEventListener("mousemove", function(event) {
                var mouse_point = event;
                movement.move(mouse_point.clientX, mouse_point.clientY);
            });
            viewer.addEventListener("mouseup", function() { movement.end(); });
            viewer.addEventListener("mouseleave", function() { movement.end(); });
            this.viewer.resize();
        },
        viewer: {
            positionTo: function(x, y) { this.updateScreen({ X: x, Y: y }); },
            position: {
                X: 0,
                Y: 0,
                movement: {
                    position: {
                        X: 0,
                        Y: 0,
                        start: { X: 0, Y: 0 }
                    },
                    started: false,
                    moving: false,
                    start: function(x, y) {
                        console.log(
                            "start from(" + x + "," + y + ")/(" +
                            ((x / 60) | 0) + "," + ((y / 60) | 0) +
                            ")"
                        );
                        this.position.start.X = x;
                        this.position.start.Y = y;
                        this.started = true;
                        this.moving = false;
                    },
                    move: function(x, y) {
                        if (!this.started) return;
                        console.log(
                            "move to(" + x + "," + y + ")/(" +
                            ((x / 60) | 0) + "," + ((y / 60) | 0) +
                            ")"
                        );
                        var now_position = linkingdom.viewer.position;
                        viewer.style.cursor = "move";
                        this.position.X = x;
                        this.position.Y = y;
                        linkingdom.viewer.positionTo(
                            now_position.X + this.position.start.X - x,
                            now_position.Y + this.position.start.Y - y
                        );
                        this.moving = true;
                    },
                    end: function() {
                        if (this.started && !this.moving) {
                            this.started = false;
                            return console.log("end");
                        }
                        console.log("end");
                        this.started = false;
                        this.moving = false;
                        var now_position = linkingdom.viewer.position;
                        viewer.style.cursor = "";
                        now_position.X = now_position.X + this.position.start.X - this.position.X;
                        now_position.Y = now_position.Y + this.position.start.Y - this.position.Y;
                    }
                }
            },
            resize: function() {
                viewer.width = document.body.clientWidth;
                viewer.height = document.body.clientHeight;
                this.updateScreen();
            },
            updateScreen: function(position) {
                painter.clearRect(0, 0, viewer.width, viewer.height);
                linkingdom.painter.draw.grid(position);
            }
        },
        painter: {
            draw: {
                grid: function(position) {
                    if (!position) position = linkingdom.viewer.position;
                    var pX = -position.X % 60,
                        pY = -position.Y % 60,
                        column = Math.ceil(viewer.width / 60),
                        row = Math.ceil(viewer.height / 60);
                    for (var x = 0; x < column; x++) {
                        painter.beginPath();
                        painter.moveTo(x * 60 + pX, 0);
                        painter.lineTo(x * 60 + pX, viewer.height);
                        painter.stroke();
                        painter.closePath();
                    }
                    for (var y = 0; y < row; y++) {
                        painter.beginPath();
                        painter.moveTo(0, y * 60 + pY);
                        painter.lineTo(viewer.width, y * 60 + pY);
                        painter.stroke();
                        painter.closePath();
                    }
                }
            }
        }
    };
document.body.onresize = function() { linkingdom.viewer.resize() };
document.body.onload = function() { linkingdom.start() };