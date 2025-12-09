// ============================================================
// SOUND EFFECTS
// ============================================================
// Initialize audio objects for game sounds
const soundMove = new Audio("sounds/moving.wav");
const soundEat = new Audio("sounds/eatfood.wav");
const soundDead = new Audio("sounds/dead.wav");
soundMove.loop = true; // Continuous background movement sound

// ============================================================
// PLAYER NAME VALIDATION AND GAME START
// ============================================================
function start() {
  // Get references to HTML elements
  const input = document.getElementById("input-name");
  const display = document.getElementById("name-player");
  const form = document.getElementById("form");
  
  // Get the input value and remove leading/trailing whitespace
  const playerName = input.value.trim();
  
  // VALIDATION CHECK 1: Empty or whitespace-only input
  if (!playerName) {
    alert("⚠️ Please enter a valid name (cannot be empty).");
    input.focus(); // Return focus to the input field
    return; // Exit function if validation fails
  }
  
  // All validations passed - proceed with game setup
  display.style.display = "block"; // Show player name display
  display.innerHTML = `Player's Name: ${playerName}`; // Display the validated name
  form.style.display = "none"; // Hide the input form
  
  // Start the game
  soundMove.play(); // Begin background music
  runGame(); // Initialize and start game loop
}

// ============================================================
// GAME SETUP AND CONFIGURATION
// ============================================================
// Get references to DOM elements for game board and score display
let board = document.getElementById("gameBoard");
let scoreDisplay = document.getElementById("score");

function Position(x, y) {
  this.x = x;
  this.y = y;
}

// Game configuration constants
let boardSize = 20; // Creates a 20x20 grid (400 cells total)
let gameRunning = true; // Flag to control whether game loop continues

// Game settings object - stores mutable game state
let settings = {
  speed: 200, // Milliseconds between each game loop iteration (lower = faster)
  score: 0    // Current player score (increases when food is eaten)
};

// Flag to prevent multiple keyboard event listeners from being added
let controlsInitialized = false;

// ============================================================
// SNAKE CONSTRUCTOR
// ============================================================
function Snake() {
  this.head = new Position(0, 0); // Starting position at top-left
  this.body = [this.head]; // Array starts with just the head
  this.direction = new Position(1, 0); // Moving right: x increases by 1, y stays 0
}

// ============================================================
// FOOD CONSTRUCTOR
// ============================================================
function Food() {
  this.position = new Position(
    Math.floor(Math.random() * boardSize), // Random x coordinate (0-19)
    Math.floor(Math.random() * boardSize)  // Random y coordinate (0-19)
  );
}

// Initialize game objects - create initial snake and food
let snake = new Snake();
let food = new Food();

// ============================================================
// KEYBOARD CONTROLS
// ============================================================
function control() {
  // Prevent adding multiple event listeners when game restarts
  if (controlsInitialized) return;
  controlsInitialized = true;
  
  document.addEventListener("keydown", e => {
    // Only respond to arrow keys, ignore all other keys
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      return;
    }
    
    // Prevent default browser behavior (scrolling the page)
    e.preventDefault();
    
    // Update snake direction based on key press
    // Each case checks current direction to prevent 180-degree turns
    switch (e.key) {
      case "ArrowUp":
        // Only allow up if not currently moving down
        if (snake.direction.y !== 1) snake.direction = { x: 0, y: -1 };
        break;
      
      case "ArrowDown":
        // Only allow down if not currently moving up
        if (snake.direction.y !== -1) snake.direction = { x: 0, y: 1 };
        break;
      
      case "ArrowLeft":
        // Only allow left if not currently moving right
        if (snake.direction.x !== 1) snake.direction = { x: -1, y: 0 };
        break;
      
      case "ArrowRight":
        // Only allow right if not currently moving left
        if (snake.direction.x !== -1) snake.direction = { x: 1, y: 0 };
        break;
    }
  });
}

// ============================================================
// MAIN GAME LOOP
// ============================================================
function gameLoop() {
  // Exit if game has ended (collision occurred)
  if (!gameRunning) return;
  
  // Calculate new head position by adding direction vector to current head
  let newHead = new Position(
    snake.head.x + snake.direction.x,
    snake.head.y + snake.direction.y
  );
  
  // Add new head to the front of the body array (snake moves forward)
  snake.body.unshift(newHead);
  
  // Check if snake's head is at the same position as food
  if (newHead.x === food.position.x && newHead.y === food.position.y) {
    // FOOD EATEN - Snake grows
    settings.score++; // Increment score
    scoreDisplay.textContent = `Score: ${settings.score}`; // Update display
    
    // Play eating sound effect
    soundEat.currentTime = 0; // Reset sound to beginning for rapid eating
    soundEat.play();
    
    // Generate new food at valid position (not on snake)
    spawnFood();
    
    // Note: We don't remove tail here, so snake grows by 1 segment
  } else {
    // NO FOOD EATEN - Remove tail to maintain current snake length
    snake.body.pop();
  }
  
  // Update head reference to new position
  snake.head = newHead;
  
  // Check for collisions with walls or self
  if (checkCollision()) {
    // GAME OVER - Collision detected
    gameRunning = false; // Stop game loop
    soundDead.play();  // Play death sound effect
    soundMove.pause(); // Stop movement sound
    
    // Display game over message with final score
    alert(`Game Over! Score: ${settings.score}`);
    
    // Show "Play again" and "Restart" buttons
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
      button.style.display = "block";
    });
    
    return; // Exit game loop
  }
  
  // Render the current game state to the screen
  drawGame();
  
  // Schedule next iteration of game loop after delay
  setTimeout(gameLoop, settings.speed);
}

// ============================================================
// DRAW GAME
// ============================================================
function drawGame() {
  // Clear all existing content from board
  board.innerHTML = "";
  
  // Create grid of cells (20x20 = 400 cells total)
  for (let i = 0; i < boardSize * boardSize; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
  
  // Draw each snake body segment
  snake.body.forEach(segment => {
    // Convert 2D position (x, y) to 1D array index
    // Formula: index = y * boardSize + x
    // Example: position (5, 3) = 3 * 20 + 5 = 65
    let index = segment.y * boardSize + segment.x;
    board.children[index].classList.add("snake");
  });
  
  // Draw food
  let foodIndex = food.position.y * boardSize + food.position.x;
  board.children[foodIndex].classList.add("food");
}

// ============================================================
// COLLISION DETECTION
// ============================================================
function checkCollision() {
  // Check wall collisions - head is out of bounds
  if (
    snake.head.x < 0 ||                // Hit left wall
    snake.head.x >= boardSize ||       // Hit right wall
    snake.head.y < 0 ||                // Hit top wall
    snake.head.y >= boardSize          // Hit bottom wall
  ) {
    return true; // Wall collision detected
  }
  
  // Check self-collision - head hits any body segment
  // Start loop at index 1 to skip the head itself (index 0)
  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.head.x === snake.body[i].x &&
      snake.head.y === snake.body[i].y
    ) {
      return true; // Self collision detected
    }
  }
  
  return false; // No collision detected
}

// ============================================================
// FOOD SPAWNING
// ============================================================
function spawnFood() {
  let validPosition = false; // Flag to control while loop
  
  // Keep trying until we find a position not occupied by snake
  while (!validPosition) {
    // Generate random coordinates within board boundaries
    let newX = Math.floor(Math.random() * boardSize);
    let newY = Math.floor(Math.random() * boardSize);
    
    // Check if this position overlaps with any snake segment
    let onSnake = false;
    for (let i = 0; i < snake.body.length; i++) {
      if (snake.body[i].x == newX && snake.body[i].y == newY) {
        onSnake = true; // Overlap found
        break; // No need to check remaining segments
      }
    }
    
    // If position doesn't overlap with snake, use it
    if (!onSnake) {
      food.position.x = newX;
      food.position.y = newY;
      validPosition = true; // Exit while loop
    }
    // If onSnake is true, loop continues and generates new random position
  }
}

// ============================================================
// GAME INITIALIZATION AND RESET
// ============================================================
function runGame() {
  soundMove.play();      // Start movement sound
  resetGame();           // Reset all game state to initial values
  control();             // Initialize keyboard controls (only runs once due to flag)
  gameLoop();            // Begin the main game loop
}

function resetGame() {
  // Create fresh game objects
  snake = new Snake();
  food = new Food();
  
  // Reset score to 0
  settings.score = 0;
  scoreDisplay.textContent = `Score: 0`;
  
  // Reset game running flag
  gameRunning = true;
  
  // Hide "Play again" and "Restart" buttons
  const buttons = document.querySelectorAll(".button");
  buttons.forEach(button => {
    button.style.display = "none";
  });
}
