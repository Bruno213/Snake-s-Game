window.onload = function() {
  const Canvas = document.querySelector("#stage");
  const $ctx = Canvas.getContext("2d");
  
  const $box = 25;
  const $qtdBox = 20;
  const $fullArea = $box * $qtdBox;

  $ctx.font = "78px serif"; 
  $ctx.fillStyle = "#228B22";
  $ctx.fillText("The", 6 *$box, 8 *$box);
  $ctx.fillText("Snake's Game", 1 *$box, 11 *$box);
  
  $ctx.font = "23px serif";
  $ctx.fillStyle = "#FDFD00";
  $ctx.fillText("Start the game pressing SPACE", 4 *$box, 15 *$box);

  const $vel = 1;
  let $snake = [];
  let $HeadPX;
  let $HeadPY;
  let $direction;
  let $snakeEatApple = false;
  let applePos = {
    randomPX: "",
    randomPY: ""
  }

  let jogoAtivo = false;
  let gameRun;

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


   function gameStop() {
    clearInterval(gameRun);

    $ctx.clearRect(0, 0, $fullArea, $fullArea);

    setTimeout(()=> {
      $ctx.fillStyle = "#FF0000";
      $ctx.font = "70px serif";
      $ctx.fillText( "Game Over", 3 *$box, 10 *$box);
      
      $ctx.fillStyle = "#FDFD00";
      $ctx.font = "23px serif";
      $ctx.fillText( "Press SPACE for restart", 5 *$box, 12 *$box);
    }, 300);

    jogoAtivo = false;
  } 



  function gameRunning() {
    let px = $snake[0].px;
    let py = $snake[0].py;

    updateDirection();
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
  /* < -------------- | -------------- > */


  /***********************************************************************
   * Funcões primitivas do jogo, usadas para pintar e limpar os quadrados* 
   ***********************************************************************/
  function drawBox(px, py) {
    return $ctx.fillRect( px * $box, py * $box, $box, $box );
  }

  function clearBox(px, py) {
    return $ctx.clearRect(px *$box , py *$box , $box, $box);
  }
  /* < -------------- | -------------- > */

  /****************************************************************
   * Funcões responsaveis por gerar a maçã e atualizar sua posição* 
   ****************************************************************/

   function drawSnake() {
    $snake.map((item)=> {
      $ctx.fillStyle = "#BBB";
      updateApplePos(item.px, item.py);
      return drawBox( item.px, item.py );
    });
   }

  /****************************************************************
   * Funcões responsaveis por gerar a maçã e atualizar sua posição* 
   ****************************************************************/
  function drawApple() {
    $ctx.fillStyle = "#FF0000";
    let randomPX = Math.round(Math.random() * ($qtdBox -1));
    let randomPY = Math.round(Math.random() * ($qtdBox -1));
    applePos.randomPX = randomPX;
    applePos.randomPY = randomPY;

    return drawBox(randomPX, randomPY);
  } 

  function updateApplePos(px , py) {
    if(px === applePos.randomPX && py === applePos.randomPY ) {
      drawApple();
      $ctx.fillStyle = "#BBB";
      $ctx.fillRect(px *$box, py *$box, $box, $box);
      return $snakeEatApple = true;
    } 
  }
  /* < -------------- | -------------- > */

  /**************************************************
   * Funcões responsáveis pelas ações dentro do jogo* 
   **************************************************/
  
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

  function newDirection(e) {
    let $newKey = e.keyCode;
    if($newKey === 37 && $HeadPX - $vel !== $snake[1].px ) $direction = "LEFT"; 
    if($newKey === 38 && $HeadPY - $vel !== $snake[1].py ) $direction = "UP";
    if($newKey === 39 && $HeadPX + $vel !== $snake[1].px ) $direction = "RIGHT";
    if($newKey === 40 && $HeadPY + $vel !== $snake[1].py ) $direction = "DOWN";
  }

   document.addEventListener("keydown", newDirection); 
  /* < -------------- | -------------- > */
}