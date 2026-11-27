console.log("first");

const scissors = "\u270C\uFE0F"
const paper = "\u270B"
const rock = "\u270A"
const options = [rock, paper, scissors]


const getComputerChoice = () => {
    var index = Math.floor(Math.random() * options.length);
    return options[index];
}

const getWinner = (user1Choice, user2Choice) => {
    if (user1Choice === user2Choice) {
        return -1
    }

    switch (user1Choice) {
        case rock:
            switch (user2Choice) {
                case scissors:
                    return 0;
                case paper:
                    return 1;
                default:
                    throw Error("Invalid game state")
            }
        case scissors:
            switch (user2Choice) {
                case paper:
                    return 0;
                case rock:
                    return 1;
                default:
                    throw Error("Invalid game state")
            }
        case paper:
            switch (user2Choice) {
                case scissors:
                    return 1;
                case rock:
                    return 0;
                default:
                    throw Error("Invalid game state")
            }
        default:
            throw Error("Invalid game state")
    }
}


function renderRoundsPage(gameContainerElement, roundsAmm, onGameFinished) {
    console.log("Round page render triggered");

    let userCount = 0;
    let computerCount = 0;

    const [setUserScore, setComputerScore, peekSignContainer] = renderRoundPage(gameContainerElement, roundsAmm)

    const onRoundFinished = () => {
        if (userCount + computerCount >= roundsAmm) {
            onGameFinished(userCount, computerCount)
            return;
        }

        renderSignPick(peekSignContainer, onSignPeeked)
    }

    const onSignPeeked = (sign) => {
        const computerChoice = getComputerChoice();
        const result = getWinner(sign, computerChoice)
        let msg = "";
        switch (result) {
            case -1:
                msg = "Draw"
                break;
            case 0:
                msg = "User win"
                userCount++;
                setUserScore(userCount)
                break;
            case 1:
                msg = "User lost";
                computerCount++;
                setComputerScore(computerCount);
                break;
            default:
                throw Error("Invalid game state");
        }

        renderRoundResult(peekSignContainer, sign, computerChoice, msg, onRoundFinished)
    }

    renderSignPick(peekSignContainer, onSignPeeked)
}


function renderRoundPage(gameContainerElement, roundsAmm) {
    gameContainerElement.replaceChildren();

    const countsContainer = document.createElement("div")
    countsContainer.id = "counts-container"

    const userScoreContainer = document.createElement("div")
    userScoreContainer.innerText = 0;

    const setUserScore = (userScore) => {
        userScoreContainer.innerText = userScore;
    }

    countsContainer.appendChild(userScoreContainer)

    
    
    const countSeparator = document.createElement("div")
    countSeparator.innerText = '-';

    countsContainer.appendChild(countSeparator)

    
    
    const computerScoreContainer = document.createElement("div")
    computerScoreContainer.innerText = 0

    const setComputerScore = (computerScore) => {
        computerScoreContainer.innerText = computerScore;
    }

    countsContainer.appendChild(computerScoreContainer)


    gameContainerElement.appendChild(countsContainer)

    const roundsAmmContainer = document.createElement("div")
    roundsAmmContainer.innerText = `We play ${roundsAmm} rounds.`
    roundsAmmContainer.id = "rounds-amm-container"
    gameContainerElement.appendChild(roundsAmmContainer)


    const peekSignContainer = document.createElement("div")
    gameContainerElement.appendChild(peekSignContainer)


    return [setUserScore, setComputerScore, peekSignContainer]
}

function renderRoundResult(gameContainer, userPeek, computerPeek, msg, onContinueSubmit) {
    gameContainer.replaceChildren();

    
    const messageContainer = document.createElement("h3")
    messageContainer.innerText = msg
    gameContainer.appendChild(messageContainer)


    const results = [
        {
            actor: 'user',
            peek: userPeek
        },
        {
            actor: 'computer',
            peek: computerPeek
        }
    ]

    const peeksContainer = document.createElement("div");
    peeksContainer.id = 'round-result-peeks-container'


    results.forEach(result => {
        const actorChoiceCardContainer = document.createElement("div")
        actorChoiceCardContainer.id = 'actor-choice-card-container'

        const actorChoiceContainer = document.createElement("div")
        actorChoiceContainer.innerText = result.peek
        actorChoiceContainer.classList.add('sign-display')
        actorChoiceCardContainer.appendChild(actorChoiceContainer)

        const actorNameContainer = document.createElement("div")
        actorNameContainer.innerText = result.actor
        actorChoiceCardContainer.appendChild(actorNameContainer)

        peeksContainer.appendChild(actorChoiceCardContainer)
    })

    gameContainer.appendChild(peeksContainer)

    const btn = document.createElement('button')
    btn.textContent = 'Continue';
    btn.classList.add('default')
    btn.addEventListener('click', () => onContinueSubmit())
    gameContainer.appendChild(btn)
}



function renderSignPick(signPeekContainer, onSignPeeked) {
    signPeekContainer.replaceChildren();
    
    const peekSignLabel = document.createElement("h3")
    peekSignLabel.innerText = "Peek your sign"
    signPeekContainer.appendChild(peekSignLabel)
    
    
    const btnsContainer = document.createElement("div")
    btnsContainer.classList = ['sign-peek-container']
    options.forEach(option => {
        const btn = document.createElement('button')
        btn.textContent = option;
        btn.addEventListener('click', () => onSignPeeked(option))
        btn.classList.add('sign-display')
        btnsContainer.appendChild(btn)
    })

    signPeekContainer.appendChild(btnsContainer)
}

const validateRundsCount = (roundsCount) => {
    if (roundsCount <= 0) {
        return { isSuccess: false, msg: "Rounds count must be bigger than 0" };
    }

    if (roundsCount % 3 !== 0) {
        return { isSuccess: false, msg: "Rounds count must be devidable by 3" };
    }

    return { isSuccess: true }
}

function renderRoundAmountPeekDialog(gameContainerElement, onRoundAmmPeeked) {
    gameContainerElement.replaceChildren();
    console.log("first page render triggered");

    const countInputContainer = document.createElement('div')
    countInputContainer.id = 'count-input-container'
    gameContainerElement.appendChild(countInputContainer);
    
    
    const roundCountInput = document.createElement('input')
    roundCountInput.type = "number"
    roundCountInput.placeholder = "a number divisible by 3"
    roundCountInput.id = 'round-count-input'
    roundCountInput.value = 3
    countInputContainer.appendChild(roundCountInput)


    const roundsAmmSubmitButton = document.createElement('button')
    roundsAmmSubmitButton.id = "rounds-amm-submit-button"
    roundsAmmSubmitButton.textContent = 'Submit'
    roundsAmmSubmitButton.addEventListener("click", () => {
        const roundsCount = Number(roundCountInput.value)
        if (isNaN(roundsCount)) {
            throw "roundsCount isNaN"
        }

        const roundsValidationResult = validateRundsCount(roundsCount)
        if (!roundsValidationResult.isSuccess) {
            alert(roundsValidationResult.msg)
            return;
        }

        onRoundAmmPeeked(roundsCount)
    })

    countInputContainer.appendChild(roundsAmmSubmitButton)

    const roundCountInputLabel = document.createElement('div')
    roundCountInputLabel.innerText = "How many rounds will we play?"
    gameContainerElement.appendChild(roundCountInputLabel)
}

//------------------------------------ game core
const renderGameResults = (gameContainerElement, userCount, computerCount, onResultAccepted) => {
    gameContainerElement.replaceChildren();

    const countsContainer = document.createElement("div")
    countsContainer.id = "counts-container"

    const userScoreContainer = document.createElement("div")
    userScoreContainer.innerText = userCount;

    countsContainer.appendChild(userScoreContainer)
    
    const countSeparator = document.createElement("div")
    countSeparator.innerText = '-';

    countsContainer.appendChild(countSeparator)

    const computerScoreContainer = document.createElement("div")
    computerScoreContainer.innerText = computerCount

    countsContainer.appendChild(computerScoreContainer)


    gameContainerElement.appendChild(countsContainer)

    const finishMessageContainer = document.createElement("h3")
    const userWin = userCount > computerCount

    finishMessageContainer.innerText = userWin ? "You win" : "You lose";
    gameContainerElement.appendChild(finishMessageContainer)

    const imageContainer = document.createElement('div')
    imageContainer.id = 'image-container';
    const image = document.createElement('img')
    image.src = `images/${Math.round(1 + 3 * Math.random())}.png`
    imageContainer.appendChild(image)
    gameContainerElement.appendChild(imageContainer)

    
    const submitButton = document.createElement('button')
    submitButton.textContent = 'Ok!'
    submitButton.classList.add('default')
    submitButton.addEventListener("click", onResultAccepted)
    gameContainerElement.appendChild(submitButton)
}


function startGame() {
    const gameContainerElement = document.querySelector("#container");

    renderRoundAmountPeekDialog(gameContainerElement, (roundsAmm) => {
        const roundsValidationResult = validateRundsCount(roundsAmm)
        if (!roundsValidationResult.isSuccess) {
            throw roundsValidationResult.msg
        }

        renderRoundsPage(
            gameContainerElement,
            roundsAmm,
            (userCount, computerCount) =>
                renderGameResults(gameContainerElement, userCount, computerCount, startGame));
    })
}

startGame();