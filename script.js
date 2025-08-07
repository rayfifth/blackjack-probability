const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];//helps set up deck
let deck = [];
let images = [];     
let aces = 0;
let dealerAces = 0;
let playerVal = 0;
let dealerVal = 0;
let waitFinish = 0;
let totalScore = 0;
let firstDace = 0;

let simDace = 0;
let simPace = 0; //avoid compiler error
let bestHit= 0;


if (localStorage.getItem("totalScore") != null){ //saves score when game refreshes
  totalScore = parseInt(localStorage.getItem("totalScore"));
}


for (let suit of suits){  //creates deck
  for (let value of values){
    deck.push(value + "_of_" + suit);
  }
}

for (let i = deck.length - 1; i > 0; i--) {  //shuffles deck
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

for (let card of deck){   //creates array of images that mimics deck
  let cardImage = document.createElement('img');
  cardImage.src = 'images/back.png'; //sets initial image of the back of the card so I can flip it later
  cardImage.dataset.front = ('images/' + card + '.png');
  cardImage.style.width = '21vh';
  cardImage.style.height = '30vh'; //sets size of card depending on screen making everything in my project dependent on screen size was scrapped later
  document.getElementById('deck').appendChild(cardImage); //adds the card facing back on the screen
  images.push(cardImage); //adds the card to the array of images so I can change the image later
}

let DCard = images.pop(); // this whole code basically just dealts the first 2 cards to the dealer and player
let facedown = images.pop();
DCard.src = DCard.dataset.front;
document.getElementById("dealer").appendChild(DCard);
document.getElementById("dealer").appendChild(facedown);
DCardVal = scoring(deck.pop().split('_')[0], "dealer")
dealerVal += DCardVal;
dealerVal += scoring(deck.pop().split('_')[0], "dealer");
document.getElementById("deck").addEventListener("click", hit );
hit();
hit();
console.log("dealer" + dealerVal + "player" + playerVal);
function delay(ms) { //gpted it helps the dealers card to not flip all at once
  return new Promise(resolve => setTimeout(resolve, ms));
}
function scoring(val, user){ //this code is reused in other parts of the code to score the cards easier
  if (val === 'jack' || val === 'queen' || val === 'king'){
    val = 10;
  }
  else if (val === 'ace'){
    val = 11;
    if (user === 'dealer'){
      dealerAces ++;
      firstDace = 1;
    }
    else if (user === 'player'){
      aces ++;
    }
    else if (user === 'simDealer'){ //ignore now this is for the simulation to calculate probability
      simDace ++;
    }
    else if (user === 'simPlayer'){
      simPace ++;
    }
  }
  else {
    val = parseInt(val);
  }
  return val;
}

function hit () {
  if (playerVal >= 21){
    return;
  }
  let card = images.pop();
  document.getElementById("player").appendChild(card);
  card.classList.add('flip'); //makes the card flip over
  setTimeout(() => { //makes the card flip over after 500ms
    card.src = card.dataset.front;
  }, 500)  
  playerVal += scoring(deck.pop().split('_')[0], "player"); //easier way to score the cards
  if (playerVal > 21 && aces > 0){ //checks if player busts and if they have an ace to turn into a 1
    playerVal -= 10;
    aces --;
  }
  else if (playerVal > 21){
    lose();
  }
  else if (playerVal === 21){
    stand();
  }
  document.getElementById('win%').innerHTML = 'win % ' + probWin(0).toFixed(2) + ' <br>hits ~ ' + bestHit; //displays probability of winning and how many hits to get there using simulation

}
async function stand (){ //makes the dealer flip over their card and hit until they have 17 or more
  document.getElementById("deck").
  removeEventListener("click", hit);
  facedown.classList.add('flip');
  await delay(500);
  facedown.src = facedown.dataset.front;
  while (dealerVal < 17){
    waitFinish += 1000;
    let card = images.pop();
    document.getElementById("dealer").appendChild(card);
    card.classList.add('flip');
    await delay(500); 
    card.src = card.dataset.front;   
    dealerVal += scoring(deck.pop().split('_')[0], "dealer");
    if (dealerVal > 21 && dealerAces > 0){
      dealerVal -= 10;
      dealerAces --;
    }
  }
  if (dealerVal > 21){ //checks if dealer/player wins
    win();
  }
  else if (dealerVal > playerVal){
    lose();
  }
  else if (dealerVal == playerVal){
    push();
  }  
  else {
    win();
  }
}


function win (){ //this code waits till a specific time to show the end screen so the dealer can finish flipping over their cards and adds score  also it saves the score in local storage so when you restart it is still saved
  setTimeout(() => { 
    totalScore += 50;
    localStorage.setItem("totalScore", totalScore);
    showEndScreen("Game Won", "#4CAF50");
  }, waitFinish); 
}

function push(){ //same as win but changes the end screen to tie
  setTimeout(() => { 
    localStorage.setItem("totalScore", totalScore);
    showEndScreen("Tie", "#B0BEC5");
  }, waitFinish); 
}

function lose (){ //same as win but changes the end screen to lose and subtracts score
  setTimeout(() => { 
    totalScore -= 50;
    if (totalScore < 0){
      totalScore = 0;
    }
    localStorage.setItem("totalScore", totalScore);
    showEndScreen("Game Over", "#ff4444");
  }, waitFinish);
}

function showEndScreen(title, color) { //used help with gpt to make the end screen look nice and funtional
  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="overlay">
      <div class="end-screen">
        <h1 style="color: ${color}">${title}</h1>
        <p>Total score: ${totalScore}</p>
        <button class="button" onclick="retry()">Retry</button>
      </div>
    </div>
  `;
  popup.style.display = "block";
}

function retry (){  //button to retry the game
  localStorage.setItem("totalScore", totalScore);
  window.location.href = "index.html";
}

function simulateGame(playerPickUp){ //runs a bunch of simulations and calculres the probability of winning given how much cards are picked up.  Works because dealer pick up cards until they have 17 or more.
  let simWins = 0;
  for (let i = 0; i < 10000; i++){
    let simDeck = deck.slice();
    let simPV = playerVal;
    let simDV = DCardVal;
    let simPace = aces;
    let simDace = firstDace;

    for (let i = simDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [simDeck[i], simDeck[j]] = [simDeck[j], simDeck[i]];
    }
    for (let l = 0; l < playerPickUp; l++){
      simPV += scoring(simDeck.pop().split('_')[0], "simPlayer");
      if (simPV > 21 && simPace > 0){
        simPV -= 10;
        simPace --;
      }
    }
    while (simDV < 17){
      simDV += scoring(simDeck.pop().split('_')[0], "simDealer");
      if (simDV > 21 && simDace > 0){
        simDV -= 10;
        simDace --;
      }
    }
    if (simPV > 21){
    }
    else if (simDV > 21){
      simWins ++;
    }
    else if (simPV > simDV){
      simWins ++;
    }
  }
  return 100.0 * simWins / 10000;
}

function probWin(playerPickUp){ //recursively calls simulateGame to find the best amount of cards to pick up and the probability of winning with that amount of cards picked up
  if (simulateGame(playerPickUp+1) > simulateGame(playerPickUp)){ //increases pick up until the probability of winning decreases
    return probWin(playerPickUp+1);
  }
  else{
    bestHit = playerPickUp;
    return simulateGame(playerPickUp); //returns the probability of winning with the best amount of cards picked up
  }
}