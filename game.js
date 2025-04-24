const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let dx = 1;
let dy = 0;
let score = 0;

function generateFood() {
  return {
    x: Math.floor(Math.random() * GRID_COUNT),
    y: Math.floor(Math.random() * GRID_COUNT)
  };
}

function drawGame() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制蛇
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE-1, GRID_SIZE-1);
  });

  // 绘制食物
  ctx.fillStyle = '#FF5252';
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE-1, GRID_SIZE-1);

  // 移动蛇头
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  // 检测食物碰撞
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = score;
    food = generateFood();
  } else {
    snake.pop();
  }

  // 碰撞检测
  if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT || 
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    clearInterval(gameLoop);
    alert('游戏结束！得分：' + score);
  }
}

// 键盘控制
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
});

// 最后的定时器设置
const gameLoop = setInterval(drawGame, 150);