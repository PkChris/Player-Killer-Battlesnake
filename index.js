const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    "color": "#374054",
    "headType": "evil",
    "tailType": "bolt"
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  console.log(request.body);

  // Board information
  var width = request.body.board.width - 1;
  var height = request.body.board.height - 1;
  var widthMinusOne = width - 1;
  var heightMinusOne = height - 1;
  var widthHalf = width / 2;
  var heightHalf = height / 2;
  var head = request.body.you.body[0];
  var body = request.body.you.body;
  var snakes = request.body.board.snakes;
  var food = request.body.board.food;

  // Directions
  var up = true;
  var down = true;
  var left = true;
  var right = true;

  // Future movement coordinates
  var moveUp = {
    x: head.x,
    y: head.y - 1
  }
  var moveDown = {
    x: head.x,
    y: head.y + 1
  }
  var moveLeft = {
    x: head.x - 1,
    y: head.y
  }
  var moveRight = {
    x: head.x + 1,
    y: head.y
  }
  var moveUpLeft = {
    x: head.x - 1,
    y: head.y - 1
  }
  var moveUpRight = {
    x: head.x + 1,
    y: head.y - 1
  }
  var moveDownLeft = {
    x: head.x - 1,
    y: head.y + 1
  }
  var moveDownRight = {
    x: head.x + 1,
    y: head.y + 1
  }
  var moveUpFurther = {
    x: head.x,
    y: head.y - 2
  }
  var moveDownFurther = {
    x: head.x,
    y: head.y + 2
  }
  var moveLeftFurther = {
    x: head.x - 2,
    y: head.y
  }
  var moveRightFurther = {
    x: head.x + 2,
    y: head.y
  }
  var moveUpLeftFurther = {
    x: head.x - 2,
    y: head.y - 1
  }
  var moveDownLeftFurther = {
    x: head.x - 2,
    y: head.y + 1
  }
  var moveLeftUpFurther = {
    x: head.x - 1,
    y: head.y - 2
  }
  var moveRightUpFurther = {
    x: head.x + 1,
    y: head.y - 2
  }
  var moveUpRightFurther = {
    x: head.x + 2,
    y: head.y - 1
  }
  var moveDownRightFurther = {
    x: head.x + 2,
    y: head.y + 1
  }
  var moveLeftDownFurther = {
    x: head.x - 1,
    y: head.y + 2
  }
  var moveRightDownFurther = {
    x: head.x + 1,
    y: head.y + 2
  }
  var moveUpEvenFurther = {
    x: head.x,
    y: head.y - 3
  }
  var moveDownEvenFurther = {
    x: head.x,
    y: head.y + 3
  }
  var moveLeftEvenFurther = {
    x: head.x - 3,
    y: head.y
  }
  var moveRightEvenFurther = {
    x: head.x + 3,
    y: head.y
  }

  // Movement priorities. 1 is added to each direction for every negative action.
  var moveUpPriority = 10;
  var moveDownPriority = 10;
  var moveLeftPriority = 10;
  var moveRightPriority = 10;

  var dangerousSnakeHeads = [];

  // Keep snake from touching other snakes or eating itself
  for (s = 0; s < snakes.length; s++) {
    snakeBody = snakes[s].body;
    for (b = 0; b < snakeBody.length; b++) {
      if (snakeBody[0].x == snakeBody[b].x && snakeBody[0].y == snakeBody[b].y) {
        // Eat adjacent snake heads if length permits
        if (body.length > snakeBody.length) {
          if (moveUp.x == snakeBody[b].x && moveUp.y == snakeBody[b].y) {
            up = 'food';
          }
          if (moveDown.x == snakeBody[b].x && moveDown.y == snakeBody[b].y) {
            down = 'food';
          }
          if (moveLeft.x == snakeBody[b].x && moveLeft.y == snakeBody[b].y) {
            left = 'food';
          }
          if (moveRight.x == snakeBody[b].x && moveRight.y == snakeBody[b].y) {
            right = 'food';
          }

          // Head towards edible snake heads
          if (moveUpFurther.x == snakeBody[b].x && moveUpFurther.y == snakeBody[b].y) {
            moveUpPriority--;
          }
          if (moveDownFurther.x == snakeBody[b].x && moveDownFurther.y == snakeBody[b].y) {
            moveDownPriority--;
          }
          if (moveLeftFurther.x == snakeBody[b].x && moveLeftFurther.y == snakeBody[b].y) {
            moveLeftPriority--;
          }
          if (moveRightFurther.x == snakeBody[b].x && moveRightFurther.y == snakeBody[b].y) {
            moveRightPriority--;
          }
          if (moveUpEvenFurther.x == snakeBody[b].x && moveUpEvenFurther.y == snakeBody[b].y) {
            moveUpPriority--;
          }
          if (moveDownEvenFurther.x == snakeBody[b].x && moveDownEvenFurther.y == snakeBody[b].y) {
            moveDownPriority--;
          }
          if (moveLeftEvenFurther.x == snakeBody[b].x && moveLeftEvenFurther.y == snakeBody[b].y) {
            moveLeftPriority--;
          }
          if (moveRightEvenFurther.x == snakeBody[b].x && moveRightEvenFurther.y == snakeBody[b].y) {
            moveRightPriority--;
          }
          if (moveUpLeft.x == snakeBody[b].x && moveUpLeft.y == snakeBody[b].y) {
            moveUpPriority--;
            moveLeftPriority--;
          }
          if (moveUpRight.x == snakeBody[b].x && moveUpRight.y == snakeBody[b].y) {
            moveUpPriority--;
            moveRightPriority--;
          }
          if (moveDownLeft.x == snakeBody[b].x && moveDownLeft.y == snakeBody[b].y) {
            moveDownPriority--;
            moveLeftPriority--;
          }
          if (moveDownRight.x == snakeBody[b].x && moveDownRight.y == snakeBody[b].y) {
            moveDownPriority--;
            moveRightPriority--;
          }
          if (moveUpLeftFurther.x == snakeBody[b].x && moveUpLeftFurther.y == snakeBody[b].y) {
            moveUpPriority--;
            moveLeftPriority--;
            moveLeftPriority--;
          }
          if (moveDownLeftFurther.x == snakeBody[b].x && moveDownLeftFurther.y == snakeBody[b].y) {
            moveDownPriority--;
            moveLeftPriority--;
            moveLeftPriority--;
          }
          if (moveLeftUpFurther.x == snakeBody[b].x && moveLeftUpFurther.y == snakeBody[b].y) {
            moveLeftPriority--;
            moveUpPriority--;
            moveUpPriority--;
          }
          if (moveRightUpFurther.x == snakeBody[b].x && moveRightUpFurther.y == snakeBody[b].y) {
            moveRightPriority--;
            moveUpPriority--;
            moveUpPriority--;
          }
          if (moveUpRightFurther.x == snakeBody[b].x && moveUpRightFurther.y == snakeBody[b].y) {
            moveUpPriority--;
            moveRightPriority--;
            moveRightPriority--;
          }
          if (moveDownRightFurther.x == snakeBody[b].x && moveDownRightFurther.y == snakeBody[b].y) {
            moveDownPriority--;
            moveRightPriority--;
            moveRightPriority--;
          }
          if (moveLeftDownFurther.x == snakeBody[b].x && moveLeftDownFurther.y == snakeBody[b].y) {
            moveLeftPriority--;
            moveDownPriority--;
            moveDownPriority--;
          }
          if (moveRightDownFurther.x == snakeBody[b].x && moveRightDownFurther.y == snakeBody[b].y) {
            moveRightPriority--;
            moveDownPriority--;
            moveDownPriority--;
          }
        } else {
          // Store dangerous snake head locations
          dangerousSnakeHeads.push(snakeBody[b]);

          // Avoid more powerful snake heads
          if (moveUp.x == snakeBody[b].x && moveUp.y == snakeBody[b].y) {
            moveUpPriority++;
          }
          if (moveDown.x == snakeBody[b].x && moveDown.y == snakeBody[b].y) {
            moveDownPriority++;
          }
          if (moveLeft.x == snakeBody[b].x && moveLeft.y == snakeBody[b].y) {
            moveLeftPriority++;
          }
          if (moveRight.x == snakeBody[b].x && moveRight.y == snakeBody[b].y) {
            moveRightPriority++;
          }
          if (moveUpFurther.x == snakeBody[b].x && moveUpFurther.y == snakeBody[b].y) {
            moveUpPriority++;
          }
          if (moveDownFurther.x == snakeBody[b].x && moveDownFurther.y == snakeBody[b].y) {
            moveDownPriority++;
          }
          if (moveLeftFurther.x == snakeBody[b].x && moveLeftFurther.y == snakeBody[b].y) {
            moveLeftPriority++;
          }
          if (moveRightFurther.x == snakeBody[b].x && moveRightFurther.y == snakeBody[b].y) {
            moveRightPriority++;
          }
          if (moveUpEvenFurther.x == snakeBody[b].x && moveUpEvenFurther.y == snakeBody[b].y) {
            moveUpPriority++;
          }
          if (moveDownEvenFurther.x == snakeBody[b].x && moveDownEvenFurther.y == snakeBody[b].y) {
            moveDownPriority++;
          }
          if (moveLeftEvenFurther.x == snakeBody[b].x && moveLeftEvenFurther.y == snakeBody[b].y) {
            moveLeftPriority++;
          }
          if (moveRightEvenFurther.x == snakeBody[b].x && moveRightEvenFurther.y == snakeBody[b].y) {
            moveRightPriority++;
          }
          if (moveUpLeft.x == snakeBody[b].x && moveUpLeft.y == snakeBody[b].y) {
            moveUpPriority++;
            moveLeftPriority++;
          }
          if (moveUpRight.x == snakeBody[b].x && moveUpRight.y == snakeBody[b].y) {
            moveUpPriority++;
            moveRightPriority++;
          }
          if (moveDownLeft.x == snakeBody[b].x && moveDownLeft.y == snakeBody[b].y) {
            moveDownPriority++;
            moveLeftPriority++;
          }
          if (moveDownRight.x == snakeBody[b].x && moveDownRight.y == snakeBody[b].y) {
            moveDownPriority++;
            moveRightPriority++;
          }
          if (moveUpLeftFurther.x == snakeBody[b].x && moveUpLeftFurther.y == snakeBody[b].y) {
            moveUpPriority++;
            moveLeftPriority++;
            moveLeftPriority++;
          }
          if (moveDownLeftFurther.x == snakeBody[b].x && moveDownLeftFurther.y == snakeBody[b].y) {
            moveDownPriority++;
            moveLeftPriority++;
            moveLeftPriority++;
          }
          if (moveLeftUpFurther.x == snakeBody[b].x && moveLeftUpFurther.y == snakeBody[b].y) {
            moveLeftPriority++;
            moveUpPriority++;
            moveUpPriority++;
          }
          if (moveRightUpFurther.x == snakeBody[b].x && moveRightUpFurther.y == snakeBody[b].y) {
            moveRightPriority++;
            moveUpPriority++;
            moveUpPriority++;
          }
          if (moveUpRightFurther.x == snakeBody[b].x && moveUpRightFurther.y == snakeBody[b].y) {
            moveUpPriority++;
            moveRightPriority++;
            moveRightPriority++;
          }
          if (moveDownRightFurther.x == snakeBody[b].x && moveDownRightFurther.y == snakeBody[b].y) {
            moveDownPriority++;
            moveRightPriority++;
            moveRightPriority++;
          }
          if (moveLeftDownFurther.x == snakeBody[b].x && moveLeftDownFurther.y == snakeBody[b].y) {
            moveLeftPriority++;
            moveDownPriority++;
            moveDownPriority++;
          }
          if (moveRightDownFurther.x == snakeBody[b].x && moveRightDownFurther.y == snakeBody[b].y) {
            moveRightPriority++;
            moveDownPriority++;
            moveDownPriority++;
          }
        }
      }

      // Do not collide with other snake's bodies
      if (moveUp.x == snakeBody[b].x && moveUp.y == snakeBody[b].y) {
        up = false;
      }
      if (moveDown.x == snakeBody[b].x && moveDown.y == snakeBody[b].y) {
        down = false;
      }
      if (moveLeft.x == snakeBody[b].x && moveLeft.y == snakeBody[b].y) {
        left = false;
      }
      if (moveRight.x == snakeBody[b].x && moveRight.y == snakeBody[b].y) {
        right = false;
      }

      // Another snake's tail is a safe direction
      if (snakeBody[snakeBody.length - 1].x == snakeBody[b].x && snakeBody[snakeBody.length - 1].y == snakeBody[b].y) {
        if (moveUp.x == snakeBody[b].x && moveUp.y == snakeBody[b].y) {
          up = true;
        }
        if (moveDown.x == snakeBody[b].x && moveDown.y == snakeBody[b].y) {
          down = true;
        }
        if (moveLeft.x == snakeBody[b].x && moveLeft.y == snakeBody[b].y) {
          left = true;
        }
        if (moveRight.x == snakeBody[b].x && moveRight.y == snakeBody[b].y) {
          right = true;
        }
      }

      // Choose the safest open route
      if (moveUpFurther.x == snakeBody[b].x && moveUpFurther.y == snakeBody[b].y) {
        moveUpPriority++;
      } else if (moveUpEvenFurther.x == snakeBody[b].x && moveUpEvenFurther.y == snakeBody[b].y) {
        moveUpPriority++;
      }
      if (moveDownFurther.x == snakeBody[b].x && moveDownFurther.y == snakeBody[b].y) {
        moveDownPriority++;
      } else if (moveDownEvenFurther.x == snakeBody[b].x && moveDownEvenFurther.y == snakeBody[b].y) {
        moveDownPriority++;
      }
      if (moveLeftFurther.x == snakeBody[b].x && moveLeftFurther.y == snakeBody[b].y) {
        moveLeftPriority++;
      } else if (moveLeftEvenFurther.x == snakeBody[b].x && moveLeftEvenFurther.y == snakeBody[b].y) {
        moveLeftPriority++;
      }
      if (moveRightFurther.x == snakeBody[b].x && moveRightFurther.y == snakeBody[b].y) {
        moveRightPriority++;
      } else if (moveRightEvenFurther.x == snakeBody[b].x && moveRightEvenFurther.y == snakeBody[b].y) {
        moveRightPriority++;
      }
      if (moveUpLeft.x == snakeBody[b].x && moveUpLeft.y == snakeBody[b].y) {
        moveUpPriority++;
        moveLeftPriority++;
      }
      if (moveUpRight.x == snakeBody[b].x && moveUpRight.y == snakeBody[b].y) {
        moveUpPriority++;
        moveRightPriority++;
      }
      if (moveDownLeft.x == snakeBody[b].x && moveDownLeft.y == snakeBody[b].y) {
        moveDownPriority++;
        moveLeftPriority++;
      }
      if (moveDownRight.x == snakeBody[b].x && moveDownRight.y == snakeBody[b].y) {
        moveDownPriority++;
        moveRightPriority++;
      }
      if (moveUpLeftFurther.x == snakeBody[b].x && moveUpLeftFurther.y == snakeBody[b].y) {
        moveUpPriority++;
        moveLeftPriority++;
        moveLeftPriority++;
      }
      if (moveDownLeftFurther.x == snakeBody[b].x && moveDownLeftFurther.y == snakeBody[b].y) {
        moveDownPriority++;
        moveLeftPriority++;
        moveLeftPriority++;
      }
      if (moveLeftUpFurther.x == snakeBody[b].x && moveLeftUpFurther.y == snakeBody[b].y) {
        moveLeftPriority++;
        moveUpPriority++;
        moveUpPriority++;
      }
      if (moveRightUpFurther.x == snakeBody[b].x && moveRightUpFurther.y == snakeBody[b].y) {
        moveRightPriority++;
        moveUpPriority++;
        moveUpPriority++;
      }
      if (moveUpRightFurther.x == snakeBody[b].x && moveUpRightFurther.y == snakeBody[b].y) {
        moveUpPriority++;
        moveRightPriority++;
        moveRightPriority++;
      }
      if (moveDownRightFurther.x == snakeBody[b].x && moveDownRightFurther.y == snakeBody[b].y) {
        moveDownPriority++;
        moveRightPriority++;
        moveRightPriority++;
      }
      if (moveLeftDownFurther.x == snakeBody[b].x && moveLeftDownFurther.y == snakeBody[b].y) {
        moveLeftPriority++;
        moveDownPriority++;
        moveDownPriority++;
      }
      if (moveRightDownFurther.x == snakeBody[b].x && moveRightDownFurther.y == snakeBody[b].y) {
        moveRightPriority++;
        moveDownPriority++;
        moveDownPriority++;
      }
    }
  }

  // Keep snake on board and avoid corners when traversing the edge of the board
  if (head.y == 0) {
    up = false;

    if (head.x < widthHalf) {
      moveLeftPriority++;
    } else {
      moveRightPriority++;
    }
  }
  if (head.y == height) {
    down = false;

    if (head.x < widthHalf) {
      moveLeftPriority++;
    } else {
      moveRightPriority++;
    }
  }
  if (head.x == 0) {
    left = false;

    if (head.y < heightHalf) {
      moveUpPriority++;
    } else {
      moveDownPriority++;
    }
  }
  if (head.x == width) {
    right = false;

    if (head.y < heightHalf) {
      moveUpPriority++;
    } else {
      moveDownPriority++;
    }
  }

  // Avoid the edge of the board and avoid corners when traversing the second last row or column of the board
  if (head.y == 1) {
    moveUpPriority++;

    if (head.x < widthHalf) {
      moveLeftPriority++;
    } else {
      moveRightPriority++;
    }
  }
  if (head.y == heightMinusOne) {
    moveDownPriority++;

    if (head.x < widthHalf) {
      moveLeftPriority++;
    } else {
      moveRightPriority++;
    }
  }
  if (head.x == 1) {
    moveLeftPriority++;

    if (head.y < heightHalf) {
      moveUpPriority++;
    } else {
      moveDownPriority++;
    }
  }
  if (head.x == widthMinusOne) {
    moveRightPriority++;

    if (head.y < heightHalf) {
      moveUpPriority++;
    } else {
      moveDownPriority++;
    }
  }

  // Prevent multiple food from stacking priority on the same row and column
  var foodUpPriority = false;
  var foodDownPriority = false;
  var foodLeftPriority = false;
  var foodRightPriority = false;

  // Seek out food
  for (f = 0; f < food.length; f++) {
    // Eat adjacent food
    if (moveUp.x == food[f].x && moveUp.y == food[f].y) {
      up = 'food';
    }
    if (moveDown.x == food[f].x && moveDown.y == food[f].y) {
      down = 'food';
    }
    if (moveLeft.x == food[f].x && moveLeft.y == food[f].y) {
      left = 'food';
    }
    if (moveRight.x == food[f].x && moveRight.y == food[f].y) {
      right = 'food';
    }

    // Head towards food in same row or column
    if (head.x == food[f].x && head.y > food[f].y && up == true && foodUpPriority == false) {
      moveUpPriority--;
      foodUpPriority = true;
    }
    if (head.x == food[f].x && head.y < food[f].y && down == true && foodDownPriority == false) {
      moveDownPriority--;
      foodDownPriority = true;
    }
    if (head.y == food[f].y && head.x > food[f].x && left == true && foodLeftPriority == false) {
      moveLeftPriority--;
      foodLeftPriority = true;
    }
    if (head.y == food[f].y && head.x < food[f].x && right == true && foodRightPriority == false) {
      moveRightPriority--;
      foodRightPriority = true;
    }
  }

  // Don't get killed by dangerous snake heads going for food
  for (d = 0; d < dangerousSnakeHeads.length; d++) {
    if (up == 'food') {
      if (moveUpFurther.x == dangerousSnakeHeads[d].x && moveUpFurther.y == dangerousSnakeHeads[d].y) {
        up = false;
      }
      if (moveUpLeft.x == dangerousSnakeHeads[d].x && moveUpLeft.y == dangerousSnakeHeads[d].y) {
        up = false;
      }
      if (moveUpRight.x == dangerousSnakeHeads[d].x && moveUpRight.y == dangerousSnakeHeads[d].y) {
        up = false;
      }
    } else if (down == 'food') {
      if (moveDownFurther.x == dangerousSnakeHeads[d].x && moveDownFurther.y == dangerousSnakeHeads[d].y) {
        down = false;
      }
      if (moveDownLeft.x == dangerousSnakeHeads[d].x && moveDownLeft.y == dangerousSnakeHeads[d].y) {
        down = false;
      }
      if (moveDownRight.x == dangerousSnakeHeads[d].x && moveDownRight.y == dangerousSnakeHeads[d].y) {
        down = false;
      }
    } else if (left == 'food') {
      if (moveLeftFurther.x == dangerousSnakeHeads[d].x && moveLeftFurther.y == dangerousSnakeHeads[d].y) {
        left = false;
      }
      if (moveUpLeft.x == dangerousSnakeHeads[d].x && moveUpLeft.y == dangerousSnakeHeads[d].y) {
        left = false;
      }
      if (moveDownLeft.x == dangerousSnakeHeads[d].x && moveDownLeft.y == dangerousSnakeHeads[d].y) {
        left = false;
      }
    } else if (right == 'food') {
      if (moveRightFurther.x == dangerousSnakeHeads[d].x && moveRightFurther.y == dangerousSnakeHeads[d].y) {
        right = false;
      }
      if (moveUpRight.x == dangerousSnakeHeads[d].x && moveUpRight.y == dangerousSnakeHeads[d].y) {
        right = false;
      }
      if (moveDownRight.x == dangerousSnakeHeads[d].x && moveDownRight.y == dangerousSnakeHeads[d].y) {
        right = false;
      }
    }
  }

  var safeDirections = [];
  var priorities = [];
  var finalDirections = [];

  // Store safe directions in array. If direction is food then only store that direction.
  if (up == 'food') {
    safeDirections.push('up');
  } else if (down == 'food') {
    safeDirections.push('down');
  } else if (left == 'food') {
    safeDirections.push('left');
  } else if (right == 'food') {
    safeDirections.push('right');
  } else {
    if (up) {
      safeDirections.push('up');
    }
    if (down) {
      safeDirections.push('down');
    }
    if (left) {
      safeDirections.push('left');
    }
    if (right) {
      safeDirections.push('right');
    }
  }

  // Store priorities in array for each direction the snake can travel
  if (up) {
    priorities.push(moveUpPriority);
  }
  if (down) {
    priorities.push(moveDownPriority);
  }
  if (left) {
    priorities.push(moveLeftPriority);
  }
  if (right) {
    priorities.push(moveRightPriority);
  }

  // Match priorities to safe directions by merging arrays
  for (i = 0; i < safeDirections.length; i++) {
    finalDirections.push([safeDirections[i], priorities[i]]);
  }

  /* Randomize order so up and down aren't prioritized over left and right if priority is equal
  function randomize(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }*/
  //randomize(finalDirections);

  // Sort descending by Priority
  function sortDescendingSecondColumn(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return (a[1] < b[1]) ? -1 : 1;
    }
  }
  finalDirections.sort(sortDescendingSecondColumn);

  // Response data
  const data = {
    move: finalDirections[0][0], // one of: ['up','down','left','right']
  }

  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
