const gamePlay = (function() {
  const grid = document.querySelector('.grid');
  const gridItems = document.querySelectorAll('.grid-item');
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');
  const overlay =  document.querySelector('.overlay');
  const openForm = document.querySelector('.open-form');
  let gameOver = true;
  let playerA = '';
  let playerB = '';
  let currentPlayer = '';
  let turn = 1;
  let gameCounter = 1;
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


  // bind events

  openForm.addEventListener('click', showForm);
  clearBtn.addEventListener('click', resetBoard);
  startBtn.addEventListener('click', playGame);
  gridItems.forEach(item => {
    item.addEventListener('click', placeMark);
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
    let player2Name = document.getElementById('player2').value;
    playerA = createPlayer(player1Name);
    playerB = createPlayer(player2Name);

    document.getElementById('playerAName').innerHTML = playerA.playerName;
    document.getElementById('playerBName').innerHTML = playerB.playerName;
  }


  // clear board data

  function clearBoardObject() {
    const blankBoard = ['', '', '', '', '', '', '', '', ''];
    array.splice(0, array.length, ...blankBoard);
    gridItems.forEach(square => {
      square.classList.remove('winner');
    });
  }

  function resetBoard() {
    clearBoardObject();
    clearBoard();
    gamePlay.gameOver = false;
    turn = 1;
  }

  function resetGame() {
    gameCounter = 1;
    gamePlay.playerA.score = 0;
    gamePlay.playerB.score = 0;
    resetBoard();
  }


  // handle gameplay logic

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
    // console.log('turn ' + turn);
    // console.log('game ' + gameCounter);
    // console.log('current player: ' + currentPlayer.playerName);
    return currentPlayer;
  }

  function placeMark() {
    playerA.mark = 'X';
    playerB.mark = 'O';
    currentPlayer = determineCurrentPlayer();
    let mark = currentPlayer.mark;
    if (array[this.id] == '' && gamePlay.gameOver == false) {
      array[this.id] = mark;
      drawOnBoard(this, mark);  // place selected mark on game board
      turn++;
      determineWinner();  // check if there's a winner
    }
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
      // winning scenario 1
      win1: (array[0] != '' && array[0] == array[4] && array[4] == array[8]),
      // winning scenario 2
      win2: (array[2] != '' && array[2] == array[4] && array[4] == array[6]),
      // winning scenario 3
      win3: (array[3] != '' && array[3] == array[4] && array[4] == array[5]),
      // winning scenario 4
      win4: (array[0] != '' && array[0] == array[1] && array[1] == array[2]),
      // winning scenario 5
      win5: (array[2] != '' && array[2] == array[5] && array[5] == array[8]),
      // winning scenario 6
      win6: (array[6] != '' && array[6] == array[7] && array[7] == array[8]),
      // winning scenario 7
      win7: (array[0] != '' && array[0] == array[3] && array[3] == array[6]),
      // winning scenario 8
      win8: (array[1] != '' && array[1] == array[4] && array[4] == array[7]),
    }

    for (const prop in winningConditions) {
      if (winningConditions[prop]) {
        currentPlayer.score += 1;
        updateScore();
        gamePlay.gameOver = true;
        gameCounter += 1;
        drawWinningScenario(prop);
        setTimeout(() => {alert(currentPlayer.playerName + ' wins!')}, 500);
        //alert(currentPlayer.playerName + ' wins!');
      }
    }
    // a tie happens when the board is full and no winning scenarios are met
    if (array.every(isBoardEmpty) && Object.values(winningConditions).indexOf(true) == -1) {    
      gamePlay.gameOver = true;
      gameCounter += 1;
      alert('It\'s a tie!');
    }
  }

  function enableBoard() {
    if (gamePlay.gameOver) {
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

  function playGame() {
    hideForm();
    gamePlay.gameOver = false;
    resetGame();
    enableBoard();
    getPlayerNames();
    updateScore();
  }

  return {
    playerA,
    playerB,
    playGame,
    gameOver
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