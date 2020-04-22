window.onload = function() {
  const Canvas = document.querySelector("#stage");
  const $ctx = Canvas.getContext("2d");

  const {width} = screen;

  window.alert(screen.width, screen.hight);

  if(width > 700) {
    Canvas.setAttribute("width", "500");
    Canvas.setAttribute("height", "500");
  } else if (width <= 700 && width >= 500) {
    Canvas.setAttribute("width", "400");
    Canvas.setAttribute("height", "400");
  } else {
    Canvas.setAttribute("width", "300");
    Canvas.setAttribute("height", "300");
  }
  
  const $qtdBox = 20;
  const $box = Canvas.width / $qtdBox;
  const $fullArea = $box * $qtdBox;

  function screenWrite(text, font, style, Xpos, Ypos) {
    $ctx.font = font; 
    $ctx.fillStyle = style;
    $ctx.fillText(text, Xpos, Ypos);
  }

  screenWrite("The", "78px serif", "#228B22",6 *$box, 8 *$box)
  $ctx.fillText("Snake's Game", 1 *$box, 11 *$box);
  screenWrite("Start the game pressing SPACE", "23px serif", "#FDFD00",4 *$box, 15 *$box);
  /* < -------------- | -------------- > */

  const $vel = 1;
  let $snake = [];
  let $HeadPX;
  let $HeadPY;
  let $direction;
  let $snakeEatApple = false;
  let $pointCount = 1;
  let applePos = {
    randomPX: "",
    randomPY: ""
  }

  let jogoAtivo = false;
  let gameRun;

  // funcão que inicia o game
  function gameStart(e) {
    if(e.keyCode === 32 && jogoAtivo === false) {
      $ctx.clearRect(0, 0, $fullArea, $fullArea);
      $HeadPX = 9;
      $HeadPY = 9;
      $direction = "DOWN";
      $snake = [
        {px: 9, py: 9}, 
        {px: 9, py: 8}, 
        {px: 9, py: 7}, 
      ]
      drawApple();
      gameRun = setInterval(gameRunning, 150);
      jogoAtivo = true;
    }
  }
  document.addEventListener("keyup", gameStart);

  // função que finaliza o game;
   function gameStop() {
    clearInterval(gameRun);
    $ctx.clearRect(0, 0, $fullArea, $fullArea);
    setTimeout(()=> {
      screenWrite("Game Over","70px serif","#FF0000", 3 *$box, 10 *$box)
      screenWrite("Press SPACE for restart","23px serif","#FDFD00",5 *$box, 12 *$box);
    }, 300);
    jogoAtivo = false;
    $pointCount = 0;
    showScore();
  } 

  // função responsavel por atualizar o jogo em tempo real:
  function gameRunning() {
    updateDirection();
    let px = $snake[0].px;
    let py = $snake[0].py;
    showScore(px, py); 
    drawSnake();
    if( px !== $HeadPX || py !== $HeadPY ) {
      let result = $snake.some((item)=> item.px === $HeadPX && item.py === $HeadPY);
      if(result) return gameStop();
      $snake.unshift({ px: $HeadPX, py: $HeadPY });
    }
    if($snakeEatApple !== true) {
      let snakeTail = $snake.pop();
      clearBox( snakeTail.px, snakeTail.py);        
    }
    $snakeEatApple = false;
  }

  // pinta o quadrado na posição especificada: 
  function drawBox(px, py) {
    return $ctx.fillRect( px * $box, py * $box, $box, $box);
  };
  // limpa o quadrado na posição especificada:
  function clearBox(px, py) {
    return $ctx.clearRect(px *$box , py *$box , $box, $box);
  };
  // Função que desenha a cobra: 
   function drawSnake() {
    $snake.map((item)=> {
      $ctx.fillStyle = "#BBB";
      if(item.px === -1) {
        item.px += 21;
        $HeadPX = $snake[0].px -$vel;

      } else if(item.px === 21) {
        item.px -= 21;
        $HeadPX = $snake[0].px +$vel;

      } else if(item.py === -1) {
        item.py += 21;
        $HeadPY = $snake[0].py -$vel;

      } else if(item.py === 21) {
        item.py -= 21;
        $HeadPY = $snake[0].py +$vel;
      }
        updateApplePos(item.px, item.py);
        return drawBox( item.px, item.py);
    });
   };


   // desenha a maçã:
  function drawApple() {
    $ctx.fillStyle = "#FF0000";
    let randomPX = Math.round(Math.random() * ($qtdBox -1));
    let randomPY = Math.round(Math.random() * ($qtdBox -1));
    applePos.randomPX = randomPX;
    applePos.randomPY = randomPY;
    console.log(applePos.randomPX, applePos.randomPY);
    return drawBox(randomPX, randomPY);
  } 
  // atualiza posição da maçã:
  function updateApplePos(px , py) {
    if(px === applePos.randomPX && py === applePos.randomPY ) {
      drawApple();
      $pointCount += 1;
      $ctx.fillStyle = "#BBB";
      $ctx.fillRect(px *$box, py *$box, $box, $box);
      return $snakeEatApple = true;
    } 
  }
  // exibe a quantidade de pontos(maçãs que o usuario comeu) na tela.
  function showScore(px, py) {
    const score = document.querySelector("#score");
    if(px === applePos.randomPX && py === applePos.randomPY ) {
      let text = `SCORE: ${$pointCount}`;
      score.innerText = text;
    }
  }

  // atualiza a direção da cobra:
  function updateDirection() {
    switch($direction) {
      case "LEFT": 
        $HeadPX -= $vel;
          break;  
      case "UP": 
        $HeadPY -= $vel;
          break;  
      case "RIGHT": 
        $HeadPX += $vel;
          break;  
      case "DOWN": 
        $HeadPY += $vel;
          break;  
    } 
  }
  // altera a direção de acordo com o clique do usuário:
  function newDirection(e) {
    let $newKey = e.keyCode;
    if($newKey === 37 && $HeadPX - $vel !== $snake[1].px ) $direction = "LEFT"; 
    if($newKey === 38 && $HeadPY - $vel !== $snake[1].py ) $direction = "UP";
    if($newKey === 39 && $HeadPX + $vel !== $snake[1].px ) $direction = "RIGHT";
    if($newKey === 40 && $HeadPY + $vel !== $snake[1].py ) $direction = "DOWN";
  }
   document.addEventListener("keydown", newDirection); 
}