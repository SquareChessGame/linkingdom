var linkingdom = {
    canvas: document.querySelector("canvas"),
    painter: document.querySelector("canvas").getContext("2d"),
    start: function() {
        var canvas = linkingdom.canvas,
            changer = linkingdom.viewer.position.change.move,
            place_chess = linkingdom.chessboard.place_chess;
        canvas.addEventListener("mousedown", changer);
        canvas.addEventListener("touchmove", changer);
        canvas.addEventListener("mousemove", changer);
        canvas.addEventListener("mouseup", changer);
        canvas.addEventListener("click", place_chess)
        linkingdom.viewer.resize();
    },
    viewer: {
        position: {
            X: 0,
            Y: 0,
            change: {
                move: function(event) {
                    var canvas = linkingdom.canvas,
                        viewer = linkingdom.viewer,
                        position = viewer.position,
                        change = position.change,
                        new_position,
                        isMove = false,
                        isEnd = false;
                    switch (event.type) {
                        case "mousemove":
                            if (!change.started) return;
                            canvas.style.cursor = "move";
                            new_position = event;
                            isMove = true;
                            break;
                        case "touchmove":
                            new_position = event.touches[0];
                            isMove = true;
                            break;
                        case "mousedown":
                            change.started = true;
                            new_position = event;
                            break;
                        case "mouseup":
                            change.started = false;
                            canvas.style.cursor = "";
                            new_position = event;
                            break;
                    }
                    if (isMove) {
                        position.X = change.X - new_position.clientX;
                        position.Y = change.Y - new_position.clientY;
                        viewer.update();
                    } else {
                        change.X = new_position.clientX;
                        change.Y = new_position.clientY;
                    }
                },
                X: 0,
                Y: 0,
                started: false
            }
        },
        resize: function() {
            var chessboard = linkingdom.chessboard,
                canvas = linkingdom.canvas,
                container = document.body;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            chessboard.width = container.clientWidth;
            chessboard.height = container.clientHeight;
            linkingdom.viewer.update();
        },
        paint: {
            grid: function() {
                var painter = linkingdom.painter,
                    chessboard = linkingdom.chessboard,
                    position = linkingdom.viewer.position,
                    pX = Math.abs(position.X) % 80,
                    pY = Math.abs(position.Y) % 80,
                    column = Math.ceil(chessboard.width / 80),
                    row = Math.ceil(chessboard.height / 80);
                for (var x = 0; x < column; x++) {
                    painter.beginPath();
                    painter.moveTo(x * 80 + pX, 0);
                    painter.lineTo(x * 80 + pX, chessboard.height);
                    painter.stroke();
                    painter.closePath();
                }
                for (var y = 0; y < row; y++) {
                    painter.beginPath();
                    painter.moveTo(0, y * 80 + pY);
                    painter.lineTo(chessboard.width, y * 80 + pY);
                    painter.stroke();
                    painter.closePath();
                }
            }
        },
        update: function() {
            var canvas = linkingdom.canvas;
            linkingdom.painter.clearRect(0, 0, canvas.width, canvas.height);
            this.paint.grid();
        }
    },
    chessboard: {
        width: 0,
        height: 0,
        place_chess: function(event) {

        }
    }
}
document.body.onresize = linkingdom.viewer.resize;
document.body.onload = linkingdom.start;