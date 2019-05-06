is3D = true;
var T3D_X = 1;
var T3D_Y = 0.7;
// 3D绘制
function repaint3D() {
    for(var i = 0; i < snake.length; i++){
        for(var j = 0; j < snake[i].snakeBody.length; j++){
            snake[i].snakeBody[j].style.left = (snake[i].snakeBody[j].lx * T3D_X - 10) + 'px';
            snake[i].snakeBody[j].style.top = (snake[i].snakeBody[j].ly * T3D_Y - 10) + 'px';
            snake[i].snakeBody[j].style.zIndex = snake[i].snakeBody[j].ly;
        }
        snake[i].snakeBody[0].getElementsByClassName('circle')[0].getElementsByTagName('span')[0].innerHTML = '☆';
        snake[i].snakeBody[0].getElementsByClassName('circle')[0].getElementsByTagName('span')[0].style.transform = 'rotateY('+ snake[i].nowToward.rotateY +'deg)';
    }
    for(var i = 0; i < things.length; i++){
        things[i].style.left = things[i].lx * T3D_X - 10 + 'px';
        things[i].style.top = things[i].ly * T3D_Y - 10 + 'px';
    }
}
// 将棋盘设置为3D，将蛇的倾斜和偏移归位
function changeTo3D() {
    console.log(1);
    is3D = true;
    chessBoard.style.width = '500px';
    chessBoard.style.height = '350px';
    chessBoard.style.transition = 'transform 2s';
    chessBoard.style.transform = 'skew(-45deg)';

    for(var i = 0; i < squareSet.length; i++){
        for(var j = 0; j < squareSet[i].length; j++){
            squareSet[i][j].style.width = '20px';
            squareSet[i][j].style.height = '14px';
        }
    }
    for(var i = 0; i < snake.length; i++){
        for(var j = 0; j < snake[i].snakeBody.length; j++){
            snake[i].snakeBody[j].style.transition = 'transform 2s';
            snake[i].snakeBody[j].style.transform = 'skew(45deg)';
            snake[i].snakeBody[j].style.left = (snake[i].snakeBody[j].lx * T3D_X - 10) + 'px';
            snake[i].snakeBody[j].style.top = (snake[i].snakeBody[j].ly * T3D_Y - 10) + 'px';
        }
    }
}

// 给所有产生的球包括蛇身和食物都变为3D效果
function rendering3D(obj, color) {
    obj.style.transform = 'skew(45deg)';
    obj.getElementsByClassName('over-circle')[0].style.backgroundImage = 'radial-gradient(circle at center, white, '+ color +')';
    obj.getElementsByClassName('shadow')[0].style.display = 'inline-block';
}