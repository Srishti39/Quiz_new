let currentQuestion = 0;
let score = 0;
let username;
let timeLeft = 10; // Timer duration in seconds
let intervalId;

const userInput = document.getElementById("user-input");
const quiz = document.getElementById("quiz");
const results = document.getElementById("results");
const startQuizBtn = document.getElementById("start-quiz");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const submitBtn = document.getElementById("submit");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const tryAgainBtn = document.getElementById("try-again");

const questions = [
    {
        q: "What country has the most islands?",
        answers: ["India", "Sweden", "Osaka"],
        correctAnswer: 1
    },
    {
        q: "What is the tallest type of tree?",
        answers: ["Redwoods", "Birch", "Juniper"],
        correctAnswer: 0
    },
    {
        q: "What sporting event has a strict dress code of all-white?",
        answers: ["Olympics", "Wimbledon", "Commonwealth"],
        correctAnswer: 1
    },
    {
        q: "Where is Angel Falls, the world's largest waterfall, located?",
        answers: ["Venezuela", "Guyana", "Amazonas"],
        correctAnswer: 0
    },
    {
        q: "Which state is also known as the 'Fruit Bowl' of India?",
        answers: ["Jammu and Kashmir", "Himachal Pradesh", "Assam"],
        correctAnswer: 1
    }
];

startQuizBtn.addEventListener("click", () => {
    username = document.getElementById("username").value;
    if (username) {
        userInput.classList.add("hidden");
        quiz.classList.remove("hidden");
        displayQuestion();
        startTimer();
    } else {
        alert("Please enter your name");
    }
});

const displayQuestion = () => {
    const question = questions[currentQuestion];
    questionEl.textContent = question.q;
    answersEl.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.addEventListener("click", () => checkAnswer(index));
        answersEl.appendChild(btn);
    });
};

const startTimer = () => {
    intervalId = setInterval(() => {
        timerEl.textContent = `Time Remaining: ${timeLeft} seconds`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(intervalId);
            checkAnswer(-1); // Simulate timeout
        }
    }, 1000);
};

const checkAnswer = (selectedAnswer) => {
    const question = questions[currentQuestion];
    clearInterval(intervalId); // Stop timer on submit

    if (selectedAnswer === question.correctAnswer) {
        score++;
        feedbackEl.textContent = "Correct!";
    } else {
        feedbackEl.textContent = `Incorrect. The correct answer is "${question.answers[question.correctAnswer]}".`;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        timeLeft = 10; // Reset timer for next question
        displayQuestion();
        startTimer();
    } else {
        showResults();
    }
};

const showResults = () => {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    scoreEl.textContent = `Your score is ${score} out of ${questions.length}`;

    const message = score > questions.length / 2 ? "Excellent job, " : "Keep practicing, ";

    feedbackEl.textContent = `${message}${username}!`;

    // Persist score and state on refresh using local storage
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizState", "completed");
};

tryAgainBtn.addEventListener("click", () => {
    username = document.getElementById("username").value;
    results.visibility="hidden";
    results.display="none";
    if (username) {
        userInput.classList.add("hidden");
        quiz.classList.remove("hidden");
        displayQuestion();
        startTimer();
        checkAnswer();
    } else {
        alert("Please enter your name");
    };
});

// Check for stored score and state on page load
window.onload = () => {
    const storedScore = localStorage.getItem("quizScore");
    const quizState = localStorage.getItem("quizState");

    if (quizState === "completed" && storedScore) {
        results.classList.remove("hidden");
        scoreEl.textContent = `Your last score was ${storedScore} out of ${questions.length}`;
        feedbackEl.textContent = "Let's try again, shall we?";
        localStorage.removeItem("quizState"); // Clear state after displaying
    }
};
