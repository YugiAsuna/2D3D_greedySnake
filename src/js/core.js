var chessBoard;
var squareSet;
// 初始化方向枚举
var toward = {
    DOWN : {
        x : 0,
        y : 1,
        rotateY : 0
    },
    UP : {
        x : 0,
        y : -1,
        rotateY : 90
    },
    LEFT : {
        x : -1,
        y : 0,
        rotateY : 45
    },
    RIGHT : {
        x : 1,
        y : 0,
        rotateY : -45
    }
};
var mainSnakeColor = '#6495ed';
// 玩家的蛇
var mainSnake;
var snake = [];
var timer;
var frame = 40;

var maxThingsSize = 10;
var things = [];

// 生成物工厂
var thingFactory = {
    autoGenerateTimer : null,
    typeEnums: {
        food: {
            name: 'food',
            value: 2,
            text: '+',
            bgColor: '#228b22',
            fgColor: 'black',
            act: function (origin) {
                origin.grow(null, null, origin.bgColor);
            }
        }
    },
    createThing : function (x, y, type) {
        var temp = createBall(x, y, type.text, type.bgColor, type.fgColor);
        temp.value = type.value;
        temp.act = type.act;
        things.push(temp);
        return temp;
    },
    randomGenerate : function () {
        var x = parseInt(Math.random() * 480);
        var y = parseInt(Math.random() * 480);
        var temp = createBall(x, y, this.typeEnums.food.text, this.typeEnums.food.bgColor, this.typeEnums.food.fgColor);
        temp.act = this.typeEnums.food.act;
        things.push(temp);
    },
    autoGenerate : function () {
        this.autoGenerateTimer = setInterval(function () {
            if(things.length < maxThingsSize){
                thingFactory.randomGenerate();
            }
        }, 1000);
    }
};
var is3D = false;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// 蛇构造函数
function Snake(headX, headY, nowToward, length, bgColor) {
    this.snakeBody = [];
    this.nowToward = nowToward;
    this.headMoveX = nowToward.x;
    this.headMoveY = nowToward.y;
    this.bgColor = bgColor;
    // 将要改变的方向
    this.changeToward = null;
    this.init = function (headX, headY, nowToward, length, bgColor) {
        for(var i = 0; i < length; i++){
            this.grow(headX, headY, bgColor);
        }
    }
    // 蛇长出一节
    this.grow = function (headX, headY, bgColor) {
        var ball;
        if(this.snakeBody.length == 0){
            ball = createBall(headX, headY, '&nbsp;', mainSnakeColor);
        }else if(this.snakeBody[this.snakeBody.length - 1].point.length == 0){
            var lastBody = this.snakeBody[this.snakeBody.length - 1];
            // 若上一节的朝向为X轴，新的一节蛇身的 X坐标 在上一节 X轴 朝向方向的反方向减去一个蛇身的距离，Y轴不变。
            // 例如初始蛇头位置 X 坐标为 80，朝向为RIGHT即 X轴正方向
            // 则新长的一节蛇身 X 坐标为 80 + -1 * 1 * 20 = 60
            //                  Y 坐标为  0 + -1 * 0 * 20 =  0
            // 若上一节的朝向为Y轴，新的一节蛇身的 Y坐标 在上一节 Y轴 朝向方向的反方向减去一个蛇身的距离，X轴不变。
            ball = createBall(lastBody.lx + -1 * this.nowToward.x * 20, lastBody.ly + -1 * this.nowToward.y * 20, '&nbsp;', bgColor);
        }else{
            var lastBody = this.snakeBody[this.snakeBody.length - 1];
            var point = lastBody.point[0];
            ball = createBall(lastBody.lx + -1 * point.speedX * 20, lastBody.ly + -1 * point.speedY * 20, '&nbsp;', bgColor);
            // 克隆上一节的拐点到新增的蛇身中
            ball.point = clone(lastBody.point);
        }
        this.snakeBody.push(ball);
    };
    // 蛇向上转
    this.turnUp = function () {
        this.nowToward = toward.UP;
        change(this, 0, -1);
    };
    // 蛇向下转
    this.turnDown = function () {
        console.log('turnDown OK');
        this.nowToward = toward.DOWN;
        console.log(this.nowToward);
        change(this, 0, 1);
    };
    // 蛇向左转
    this.turnLeft = function () {
        this.nowToward = toward.LEFT;
        change(this, -1, 0);
    };
    // 蛇向右转
    this.turnRight = function () {
        this.nowToward = toward.RIGHT;
        change(this, 1, 0);
    };
    // 蛇死亡
    this.over = function () {
      if(mainSnake == this){
          clearInterval(timer);
          alert('游戏结束');
      }
      else{

      }
    };
    this.init(headX, headY, nowToward, length, bgColor);
}
// 初始化场地
function initSquareSet() {
    squareSet = new Array(25);
    for(var i = 0; i < squareSet.length; i++){
        squareSet[i] = new Array(25);
        for(var j = 0; j < squareSet[i].length; j++){
            squareSet[i][j] = document.createElement('div');
            squareSet[i][j].classList.add('square');
            chessBoard.appendChild(squareSet[i][j]);
        }
    }
}
// 初始化蛇
function initSnake() {
    var main = new Snake(80, 0, toward.RIGHT, 4, mainSnakeColor);
    mainSnake = main;
    snake.push(main);
}
// 创造一节蛇身
function createBall(x, y, text, bgColor, fgColor) {
    var ball = document.createElement('div');
    // 3D组件
    var shadow = document.createElement('div');
    var circle = document.createElement('div');
    var over = document.createElement('div');
    var textDiv = document.createElement('span');
    textDiv.innerHTML = text;
    circle.appendChild(over);
    circle.appendChild(textDiv);
    ball.appendChild(shadow);
    ball.appendChild(circle);
    over.classList.add('over-circle');
    circle.classList.add('circle');
    shadow.classList.add('shadow');

    ball.classList.add('ball');
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    ball.style.background = bgColor;
    ball.style.color = fgColor;
    ball.lx = x;
    ball.ly = y;
    // 蛇身拐点序列
    ball.point = [];
    if(is3D){
        rendering3D(ball, bgColor);
    }
    chessBoard.appendChild(ball);
    return ball;
}
// 蛇改变方向
function change(nowSnake, x, y) {
    console.log('change OK');
    var lastX = nowSnake.snakeBody[0].lx;
    var lastY = nowSnake.snakeBody[0].ly;
    var speedX = nowSnake.headMoveX;
    var speedY = nowSnake.headMoveY;
    console.log(lastX, lastY, speedX, speedY);
    // 给除了蛇头的所有蛇身添加拐点
    for (var i = 1; i < nowSnake.snakeBody.length; i++){
        nowSnake.snakeBody[i].point.push({x: lastX, y: lastY, speedX: speedX, speedY: speedY});
    }
    nowSnake.headMoveX = x;
    nowSnake.headMoveY = y;
}
// 绘制图像
function repaint() {
    if(is3D){
        repaint3D();
    }
    else{
        for(var i = 0; i < snake.length; i++){
            for(var j = 0; j < snake[i].snakeBody.length; j++){
                snake[i].snakeBody[j].style.left = snake[i].snakeBody[j].lx + 'px';
                snake[i].snakeBody[j].style.top = snake[i].snakeBody[j].ly + 'px';
            }
            snake[i].snakeBody[0].innerHTML = '☆';
        }
    }
}
// 蛇移动
function move() {
    console.log('move in OK');
    for(var i = 0; i < snake.length; i++){
        for(var j = 0; j < snake[i].snakeBody.length; j++){
            // 当蛇身存在拐点时，蛇身跟着拐点的方向走
            if(snake[i].snakeBody[j].point.length > 0){
                snake[i].snakeBody[j].lx += snake[i].snakeBody[j].point[0].speedX;
                snake[i].snakeBody[j].ly += snake[i].snakeBody[j].point[0].speedY;
                // 当蛇身拐过来之后，将当前拐点从拐点数组中移除
                if(snake[i].snakeBody[j].lx == snake[i].snakeBody[j].point[0].x && snake[i].snakeBody[j].ly == snake[i].snakeBody[j].point[0].y){
                    snake[i].snakeBody[j].point.shift();
                }
            }
            // 当蛇身不存在拐点时，蛇身跟着蛇头的方向走
            else{
                snake[i].snakeBody[j].lx += snake[i].headMoveX;
                snake[i].snakeBody[j].ly += snake[i].headMoveY;
            }
            console.log(snake[0].snakeBody[0].lx, snake[0].snakeBody[0].ly);
        }
    }
    repaint();
}
// 蛇改变方向前的判断
function tryChangeToward() {
    for(var i = 0; i < snake.length; i++){
        // 如果蛇存在将要改变的方向且与当前方向不同时
        if(snake[i].changeToward && snake[i].changeToward.change != snake[i].nowToward){
            // 如果蛇将要改变你的方向不为当前方向的反方向时
            if(snake[i].changeToward.change.x + snake[i].nowToward.x != 0 || snake[i].changeToward.change.y + snake[i].nowToward.y != 0){
                snake[i].nowToward = snake[i].changeToward.change;
                snake[i].changeToward.act.call(snake[i]);
            }
        }
    }
}
// 判断两物之间距离
function getDistance(a, b) {
    var snakeCenterX = a.lx + 10;
    var snakeCenterY = a.ly + 10;
    var thingsCenterX = b.lx + 10;
    var thingsCenterY = b.ly + 10;
    var absX = Math.abs(snakeCenterX - thingsCenterX);
    var absY = Math.abs(snakeCenterY - thingsCenterY);
    var distance = Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2), 2);
    return distance;
}
// 蛇碰撞判断
function checkCrash() {
    for(var i = 0; i < snake.length; i++){
        var x = snake[i].snakeBody[0].lx;
        var y = snake[i].snakeBody[0].ly;
        // 蛇撞墙
        if(x < 0 || x > 480 || y < 0 || y >480){
            snake[i].over();
            continue;
        }
        for(var j = 0; j < things.length; j++){
            var distance = getDistance(snake[i].snakeBody[0], things[j]);
            if(distance < 20){
                things[j].act(snake[i]);
                chessBoard.removeChild(things[j]);
                things.splice(j, 1);
            }
        }
    }
}
// 蛇开始运动
function start() {
    timer = setInterval(function () {
        tryChangeToward();
        move();
        checkCrash();
    }, 1000 / frame);
    thingFactory.autoGenerate();
    // 键盘控制主蛇运动
    document.onkeydown = function (ev) {
        if(ev.keyCode == 38){
            console.log('向上');
            mainSnake.changeToward = {change: toward.UP, act: mainSnake.turnUp}
        }else if(ev.keyCode == 40){
            console.log('向下');
            mainSnake.changeToward = {change: toward.DOWN, act: mainSnake.turnDown}
        }else if(ev.keyCode == 37){
            console.log('向左');
            mainSnake.changeToward = {change: toward.LEFT, act: mainSnake.turnLeft}
        }else if(ev.keyCode == 39){
            console.log('向右');
            mainSnake.changeToward = {change: toward.RIGHT, act: mainSnake.turnRight}
        }
    };
}


window.onload = function (ev) {
    chessBoard = document.getElementById('chess-board');
    // 初始化方格
    initSquareSet();
    // 初始化蛇
    initSnake();
    if(is3D){
        changeTo3D();
    }
    repaint3D();
};