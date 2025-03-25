export class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(questions.length).fill(null);
    this.startTime = null;
    this.timerInterval = null;
    this.isInitialized = false;
  }

  init() {
    // Initialize DOM elements when the quiz starts
    this.initializeDOMElements();

    // Verify that all required elements exist
    if (!this.verifyDOMElements()) {
      console.error('Required DOM elements not found');
      return;
    }

    this.isInitialized = true;
    this.startTime = new Date();
    this.startTimer();
    this.nextButton.addEventListener('click', () => this.handleNext());
    this.restartButton.addEventListener('click', () => this.restartQuiz());
    this.displayQuestion();
    this.updateProgress();
    this.updateScore();
  }

  initializeDOMElements() {
    this.questionContainer = document.getElementById('question-container');
    this.optionsContainer = document.getElementById('options-container');
    this.nextButton = document.getElementById('next-btn');
    this.progressElement = document.getElementById('progress');
    this.scoreElement = document.getElementById('score');
    this.resultsContainer = document.getElementById('results');
    this.finalScoreElement = document.getElementById('final-score');
    this.answerReviewElement = document.getElementById('answer-review');
    this.restartButton = document.getElementById('restart-btn');
    this.quizContainer = document.getElementById('quiz-container');
    this.timerElement = document.getElementById('timer');
  }

  verifyDOMElements() {
    return (
      this.questionContainer &&
      this.optionsContainer &&
      this.nextButton &&
      this.progressElement &&
      this.scoreElement &&
      this.resultsContainer &&
      this.finalScoreElement &&
      this.answerReviewElement &&
      this.restartButton &&
      this.quizContainer &&
      this.timerElement
    );
  }

  startTimer() {
    if (!this.timerElement) return;
    this.timerInterval = setInterval(() => {
      const now = new Date();
      const timeDiff = Math.floor((now - this.startTime) / 1000);
      const minutes = Math.floor(timeDiff / 60);
      const seconds = timeDiff % 60;
      this.timerElement.textContent = `Thời gian: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  displayQuestion() {
    if (!this.verifyDOMElements()) return;

    const question = this.questions[this.currentQuestionIndex];
    this.questionContainer.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">Câu ${this.currentQuestionIndex + 1}: ${question.question}</h2>
    `;

    this.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors';
      button.textContent = option;
      button.addEventListener('click', () => this.handleAnswer(index));
      this.optionsContainer.appendChild(button);
    });

    this.updateNextButtonState();
  }

  updateNextButtonState() {
    if (!this.nextButton) return;
    
    if (this.userAnswers[this.currentQuestionIndex] === null) {
      this.nextButton.disabled = true;
      this.nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      this.nextButton.disabled = false;
      this.nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  handleAnswer(selectedIndex) {
    if (!this.verifyDOMElements()) return;
    if (this.userAnswers[this.currentQuestionIndex] !== null) return;

    const question = this.questions[this.currentQuestionIndex];
    const buttons = this.optionsContainer.getElementsByTagName('button');
    if (!buttons || !buttons.length) return;
    
    this.userAnswers[this.currentQuestionIndex] = selectedIndex;
    
    Array.from(buttons).forEach(button => {
      if (button) {
        button.disabled = true;
        button.classList.add('cursor-not-allowed');
      }
    });

    const correctButton = buttons[question.correctAnswer];
    const selectedButton = buttons[selectedIndex];

    if (correctButton) {
      correctButton.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
    }
    
    if (selectedIndex !== question.correctAnswer && selectedButton) {
      selectedButton.classList.add('bg-red-500', 'border-red-600', 'text-white');
    } else {
      this.score++;
      this.updateScore();
    }

    this.updateNextButtonState();
  }

  handleNext() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.displayQuestion();
      this.updateProgress();
    } else {
      this.showResults();
    }
  }

  updateProgress() {
    if (!this.progressElement) return;
    this.progressElement.textContent = `Câu ${this.currentQuestionIndex + 1}/${this.questions.length}`;
  }

  updateScore() {
    if (!this.scoreElement) return;
    this.scoreElement.textContent = `Điểm: ${this.score}/${this.questions.length}`;
  }

  showResults() {
    if (!this.verifyDOMElements()) return;

    clearInterval(this.timerInterval);
    this.quizContainer.classList.add('hidden');
    this.resultsContainer.classList.remove('hidden');
    
    const percentage = (this.score / this.questions.length) * 100;
    const timeTaken = Math.floor((new Date() - this.startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    this.finalScoreElement.innerHTML = `
      <div class="bg-indigo-50 rounded-lg p-6 mb-6">
        <p class="text-2xl font-bold text-indigo-600 mb-2">Điểm số: ${this.score}/${this.questions.length} (${percentage}%)</p>
        <p class="text-gray-600">Thời gian hoàn thành: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
      </div>
    `;

    this.answerReviewElement.innerHTML = this.questions.map((question, index) => `
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 class="font-semibold text-lg mb-3">Câu ${index + 1}: ${question.question}</h3>
        <div class="space-y-2">
          ${question.options.map((option, optionIndex) => `
            <div class="p-3 rounded-lg ${
              optionIndex === question.correctAnswer
                ? 'bg-green-100 text-green-800 border border-green-500'
                : optionIndex === this.userAnswers[index] && optionIndex !== question.correctAnswer
                ? 'bg-red-500 text-white border border-red-600'
                : 'bg-gray-50 text-gray-600'
            }">
              ${option}
              ${optionIndex === question.correctAnswer ? 
                '<span class="float-right font-semibold">✓ Đáp án đúng</span>' : 
                optionIndex === this.userAnswers[index] && optionIndex !== question.correctAnswer ? 
                '<span class="float-right font-semibold">✗ Đáp án của bạn</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  restartQuiz() {
    if (!this.verifyDOMElements()) return;
    
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.startTime = new Date();
    this.startTimer();
    this.quizContainer.classList.remove('hidden');
    this.resultsContainer.classList.add('hidden');
    this.displayQuestion();
    this.updateProgress();
    this.updateScore();
  }
}