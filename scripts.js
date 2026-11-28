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

    let roundsToWin = Math.round(roundsAmm / 2)

    const [setUserScore, setComputerScore, pickSignContainer] = renderRoundPage(gameContainerElement, roundsAmm)

    const onRoundFinished = () => {
        if (userCount >= roundsToWin || computerCount >= roundsToWin) {
            onGameFinished(userCount, computerCount)
            return;
        }

        renderSignPick(pickSignContainer, onSignpicked)
    }

    const onSignpicked = (sign) => {
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

        renderRoundResult(pickSignContainer, sign, computerChoice, msg, onRoundFinished)
    }

    renderSignPick(pickSignContainer, onSignpicked)
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


    const pickSignContainer = document.createElement("div")
    gameContainerElement.appendChild(pickSignContainer)


    return [setUserScore, setComputerScore, pickSignContainer]
}

function renderRoundResult(gameContainer, userpick, computerpick, msg, onContinueSubmit) {
    gameContainer.replaceChildren();

    const groupContainer = document.createElement('div')

    
    const messageContainer = document.createElement("h3")
    messageContainer.innerText = msg
    groupContainer.appendChild(messageContainer)


    const results = [
        {
            actor: 'user',
            pick: userpick
        },
        {
            actor: 'computer',
            pick: computerpick
        }
    ]

    const picksContainer = document.createElement("div");
    picksContainer.id = 'round-result-picks-container'


    results.forEach(result => {
        const actorChoiceCardContainer = document.createElement("div")
        actorChoiceCardContainer.id = 'actor-choice-card-container'

        const actorChoiceContainer = document.createElement("div")
        actorChoiceContainer.innerText = result.pick
        actorChoiceContainer.classList.add('sign-display')
        actorChoiceCardContainer.appendChild(actorChoiceContainer)

        const actorNameContainer = document.createElement("div")
        actorNameContainer.innerText = result.actor
        actorChoiceCardContainer.appendChild(actorNameContainer)

        picksContainer.appendChild(actorChoiceCardContainer)
    })

    groupContainer.appendChild(picksContainer)


    const btn = document.createElement('button')
    btn.textContent = 'Continue';
    btn.classList.add('default');
    groupContainer.appendChild(btn)

    const tapToContinueMsg = document.createElement('div')
    tapToContinueMsg.textContent = 'or just tap to continue';
    tapToContinueMsg.classList.add('tap-to-continue-msg')
    groupContainer.appendChild(tapToContinueMsg)


    groupContainer.addEventListener('click', () => onContinueSubmit())

    gameContainer.appendChild(groupContainer)
}



function renderSignPick(signpickContainer, onSignpicked) {
    signpickContainer.replaceChildren();
    
    const pickSignLabel = document.createElement("h3")
    pickSignLabel.innerText = "Pick your sign"
    signpickContainer.appendChild(pickSignLabel)
    
    
    const btnsContainer = document.createElement("div")
    btnsContainer.classList = ['sign-pick-container']
    options.forEach(option => {
        const btn = document.createElement('button')
        btn.textContent = option;
        btn.addEventListener('click', () => onSignpicked(option))
        btn.classList.add('sign-display')
        btnsContainer.appendChild(btn)
    })

    signpickContainer.appendChild(btnsContainer)
}

const validateRundsCount = (roundsCount) => {
    if (roundsCount <= 2) {
        return { isSuccess: false, msg: "Rounds count must be bigger than 2" };
    }

    if (roundsCount % 2 !== 1) {
        return { isSuccess: false, msg: "Rounds count must be odd" };
    }

    return { isSuccess: true }
}

function renderRoundAmountpickDialog(gameContainerElement, onRoundAmmpicked) {
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

        onRoundAmmpicked(roundsCount)
    })

    countInputContainer.appendChild(roundsAmmSubmitButton)

    const roundCountInputLabel = document.createElement('div')
    roundCountInputLabel.innerText = "How many rounds will we play?"
    gameContainerElement.appendChild(roundCountInputLabel)
}

//------------------------------------ game core
const renderGameResults = (gameContainerElement, userCount, computerCount, onResultAccepted) => {
    gameContainerElement.replaceChildren();

    const groupContainer = document.createElement('div')

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


    groupContainer.appendChild(countsContainer)

    const finishMessageContainer = document.createElement("h3")
    const userWin = userCount > computerCount

    finishMessageContainer.innerText = userWin ? "You win" : "You lose";
    groupContainer.appendChild(finishMessageContainer)

    const imageContainer = document.createElement('div')
    imageContainer.id = 'image-container';
    const image = document.createElement('img')
    image.src = `images/${Math.round(1 + 3 * Math.random())}.png`
    imageContainer.appendChild(image)
    groupContainer.appendChild(imageContainer)

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Ok!'
    submitButton.classList.add('default')
    groupContainer.addEventListener("click", onResultAccepted)
    groupContainer.appendChild(submitButton)

        const tapToContinueMsg = document.createElement('div')
    tapToContinueMsg.textContent = 'or just tap to continue';
    tapToContinueMsg.classList.add('tap-to-continue-msg')
    groupContainer.appendChild(tapToContinueMsg)


    gameContainerElement.appendChild(groupContainer)
}


function startGame() {
    const gameContainerElement = document.querySelector("#container");

    renderRoundAmountpickDialog(gameContainerElement, (roundsAmm) => {
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