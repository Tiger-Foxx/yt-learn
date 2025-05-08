/**
 * Service pour transformer les données JSON en HTML pour les jeux éducatifs
 * avec un design moderne, des animations avancées et une UX améliorée.
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
     * Transforme un quiz JSON en HTML interactif avec Tailwind CSS et CSS personnalisé avancé.
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
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
        <style>
          :root {
            --yt-red: #FF0000;
            --yt-dark-1: #0F0F0F;
            --yt-dark-2: #1A1A1A;
            --yt-dark-3: #282828;
            --yt-light-1: #FFFFFF;
            --yt-light-2: #AAAAAA;
            --yt-green: #4CAF50;
            --yt-orange: #FF9800;
          }

          body {
            font-family: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: var(--yt-dark-1);
            color: var(--yt-light-1);
            overflow-x: hidden;
          }

          .yt-title {
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 5px var(--yt-red), 0 0 10px var(--yt-red), 0 0 15px rgba(255,0,0,0.5);
          }

          .quiz-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: radial-gradient(circle at top center, rgba(255,0,0,0.15), transparent 40%),
                        radial-gradient(circle at bottom left, rgba(50,50,50,0.3), transparent 50%),
                        radial-gradient(circle at bottom right, rgba(50,50,50,0.3), transparent 50%);
          }
          
          .quiz-container {
            background-color: var(--yt-dark-2);
            border: 1px solid var(--yt-dark-3);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255,0,0,0.3) inset;
            transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
          }

          .question-card {
            background-color: var(--yt-dark-2); /* Slightly lighter than container if needed, or same */
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            position: absolute; /* For transition group like behavior */
            width: calc(100% - 2 * 1.5rem); /* Match padding of parent */
          }
          .question-card.active {
            opacity: 1;
            transform: translateX(0);
            position: relative; 
          }
          .question-card.exit-left {
            opacity: 0;
            transform: translateX(-100%);
          }
           .question-card.exit-right {
            opacity: 0;
            transform: translateX(100%);
          }


          .option {
            background-color: var(--yt-dark-3);
            border: 2px solid transparent;
            transition: all 0.25s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Elastic transition */
          }
          .option:hover {
            background-color: #3f3f3f; /* Slightly lighter dark */
            transform: translateY(-3px) scale(1.02);
            border-color: var(--yt-red);
            box-shadow: 0 5px 15px rgba(255,0,0,0.2);
          }
          .option.selected {
            background-color: var(--yt-red) !important;
            color: var(--yt-light-1) !important;
            border-color: var(--yt-red) !important;
            transform: scale(1.05);
            box-shadow: 0 0 20px var(--yt-red);
          }
          .option.correct {
            background-color: var(--yt-green) !important;
            color: var(--yt-light-1) !important;
            border-color: var(--yt-green) !important;
            animation: pulseCorrect 0.8s ease-in-out;
          }
          .option.incorrect {
            background-color: var(--yt-orange) !important; /* Using orange for user's incorrect, red for unselected correct */
            color: var(--yt-light-1) !important;
            border-color: var(--yt-orange) !important;
            animation: shakeIncorrect 0.5s ease-in-out;
          }
          .option.disabled {
            pointer-events: none;
            opacity: 0.7;
          }
          .option.reveal-correct {
             background-color: var(--yt-green) !important;
             color: var(--yt-light-1) !important;
             border-color: var(--yt-green) !important;
          }


          .explanation {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out, opacity 0.3s 0.2s ease-in-out;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
          .explanation.show {
            max-height: 200px; /* Adjust as needed */
            opacity: 1;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          .progress-bar-container {
            height: 8px;
            background-color: var(--yt-dark-3);
          }
          .progress-bar {
            background-color: var(--yt-red);
            transition: width 0.4s ease-out;
            box-shadow: 0 0 10px var(--yt-red);
          }
          
          .yt-button {
            background-color: var(--yt-red);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          }
          .yt-button:hover {
            background-color: #D30000;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 15px rgba(255,0,0,0.3);
          }
          .yt-button:disabled {
            background-color: var(--yt-dark-3);
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          .yt-button-secondary {
            background-color: var(--yt-dark-3);
            border: 1px solid #4a4a4a;
          }
           .yt-button-secondary:hover {
            background-color: #3f3f3f;
            border-color: var(--yt-light-2);
          }


          @keyframes pulseCorrect {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes shakeIncorrect {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          
          .results-screen {
            animation: fadeInScaleUp 0.5s ease-out forwards;
          }
          @keyframes fadeInScaleUp {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: conic-gradient(var(--yt-red) 0% var(--score-percent, 0%), var(--yt-dark-3) var(--score-percent, 0%) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2rem auto;
            box-shadow: 0 0 20px rgba(255,0,0,0.4);
          }
          .score-text {
             font-family: 'Orbitron', sans-serif;
          }

        </style>
      </head>
      <body class="selection:bg-red-700 selection:text-white">
        <div class="quiz-wrapper">
          <div id="quiz-main-container" class="w-full max-w-2xl lg:max-w-3xl">
            <header class="mb-6 sm:mb-10 text-center">
              <h1 class="text-4xl sm:text-5xl font-bold text-red-500 yt-title">${quiz.title || 'Quiz YTLearn'}</h1>
            </header>
            
            <main id="quiz-content" class="quiz-container relative p-6 sm:p-8 rounded-xl shadow-2xl overflow-hidden">
              
              <!-- Progress Bar -->
              <div class="progress-bar-container w-full rounded-full mb-6">
                <div id="progress-bar" class="progress-bar h-full rounded-full"></div>
              </div>
              <div class="text-center text-sm text-neutral-400 mb-6" id="progress-text">Question 1 sur ${quiz.questions.length}</div>

              <!-- Questions Area -->
              <div id="questions-container" class="relative min-h-[300px] sm:min-h-[350px]">
                ${quiz.questions.map((q, qIndex) => `
                  <div class="question-card ${qIndex === 0 ? 'active' : ''}" data-index="${qIndex}" data-answer="${q.reponseCorrecte}">
                    <p class="question-text text-xl sm:text-2xl font-semibold mb-6 text-neutral-100">${q.question}</p>
                    <ul class="options space-y-3 sm:space-y-4">
                      ${q.options.map((opt, optIndex) => `
                        <li class="option block w-full text-left p-4 sm:p-5 rounded-lg cursor-pointer text-neutral-100 text-base sm:text-lg focus:outline-none" data-option-index="${optIndex}" tabindex="0">
                          <span class="option-letter font-bold mr-2">${String.fromCharCode(65 + optIndex)}.</span> ${opt}
                        </li>
                      `).join('')}
                    </ul>
                    <div class="explanation mt-5 p-4 bg-neutral-800/70 border-l-4 border-green-500 rounded-md text-neutral-200 text-sm sm:text-base">
                      <strong class="text-green-400">Explication :</strong> ${q.explication || 'Pas d\'explication disponible.'}
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Navigation Buttons -->
              <div class="navigation-buttons flex justify-between items-center mt-8 pt-6 border-t border-neutral-700">
                <button id="prev-btn" class="yt-button yt-button-secondary text-white font-semibold py-2.5 px-6 rounded-lg text-sm sm:text-base">Précédent</button>
                <button id="next-btn" class="yt-button text-white font-bold py-2.5 px-6 rounded-lg text-sm sm:text-base">Suivant</button>
                <button id="validate-btn" class="yt-button text-white font-bold py-2.5 px-6 rounded-lg text-sm sm:text-base" style="display:none;">Valider</button>
                <button id="results-btn" class="yt-button text-white font-bold py-2.5 px-6 rounded-lg text-sm sm:text-base" style="display:none;">Voir Résultats</button>
              </div>
            </main>

            <!-- Results Screen -->
            <div id="results-screen" class="quiz-container p-6 sm:p-8 rounded-xl shadow-2xl mt-8 text-center" style="display:none;">
              <h2 class="text-3xl sm:text-4xl font-bold text-red-500 yt-title mb-6">Résultats du Quiz</h2>
              <div id="score-circle" class="score-circle">
                <span id="score-display" class="text-3xl sm:text-4xl font-bold score-text text-white"></span>
              </div>
              <p class="text-xl sm:text-2xl text-neutral-200 mb-2">Vous avez obtenu <span id="final-score" class="font-bold text-red-400">0</span> sur <span id="total-questions-results">${quiz.questions.length}</span> bonnes réponses.</p>
              <p id="results-message" class="text-lg text-neutral-300 mb-8"></p>
              <div id="detailed-results" class="text-left space-y-3 mb-8"></div>
              <button id="restart-btn" class="yt-button text-white font-bold py-3 px-8 rounded-lg text-base sm:text-lg">Recommencer le Quiz</button>
            </div>
          </div>
        </div>

        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const questions = Array.from(document.querySelectorAll('.question-card'));
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const validateBtn = document.getElementById('validate-btn');
            const resultsBtn = document.getElementById('results-btn');
            const restartBtn = document.getElementById('restart-btn');
            
            const quizContent = document.getElementById('quiz-content');
            const resultsScreen = document.getElementById('results-screen');
            const scoreDisplay = document.getElementById('score-display');
            const finalScore = document.getElementById('final-score');
            const totalQuestionsResults = document.getElementById('total-questions-results');
            const resultsMessage = document.getElementById('results-message');
            const detailedResultsContainer = document.getElementById('detailed-results');
            const scoreCircle = document.getElementById('score-circle');

            let currentQuestionIndex = 0;
            const userAnswers = new Array(questions.length).fill(null);
            let quizFinished = false;

            function updateProgressBar() {
              const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
              progressBar.style.width = progressPercent + '%';
              progressText.textContent = \`Question \${currentQuestionIndex + 1} sur \${questions.length}\`;
            }

            function showQuestion(index, direction = 'next') {
              questions.forEach((q, i) => {
                if (i === index) {
                  q.classList.remove('exit-left', 'exit-right');
                  q.classList.add('active');
                } else if (q.classList.contains('active')) {
                   q.classList.remove('active');
                   q.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
                } else {
                   q.classList.remove('active', 'exit-left', 'exit-right');
                }
              });
              currentQuestionIndex = index;
              updateProgressBar();
              updateNavigationButtons();
              
              // Focus first option of current question for accessibility
              const currentQuestionCard = questions[currentQuestionIndex];
              if(currentQuestionCard) {
                const firstOption = currentQuestionCard.querySelector('.option');
                if(firstOption) firstOption.focus();
              }
            }
            
            function updateNavigationButtons() {
              prevBtn.disabled = currentQuestionIndex === 0;
              prevBtn.style.display = quizFinished ? 'none' : 'inline-block';
              
              if (currentQuestionIndex === questions.length - 1) {
                nextBtn.style.display = 'none';
                validateBtn.style.display = 'inline-block';
                validateBtn.disabled = userAnswers[currentQuestionIndex] === null; // Enable only if last question answered
              } else {
                nextBtn.style.display = 'inline-block';
                validateBtn.style.display = 'none';
                nextBtn.disabled = userAnswers[currentQuestionIndex] === null && !quizFinished; // Disable next if current question not answered
              }
              resultsBtn.style.display = 'none'; // Hide results button initially
            }

            questions.forEach((questionCard, qIndex) => {
              const options = questionCard.querySelectorAll('.option');
              options.forEach(option => {
                option.addEventListener('click', function() {
                  if (quizFinished) return;

                  const selectedOptionIndex = parseInt(this.dataset.optionIndex);
                  userAnswers[qIndex] = selectedOptionIndex;
                  
                  options.forEach(opt => opt.classList.remove('selected'));
                  this.classList.add('selected');
                  
                  // If on last question, enable validate button, otherwise enable next button
                  if (currentQuestionIndex === questions.length - 1) {
                    validateBtn.disabled = false;
                  } else {
                    nextBtn.disabled = false;
                  }
                });
                 // Keyboard accessibility for options
                option.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
              });
            });

            nextBtn.addEventListener('click', () => {
              if (currentQuestionIndex < questions.length - 1) {
                showQuestion(currentQuestionIndex + 1, 'next');
              }
            });

            prevBtn.addEventListener('click', () => {
              if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1, 'prev');
              }
            });
            
            validateBtn.addEventListener('click', function() {
                if (quizFinished) return;
                quizFinished = true;
                this.style.display = 'none';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                resultsBtn.style.display = 'inline-block'; // Show "Voir Résultats" button

                questions.forEach((questionCard, qIndex) => {
                    const correctAnswer = parseInt(questionCard.dataset.answer);
                    const userAnswer = userAnswers[qIndex];
                    const options = questionCard.querySelectorAll('.option');
                    const explanationDiv = questionCard.querySelector('.explanation');

                    options.forEach((opt, optIndex) => {
                        opt.classList.add('disabled'); // Disable all options
                        opt.classList.remove('selected'); // Remove user's selection style for clarity
                        if (optIndex === correctAnswer) {
                            opt.classList.add('reveal-correct'); // Highlight correct answer
                        }
                        if (optIndex === userAnswer) { // Re-apply style for user's choice
                            if (userAnswer === correctAnswer) {
                                opt.classList.add('correct'); // Correct stays green
                            } else {
                                opt.classList.add('incorrect'); // Incorrect marked orange
                            }
                        }
                    });
                    if (explanationDiv) explanationDiv.classList.add('show');
                });
                 // Prompt to see results
                // resultsBtn.focus(); // Maybe too aggressive
            });

            resultsBtn.addEventListener('click', displayResults);

            function displayResults() {
              quizContent.style.display = 'none';
              resultsScreen.style.display = 'block';
              resultsScreen.classList.add('results-screen');
              
              let score = 0;
              detailedResultsContainer.innerHTML = ''; 

              questions.forEach((questionCard, qIndex) => {
                const questionText = questionCard.querySelector('.question-text').textContent;
                const correctAnswerIndex = parseInt(questionCard.dataset.answer);
                const userAnswerIndex = userAnswers[qIndex];
                const optionsElements = Array.from(questionCard.querySelectorAll('.option'));
                const explanation = quiz.questions[qIndex].explication || 'Pas d\'explication.';

                let detailHTML = \`<div class="p-3 bg-neutral-800 rounded-lg">\`;
                detailHTML += \`<p class="font-semibold text-neutral-100 mb-1">\${qIndex + 1}. \${questionText}</p>\`;
                
                const userAnswerText = userAnswerIndex !== null ? optionsElements[userAnswerIndex].textContent.substring(3) : 'Non répondu';
                const correctAnswerText = optionsElements[correctAnswerIndex].textContent.substring(3);

                if (userAnswerIndex === correctAnswerIndex) {
                  score++;
                  detailHTML += \`<p class="text-sm text-green-400">Votre réponse : \${userAnswerText} (Correct)</p>\`;
                } else {
                  detailHTML += \`<p class="text-sm text-red-400">Votre réponse : \${userAnswerText} (Incorrect)</p>\`;
                  detailHTML += \`<p class="text-sm text-green-300">Réponse correcte : \${correctAnswerText}</p>\`;
                }
                detailHTML += \`<p class="text-xs text-neutral-400 mt-1"><em>Explication : \${explanation}</em></p>\`;
                detailHTML += \`</div>\`;
                detailedResultsContainer.innerHTML += detailHTML;
              });
              
              const scorePercent = (score / questions.length) * 100;
              scoreDisplay.textContent = \`\${Math.round(scorePercent)}%\`;
              scoreCircle.style.setProperty('--score-percent', \`\${scorePercent}%\`);
              finalScore.textContent = score;
              totalQuestionsResults.textContent = questions.length;

              let message = "";
              if (scorePercent === 100) message = "Parfait ! Excellent travail !";
              else if (scorePercent >= 75) message = "Très bien ! Vous maîtrisez le sujet.";
              else if (scorePercent >= 50) message = "Pas mal ! Continuez à apprendre.";
              else message = "Continuez vos efforts, vous allez progresser !";
              resultsMessage.textContent = message;
              
              restartBtn.focus();
            }

            restartBtn.addEventListener('click', () => {
              window.location.reload();
            });

            // Initial setup
            showQuestion(0);
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
     * Transforme un ensemble de flashcards JSON en HTML interactif avec Tailwind CSS et CSS personnalisé avancé.
     */
    renderFlashcardsHTML(flashcardsData: any): string {
        try {
            let flashcards: FlashcardsDeck;

            if (flashcardsData && flashcardsData.cards && Array.isArray(flashcardsData.cards)) {
                flashcards = flashcardsData as FlashcardsDeck;
            } else if (Array.isArray(flashcardsData)) {
                flashcards = { title: "Flashcards", cards: flashcardsData as Flashcard[] };
            } else {
                throw new Error('Format de flashcards invalide');
            }

            if (flashcards.cards.length === 0) {
                return this.renderErrorHTML('Aucune flashcard à afficher.');
            }

            return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${flashcards.title || 'Flashcards Interactives YTLearn'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
        <style>
          :root {
            --yt-red: #FF0000;
            --yt-dark-1: #0F0F0F;
            --yt-dark-2: #1A1A1A;
            --yt-dark-3: #282828;
            --yt-light-1: #FFFFFF;
            --yt-light-2: #AAAAAA;
          }
          body {
            font-family: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: var(--yt-dark-1);
            color: var(--yt-light-1);
            overflow-x: hidden;
          }
          .yt-title {
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 5px var(--yt-red), 0 0 10px var(--yt-red), 0 0 15px rgba(255,0,0,0.5);
          }
          .flashcard-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
             background: radial-gradient(circle at top center, rgba(255,0,0,0.15), transparent 40%),
                        radial-gradient(circle at bottom left, rgba(50,50,50,0.3), transparent 50%),
                        radial-gradient(circle at bottom right, rgba(50,50,50,0.3), transparent 50%);
          }
          .flashcard-deck-container {
            perspective: 1500px;
          }
          .flashcard {
            width: 100%;
            height: 320px; /* Increased height */
            max-width: 500px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother, more dynamic flip */
            cursor: pointer;
          }
          .flashcard.flipped {
            transform: rotateY(180deg);
          }
          .flashcard-side {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem; /* Increased padding */
            text-align: center;
            background-color: var(--yt-dark-2);
            border-radius: 1rem; /* More rounded */
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255,0,0,0.2) inset;
            border: 1px solid var(--yt-dark-3);
            overflow-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
          }
          .flashcard-side.front {
            font-size: 1.75rem; /* Larger font for front */
            font-weight: 700;
            color: var(--yt-light-1);
          }
          .flashcard-side.back {
            transform: rotateY(180deg);
            font-size: 1.25rem; /* Slightly smaller for back, potentially more text */
            color: var(--yt-light-2);
            background-color: #222222; /* Slightly different back */
          }
          .flashcard-content {
             max-height: calc(100% - 2rem); /* Ensure content fits with padding */
             overflow-y: auto; /* Scroll if content too long */
          }
          /* Custom scrollbar for flashcard content */
          .flashcard-content::-webkit-scrollbar {
            width: 6px;
          }
          .flashcard-content::-webkit-scrollbar-track {
            background: var(--yt-dark-3);
            border-radius: 3px;
          }
          .flashcard-content::-webkit-scrollbar-thumb {
            background: var(--yt-red);
            border-radius: 3px;
          }
          .flashcard-content::-webkit-scrollbar-thumb:hover {
            background: #D30000;
          }


          .yt-button {
            background-color: var(--yt-red);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          }
          .yt-button:hover {
            background-color: #D30000;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 15px rgba(255,0,0,0.3);
          }
          .yt-button-secondary {
            background-color: var(--yt-dark-3);
            border: 1px solid #4a4a4a;
          }
           .yt-button-secondary:hover {
            background-color: #3f3f3f;
            border-color: var(--yt-light-2);
          }
          
          /* Animation for card change */
          .card-enter-next { animation: slideInFromRight 0.5s forwards; }
          .card-exit-next { animation: slideOutToLeft 0.5s forwards; }
          .card-enter-prev { animation: slideInFromLeft 0.5s forwards; }
          .card-exit-prev { animation: slideOutToRight 0.5s forwards; }

          @keyframes slideInFromRight { from { opacity: 0; transform: translateX(50px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
          @keyframes slideOutToLeft { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(-50px) scale(0.95); } }
          @keyframes slideInFromLeft { from { opacity: 0; transform: translateX(-50px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
          @keyframes slideOutToRight { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(50px) scale(0.95); } }

        </style>
      </head>
      <body class="selection:bg-red-700 selection:text-white">
        <div class="flashcard-wrapper">
          <div class="w-full max-w-lg sm:max-w-xl">
            <header class="mb-8 sm:mb-10 text-center">
              <h1 class="text-4xl sm:text-5xl font-bold text-red-500 yt-title">${flashcards.title || 'Flashcards YTLearn'}</h1>
            </header>

            <main>
              <div class="flashcard-deck-container mb-8 sm:mb-10">
                <div id="flashcard" class="flashcard mx-auto">
                  <div class="flashcard-side front">
                     <div class="flashcard-content" id="flashcard-front-content"></div>
                  </div>
                  <div class="flashcard-side back">
                     <div class="flashcard-content" id="flashcard-back-content"></div>
                  </div>
                </div>
              </div>
              
              <div class="controls flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                <button id="prev-btn" title="Précédent (Flèche gauche)" class="yt-button yt-button-secondary text-white font-semibold py-3 px-6 sm:py-3.5 sm:px-7 rounded-lg text-base sm:text-lg">
                  &larr;
                </button>
                <button id="flip-btn" title="Retourner (Espace)" class="yt-button text-white font-bold py-3 px-8 sm:py-3.5 sm:px-10 rounded-lg text-base sm:text-lg">
                  Retourner
                </button>
                <button id="next-btn" title="Suivant (Flèche droite)" class="yt-button yt-button-secondary text-white font-semibold py-3 px-6 sm:py-3.5 sm:px-7 rounded-lg text-base sm:text-lg">
                  &rarr;
                </button>
              </div>
              
              <div class="progress text-base sm:text-lg text-neutral-300 text-center">
                Carte <span id="current-card" class="font-bold text-neutral-100">1</span> sur <span id="total-cards" class="font-bold text-neutral-100">${flashcards.cards.length}</span>
              </div>
            </main>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const cardsData = ${JSON.stringify(flashcards.cards)};
            if (!cardsData || cardsData.length === 0) return;

            let currentCardIndex = 0;
            let isFlipping = false;
            
            const flashcardElement = document.getElementById('flashcard');
            const frontSideContent = document.getElementById('flashcard-front-content');
            const backSideContent = document.getElementById('flashcard-back-content');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const flipBtn = document.getElementById('flip-btn');
            const currentCardDisplay = document.getElementById('current-card');
            
            function updateCardContent() {
              const card = cardsData[currentCardIndex];
              frontSideContent.textContent = card.front;
              backSideContent.textContent = card.back;
              currentCardDisplay.textContent = (currentCardIndex + 1).toString();
            }

            function animateCardChange(direction) {
                const currentAnimation = direction === 'next' ? ['card-exit-next', 'card-enter-next'] : ['card-exit-prev', 'card-enter-prev'];
                
                flashcardElement.classList.add(currentAnimation[0]);

                setTimeout(() => {
                    flashcardElement.classList.remove('flipped'); // Ensure card is front-facing for new content
                    updateCardContent();
                    flashcardElement.classList.remove(currentAnimation[0]);
                    flashcardElement.classList.add(currentAnimation[1]);
                    setTimeout(() => flashcardElement.classList.remove(currentAnimation[1]), 500); // Clean up animation class
                }, 250); // Halfway through exit animation
            }
            
            showCurrentCard('initial'); // Initial load without animation

            function showCurrentCard(animationType = 'next') {
                if (animationType === 'initial') {
                    updateCardContent();
                    flashcardElement.classList.remove('flipped');
                } else {
                    animateCardChange(animationType);
                }
                 // Accessibility: Announce card content change
                frontSideContent.setAttribute('aria-live', 'polite');
                backSideContent.setAttribute('aria-live', 'polite');
            }
            
            flipBtn.addEventListener('click', () => {
              if (isFlipping) return;
              isFlipping = true;
              flashcardElement.classList.toggle('flipped');
              setTimeout(() => isFlipping = false, 700); // Match transition duration
            });
            
            prevBtn.addEventListener('click', () => {
              currentCardIndex = (currentCardIndex - 1 + cardsData.length) % cardsData.length;
              showCurrentCard('prev');
            });
            
            nextBtn.addEventListener('click', () => {
              currentCardIndex = (currentCardIndex + 1) % cardsData.length;
              showCurrentCard('next');
            });
            
            flashcardElement.addEventListener('click', (e) => {
              if (e.target.closest('button')) return; // Ignore if click is on a button inside card (if any)
              flipBtn.click();
            });

            document.addEventListener('keydown', (e) => {
              if (document.activeElement && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName)) {
                 if ((e.key === ' ' || e.key === 'Enter') && document.activeElement === flipBtn) { /* Allow flipBtn focus */ } 
                 else if (e.key === ' ' || e.key === 'Enter') { return; }
              }
              if (e.key === 'ArrowLeft') { prevBtn.click(); } 
              else if (e.key === 'ArrowRight') { nextBtn.click(); } 
              else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipBtn.click(); }
            });
          });
        </script>
      </body>
      </html>
      `;
        } catch (error) {
            console.error("Erreur lors du rendu des flashcards en HTML:", error);
            return this.renderErrorHTML('Impossible de charger les flashcards. Format invalide ou aucune carte.');
        }
    }

    /**
     * Génère une page d'erreur HTML stylisée avec Tailwind CSS et CSS personnalisé.
     */
    renderErrorHTML(message: string): string {
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erreur YTLearn</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
      <style>
        :root {
          --yt-red: #FF0000;
          --yt-dark-1: #0F0F0F;
          --yt-dark-2: #1A1A1A;
          --yt-light-1: #FFFFFF;
        }
        body {
          font-family: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          background-color: var(--yt-dark-1);
          color: var(--yt-light-1);
        }
        .yt-title-font { font-family: 'Orbitron', sans-serif; }
        .error-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: radial-gradient(circle at center, rgba(255,0,0,0.2), transparent 50%);
        }
        .error-container {
          background-color: var(--yt-dark-2);
          border: 1px solid #282828;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255,0,0,0.3) inset;
          animation: fadeInDrop 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes fadeInDrop {
          0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .error-icon {
          font-size: 4rem; /* Tailwind: text-6xl */
          color: var(--yt-red);
          animation: pulseErrorIcon 2s infinite ease-in-out;
        }
        @keyframes pulseErrorIcon {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .yt-button {
          background-color: var(--yt-red);
          transition: all 0.3s ease;
        }
        .yt-button:hover {
          background-color: #D30000;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 15px rgba(255,0,0,0.3);
        }
      </style>
    </head>
    <body class="selection:bg-red-700 selection:text-white">
      <div class="error-wrapper">
        <div class="error-container p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-lg text-center">
          <div class="error-icon mb-6">⚠️</div>
          <h1 class="text-3xl sm:text-4xl font-bold text-red-500 yt-title-font mb-4">Oops ! Erreur YTLearn</h1>
          <p class="text-neutral-300 mb-8 text-lg sm:text-xl">${message}</p>
          <button 
            onclick="typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : (typeof window !== 'undefined' ? window.location.reload() : null)"
            class="yt-button text-white font-bold py-3 px-8 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-red-500/50"
          >
            Réessayer / Retourner
          </button>
        </div>
      </div>
    </body>
    </html>
    `;
    }
}

export default new ContentRenderers();
