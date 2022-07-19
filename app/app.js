const socket = io();


const view = document.querySelector('#view');
const keyboard = document.querySelector('#keyboard')

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
            console.log("Won")

            letters.forEach(letter => {
                letter.style.backgroundColor = "#538d4e"
                letter.style.borderColor = "#538d4e"
            })
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

        if (currentLayer === 6) {
            console.log("You Lost", winningWord)
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


socket.on('word', (data) => {
    winningWord = data.word;
})