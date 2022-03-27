var userClickedPattern = []
const buttonColors = ["red", "green", "blue", "yellow"]
var gamePattern = []
var level = 0
var gameStarted = false
var currentlyCheckingArrayPosition = 0
disableButtons()

async function reset() {
    $('#level-title').html("Game Over, Press Any Key to Restart")
    userClickedPattern = []
    gamePattern = []
    level = 0
    gameStarted = false
    currentlyCheckingArrayPosition = 0
}

async function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4)
    var randomChosenColor = buttonColors[randomNumber]
    gamePattern.push(randomChosenColor)

    await playSequence()

    $('#level-title').text('Level ' + level)
    level += 1
    currentlyCheckingArrayPosition = 0;
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

async function playSequence() {
    disableButtons()
    for (let color of gamePattern) {
        await sleep(1000)
        blink(color)
        playSound(color)
        // const finished = await blink(color);
    }
    enableButtons()
}

async function playSound(color) {
    var audio = new Audio(`sounds/${color}.mp3`)
    audio.play()
}

async function blink(color) {
    $("#" + color).fadeOut(100).fadeIn(100).fadeIn(100);
    playSound(color)
}

async function pressed(color) {
    $("#" + color).addClass("pressed")
    setTimeout(function () {
        $("#" + color).removeClass('pressed');
    }, 100);

}

// button on click
$("div[type='button']").click(async function (event) {
    var userChosenColor = event.target.id
    pressed(userChosenColor)
    playSound(userChosenColor)
    userClickedPattern.push(userChosenColor)
    if (gamePattern[currentlyCheckingArrayPosition] == userChosenColor) {
        currentlyCheckingArrayPosition++;
        if (currentlyCheckingArrayPosition == gamePattern.length) {
            nextSequence()
        }
    } else {
        playSound('wrong');
        $('body').addClass('game-over')
        setTimeout(function () { $('body').removeClass('game-over') }, 200)
        disableButtons();
        await reset();
    }
})

$(document).on('keypress', async function () {
    if (!gameStarted) {
        nextSequence()
        gameStarted = true
        enableButtons()
    }
})

function enableButtons() {
    $("div[type='button']").removeClass('disabled')
}

function disableButtons() {
    $("div[type='button']").addClass('disabled')
}