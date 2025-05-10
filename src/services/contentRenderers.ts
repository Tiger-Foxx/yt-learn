/**
 * Service pour transformer les données JSON en HTML pour les jeux éducatifs
 * avec un design ultra-moderne, animations avancées, et UX repensée.
 */

interface QuizQuestion {
    question: string;
    options: string[];
    reponseCorrecte: number;
    explication: string;
}

interface Quiz {
    title: string;
    questions: QuizQuestion[];
}

interface Flashcard {
    front: string;
    back: string;
}

interface FlashcardsDeck {
    title: string;
    cards: Flashcard[];
}

class ContentRenderers {
    /**
     * Transforme un quiz JSON en HTML interactif avec feedback immédiat et suivi du score.
     */
    renderQuizHTML(quizData: any): string {
        try {
            const quiz = quizData as Quiz;

            if (!quiz || !quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
                throw new Error('Format de quiz invalide ou aucune question fournie.');
            }

            return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${quiz.title || 'Quiz Interactif YTLearn'}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #FF0000;
            --primary-dark: #CC0000;
            --primary-light: #FF3333;
            --primary-glow: rgba(255, 0, 0, 0.3);
            --secondary: #1F2937;
            --dark: #111827;
            --darker: #030712;
            --light: #F9FAFB;
            --correct: #10B981;
            --incorrect: #EF4444;
            --neutral: #6B7280;
            --card-bg: rgba(31, 41, 55, 0.8);
            --card-border: rgba(255, 255, 255, 0.1);
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
            color: var(--light);
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.5;
          }
          
          /* ===== Scrollbar ===== */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.5);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
          }
          
          /* ===== Quiz Container ===== */
          .quiz-container {
            position: relative;
            background: var(--secondary);
            border-radius: 16px;
            border: 1px solid var(--card-border);
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 
                        0 0 20px var(--primary-glow);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          
          .quiz-header {
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 20px;
            text-align: center;
            position: relative;
          }
          
          .quiz-header h2 {
            font-weight: 700;
            color: var(--light);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .quiz-header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
                      rgba(255, 0, 0, 0.1) 0%, 
                      rgba(255, 0, 0, 0) 100%);
            z-index: 0;
          }
          
          /* ===== Progress Bar ===== */
          .progress-container {
            height: 6px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 15px;
          }
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--primary-light));
            border-radius: 3px;
            transition: width 0.4s ease;
            position: relative;
          }
          
          .progress-bar::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
            animation: pulse 1.5s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          /* ===== Question Styles ===== */
          .question {
            display: none;
            padding: 20px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
            background: var(--card-bg);
            border-radius: 12px;
            margin: 10px;
            border: 1px solid var(--card-border);
          }
          
          .question.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
            animation: fadeIn 0.5s forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .question h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            line-height: 1.4;
          }
          
          /* ===== Options Styles ===== */
          .options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          @media (min-width: 640px) {
            .options {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          .option {
            position: relative;
            padding: 15px;
            border-radius: 8px;
            background: rgba(31, 41, 55, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            overflow: hidden;
          }
          
          .option:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .option.selected {
            background: var(--primary);
            color: white;
            border-color: var(--primary-dark);
          }
          
          .option.correct {
            background: var(--correct);
            color: white;
            border-color: #059669;
          }
          
          .option.incorrect {
            background: var(--incorrect);
            color: white;
            border-color: #B91C1C;
          }
          
          .option-letter {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            margin-right: 10px;
            font-weight: 600;
            flex-shrink: 0;
          }
          
          .option.selected .option-letter,
          .option.correct .option-letter,
          .option.incorrect .option-letter {
            background: rgba(255, 255, 255, 0.2);
          }
          
          /* ===== Explanation Styles ===== */
          .explanation {
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-left: 4px solid var(--primary);
            border-radius: 6px;
            display: none;
            animation: slideDown 0.4s forwards;
            font-size: 0.95rem;
          }
          
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .explanation.show {
            display: block;
          }
          
          /* ===== Buttons ===== */
          .quiz-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding: 0 10px 10px;
          }
          
          .btn {
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            box-shadow: 0 4px 12px var(--primary-glow);
          }
          
          .btn-primary:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px var(--primary-glow);
          }
          
          .btn-secondary {
            background: rgba(31, 41, 55, 0.8);
            color: var(--light);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .btn-secondary:hover:not(:disabled) {
            background: rgba(55, 65, 81, 0.8);
            transform: translateY(-3px);
          }
          
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .btn-icon {
            font-size: 1.2em;
          }
          
          /* ===== Results Screen ===== */
          .result-container {
            text-align: center;
            padding: 30px;
            display: none;
          }
          
          .result-header {
            margin-bottom: 30px;
          }
          
          .score-display {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
          }
          
          .score-circle {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .score-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: 700;
          }
          
          .score-label {
            font-size: 1rem;
            opacity: 0.7;
          }
          
          .result-message {
            margin-bottom: 30px;
            font-size: 1.2rem;
          }
          
          .result-details {
            background: rgba(31, 41, 55, 0.6);
            border-radius: 12px;
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 30px;
            text-align: left;
          }
          
          .result-item {
            background: rgba(31, 41, 55, 0.8);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid var(--neutral);
            transition: transform 0.2s;
          }
          
          .result-item:hover {
            transform: translateX(5px);
          }
          
          .result-item.correct {
            border-left-color: var(--correct);
          }
          
          .result-item.incorrect {
            border-left-color: var(--incorrect);
          }
          
          .result-question {
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .result-answer {
            margin-bottom: 5px;
            font-size: 0.95rem;
          }
          
          .result-explanation {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          /* ===== Confetti Animation ===== */
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: var(--primary);
            opacity: 0.7;
            top: 0;
            animation: confetti 5s ease-in-out infinite;
          }
          
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          /* ===== 3D Card Flip Animation ===== */
          .card-3d {
            transition: transform 0.6s;
            transform-style: preserve-3d;
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .card-3d.flipped {
            transform: rotateY(180deg);
          }
          
          .card-3d-front, .card-3d-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .card-3d-back {
            transform: rotateY(180deg);
          }
          
          /* ===== Scrollbar ===== */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.5);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
          }
          
          /* ===== Mobile Optimization ===== */
          @media (max-width: 640px) {
            .quiz-container {
              border-radius: 12px;
              margin: 10px;
            }
            
            .question h3 {
              font-size: 1.1rem;
            }
            
            .btn {
              padding: 10px 20px;
              font-size: 0.95rem;
            }
            
            .score-display {
              width: 150px;
              height: 150px;
            }
            
            .score-text {
              font-size: 2.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="min-h-screen py-10 px-4 flex items-center justify-center">
          <div class="w-full max-w-3xl">
            <div id="quiz-container" class="quiz-container">
              <div class="quiz-header">
                <h2 class="text-xl sm:text-2xl">${quiz.title}</h2>
              </div>
              
              <div class="p-6">
                <div class="progress-container">
                  <div id="progress-bar" class="progress-bar" style="width: ${100 / quiz.questions.length}%;"></div>
                </div>
                
                <div id="progress-text" class="text-center text-sm mb-5">
                  Question <span id="current-question">1</span> sur ${quiz.questions.length}
                </div>
                
                <div id="questions-container">
                  ${quiz.questions.map((question, idx) => `
                    <div id="question-${idx}" class="question ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                      <h3>${question.question}</h3>
                      <div class="options">
                        ${question.options.map((option, optIdx) => `
                          <div class="option" data-index="${optIdx}">
                            <div class="option-letter">${String.fromCharCode(65 + optIdx)}</div>
                            <div class="option-text">${option}</div>
                          </div>
                        `).join('')}
                      </div>
                      <div class="explanation" id="explanation-${idx}">
                        <p><strong>Explication:</strong> ${question.explication}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
                
                <div class="quiz-buttons">
                  <button id="btn-prev" class="btn btn-secondary" disabled>
                    <span class="btn-icon">←</span> Précédent
                  </button>
                  <button id="btn-next" class="btn btn-primary" disabled>
                    Suivant <span class="btn-icon">→</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div id="result-container" class="result-container quiz-container mt-8">
              <div class="result-header">
                <h2 class="text-2xl font-bold mb-2">Résultats du Quiz</h2>
                <p class="text-sm opacity-70">Voyons comment vous vous êtes débrouillé...</p>
              </div>
              
              <div class="score-display">
                <canvas id="score-circle" class="score-circle"></canvas>
                <div class="score-text">
                  <span id="score-percentage">0%</span>
                  <div class="score-label">Score</div>
                </div>
              </div>
              
              <div class="result-message" id="result-message">
                Calculons votre score...
              </div>
              
              <div id="result-details" class="result-details">
                <!-- Results will be dynamically populated here -->
              </div>
              
              <button id="btn-restart" class="btn btn-primary mx-auto">
                Recommencer le Quiz
              </button>
            </div>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Quiz Data
            const quizData = ${JSON.stringify(quiz)};
            
            // DOM Elements
            const questionsContainer = document.getElementById('questions-container');
            const progressBar = document.getElementById('progress-bar');
            const currentQuestionEl = document.getElementById('current-question');
            const prevButton = document.getElementById('btn-prev');
            const nextButton = document.getElementById('btn-next');
            const quizContainer = document.getElementById('quiz-container');
            const resultContainer = document.getElementById('result-container');
            const scorePercentage = document.getElementById('score-percentage');
            const resultMessage = document.getElementById('result-message');
            const resultDetails = document.getElementById('result-details');
            const restartButton = document.getElementById('btn-restart');
            
            // Quiz State
            let currentQuestionIndex = 0;
            let score = 0;
            const userAnswers = Array(quizData.questions.length).fill(null);
            const questions = Array.from(document.querySelectorAll('.question'));
            
            // Initialize Quiz
            function initQuiz() {
              showQuestion(0);
              setupEventListeners();
            }
            
            // Show Question
            function showQuestion(index) {
              questions.forEach((q, i) => {
                q.classList.toggle('active', i === index);
              });
              
              currentQuestionIndex = index;
              currentQuestionEl.textContent = index + 1;
              progressBar.style.width = \`\${((index + 1) / quizData.questions.length) * 100}%\`;
              
              updateButtonState();
            }
            
            // Update Button State
            function updateButtonState() {
              prevButton.disabled = currentQuestionIndex === 0;
              nextButton.disabled = userAnswers[currentQuestionIndex] === null;
              
              // If user is on the last question and has answered
              if (currentQuestionIndex === quizData.questions.length - 1 && userAnswers[currentQuestionIndex] !== null) {
                nextButton.textContent = 'Voir les résultats';
                nextButton.classList.add('btn-primary');
              } else {
                nextButton.innerHTML = 'Suivant <span class="btn-icon">→</span>';
                nextButton.classList.remove('btn-success');
              }
            }
            
            // Handle Option Click
            function handleOptionClick(optionElement, questionIndex, optionIndex) {
              const questionEl = document.getElementById(\`question-\${questionIndex}\`);
              const explanation = document.getElementById(\`explanation-\${questionIndex}\`);
              const options = questionEl.querySelectorAll('.option');
              const correctAnswerIndex = quizData.questions[questionIndex].reponseCorrecte;
              
              // Remove any previous selection
              options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
              });
              
              // Mark user's selection
              optionElement.classList.add('selected');
              
              // Record user's answer
              userAnswers[questionIndex] = optionIndex;
              
              // Show correct/incorrect feedback immediately
              if (optionIndex === correctAnswerIndex) {
                optionElement.classList.add('correct');
                score += (userAnswers[questionIndex] === null) ? 1 : 0; // Add point only if answering first time
              } else {
                optionElement.classList.add('incorrect');
                options[correctAnswerIndex].classList.add('correct'); // Show the correct answer
              }
              
              // Show explanation
              explanation.classList.add('show');
              
              // Enable next button
              updateButtonState();
              
              // Auto-advance after a delay (optional)
              if (questionIndex < quizData.questions.length - 1) {
                setTimeout(() => {
                  if (currentQuestionIndex === questionIndex) {
                    // Only auto-advance if user hasn't manually moved away
                    showQuestion(questionIndex + 1);
                  }
                }, 2500);
              }
            }
            
            // Setup Event Listeners
            function setupEventListeners() {
              // Option click listeners
              questions.forEach((questionEl, qIndex) => {
                const options = questionEl.querySelectorAll('.option');
                
                options.forEach((option, optIndex) => {
                  option.addEventListener('click', function() {
                    handleOptionClick(this, qIndex, optIndex);
                  });
                });
              });
              
              // Navigation button listeners
              prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                  showQuestion(currentQuestionIndex - 1);
                }
              });
              
              nextButton.addEventListener('click', () => {
                if (currentQuestionIndex < quizData.questions.length - 1) {
                  showQuestion(currentQuestionIndex + 1);
                } else {
                  showResults();
                }
              });
              
              // Restart button
              restartButton.addEventListener('click', () => {
                resetQuiz();
              });
              
              // Keyboard navigation
              document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' && !prevButton.disabled) {
                  prevButton.click();
                } else if (e.key === 'ArrowRight' && !nextButton.disabled) {
                  nextButton.click();
                } else if (['1', '2', '3', '4'].includes(e.key)) {
                  const keyIndex = parseInt(e.key) - 1;
                  const currentOptions = questions[currentQuestionIndex].querySelectorAll('.option');
                  if (keyIndex >= 0 && keyIndex < currentOptions.length) {
                    currentOptions[keyIndex].click();
                  }
                }
              });
            }
            
            // Show Results
            function showResults() {
              quizContainer.style.display = 'none';
              resultContainer.style.display = 'block';
              
              // Calculate final score if not calculated yet
              const finalScore = score;
              const scorePercent = Math.round((finalScore / quizData.questions.length) * 100);
              
              // Update score display with animation
              animateScore(scorePercent);
              
              // Set result message based on score
              if (scorePercent === 100) {
                resultMessage.textContent = "Parfait ! Vous avez brillamment réussi ce quiz !";
                createConfetti();
              } else if (scorePercent >= 80) {
                resultMessage.textContent = "Excellent travail ! Vous maîtrisez très bien ce sujet !";
              } else if (scorePercent >= 60) {
                resultMessage.textContent = "Bon travail ! Vous avez une bonne compréhension du sujet.";
              } else if (scorePercent >= 40) {
                resultMessage.textContent = "Pas mal, mais il y a encore place à l'amélioration.";
              } else {
                resultMessage.textContent = "Ce sujet mérite une révision plus approfondie.";
              }
              
              // Build detailed results
              resultDetails.innerHTML = '';
              quizData.questions.forEach((question, qIndex) => {
                const userAnswerIndex = userAnswers[qIndex];
                const isCorrect = userAnswerIndex === question.reponseCorrecte;
                
                const resultItem = document.createElement('div');
                resultItem.className = \`result-item \${isCorrect ? 'correct' : 'incorrect'}\`;
                
                resultItem.innerHTML = \`
                  <div class="result-question">
                    <span class="font-bold">\${qIndex + 1}.</span> \${question.question}
                  </div>
                  <div class="result-answer \${isCorrect ? 'text-green-400' : 'text-red-400'}">
                    Votre réponse: \${userAnswerIndex !== null ? question.options[userAnswerIndex] : 'Aucune réponse'}
                  </div>
                  \${!isCorrect ? \`
                    <div class="result-answer text-green-400">
                      Bonne réponse: \${question.options[question.reponseCorrecte]}
                    </div>
                  \` : ''}
                  <div class="result-explanation">
                    \${question.explication}
                  </div>
                \`;
                
                resultDetails.appendChild(resultItem);
              });
              
              // Draw score circle
              drawScoreCircle(scorePercent);
            }
            
            // Animate Score
            function animateScore(targetScore) {
              let currentScore = 0;
              const duration = 1500; // animation duration in ms
              const interval = 20; // update interval in ms
              const steps = duration / interval;
              const increment = targetScore / steps;
              
              const animation = setInterval(() => {
                currentScore += increment;
                
                if (currentScore >= targetScore) {
                  currentScore = targetScore;
                  clearInterval(animation);
                }
                
                scorePercentage.textContent = \`\${Math.round(currentScore)}%\`;
              }, interval);
            }
            
            // Draw Score Circle
            function drawScoreCircle(percent) {
              const canvas = document.getElementById('score-circle');
              const ctx = canvas.getContext('2d');
              const width = canvas.width = 200;
              const height = canvas.height = 200;
              const centerX = width / 2;
              const centerY = height / 2;
              const radius = 80;
              const startAngle = -0.5 * Math.PI; // Start at top
              const endAngle = startAngle + (2 * Math.PI * percent / 100);
              const counterClockwise = false;
              
              // Clear canvas
              ctx.clearRect(0, 0, width, height);
              
              // Create gradient for background circle
              const bgGradient = ctx.createLinearGradient(0, 0, width, height);
              bgGradient.addColorStop(0, 'rgba(75, 85, 99, 0.3)');
              bgGradient.addColorStop(1, 'rgba(55, 65, 81, 0.3)');
              
              // Draw background circle
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.strokeStyle = bgGradient;
              ctx.lineWidth = 15;
              ctx.stroke();
              
              // Determine color based on score
              let scoreColor;
              if (percent >= 80) {
                scoreColor = '#10B981'; // Green
              } else if (percent >= 60) {
                scoreColor = '#3B82F6'; // Blue
              } else if (percent >= 40) {
                scoreColor = '#F59E0B'; // Amber
              } else {
                scoreColor = '#EF4444'; // Red
              }
              
              // Create gradient for score arc
              const scoreGradient = ctx.createLinearGradient(0, 0, width, height);
              scoreGradient.addColorStop(0, scoreColor);
              scoreGradient.addColorStop(1, shadeColor(scoreColor, -20)); // Darker shade
              
              // Animate the score arc
              let currentPercent = 0;
              const animationInterval = setInterval(() => {
                currentPercent += 1;
                
                if (currentPercent > percent) {
                  clearInterval(animationInterval);
                  return;
                }
                
                const currentEndAngle = startAngle + (2 * Math.PI * currentPercent / 100);
                
                // Clear previous arc
                ctx.clearRect(0, 0, width, height);
                
                // Redraw background circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = bgGradient;
                ctx.lineWidth = 15;
                ctx.stroke();
                
                // Draw score arc
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, currentEndAngle, counterClockwise);
                ctx.strokeStyle = scoreGradient;
                ctx.lineWidth = 15;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                // Add glow effect
                ctx.shadowColor = scoreColor;
                ctx.shadowBlur = 15;
              }, 20);
            }
            
            // Helper function to shade a color
            function shadeColor(color, percent) {
              let R = parseInt(color.substring(1, 3), 16);
              let G = parseInt(color.substring(3, 5), 16);
              let B = parseInt(color.substring(5, 7), 16);
              
              R = parseInt(R * (100 + percent) / 100);
              G = parseInt(G * (100 + percent) / 100);
              B = parseInt(B * (100 + percent) / 100);
              
              R = (R < 255) ? R : 255;
              G = (G < 255) ? G : 255;
              B = (B < 255) ? B : 255;
              
              const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
              const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
              const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
              
              return "#" + RR + GG + BB;
            }
            
            // Create confetti effect for perfect score
            function createConfetti() {
              const container = document.body;
              
              for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Random properties
                confetti.style.left = \`\${Math.random() * 100}%\`;
                confetti.style.width = \`\${Math.random() * 10 + 5}px\`;
                confetti.style.height = \`\${Math.random() * 10 + 5}px\`;
                confetti.style.backgroundColor = ['#FF0000', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)];
                confetti.style.animationDuration = \`\${Math.random() * 3 + 2}s\`;
                confetti.style.animationDelay = \`\${Math.random() * 2}s\`;
                
                container.appendChild(confetti);
                
                // Clean up confetti after animation
                setTimeout(() => {
                  confetti.remove();
                }, 5000);
              }
            }
            
            // Reset Quiz
            function resetQuiz() {
              // Reset state
              currentQuestionIndex = 0;
              score = 0;
              userAnswers.fill(null);
              
              // Reset UI
              questions.forEach(q => {
                q.classList.remove('active');
                const options = q.querySelectorAll('.option');
                options.forEach(opt => {
                  opt.classList.remove('selected', 'correct', 'incorrect');
                });
                
                const explanation = q.querySelector('.explanation');
                explanation.classList.remove('show');
              });
              
              // Show first question
              showQuestion(0);
              
              // Switch views
              quizContainer.style.display = 'block';
              resultContainer.style.display = 'none';
              
              // Remove confetti if any
              document.querySelectorAll('.confetti').forEach(c => c.remove());
            }
            
            // Initialize
            initQuiz();
          });
        </script>
      </body>
      </html>
      `;
        } catch (error) {
            console.error("Erreur lors du rendu du quiz en HTML:", error);
            return this.renderErrorHTML('Impossible de charger le quiz. Format des données incorrect ou vide.');
        }
    }

    /**
     * Transforme un ensemble de flashcards JSON en HTML interactif avec animation 3D et styles modernes.
     */
    renderFlashcardsHTML(flashcardsData: any): string {
        try {
            let flashcardsDeck: FlashcardsDeck;

            if (flashcardsData && flashcardsData.cards && Array.isArray(flashcardsData.cards)) {
                flashcardsDeck = flashcardsData as FlashcardsDeck;
            } else if (Array.isArray(flashcardsData)) {
                flashcardsDeck = { title: "Flashcards YTLearn", cards: flashcardsData as Flashcard[] };
            } else {
                throw new Error('Format de flashcards invalide');
            }

            if (flashcardsDeck.cards.length === 0) {
                return this.renderErrorHTML('Aucune flashcard à afficher.');
            }

            return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${flashcardsDeck.title || 'Flashcards Interactives YTLearn'}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #FF0000;
            --primary-dark: #CC0000;
            --primary-light: #FF3333;
            --primary-glow: rgba(255, 0, 0, 0.3);
            --secondary: #1F2937;
            --dark: #111827;
            --darker: #030712;
            --light: #F9FAFB;
            --card-bg: rgba(31, 41, 55, 0.8);
            --card-border: rgba(255, 255, 255, 0.1);
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
            color: var(--light);
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          /* ===== Flashcard Container ===== */
          .flashcards-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          /* ===== Flashcard Styles ===== */
          .flashcard-wrapper {
            perspective: 2000px;
            width: 100%;
            height: 300px;
            margin: 0 auto;
          }
          
          .flashcard {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
          }
          
          .flashcard.flipped {
            transform: rotateY(180deg);
          }
          
          .flashcard-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            transition: transform 0.3s ease;
          }
          
          .flashcard-face.front {
            background: linear-gradient(135deg, var(--secondary) 0%, var(--dark) 100%);
            border: 1px solid var(--card-border);
            color: var(--light);
          }
          
          .flashcard-face.back {
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary) 100%);
            transform: rotateY(180deg);
            border: 1px solid rgba(255, 0, 0, 0.3);
            color: var(--light);
          }
          
          .flashcard-content {
            max-width: 100%;
            word-break: break-word;
          }
          
          .flashcard-front-text {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.5;
          }
          
          .flashcard-back-text {
            font-size: 1.25rem;
            line-height: 1.6;
          }
          
          /* ===== Flip Instruction ===== */
          .flip-instruction {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.1);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            opacity: 0.7;
            pointer-events: none;
            transition: opacity 0.3s;
          }
          
          .flashcard:hover .flip-instruction {
            opacity: 1;
          }
          
          .flashcard.flipped .flip-instruction {
            opacity: 0;
          }
          
          /* ===== Navigation Controls ===== */
          .flashcard-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
          }
          
          .flashcard-btn {
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            box-shadow: 0 4px 12px var(--primary-glow);
          }
          
          .btn-primary:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px var(--primary-glow);
          }
          
          .btn-secondary {
            background: rgba(31, 41, 55, 0.8);
            color: var(--light);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .btn-secondary:hover:not(:disabled) {
            background: rgba(55, 65, 81, 0.8);
            transform: translateY(-3px);
          }
          
          .flashcard-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          
          /* ===== Progress indicator ===== */
          .progress-indicator {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .progress-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transition: transform 0.3s, background-color 0.3s;
          }
          
          .progress-dot.active {
            background-color: var(--primary);
            transform: scale(1.3);
          }
          
          .progress-dot.completed {
            background-color: rgba(255, 255, 255, 0.6);
          }
          
          /* ===== Card Stack Effect ===== */
          .flashcard-stack {
            position: relative;
          }
          
          .stack-card {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--secondary);
            border-radius: 16px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            opacity: 0.5;
            transform: scale(0.95) translateY(-10px);
            transition: all 0.3s;
            pointer-events: none;
          }
          
          .stack-card:nth-child(1) {
            transform: scale(0.92) translateY(-20px);
            opacity: 0.3;
          }
          
          /* ===== Keyboard Shortcuts Info ===== */
          .keyboard-shortcuts {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9rem;
            opacity: 0.7;
          }
          
          .keyboard-key {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 2px 6px;
            margin: 0 3px;
            font-size: 0.8rem;
            min-width: 20px;
          }
          
          /* ===== Mobile Optimization ===== */
          @media (max-width: 640px) {
            .flashcard-wrapper {
              height: 250px;
            }
            
            .flashcard-front-text {
              font-size: 1.3rem;
            }
            
            .flashcard-back-text {
              font-size: 1.1rem;
            }
            
            .flashcard-btn {
              padding: 10px 20px;
              font-size: 0.95rem;
            }
          }
          
          /* ===== Animations ===== */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s forwards;
          }
          
          /* Card counter badge */
          .card-counter {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 5px 15px;
            font-size: 0.9rem;
            margin-bottom: 20px;
          }
          
          /* ===== Mastery indicator ===== */
          .mastery-container {
            margin-top: 20px;
            text-align: center;
          }
          
          .mastery-bar {
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            overflow: hidden;
            width: 100%;
            max-width: 300px;
            margin: 10px auto;
          }
          
          .mastery-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--primary-light));
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 5px;
          }
          
          .mastery-label {
            font-size: 0.9rem;
            margin-top: 5px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="min-h-screen py-10 px-4">
          <div class="flashcards-container">
            <header class="text-center mb-10">
              <h1 class="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                ${flashcardsDeck.title}
              </h1>
              <p class="text-gray-400">Cliquez sur une carte ou utilisez la barre d'espace pour la retourner</p>
            </header>
            
            <div class="card-counter">
              <span id="current-card">1</span> / <span id="total-cards">${flashcardsDeck.cards.length}</span>
            </div>
            
            <div class="flashcard-stack">
              <div class="stack-card"></div>
              <div class="stack-card"></div>
              <div class="flashcard-wrapper">
                <div class="flashcard" id="flashcard">
                  <div class="flashcard-face front">
                    <div class="flashcard-content">
                      <p class="flashcard-front-text" id="front-text">${flashcardsDeck.cards[0].front}</p>
                    </div>
                    <div class="flip-instruction animate-pulse">
                      Cliquez pour retourner
                    </div>
                  </div>
                  <div class="flashcard-face back">
                    <div class="flashcard-content">
                      <p class="flashcard-back-text" id="back-text">${flashcardsDeck.cards[0].back}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="progress-indicator" id="progress-indicator">
              <!-- Progress dots will be generated here -->
            </div>
            
            <div class="flashcard-controls">
              <button id="btn-prev" class="flashcard-btn btn-secondary" disabled>
                ← Précédente
              </button>
              <button id="btn-flip" class="flashcard-btn btn-primary">
                Retourner
              </button>
              <button id="btn-next" class="flashcard-btn btn-secondary">
                Suivante →
              </button>
            </div>
            
            <div class="keyboard-shortcuts">
              <p>Raccourcis : <span class="keyboard-key">←</span> Précédente | <span class="keyboard-key">Space</span> Retourner | <span class="keyboard-key">→</span> Suivante</p>
            </div>
            
            <div class="mastery-container">
              <div class="mastery-bar">
                <div class="mastery-progress" id="mastery-progress" style="width: 0%"></div>
              </div>
              <p class="mastery-label">Progression de la mémorisation: <span id="mastery-percent">0%</span></p>
            </div>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Flashcards Data
            const flashcardsData = ${JSON.stringify(flashcardsDeck.cards)};
            
            // DOM Elements
            const flashcard = document.getElementById('flashcard');
            const frontText = document.getElementById('front-text');
            const backText = document.getElementById('back-text');
            const btnPrev = document.getElementById('btn-prev');
            const btnNext = document.getElementById('btn-next');
            const btnFlip = document.getElementById('btn-flip');
            const currentCardEl = document.getElementById('current-card');
            const totalCardsEl = document.getElementById('total-cards');
            const progressIndicator = document.getElementById('progress-indicator');
            const masteryProgress = document.getElementById('mastery-progress');
            const masteryPercent = document.getElementById('mastery-percent');
            
            // State
            let currentCardIndex = 0;
            const totalCards = flashcardsData.length;
            const cardStatus = new Array(totalCards).fill(0); // 0: not seen, 1: seen front, 2: seen both sides
            
            // Initialize
            function initFlashcards() {
              updateCard();
              createProgressDots();
              setupEventListeners();
              updateMasteryProgress();
            }
            
            // Update the current card
            function updateCard() {
              // Apply exit animation first if desired
              
              // Update content
              frontText.textContent = flashcardsData[currentCardIndex].front;
              backText.textContent = flashcardsData[currentCardIndex].back;
              
              // Ensure card is showing front side when changing cards
              if (flashcard.classList.contains('flipped')) {
                flashcard.classList.remove('flipped');
              }
              
              // Update card counter
              currentCardEl.textContent = currentCardIndex + 1;
              
              // Update navigation buttons
              btnPrev.disabled = currentCardIndex === 0;
              btnNext.disabled = currentCardIndex === totalCards - 1;
              
              // Update progress indicator
              document.querySelectorAll('.progress-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCardIndex);
              });
              
              // Mark card as at least seen front side
              if (cardStatus[currentCardIndex] === 0) {
                cardStatus[currentCardIndex] = 1;
                updateMasteryProgress();
              }
            }
            
            // Create progress indicator dots
            function createProgressDots() {
              progressIndicator.innerHTML = '';
              
              for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                if (i === currentCardIndex) {
                  dot.classList.add('active');
                }
                
                // Click on dot to navigate to that card
                dot.addEventListener('click', () => {
                  navigateToCard(i);
                });
                
                progressIndicator.appendChild(dot);
              }
            }
            
            // Navigate to specific card
            function navigateToCard(index) {
              if (index < 0 || index >= totalCards) return;
              
              currentCardIndex = index;
              updateCard();
            }
            
            // Flip card
            function flipCard() {
              flashcard.classList.toggle('flipped');
              
              // If card is flipped to back, mark as fully seen
              if (flashcard.classList.contains('flipped') && cardStatus[currentCardIndex] < 2) {
                cardStatus[currentCardIndex] = 2;
                updateMasteryProgress();
                
                // Update progress dot to show completed
                const dots = document.querySelectorAll('.progress-dot');
                dots[currentCardIndex].classList.add('completed');
              }
            }
            
            // Navigate to previous card
            function prevCard() {
              if (currentCardIndex > 0) {
                navigateToCard(currentCardIndex - 1);
              }
            }
            
            // Navigate to next card
            function nextCard() {
              if (currentCardIndex < totalCards - 1) {
                navigateToCard(currentCardIndex + 1);
              }
            }
            
            // Update mastery progress
            function updateMasteryProgress() {
              let seenCount = 0;
              let masteredCount = 0;
              
              cardStatus.forEach(status => {
                if (status >= 1) seenCount++;
                if (status === 2) masteredCount++;
              });
              
              const progressPercent = Math.round((masteredCount / totalCards) * 100);
              masteryProgress.style.width = \`\${progressPercent}%\`;
              masteryPercent.textContent = \`\${progressPercent}%\`;
            }
            
            // Setup Event Listeners
            function setupEventListeners() {
              // Flashcard click to flip
              flashcard.addEventListener('click', flipCard);
              
              // Button click handlers
              btnPrev.addEventListener('click', prevCard);
              btnNext.addEventListener('click', nextCard);
              btnFlip.addEventListener('click', flipCard);
              
              // Keyboard navigation
              document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                  prevCard();
                } else if (e.key === 'ArrowRight') {
                  nextCard();
                } else if (e.key === ' ' || e.code === 'Space') {
                  e.preventDefault(); // Prevent scrolling with space
                  flipCard();
                }
              });
              
              // Touch swipe navigation for mobile
              let touchStartX = 0;
              let touchEndX = 0;
              
              flashcard.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
              });
              
              flashcard.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
              });
              
              function handleSwipe() {
                const swipeThreshold = 50;
                const swipeDistance = touchEndX - touchStartX;
                
                if (swipeDistance > swipeThreshold) {
                  // Swiped right
                  prevCard();
                } else if (swipeDistance < -swipeThreshold) {
                  // Swiped left
                  nextCard();
                } else {
                  // Tap (small swipe) - flip card
                  flipCard();
                }
              }
            }
            
            // Initialize the flashcards
            initFlashcards();
          });
        </script>
      </body>
      </html>
      `;
        } catch (error) {
            console.error("Erreur lors du rendu des flashcards en HTML:", error);
            return this.renderErrorHTML('Impossible de charger les flashcards. Format des données incorrect ou vide.');
        }
    }

    /**
     * Page d'erreur élégante et informative.
     */
    renderErrorHTML(message: string): string {
        return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erreur - YT-Learn</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #FF0000;
            --primary-dark: #CC0000;
            --primary-glow: rgba(255, 0, 0, 0.2);
            --dark: #111827;
            --darker: #030712;
            --light: #F9FAFB;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
            color: var(--light);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .error-container {
            background: rgba(31, 41, 55, 0.8);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px var(--primary-glow);
            overflow: hidden;
            position: relative;
          }
          
          .error-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark));
          }
          
          .error-icon {
            position: relative;
            width: 80px;
            height: 80px;
            background: rgba(255, 0, 0, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          
          .error-icon::before {
            content: "!";
            font-size: 40px;
            font-weight: 700;
            color: var(--primary);
          }
          
          .error-icon::after {
            content: "";
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            border: 2px solid var(--primary);
            opacity: 0.5;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.5; }
          }
          
          .btn-retry {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px var(--primary-glow);
          }
          
          .btn-retry:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
          }
          
          .btn-retry:active {
            transform: translateY(0);
          }
          
          .error-message {
            animation: fadeIn 0.6s forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        <div class="error-container w-full max-w-md p-8">
          <div class="error-icon"></div>
          
          <div class="error-message text-center">
            <h1 class="text-2xl font-bold mb-4 text-red-500">Oups ! Un problème est survenu</h1>
            <p class="text-gray-300 mb-8">${message}</p>
            
            <button onclick="window.location.reload();" class="btn-retry">
              Réessayer
            </button>
          </div>
        </div>
        
        <script>
          // Simple animation for the error icon
          document.addEventListener('DOMContentLoaded', () => {
            const errorIcon = document.querySelector('.error-icon');
            errorIcon.style.animation = 'pulse 2s infinite';
          });
        </script>
      </body>
      </html>
    `;
    }
}

export default new ContentRenderers();