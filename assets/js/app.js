'use strict';

const timeout = select('.timeout p');
const wordDisplay = select('.word-display p');
const counter = select('.counter p');
const inputText = select('.input-text');
const restartBtn = select('.restart-button');
const instructionBtn = select('#instruction-button');
const instructionWindow = select('#modal-popup'); 
const backgroundVideo = document.getElementById('background-video');
const cyberSound = new Audio('./assets/audio/cyber-sound.wav');
const laserShoot = new Audio('./assets/audio/laser-shot.wav');
const gameOver = new Audio('./assets/audio/game-over.wav');
const scores = [];
const wordBank = [ 
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money', 
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone', 
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 
    'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze', 
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake', 
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer', 
    'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown', 
    'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird', 
    'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework', 
    'beach', 'economy', 'interview', 'awesome', 'challenge', 'science', 
    'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software', 
    'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep', 
    'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary', 
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion', 
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 
    'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media', 
    'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond', 
    'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon', 
    'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust', 
    'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony', 
    'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision', 
    'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet', 
    'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo', 
    'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure', 
    'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle', 
    'film', 'jupiter' 
];  

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

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function updateTimer() {
    timeout.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${stopwatch}s`;
}

function showRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
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
        restartBtn.classList.remove('hidden');
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

function restartGame() {
    isGameActive = false;
    inputText.disabled = false; 
    inputText.value = "";
    inputText.placeholder = "click to start!";
    wordDisplay.innerText = "";
    timeout.innerHTML = `<i class="fa-solid fa-stopwatch"></i> 00:00`;
    counter.innerText = "0 Points";
    cyberSound.pause();
    cyberSound.currentTime = 0;
    backgroundVideo.style.opacity = 0;
    restartBtn.classList.add('hidden');
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

function checkInput() {
    if (inputText.value === currentWord && isGameActive) {
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

listen('click', inputText, startGame); 
listen('click', restartBtn, restartGame);
listen('input', inputText, checkInput);
listen('click', instructionBtn, openModal);
listen('click', instructionWindow, (event) => {
    if (event.target === instructionWindow) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => { restartBtn.classList.add('hidden'); });

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
    if (event.key === 'Escape' && isGameActive) {
        restartGame();
    }
});
