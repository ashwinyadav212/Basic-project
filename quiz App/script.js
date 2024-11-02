const question = [
    {
        question:"which is larget animal in the world",
        answers: [
            { text: "Shark", correct: false},
            { text: "Blue whale", correct: true},
            { text: "Elephant", correct: false},
            { text: "Giraffe", correct: false},
        ]
    },
    {
        question:"How many legs does a spider have?",
        answers: [
            { text: "3", correct: false},
            { text: "5", correct: false},
            { text: "9", correct: false},
            { text: "8", correct: true},
        ]
    },
    {
        question:"Which is the smallest continent in the world?",
        answers: [
            { text: "asia", correct: false},
            { text: "australia", correct: true},
            { text: "arctic", correct: false},
            { text: "africa", correct: false},
        ]   
      },
    {

    question:"who wins the t20 world in 2024",
        answers: [
            { text: "india", correct: true},
            { text: "england", correct: false},
            { text: "pakistan", correct: false},
            { text: "south africa", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question")
const answerButtons = document.getElementById("answer-button")
const nextButton = document.getElementById("next-btn")

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0 ;
    nextButton.innerHTML = 'Next';
    showQuestion();
}

function showQuestion() {
    resetstate();
    let currentQuestion = question[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + "." + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}


function resetstate() {
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild)
    }
}

function selectAnswer(e){
    const selectBtn = e.target;
    const isCorrect = selectBtn.dataset.correct === "true";
    if(isCorrect){
        selectBtn.classList.add("correct");
        score++;
    }else {
        selectBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === true){
            button.classList.add("correct");
        }
        button.disabled = true;
        });
        nextButton.style.display ='block';
 }

function showScore() {
    resetstate();
    questionElement.innerHTML = `You scored ${score} out of ${question.length}!`;
    nextButton.innerHTML = "play Again";
    nextButton.style.display = "block";
}

 function handleNextButton(){
        currentQuestionIndex++;
        if(currentQuestionIndex < question.length){
            showQuestion();
        }else{
            showScore();
        }
 }


 nextButton.addEventListener("click", ()=> {
    if(currentQuestionIndex < question.length){
        handleNextButton();
    }else{
        startQuiz();
    }
 });

startQuiz();