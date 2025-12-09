// ----------------------
// Sounds
// ----------------------
const soundMove = new Audio("sounds/moving.wav");
const soundEat = new Audio("sounds/eatfood.wav");
const soundDead = new Audio("sounds/dead.wav");
soundMove.loop = true;

// ----------------------
// Name Input
// ----------------------
function start() {
  const input = document.getElementById("input-name");
  const display = document.getElementById("name-player");
  const form = document.getElementById("form");

  if (input.value) {
    display.style.display = "block";
    display.innerHTML = `Player's Name: ${input.value}`;
    form.style.display = "none";

    // ----------------------
    // Start Game
    // ----------------------
    soundMove.play();
    runGame();
  } else {
    alert("Enter a valid name.");
  }
}

// ----------------------
// Game Setup
// ----------------------
let board = document.getElementById("gameBoard");
let scoreDisplay = document.getElementById("score");

function Position(x, y) {
  this.x = x;
  this.y = y;
}

let boardSize = 20;
let gameRunning = true;

let settings = {
  speed: 200,
  score: 0
};

// ----------------------
// Snake Constructor
// ----------------------
function Snake() {
  this.head = new Position(0, 0);
  this.body = [this.head];
  this.direction = new Position(1, 0); // move right initially
}


// ----------------------
// Food Constructor
// ----------------------
function Food() {
  this.position = new Position(
    Math.floor(Math.random() * boardSize),
    Math.floor(Math.random() * boardSize)
  );
}

let snake = new Snake();
let food = new Food();

// ----------------------
// Control Snake
// ----------------------
function control() {
  document.addEventListener("keydown", e => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        if (snake.direction.y !== 1) snake.direction = { x: 0, y: -1 };
        break;

      case "ArrowDown":
        if (snake.direction.y !== -1) snake.direction = { x: 0, y: 1 };
        break;

      case "ArrowLeft":
        if (snake.direction.x !== 1) snake.direction = { x: -1, y: 0 };
        break;

      case "ArrowRight":
        if (snake.direction.x !== -1) snake.direction = { x: 1, y: 0 };
        break;
    }
  });
}

// ----------------------
// Game Loop
// ----------------------
function gameLoop() {
  if (!gameRunning) return;

  let newHead = new Position(
    snake.head.x + snake.direction.x,
    snake.head.y + snake.direction.y
  );

  snake.body.unshift(newHead);

  // Check if food eaten
  if (newHead.x === food.position.x && newHead.y === food.position.y) {
    settings.score++;
    scoreDisplay.textContent = `Score: ${settings.score}`;
    soundEat.currentTime = 0;
    soundEat.play();   // <-- play eating sound
    spawnFood();
  } else {
    snake.body.pop(); // remove tail
  }

  snake.head = newHead;

  // Check collision
  if (checkCollision()) {
    gameRunning = false;
    soundDead.play();  // <-- play death sound
    soundMove.pause();
    alert(`Game Over! Score: ${settings.score}`);

    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
      button.style.display = "block";
    });

    return;
  }

  drawGame();

  setTimeout(gameLoop, settings.speed);
}

// ----------------------
// Draw Game
// ----------------------
function drawGame() {
  board.innerHTML = "";

  for (let i = 0; i < boardSize * boardSize; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }

  // Draw snake
  snake.body.forEach(segment => {
    let index = segment.y * boardSize + segment.x;
    board.children[index].classList.add("snake");
  });

  // Draw food
  let foodIndex = food.position.y * boardSize + food.position.x;
  board.children[foodIndex].classList.add("food");
}

// ----------------------
// Collision Detection
// ----------------------
function checkCollision() {
  if (
    snake.head.x < 0 ||
    snake.head.x >= boardSize ||
    snake.head.y < 0 ||
    snake.head.y >= boardSize
  ) {
    return true; // wall hit
  }

  // Self collision
  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.head.x === snake.body[i].x &&
      snake.head.y === snake.body[i].y
    ) {
      return true;
    }
  }

  return false;
}

// ----------------------
// Spawn Food
// ----------------------
function spawnFood() {
  let validPosition = false;

  while (!validPosition) {
    let newX = Math.floor(Math.random() * boardSize);
    let newY = Math.floor(Math.random() * boardSize);

    let onSnake = false;
    for (let i = 0; i < snake.body.length; i++) {
      if (snake.body[i].x == newX && snake.body[i].y == newY) {
        onSnake = true;
        break;
      }
    }

    if (!onSnake) {
      food.position.x = newX;
      food.position.y = newY;
      validPosition = true;
    }
  }
}

function runGame() {
  soundMove.play();
  resetGame();   // Reset snake, food, score
  control();     // Add keyboard listener
  gameLoop();    // Start game loop
}

function resetGame() {
  // Reset game state
  snake = new Snake();
  food = new Food();
  settings.score = 0;
  scoreDisplay.textContent = `Score: 0`;
  gameRunning = true;
}

