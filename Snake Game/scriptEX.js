let board = document.getElementById("gameBoard");
let scoreDisplay = document.getElementById("score");

//
let boardSize = 20;
let snake = [{ x: 10, y: 10}];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let gameOver = false;

function draw() {
  board.innerHTML = ""; // clear old board

  // draw food
  const foodDiv = document.createElement("div");
  foodDiv.style.gridRowStart = food.y;
  foodDiv.style.gridcolumnstart = food.x;
  foodDiv.classList.add("food");
  board.appendChild(foodDiv);

  // draw snake
  snake.forEach(part => {
    const snakePart = document.createElement("div");
    snakePart.style.gridRowStart = part.y;
    snakePart.style.gridcolumnstart = part.x;
    snakePart.classList.add("snake");
    board.appendChild(snakePart);
  });
}

function move() {
  if (gameOver) return;

  const head= {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Check wall or self-collision
  if (
    head.x < 1 || head.x > boardSize ||
    head.y < 1 || head.y > boardSize ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true;
    alert("Game Over! Your score: " + score);
    return;
  }

  snake.unshift(head);

  //check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  
  food = newFood;
}

// Handle keyboard controls
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 1) break;
      direction = {x: 0, y: -1};
      break;
    case "ArrowDown":
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
})

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp" :
      if (direction.y === 1) break;
  }
});

function gameLoop() {
  move();
  draw();
  if (!gameOver) {
    setTimeout(gameLoop, 150); // control speed
  }
}

draw();
gameLoop();