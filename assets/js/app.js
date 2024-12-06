'use strict';

import { wordBank } from './data.js';
import { select, listen } from './utils.js';

const timeout = select('.timeout p');
const wordDisplay = select('.word-display p');
const counter = select('.counter p');
const inputText = select('.input-text');
const restartBtn = select('.restart-button');
const quitBtn = select('.quit-button');
const instructionBtn = select('#instruction-button');
const instructionWindow = select('#modal-popup'); 
const backgroundVideo = select('.background-video');
const copyright = select('.copyright');
const cyberSound = new Audio('./assets/audio/cyber-sound.wav');
const laserShoot = new Audio('./assets/audio/laser-shot.wav');
const gameOver = new Audio('./assets/audio/game-over.wav');
const scores = [];

let stopwatch = 99; 
let score = 0; 
let isGameActive = false; 
let wordList = [...wordBank]; 
let currentWord = ""; 
let gameInterval;    

class Score {
    #date;
    #points;
    #percentage;

    constructor(points, percentage) {
        this.#date = new Date();
        this.#points = points;
        this.#percentage = percentage;
    }

    date() {
        return this.#date;
    }

    points() {
        return this.#points;
    }

    percentage() {
        return this.#percentage;
    }
}

function validateInput(event) {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');  
    if (value !== sanitizedValue) {
        event.target.value = sanitizedValue; 
    }
}

function updateTimer() {
    timeout.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${stopwatch}s`;
}

function showRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    currentWord = wordList[randomIndex];
    wordDisplay.innerText = currentWord;
}

function startGame() {
    if (!isGameActive) {
        isGameActive = true;
        score = 0;
        stopwatch = 99;
        wordList = [...wordBank];
        inputText.value = "";
        inputText.placeholder = "";
        inputText.disabled = false;
        inputText.focus();
        updateTimer();
        showRandomWord();
        cyberSound.play();
        cyberSound.loop = true;
        backgroundVideo.style.opacity = 1; 
        backgroundVideo.play();
        quitBtn.classList.remove('hidden');
        restartBtn.classList.remove('hidden');
        instructionBtn.classList.add('hidden');
        copyright.classList.add('hidden');
        gameInterval = setInterval(() => {
            if (stopwatch > 0 && isGameActive) {
                stopwatch--;
                updateTimer();
            } else {
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);
    }    
}

function quitGame() {
    isGameActive = false;
    inputText.disabled = false; 
    inputText.value = "";
    inputText.placeholder = "click to start!";
    wordDisplay.innerText = "";
    timeout.innerHTML = `<i class="fa-solid fa-stopwatch"></i>`;
    counter.innerText = "0 Points";
    cyberSound.pause();
    cyberSound.currentTime = 0;
    backgroundVideo.style.opacity = 0;
    quitBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    instructionBtn.classList.remove('hidden');
    copyright.classList.remove('hidden');
    clearInterval(gameInterval);
}

function endGame() {
    isGameActive = false;
    inputText.disabled = true;
    inputText.value = "";
    inputText.placeholder = "game over";
    cyberSound.pause();
    gameOver.play();
    backgroundVideo.style.opacity = 0; 

    const percentage = (score / wordBank.length) * 100;
    const newScore = new Score(score, percentage.toFixed(2)); 
    scores.push(newScore);
}

function restartGame() {
    if (isGameActive) {
        clearInterval(gameInterval); 
    }

    isGameActive = true; 
    score = 0;
    stopwatch = 99;
    wordList = [...wordBank]; 
    inputText.value = "";
    inputText.placeholder = "";
    inputText.disabled = false;
    inputText.focus();  
    updateTimer(); 
    showRandomWord();    
    counter.innerText = "0 Points"; 
    cyberSound.play(); 
    cyberSound.loop = true; 
    backgroundVideo.style.opacity = 1; 
    backgroundVideo.play();
    restartBtn.classList.remove('hidden'); 
    instructionBtn.classList.add('hidden'); 
    copyright.classList.add('hidden'); 

    gameInterval = setInterval(() => {
        if (stopwatch > 0 && isGameActive) {
            stopwatch--;
            updateTimer();
        } else {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
}

function checkInput() {
    const inputValue = inputText.value.toLowerCase();  
    const currentWordLowerCase = currentWord.toLowerCase(); 
    if (inputValue === currentWordLowerCase && isGameActive) {
        score++;
        counter.innerText = `${score} Points`;
        wordList = wordList.filter(word => word !== currentWord);
        inputText.value = "";
        laserShoot.play();
        if (wordList.length === 0) {
            endGame();
        } else {
            showRandomWord();
        }
    }
}

function openModal() { 
    instructionWindow.style.display = 'flex'; 
} 

function closeModal() { 
    instructionWindow.style.display = 'none'; 
}

listen('click', restartBtn, restartGame);  
listen('click', inputText, startGame);
listen('click', quitBtn, quitGame);
listen('input', inputText, validateInput); 
listen('input', inputText, checkInput);
listen('click', instructionBtn, openModal);
listen('DOMContentLoaded', document, () => { quitBtn.classList.add('hidden'); }); 
listen('DOMContentLoaded', document, () => { restartBtn.classList.add('hidden'); });
listen('click', instructionWindow, (event) => {
    if (event.target === instructionWindow) {
        closeModal();
    }
});

listen('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
    if (event.key === 'Escape' && isGameActive) {
        quitGame();
    }
});
