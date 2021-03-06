var userClickedPattern = []
const buttonColors = ["red", "green", "blue", "yellow"]
var gamePattern = []
var level = 0
var gameStarted = false
var currentlyCheckingArrayPosition = 0
disableButtons()

async function reset() {
    $('#level-title').html("Previous Highscore: " + level + "\nPress Any Key to Restart")
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
    level += 1
    $('#level-title').text('Level ' + level)
    currentlyCheckingArrayPosition = 0;

    await playSequence()

}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

async function playSequence() {
    disableButtons()
    for (let color of gamePattern) {
        await sleep(700)
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
    await pressed(userChosenColor)
    await playSound(userChosenColor)
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
        enablePlayButton();
        await reset();
    }
})

$(document).on('keypress', async function () {
    if (!gameStarted) {
        nextSequence()
        gameStarted = true
        enableButtons()
        disablePlayButton()
    }
})

$('#playButton').on('click', async function () {
    if (!gameStarted) {
        nextSequence()
        gameStarted = true
        enableButtons()
        disablePlayButton()
    }
})

function enableButtons() {
    $("div[type='button']").removeClass('disabled')
}

function disableButtons() {
    $("div[type='button']").addClass('disabled')
}

function disablePlayButton() {
    $('#playButton').addClass('disabled ui-disabled')
}

function enablePlayButton() {
    $('#playButton').removeClass('disabled ui-disabled')
}