const socket = io();
const view = document.querySelector('#view');
const keyboard = document.querySelector('#keyboard')
const modal = document.querySelector('#modal')
const modalContent = document.querySelector('#modal-content') 
const close = document.querySelector('#close')
const headerReset = document.querySelector('#header-reset')



const keys = [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['ENTER','Z','X','C','V','B','N','M','<-']];
const layers = ['#first', '#second', "#third"]
const squares = [];
const letters = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M']

let numSquares = 30;
let currentBox = 0;
let five = 0;
let winningWord;
let currentLayer = 1;


function range(start, end) {
    const ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function resetGame() {
    five = 0;
    currentBox = 0;
    currentLayer = 1;
    
    socket.emit('newWord', (data) => {
        winningWord = data.word;
    })

    squares.forEach(square => {
        const text = square.firstElementChild;

        text.textContent = ''
        square.style.backgroundColor = "#121213"
        square.style.borderColor = "#3a3a3c"
    })
    modal.style.display = 'none'
    
    

    if (modalContent.children.length != 1) {
        for (let i = 0; i < 3; i++){
            modalContent.removeChild(modalContent.lastElementChild)
        }
    }

    const keyLayers = keyboard.children;

    for (let x = 0; x < keyLayers.length; x++) {
        const keys = keyLayers[x].children

        for (let i = 0; i < keys.length; i++) {
            keys[i].style.backgroundColor = '#818384'
        }
    }

     
}

function modalEnd(state) {
    const header = document.createElement('h1');
    const sub = document.createElement('p');
    const resetButton = document.createElement('button')

    header.textContent = state;
    sub.textContent = `The word was ${winningWord}`;

    resetButton.setAttribute('type', 'button')
    resetButton.classList.add('reset')
    resetButton.textContent = 'Reset'
    resetButton.id = 'reset'

    resetButton.addEventListener('click', resetGame)

            
    modalContent.appendChild(header);
    modalContent.appendChild(sub);
    modalContent.appendChild(resetButton)
    modal.style.display = "block";
}

function enter() {
    if (five === 5) {
        const letters = squares.slice(currentBox - 5, currentBox)
        let word = '';

        letters.forEach(letter => {
            word += letter.textContent
        })

        word = word.toLowerCase();

        const winningWordLetters = winningWord.split('')
    
        if (word == winningWord) {

            letters.forEach(letter => {
                letter.style.backgroundColor = "#538d4e";
                letter.style.borderColor = "#538d4e";
            })
            
            modalEnd('You Won')
        }
        else {
            for (let i = 0; i < word.length; i++) {
                const key = keyboard.querySelector(`#${letters[i].textContent}`)
                if (word[i] === winningWord[i]) {
                    letters[i].classList.add('flip');
                    letters[i].style.backgroundColor = "#538d4e";
                    letters[i].style.borderColor = "#538d4e";
                    key.style.backgroundColor = "#538d4e";
                }
                else if (winningWordLetters.indexOf(word[i]) in winningWordLetters) {
                    letters[i].classList.add('flip');
                    letters[i].style.backgroundColor = "#b59f3b";
                    letters[i].style.borderColor = "#b59f3b";
                    if (key.style.backgroundColor != "rgb(83, 141, 78)"){
                        key.style.backgroundColor = "#b59f3b";
                    }
                    
                }
                else {
                    letters[i].classList.add('flip');
                    letters[i].style.backgroundColor = "#3a3a3c";
                    letters[i].style.borderColor = "#3a3a3c";
                    if (key.style.backgroundColor != "rgb(83, 141, 78)"){
                        key.style.backgroundColor = "#3a3a3c";
                    }
                }
            }
        }
        currentLayer += 1;
        five = 0;

        if (currentLayer === 7) {
            modalEnd('You Lost')
        }
    }
}

function backspace() {
    const ids = range((currentLayer * 5) - 5, (currentLayer * 5) - 1)


    if (ids.indexOf(currentBox) in ids && currentBox !== (currentLayer * 5) - 5 || currentBox == currentLayer * 5) {
        currentBox -= 1;
        five -= 1;
    }
    

    if (currentBox < 0) {
        currentBox = 0;
    }
                    
    if (five < 0) {
        five = 0;
    }
    

    
    

    const square = squares[currentBox]
    const text = square.querySelector('.square-text')

    let id = parseInt(square.id)

    const index = ids.indexOf(id)

    if (index in ids) {
        square.classList.remove('typed');
        square.style.border = '2px solid #3a3a3c'
        text.textContent = '';
    }
}


for (let i = 0; i < numSquares; i++) {
    const square = document.createElement('div');
    const text = document.createElement('div')


    square.classList.add('square');
    square.id = `${i}`

    text.classList.add('square-text')

    square.appendChild(text)

    view.appendChild(square);

    squares.push(square);
}


for (let i = 0; i < keys.length; i++) {
    const layer = document.querySelector(layers[i])

    keys[i].forEach(letter => {
        const key = document.createElement('button');

        if (letter === "ENTER" || letter === "<-") {
            if (letter === "ENTER") {
                key.addEventListener('click', enter)
            }
            else {  
                key.addEventListener('click', () => {
                    backspace()
                })
            }
        }
        else {
            key.addEventListener('click', () => {
                const square = squares[currentBox];
                const text = square.querySelector('.square-text');

                if (five < 5) {
                    square.style.border = '2px solid #818384';
                    square.classList.add('typed')
                    text.textContent = letter
                    currentBox++;
                    five += 1;
                }
            })
        }

        

        key.classList.add('key');
        key.textContent = letter;
        key.id = letter
        layer.appendChild(key);

    })
}

document.addEventListener('keydown', (event) => {
    if (event.key == 'Backspace') {
        backspace()
    }
    else if (event.key == "Enter") {
        enter()
    }
    else if (letters.indexOf(event.key.toUpperCase()) in letters ) {
        const square = squares[currentBox];

        const text = square.querySelector('.square-text');
                 
        if (five < 5) {
            square.style.border = '2px solid #818384';
            square.classList.add('typed')

            text.textContent = event.key.toUpperCase();
            currentBox++;
            five += 1;
        }
    }
})


close.addEventListener('click', () => {
    modal.style.display = "none"
})

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

headerReset.addEventListener('click', resetGame)


socket.on('word', (data) => {
    winningWord = data.word;
})