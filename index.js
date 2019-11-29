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
  var head = request.body.you.body[0];
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

  // Movement priorities. Higher numbers are worse decisions
  var moveUpPriority = 0;
  var moveDownPriority = 0;
  var moveLeftPriority = 0;
  var moveRightPriority = 0;

  // Keep snake from touching other snakes or eating itself
  for (s = 0; s < snakes.length; s++) {
    snakeBody = snakes[s].body;
    for (b = 0; b < snakeBody.length; b++) {
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

      // Tally up movement priorities
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
    }
  }

  // Keep snake on board
  if (head.y == 0) {
    up = false;
  }
  if (head.y == height) {
    down = false;
  }
  if (head.x == 0) {
    left = false;
  }
  if (head.x == width) {
    right = false;
  }

  // Seek out food
  for (f = 0; f < food.length; f++) {
    // Eat food directly next to snake's head
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

    // Head towards food in same row or column as snake's head and priority is at 0
    if (head.x == food[f].x && head.y > food[f].y) {
      if (up == true && moveUpPriority == 0) {
        up = 'food';
      }
    }
    if (head.x == food[f].x && head.y < food[f].y) {
      if (down == true && moveDownPriority == 0) {
        down = 'food';
      }
    }
    if (head.y == food[f].y && head.x > food[f].x) {
      if (left == true && moveLeftPriority == 0) {
        left = 'food';
      }
    }
    if (head.y == food[f].y && head.x < food[f].x) {
      if (right == true && moveRightPriority == 0) {
        right = 'food';
      }
    }
  }

  /* Sophisticated decision chooser
  function sophisticated(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }*/

  var safeDirections = [];
  var priorities = [];
  var finalDirections = [];

  // Go for the food else store safe directions in array
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

    //sophisticated(directions);
  }

  // Store priorities in array
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

  // Match priorities to safe directions
  for (i = 0; i < safeDirections.length; i++) {
    finalDirections.push([safeDirections[i], priorities[i]]);
  }

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
