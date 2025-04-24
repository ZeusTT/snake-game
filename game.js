document.addEventListener('DOMContentLoaded', () => {
    // 获取画布和上下文
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    // 游戏设置
    const gridSize = 15; // 网格大小
    const tileCount = canvas.width / gridSize; // 网格数量
    let speed = 7; // 蛇的速度（帧率）
    
    // 蛇的初始位置和速度
    let snake = [
        { x: 10, y: 10 }
    ];
    let velocityX = 0;
    let velocityY = 0;
    let nextVelocityX = 0;
    let nextVelocityY = 0;
    
    // 食物位置
    let foodX;
    let foodY;
    
    // 分数
    let score = 0;
    
    // 游戏状态
    let gameOver = false;
    let gameStarted = false;
    
    // 初始化游戏
    function initGame() {
        snake = [{ x: 10, y: 10 }];
        velocityX = 0;
        velocityY = 0;
        nextVelocityX = 0;
        nextVelocityY = 0;
        score = 0;
        gameOver = false;
        gameStarted = false;
        document.getElementById('score').textContent = score;
        document.getElementById('game-over').classList.add('hidden');
        placeFood();
        drawGame();
    }
    
    // 生成食物
    function placeFood() {
        // 生成随机位置
        let newFoodX, newFoodY;
        let foodOnSnake;
        
        do {
            foodOnSnake = false;
            newFoodX = Math.floor(Math.random() * tileCount);
            newFoodY = Math.floor(Math.random() * tileCount);
            
            // 检查食物是否在蛇身上
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        foodX = newFoodX;
        foodY = newFoodY;
    }
    
    // 游戏主循环
    function drawGame() {
        if (gameOver) {
            return;
        }
        
        // 清除画布
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制食物
        ctx.fillStyle = 'red';
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
        
        // 绘制蛇
        ctx.fillStyle = 'green';
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
            
            // 绘制蛇身边框
            ctx.strokeStyle = 'darkgreen';
            ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }
        
        // 如果游戏未开始，显示提示
        if (!gameStarted) {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('按方向键开始游戏', canvas.width / 2, canvas.height / 2);
            requestAnimationFrame(drawGame);
            return;
        }
        
        // 更新蛇的位置
        velocityX = nextVelocityX;
        velocityY = nextVelocityY;
        
        // 移动蛇
        const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === foodX && head.y === foodY) {
            score++;
            document.getElementById('score').textContent = score;
            placeFood();
            
            // 每得5分增加速度，最大速度为12
            if (score % 5 === 0 && speed < 12) {
                speed++;
            }
        } else {
            snake.pop();
        }
        
        // 检查碰撞
        checkCollision();
        
        // 继续游戏循环
        setTimeout(() => {
            requestAnimationFrame(drawGame);
        }, 1000 / speed);
    }
    
    // 检查碰撞
    function checkCollision() {
        const head = snake[0];
        
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            endGame();
            return;
        }
        
        // 检查自身碰撞
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame();
                return;
            }
        }
    }
    
    // 游戏结束
    function endGame() {
        gameOver = true;
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        // 开始游戏
        if (!gameStarted && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            gameStarted = true;
        }
        
        // 控制方向
        switch (e.key) {
            case 'ArrowUp':
                if (velocityY !== 1) { // 防止反向移动
                    nextVelocityX = 0;
                    nextVelocityY = -1;
                }
                break;
            case 'ArrowDown':
                if (velocityY !== -1) {
                    nextVelocityX = 0;
                    nextVelocityY = 1;
                }
                break;
            case 'ArrowLeft':
                if (velocityX !== 1) {
                    nextVelocityX = -1;
                    nextVelocityY = 0;
                }
                break;
            case 'ArrowRight':
                if (velocityX !== -1) {
                    nextVelocityX = 1;
                    nextVelocityY = 0;
                }
                break;
        }
    });
    
    // 触摸控制
    const upBtn = document.getElementById('up');
    const downBtn = document.getElementById('down');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const restartBtn = document.getElementById('restart');
    
    upBtn.addEventListener('click', () => {
        if (!gameStarted) gameStarted = true;
        if (velocityY !== 1) {
            nextVelocityX = 0;
            nextVelocityY = -1;
        }
    });
    
    downBtn.addEventListener('click', () => {
        if (!gameStarted) gameStarted = true;
        if (velocityY !== -1) {
            nextVelocityX = 0;
            nextVelocityY = 1;
        }
    });
    
    leftBtn.addEventListener('click', () => {
        if (!gameStarted) gameStarted = true;
        if (velocityX !== 1) {
            nextVelocityX = -1;
            nextVelocityY = 0;
        }
    });
    
    rightBtn.addEventListener('click', () => {
        if (!gameStarted) gameStarted = true;
        if (velocityX !== -1) {
            nextVelocityX = 1;
            nextVelocityY = 0;
        }
    });
    
    restartBtn.addEventListener('click', initGame);
    
    // 防止滑动屏幕
    document.addEventListener('touchmove', (e) => {
        if (e.target.tagName === 'BUTTON') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 初始化游戏
    initGame();
});