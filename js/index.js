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
        canvas.addEventListener("touchend", changer);
        canvas.addEventListener("mouseup", changer);
        canvas.addEventListener("click", place_chess)
        linkingdom.viewer.resize();
    },
    viewer: {
        position: {
            X: 0,
            Y: 0,
            tX: 0,
            tY: 0,
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
                        case "touchstart":
                            change.started = true;
                            new_position = event.touches[0];
                            break;
                        case "mouseup":
                            change.started = false;
                            canvas.style.cursor = "";
                            new_position = event;
                            isEnd = true;
                            break;
                        case "touchend":
                            change.started = false;
                            new_position = event;
                            isEnd = true;
                            break;
                    }
                    if (isMove) {
                        change.tX = change.X - new_position.clientX;
                        change.tY = change.Y - new_position.clientY;
                        position.tX = position.X + change.tX;
                        position.tY = position.Y + change.tY;
                        viewer.update({
                            X: position.tX,
                            Y: position.tY
                        });
                    } else if (isEnd) {
                        position.X += change.tX;
                        position.Y += change.tY;
                    } else {
                        change.X = new_position.clientX;
                        change.Y = new_position.clientY;
                    }
                },
                X: 0,
                Y: 0,
                tX: 0,
                tY: 0,
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
            grid: function(position) {
                if (!position) position = linkingdom.viewer.position;
                var painter = linkingdom.painter,
                    chessboard = linkingdom.chessboard,
                    pX = -position.X % 60,
                    pY = -position.Y % 60,
                    column = Math.ceil(chessboard.width / 60),
                    row = Math.ceil(chessboard.height / 60);
                for (var x = 0; x < column; x++) {
                    painter.beginPath();
                    painter.moveTo(x * 60 + pX, 0);
                    painter.lineTo(x * 60 + pX, chessboard.height);
                    painter.stroke();
                    painter.closePath();
                }
                for (var y = 0; y < row; y++) {
                    painter.beginPath();
                    painter.moveTo(0, y * 60 + pY);
                    painter.lineTo(chessboard.width, y * 60 + pY);
                    painter.stroke();
                    painter.closePath();
                }
            },
            mark: function(position) {
                if (!position) position = linkingdom.viewer.position;
                var painter = linkingdom.painter,
                    chessboard = linkingdom.chessboard,
                    chess = chessboard.chess,
                    pX = -position.X,
                    pY = -position.Y,
                    sX = Math.floor(position.X / 60),
                    sY = Math.floor(position.Y / 60),
                    column = Math.ceil(chessboard.width / 60),
                    row = Math.ceil(chessboard.height / 60);
                painter.textAlign = "center";
                painter.textBaseline = "middle";
                painter.font = "50px sans-if";
                for (var x = sX; x < sX + column; x++)
                    for (var y = sY; y < sY + row; y++)
                        if (chess[x] && chess[x][y])
                            painter.fillText(
                                chess[x][y].sym,
                                ((x + 1) * 2 - 1) * 30 + pX,
                                ((y + 1) * 2 - 1) * 30 + pY
                            );
            }
        },
        update: function(position) {
            var canvas = linkingdom.canvas;
            linkingdom.painter.clearRect(0, 0, canvas.width, canvas.height);
            this.paint.grid(position);
            this.paint.mark(position);
        }
    },
    chessboard: {
        width: 0,
        height: 0,
        chess: {},
        users: ["O", "X"],
        turn: 1,
        clean: function() { this.chess = {}; },
        place_chess: function(event) {
            var view_position = linkingdom.viewer.position,
                position = view_position.change,
                chess = linkingdom.chessboard.chess,
                users = linkingdom.chessboard.users,
                turn = linkingdom.chessboard.turn;
            if (position.X != event.clientX || position.Y != event.clientY) return;
            var x = Math.floor((view_position.X + position.X) / 60),
                y = Math.floor((view_position.Y + position.Y) / 60);
            if (!chess[x]) chess[x] = {};
            chess[x][y] = {
                sym: users[(turn - 1) % 2],
                turn: turn
            };
            linkingdom.chessboard.turn++;
            linkingdom.viewer.update();
        }
    }
}
document.body.onresize = linkingdom.viewer.resize;
document.body.onload = linkingdom.start;