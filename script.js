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

// Start quiz when "Start Quiz" button is clicked
startQuizBtn.addEventListener("click", () => {
    username = document.getElementById("username").value;

    /* Original Code:
    if (username) {
        userInput.classList.add("hidden");
        quiz.classList.remove("hidden");
        displayQuestion();
        startTimer();
    } else {
        alert("Please enter your name");
    }
    */

    // New Code: Modified to handle skipping the start screen if localStorage has data
    if (username) {
        userInput.classList.add("hidden");
        quiz.classList.remove("hidden");
        displayQuestion();
        startTimer();
    } else {
        alert("Please enter your name");
    }
});

// Display the current question and its answers
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

// Start the countdown timer for each question
const startTimer = () => {
    intervalId = setInterval(() => {
        timerEl.textContent = `Time Remaining: ${timeLeft} seconds`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(intervalId);
            checkAnswer(-1); // Timeout situation
        }
    }, 1000);
};

// Check if the selected answer is correct
const checkAnswer = (selectedAnswer) => {
    const question = questions[currentQuestion];
    clearInterval(intervalId); // Stop timer on answer

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

// Show the final results and store them in localStorage
const showResults = () => {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    scoreEl.textContent = `Your score is ${score} out of ${questions.length}`;

    const message = score > questions.length / 2 ? "Excellent job, " : "Keep practicing, ";

    feedbackEl.textContent = `${message}${username}!`;

    /* Original Code:
    // Persist score and state on refresh using local storage
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizState", "completed");
    */

    // New Code: Storing score and username to localStorage
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizUsername", username);
};

// Handle the "Try Again" functionality
tryAgainBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    timeLeft = 10;

    results.classList.add("hidden");
    quiz.classList.remove("hidden");
    displayQuestion();
    startTimer();

    feedbackEl.textContent = "";
    
    /* Original Code:
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizState");
    */

    // New Code: Clear both score and username from localStorage
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizUsername");
});

// Automatically check for saved quiz data on page load
window.onload = () => {
    const storedScore = localStorage.getItem("quizScore");
    const storedUsername = localStorage.getItem("quizUsername");

    /* Original Code:
    if (quizState === "completed" && storedScore) {
        results.classList.remove("hidden");
        scoreEl.textContent = `Your last score was ${storedScore} out of ${questions.length}`;
        feedbackEl.textContent = "Let's try again, shall we?";
        localStorage.removeItem("quizState"); // Clear state after displaying
    }
    */

    // New Code: Check for score and username to skip "name + start" screen
    if (storedScore && storedUsername) {
        username = storedUsername;
        results.classList.remove("hidden");
        scoreEl.textContent = `Your last score was ${storedScore} out of ${questions.length}`;
        feedbackEl.textContent = `${storedUsername}, let's try again!`;
        userInput.classList.add("hidden"); // Hide the name input form
    }
};
