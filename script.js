const gamePlay = (function() {
  const gridItems = document.querySelectorAll('.grid-item');
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');
  const overlay =  document.querySelector('.overlay');
  const openForm = document.querySelector('.open-form');
  const gameTypeSelection = document.querySelectorAll('input[name="game-type"]');
  let gameOver = true;
  let playerA = {};
  let playerB = {};
  let currentPlayer = '';
  let turn = 1;
  let gameType = 1; // 1 -> human vs bot, 2 -> human vs human
  let gameCounter = 1;
  const x = 'X';
  const o = 'O';
  const Gameboard = {
    board: [
      // O  1  2
      '', '', '',
      // 3  4  5
      '', '', '',
      // 6  7  8
      '', '', '',
    ],
  };
  const array = Gameboard.board;
  let path = '';
  let moveStatus = false;
  let human = true;
  let mark = '';

  // bind events

  openForm.addEventListener('click', showForm);
  clearBtn.addEventListener('click', resetBoard);
  startBtn.addEventListener('click', playGame);
  gridItems.forEach(item => {
    item.addEventListener('click', playerChoice);
  });
  gameTypeSelection.forEach(btn => {
    btn.addEventListener('click', togglePlayerBSection);
  });

  // update game info on page

  function drawOnBoard(cell, mark) {
    cell.innerHTML = mark;
  }

  function drawWinningScenario(scenario) {
    if (scenario == 'win1') {
      gridItems[0].classList.add('winner');
      gridItems[4].classList.add('winner');
      gridItems[8].classList.add('winner');
    }
    else if (scenario == 'win2') {
      gridItems[2].classList.add('winner');
      gridItems[4].classList.add('winner');
      gridItems[6].classList.add('winner');
    }
    else if (scenario == 'win3') {
      gridItems[3].classList.add('winner');
      gridItems[4].classList.add('winner');
      gridItems[5].classList.add('winner');
    }
    else if (scenario == 'win4') {
      gridItems[0].classList.add('winner');
      gridItems[1].classList.add('winner');
      gridItems[2].classList.add('winner');
    }
    else if (scenario == 'win5') {
      gridItems[2].classList.add('winner');
      gridItems[5].classList.add('winner');
      gridItems[8].classList.add('winner');
    }
    else if (scenario == 'win6') {
      gridItems[6].classList.add('winner');
      gridItems[7].classList.add('winner');
      gridItems[8].classList.add('winner');
    }
    else if (scenario == 'win7') {
      gridItems[0].classList.add('winner');
      gridItems[3].classList.add('winner');
      gridItems[6].classList.add('winner');
    }
    else if (scenario == 'win8') {
      gridItems[1].classList.add('winner');
      gridItems[4].classList.add('winner');
      gridItems[7].classList.add('winner');
    }
  }

  function clearBoard() {
    gridItems.forEach(item => {
      item.innerHTML = '';
    });
  }

  function getPlayerNames() {
    let player1Name = document.getElementById('player1').value;
    let player2Name = '';
    // give bot a name if human vs bot
    if (document.getElementById('hvr').checked) {
      gameType = 2;
      player2Name = 'J.A.D.A.';
    } else {
      gameType = 1;
      player2Name = document.getElementById('player2').value;
    }  
    playerA = createPlayer(player1Name);
    playerB = createPlayer(player2Name);
    document.getElementById('playerAName').innerHTML = playerA.playerName;
    document.getElementById('playerBName').innerHTML = playerB.playerName;
  }


  // clear board data

  function clearBoardObject() {
    const blankBoard = ['', '', '', '', '', '', '', '', ''];
    // replace current board with blank board
    array.splice(0, array.length, ...blankBoard);
    gridItems.forEach(square => {
      square.classList.remove('winner');
    });
  }

  function resetBoard() {
    clearBoardObject();
    clearBoard();
    gameOver = false;
    turn = 1;
    // computer plays first on even games
    if (gameType == 2 && gameCounter % 2 == 0) {
      computerChoice();
    }
  }

  function resetGame() {
    gameCounter = 1;
    playerA.score = 0;
    playerB.score = 0;
    resetBoard();
  }


  // handle gameplay logic

  function findWinningPathPlayerA() {
    if ((array[0] === x) && (array[1] === x) && (array[2] === '') && (path === '')) {path = 2;}
    else if ((array[0] === x) && (array[1] === '') && (array[2] === x) && (path === '')) {path = 1;}
    else if ((array[0] === '') && (array[1] === x) && (array[2] == x) && (path === '')) {path = 0;} 
    else if ((array[0] === x) && (array[3] === x) && (array[6] == '') && (path === '')) {path = 6;}
    else if ((array[0] === x) && (array[3] === '') && (array[6] == x) && (path === '')) {path = 3;}
    else if ((array[0] === '') && (array[3] === x) && (array[6] == x) && (path === '')) {path = 0;}
    else if ((array[0] === x) && (array[4] === x) && (array[8] == '') && (path === '')) {path = 8;}
    else if ((array[0] === x) && (array[4] === '') && (array[8] == x) && (path === '')) {path = 4;}
    else if ((array[0] === '') && (array[4] === x) && (array[8] == x) && (path === '')) {path = 0;}
    else if ((array[1] === x) && (array[4] === x) && (array[7] == '') && (path === '')) {path = 7;}
    else if ((array[1] === x) && (array[4] === '') && (array[7] == x) && (path === '')) {path = 4;}
    else if ((array[1] === '') && (array[4] === x) && (array[7] == x) && (path === '')) {path = 1;}
    else if ((array[3] === x) && (array[4] === x) && (array[5] == '') && (path === '')) {path = 5;}
    else if ((array[3] === x) && (array[4] === '') && (array[5] == x) && (path === '')) {path = 4;}
    else if ((array[3] === '') && (array[4] === x) && (array[5] == x) && (path === '')) {path = 3;}
    else if ((array[6] === x) && (array[7] === x) && (array[8] == '') && (path === '')) {path = 8;}
    else if ((array[6] === x) && (array[7] === '') && (array[8] == x) && (path === '')) {path = 7;}
    else if ((array[6] === '') && (array[7] === x) && (array[8] == x) && (path === '')) {path = 6;}
    else if ((array[2] === x) && (array[5] === x) && (array[8] == '') && (path === '')) {path = 8;}
    else if ((array[2] === x) && (array[5] === '') && (array[8] == x) && (path === '')) {path = 5;}
    else if ((array[2] === '') && (array[5] === x) && (array[8] == x) && (path === '')) {path = 2;}
    else if ((array[6] === x) && (array[4] === x) && (array[2] == '') && (path === '')) {path = 2;}
    else if ((array[6] === x) && (array[4] === '') && (array[2] == x) && (path === '')) {path = 4;}
    else if ((array[6] === '') && (array[4] === x) && (array[2] == x) && (path === '')) {path = 6;}
  }

  function findWinningPathPlayerB() {
    if ((array[0] == o) && (array[1] == o) && (array[2] == '') && (path == '')) {path = 2;}
    else if ((array[0] == o) && (array[1] == '') && (array[2] == o) && (path == '')) {path = 1;}
    else if ((array[0] == '') && (array[1] == o) && (array[2] == o) && (path == '')) {path = 0;} 
    else if ((array[0] == o) && (array[3] == o) && (array[6] == '') && (path == '')) {path = 6;}
    else if ((array[0] == o) && (array[3] == '') && (array[6] == o) && (path == '')) {path = 3;}
    else if ((array[0] == '') && (array[3] == o) && (array[6] == o) && (path == '')) {path = 0;} 
    else if ((array[0] == o) && (array[4] == o) && (array[8] == '') && (path == '')) {path = 8;}
    else if ((array[0] == o) && (array[4] == '') && (array[8] == o) && (path == '')) {path = 4;}
    else if ((array[0] == '') && (array[4] == o) && (array[8] == o) && (path == '')) {path = 0;}
    else if ((array[1] == o) && (array[4] == o) && (array[7] == '') && (path == '')) {path = 7;}
    else if ((array[1] == o) && (array[4] == '') && (array[7] == o) && (path == '')) {path = 4;}
    else if ((array[1] == '') && (array[4] == o) && (array[7] == o) && (path == '')) {path = 1;}
    else if ((array[3] == o) && (array[4] == o) && (array[5] == '') && (path == '')) {path = 5;}
    else if ((array[3] == o) && (array[4] == '') && (array[5] == o) && (path == '')) {path = 4;}
    else if ((array[3] == '') && (array[4] == o) && (array[5] == o) && (path == '')) {path = 3;}
    else if ((array[6] == o) && (array[7] == o) && (array[8] == '') && (path == '')) {path = 8;}
    else if ((array[6] == o) && (array[7] == '') && (array[8] == o) && (path == '')) {path = 7;}
    else if ((array[6] == '') && (array[7] == o) && (array[8] == o) && (path == '')) {path = 6;}
    else if ((array[2] == o) && (array[5] == o) && (array[8] == '') && (path == '')) {path = 8;}
    else if ((array[2] == o) && (array[5] == '') && (array[8] == o) && (path == '')) {path = 5;}
    else if ((array[2] == '') && (array[5] == o) && (array[8] == o) && (path == '')) {path = 2;}
    else if ((array[6] == o) && (array[4] == o) && (array[2] == '') && (path == '')) {path = 6;}
    else if ((array[6] == o) && (array[4] == '') && (array[2] == o) && (path == '')) {path = 4;}
    else if ((array[6] == '') && (array[4] == o) && (array[2] == o) && (path == '')) {path = 6;}    
  }

  function checkSquareAvailability() {
    if ((path === 0) && array[0] == '') {
      array[0] = o;
      moveStatus = true;
    }
    else if ((path === 1) && array[1] == '') {
      array[1] = o;
      moveStatus = true;
    }
    else if ((path === 2) && array[2] == '') {
      array[2] = o;
      moveStatus = true;
    }
    else if ((path === 3) && array[3] == '') {
      array[3] = o;
      moveStatus = true;
    }
    else if ((path === 4) && array[4] == '') {
      array[4] = o;
      moveStatus = true;
    }
    else if ((path === 5) && array[5] == '') {
      array[5] = o;
      moveStatus = true;
    }
    else if ((path === 6) && array[6] == '') {
      array[6] = o;
      moveStatus = true;
    }
    else if ((path === 7) && array[7] == '') {
      array[7] = o;
      moveStatus = true;
    }
    else if ((path === 8) && array[8] == '') {
      array[8] = o;
      moveStatus = true;
    }
  }

  function determineCurrentPlayer() {
    // playerA always starts on odd games, while playerB starts on even games, then switch turns within a game.
    if (gameCounter % 2 !== 0) {
      if (turn % 2 !== 0) {
        currentPlayer = playerA;
      } else {
        currentPlayer = playerB;
      }  
    } else if (gameCounter % 2 == 0) {
      if (turn % 2 !== 0) {
        currentPlayer = playerB;
      } else {
        currentPlayer = playerA;
      }
    } 
    return currentPlayer;
  }

  function playerChoice() {
    playerA.mark = x;
    playerB.mark = o;
    currentPlayer = determineCurrentPlayer();
    mark = currentPlayer.mark;
    if (array[this.id] == '' && gameOver == false) {
      array[this.id] = mark;
      drawOnBoard(this, mark);  // place selected mark on game board
      turn++;
      determineWinner();  // check if there's a winner
    }
    if (gameType == 2 && gameOver == false) {computerChoice()};
  }

  function computerChoice() {
    let ranNum = 0;   
    path = '';
    moveStatus = false;
    currentPlayer = determineCurrentPlayer();
    mark = currentPlayer.mark;

    findWinningPathPlayerB();
    findWinningPathPlayerA();
    checkSquareAvailability();

    while (!moveStatus) {    
      ranNum = Math.floor(Math.random() * Gameboard.board.length);  // 0 - 8
      path = ranNum;
      checkSquareAvailability();
      // console.log(gridItems[path]);
    }
    array[path] = mark;
    drawOnBoard(gridItems[path], mark);
    determineWinner();   
    turn++;
  }

  function updateScore() {
    const aPlayerScore = document.getElementById('playerA');
    const bPlayerScore = document.getElementById('playerB');
    aPlayerScore.innerHTML = playerA.score;
    bPlayerScore.innerHTML = playerB.score;
  }

  function determineWinner() {
    const isBoardEmpty = (currentValue) => currentValue != '';
    const winningConditions = {
      win1: (array[0] != '' && array[0] == array[4] && array[4] == array[8]),
      win2: (array[2] != '' && array[2] == array[4] && array[4] == array[6]),
      win3: (array[3] != '' && array[3] == array[4] && array[4] == array[5]),
      win4: (array[0] != '' && array[0] == array[1] && array[1] == array[2]),
      win5: (array[2] != '' && array[2] == array[5] && array[5] == array[8]),
      win6: (array[6] != '' && array[6] == array[7] && array[7] == array[8]),
      win7: (array[0] != '' && array[0] == array[3] && array[3] == array[6]),
      win8: (array[1] != '' && array[1] == array[4] && array[4] == array[7]),
    }
    // declare a winner if any of the winning scenrarios are met
    for (const prop in winningConditions) {
      if (winningConditions[prop]) {
        currentPlayer.score += 1;
        updateScore();
        gameOver = true;
        gameCounter += 1;
        drawWinningScenario(prop);
        setTimeout(() => {alert(currentPlayer.playerName + ' wins!')}, 500);
      }
    }
    // a tie happens when the board is full and no winning scenarios are met
    if (array.every(isBoardEmpty) && Object.values(winningConditions).indexOf(true) == -1) {    
      gameOver = true;
      gameCounter += 1;
      alert('It\'s a tie!');
    }
  }

  function enableBoard() {
    const grid = document.querySelector('.grid');
    if (gameOver) {
      grid.classList.remove('enable');
    } else {
      grid.classList.add('enable');
    }
  }

  function showForm() {
    overlay.classList.add('shown');
    overlay.classList.remove('hidden');
  }

  function hideForm() {
    overlay.classList.remove('shown');
    overlay.classList.add('hidden');
  }

  function togglePlayerBSection() {
    const playerBSection = document.getElementById('second');
    if (document.getElementById('hvr').checked) {
      playerBSection.classList.add('hidden');
      playerBSection.classList.remove('shown');
    } else {
      playerBSection.classList.remove('hidden');
      playerBSection.classList.add('shown');
    }
  }

  // initialize game

  function playGame() {
    hideForm();
    gameOver = false;
    resetGame();
    enableBoard();
    getPlayerNames();
    updateScore();
  }

  return {
    //playGame,
    //Gameboard,
  };
})();


// Factory Function for player creation

function createPlayer(playerName) {
  let score = 0;
  let mark = 'X';

  return {
    mark,
    score,
    playerName,
  };
}