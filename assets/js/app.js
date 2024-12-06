'use strict';

import { wordBank } from '../js/data.js';
import { select, listen } from '../js/utils.js';

const dashboard = select('.dashboard');
const timeoutDiv = select('.timeout');
const wordDisplayDiv = select('.word-display');
const counterDiv = select('.counter');
const timeout = select('.timeout p');
const wordDisplay = select('.word-display p');
const counter = select('.counter p');
const inputText = select('.input-text');
const restartBtn = select('.restart-button');
const quitBtn = select('.quit-button');
const instructionBtn = select('#instruction-button');
const instructionWindow = select('#modal-popup'); 
const scoreBtn = select('#score-button');
const scoreWindow = select('#modal-score');
const backgroundVideo = select('.background-video');
const copyright = select('.copyright');
const cyberSound = new Audio('./assets/audio/cyber-sound.wav');
const laserShoot = new Audio('./assets/audio/laser-shot.wav');
const gameOver = new Audio('./assets/audio/game-over.wav');

let stopwatch = 99; 
let score = 0; 
let isGameActive = false; 
let wordList = [...wordBank]; 
let currentWord = ""; 
let gameInterval;    

function getScores() {
    const scores = localStorage.getItem('scores');
    return scores ? JSON.parse(scores) : [];
}

function saveScores(scores) {
    localStorage.setItem('scores', JSON.stringify(scores));
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
        dashboard.classList.remove('transparent-dashboard');
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
        timeoutDiv.classList.remove('hidden');
        wordDisplayDiv.classList.remove('hidden');
        counterDiv.classList.remove('hidden');
        instructionBtn.classList.add('hidden');
        scoreBtn.classList.add('hidden');
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
    dashboard.classList.add('transparent-dashboard');
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
    timeoutDiv.classList.add('hidden');
    wordDisplayDiv.classList.add('hidden');
    counterDiv.classList.add('hidden');
    instructionBtn.classList.remove('hidden');
    scoreBtn.classList.remove('hidden');
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

    const percentage = Math.round((score / wordBank.length) * 100);
    const newScore = { hits: score, percentage: percentage, date: new Date() }; 

    const scores = getScores();
    scores.push(newScore);

    scores.sort((a, b) => b.hits - a.hits);
    if (scores.length > 9) {
        scores.splice(9);
    }

    saveScores(scores); 
    updateScoreboard();  
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
    scoreBtn.classList.add('hidden'); 
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

function openScoreModal() {
    scoreWindow.style.display = 'flex';
}

function closeScoreModal() {
    scoreWindow.style.display = 'none';
}

function updateScoreboard() {
    const scores = getScores().sort((a, b) => b.hits - a.hits).splice(0, 9);
    const scoreList = select('#score-list');
    scoreList.innerHTML = '';

    if (scores.length === 0) {
        scoreList.innerHTML = '<p>No games have been played yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Points</th>
            <th>Percentage</th>
            <th>Date</th>
        </tr>
    `;

    scores.forEach((score, index) => {
        const date = new Date(score.date).toLocaleDateString();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 8px; text-align: center;">${index + 1}</td>
            <td style="padding: 8px; text-align: center;">${score.hits}</td>
            <td style="padding: 8px; text-align: center;">${score.percentage}%</td>
            <td style="padding: 8px; text-align: center;">${date}</td>
        `;
        table.appendChild(row);
    });

    scoreList.appendChild(table);
}

listen('click', restartBtn, restartGame);  
listen('click', inputText, startGame);
listen('click', quitBtn, quitGame);
listen('input', inputText, validateInput); 
listen('input', inputText, checkInput);
listen('click', instructionBtn, openModal);
listen('click', scoreBtn, openScoreModal);
listen('DOMContentLoaded', document, () => { 
    dashboard.classList.add('transparent-dashboard'); 
    quitBtn.classList.add('hidden'); 
    restartBtn.classList.add('hidden'); 
    timeoutDiv.classList.add('hidden');
    wordDisplayDiv.classList.add('hidden');
    counterDiv.classList.add('hidden');
    updateScoreboard();
});
listen('click', instructionWindow, (event) => {
    if (event.target === instructionWindow) {
        closeModal();
    }
});
listen('click', scoreWindow, (event) => {
    if (event.target === scoreWindow) {
        closeScoreModal();
    }
});
listen('keydown', document, (event) => {
    if (event.key === 'Escape') {
        closeModal();
        closeScoreModal();
        if (isGameActive) {
            quitGame();
        }
    }
});