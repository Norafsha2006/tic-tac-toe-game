const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");

const resetBtn = document.getElementById("resetBtn");
const newMatchBtn = document.getElementById("newMatchBtn");
const themeToggle = document.getElementById("themeToggle");
const gameMode = document.getElementById("gameMode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let aiMode = false;

let scores = JSON.parse(localStorage.getItem("scores")) || {
  x: 0,
  o: 0,
  draw: 0
};
if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
}
updateScoreboard();
gameMode.addEventListener("change", () => {
  aiMode = gameMode.value === "ai";
  resetBoard();
});

const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

function handleCellClick(e){
  const index = e.target.dataset.index;

  if(board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  if(currentPlayer === "X"){
    e.target.style.color = "#ff4757";
}else{
    e.target.style.color = "#2ed573";
}

  checkWinner();

  if(gameActive){

 if(aiMode && currentPlayer === "X"){

    currentPlayer = "O";
    statusText.textContent = "Computer Thinking...";

    setTimeout(()=>{
      aiMove();
    },500);

  }else{

    currentPlayer =
      currentPlayer === "X" ? "O" : "X";

    statusText.textContent =
      `Player ${currentPlayer}'s Turn`;
  }

}
}
function aiMove(){

  // Check if AI can win
  for(let pattern of winPatterns){
    const [a,b,c] = pattern;

    const values = [board[a], board[b], board[c]];

    if(values.filter(v => v === "O").length === 2 &&
       values.includes("")){

      const emptyIndex = pattern[values.indexOf("")];

      makeAIMove(emptyIndex);
      return;
    }
  }

  // Check if player can win and block
  for(let pattern of winPatterns){
    const [a,b,c] = pattern;

    const values = [board[a], board[b], board[c]];

    if(values.filter(v => v === "X").length === 2 &&
       values.includes("")){

      const emptyIndex = pattern[values.indexOf("")];

      makeAIMove(emptyIndex);
      return;
    }
  }

  // Take center if available
  if(board[4] === ""){
    makeAIMove(4);
    return;
  }

  // Random move
  const emptyCells = [];

  board.forEach((cell,index)=>{
    if(cell === ""){
      emptyCells.push(index);
    }
  });

  if(emptyCells.length > 0){
    const randomIndex =
      emptyCells[Math.floor(Math.random()*emptyCells.length)];

    makeAIMove(randomIndex);
  }
}
function makeAIMove(index){

  board[index] = "O";

  cells[index].textContent = "O";
  cells[index].style.color = "#2ed573";

  checkWinner();

  if(gameActive){
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
  }
}

function checkWinner(){

  let winnerFound = false;

  winPatterns.forEach(pattern => {
    const [a,b,c] = pattern;

    if(
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ){
      winnerFound = true;

      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");

      statusText.textContent = `🎉 Player ${board[a]} Wins!`;

      if(board[a] === "X"){
        scores.x++;
      }else{
        scores.o++;
      }

      saveScores();
      updateScoreboard();

      gameActive = false;
    }
  });

  if(winnerFound) return;

  if(!board.includes("")){
    statusText.textContent = "🤝 It's a Draw!";
    scores.draw++;

    saveScores();
    updateScoreboard();


    gameActive = false;
  }
}

function resetBoard(){
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });

  statusText.textContent = "Player X's Turn";
}

resetBtn.addEventListener("click", resetBoard);

newMatchBtn.addEventListener("click", () => {
  scores = {
    x:0,
    o:0,
    draw:0
  };

  saveScores();
  updateScoreboard();
  resetBoard();
});

function updateScoreboard(){
  xScoreEl.textContent = scores.x;
  oScoreEl.textContent = scores.o;
  drawScoreEl.textContent = scores.draw;
}

function saveScores(){
  localStorage.setItem("scores", JSON.stringify(scores));
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){
    themeToggle.textContent = "☀️ Light Mode";
    localStorage.setItem("theme","dark");
}else{
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme","light");
}
});