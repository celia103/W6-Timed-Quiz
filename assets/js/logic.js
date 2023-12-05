// Dom Elements
let questionsEl = document.querySelector("#questions");
let timerEl = document.querySelector("#timer");
let choicesEl = document.querySelector("#choices");
let submitBtn = document.querySelector("#submit");
let startBtn = document.querySelector("#start");
let nameEl = document.querySelector("#initials");
let feedbackEl = document.querySelector("#feedback");
let endScreenEl = document.getElementById("#end-screen");
let finalScoreEl = document.querySelector("#final-score");

// Quiz state
let currentQuestionIndex = 0;
let time = questions.length * 10;
let timerId;

// Start quiz
function quizStart() {
	timerId = setInterval(clockTick, 1000);
	timerEl.textContent = time;
	let landingScreenEl = document.getElementById("start-screen");
	landingScreenEl.setAttribute("class", "hide");
	questionsEl.removeAttribute("class");
	getQuestion();
}

// Array of questions
function getQuestion() {
	let currentQuestion = questions[currentQuestionIndex];
	let promptEl = document.getElementById("question-title");
	promptEl.textContent = currentQuestion.prompt;
	choicesEl.innerHTML = "";
	currentQuestion.options.forEach(function (choice, i) {
		let choiceBtn = document.createElement("button");
		choiceBtn.setAttribute("value", choice);
		choiceBtn.textContent = i + 1 + ". " + choice;
		choiceBtn.onclick = questionClick;
		choicesEl.appendChild(choiceBtn);
	});
}

// Check for right answers
// Random Compliment
const compliments = [
	"Brilliant!",
	"Fantastic!",
	"Impressive!",
	"Well done!",
	"Outstanding!",
];

const randomCompliment =
	compliments[Math.floor(Math.random() * compliments.length)];
	
function questionClick() {
	if (this.value !== questions[currentQuestionIndex].answer) {
		time -= 10;
		if (time < 0) {
			time = 0;
		}
		timerEl.textContent = time;
		feedbackEl.textContent = `Nice try, the correct answer was 
		${questions[currentQuestionIndex].answer}.`;
		feedbackEl.style.color = "#ffffff";
		incorrectAudio.play();
	} else {
		feedbackEl.textContent = randomCompliment;
		feedbackEl.style.color = "#b69451";
		correctAudio.play();
	}
	feedbackEl.setAttribute("class", "feedback");
	setTimeout(function () {
		feedbackEl.setAttribute("class", "feedback hide");
	}, 2000);
	currentQuestionIndex++;
	if (currentQuestionIndex === questions.length) {
		quizEnd();
	} else {
		getQuestion();
	}
}

// Stop timer and show final score
function quizEnd() {
	clearInterval(timerId);
	let endScreenEl = document.getElementById("end-screen");
	endScreenEl.removeAttribute("class");
	let finalScoreEl = document.getElementById("final-score");
	finalScoreEl.textContent = time;
	questionsEl.setAttribute("class", "hide");
}

// End quiz if timer reaches 0
function clockTick() {
	time--;
	timerEl.textContent = time;
	if (time <= 0) {
		quizEnd();
	}
}

// Save score with users' name
function saveHighscore() {
	let name = nameEl.value.trim();
	if (name !== "") {
		let highscores =
			JSON.parse(window.localStorage.getItem("highscores")) || [];
		let newScore = {
			score: time,
			name: name,
		};
		highscores.push(newScore);
		window.localStorage.setItem("highscores", JSON.stringify(highscores));
		alert("Your Score has been Submitted");
	}
}

function checkForEnter(event) {
	if (event.key === "Enter") {
		saveHighscore();
		alert("Your Score has been Submitted");
	}
}
nameEl.onkeyup = checkForEnter;

submitBtn.onclick = saveHighscore;

startBtn.onclick = quizStart;

// For audio
const correctAudio = new Audio('./assets/sfx/correct.wav');
const incorrectAudio = new Audio('./assets/sfx/incorrect.wav');

// Play the audio when start button is clicked
document.getElementById('start').addEventListener('click', function() {
    incorrectAudio.play();
});