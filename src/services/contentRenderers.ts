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
     * Transforme un quiz JSON en HTML interactif avec une UX de question unique et des styles avancés.
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
        <title>${quiz.title || 'Quiz Interactif YTLearn'} - Niveau Expert</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
        <style>
          :root {
            --yt-red: #FF0000;
            --yt-red-dark: #D30000;
            --yt-red-glow: rgba(255,0,0,0.5);
            --yt-dark-1: #0A0A0A; /* Even darker bg */
            --yt-dark-2: #161616; /* Cards bg */
            --yt-dark-3: #2C2C2C; /* Options bg */
            --yt-light-1: #FFFFFF;
            --yt-light-2: #B0B0B0; /* Secondary text */
            --yt-green: #00C853;
            --yt-orange: #FF9100;
            --yt-blue-glow: rgba(0, 150, 255, 0.4);
          }

          body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--yt-dark-1);
            color: var(--yt-light-1);
            overflow-x: hidden;
            line-height: 1.7;
          }

          .yt-title-main {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: clamp(2.5rem, 6vw, 4rem); /* Responsive title */
            text-shadow: 0 0 8px var(--yt-red), 0 0 15px var(--yt-red), 0 0 25px var(--yt-red-glow);
            letter-spacing: 1px;
          }

          .quiz-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: 
              radial-gradient(ellipse at 50% 0%, var(--yt-red-glow) 0%, transparent 50%),
              linear-gradient(180deg, var(--yt-dark-1) 0%, #100000 100%);
          }
          
          .quiz-container {
            background-color: var(--yt-dark-2);
            border: 1px solid var(--yt-dark-3);
            box-shadow: 0 15px 40px rgba(0,0,0,0.7), 0 0 20px var(--yt-red-glow) inset, 0 0 50px rgba(0,0,0,0.5);
          }

          .question-card {
            opacity: 0;
            transform: translateX(100vw) scale(0.8); /* Start further out and smaller */
            transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            position: absolute;
            width: calc(100% - 2 * clamp(1rem, 4vw, 2rem)); /* Responsive padding */
            will-change: transform, opacity;
          }
          .question-card.active {
            opacity: 1;
            transform: translateX(0) scale(1);
            position: relative; 
          }
          .question-card.exit-left {
            opacity: 0;
            transform: translateX(-100vw) scale(0.8);
          }
          .question-card.exit-right { /* For previous button */
            opacity: 0;
            transform: translateX(100vw) scale(0.8);
          }
          .question-text-container {
            min-height: 80px; /* Ensure consistent height */
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .question-text {
             font-size: clamp(1.1rem, 3vw, 1.5rem);
             line-height: 1.4;
          }

          .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive grid for options */
            gap: clamp(0.75rem, 2vw, 1rem);
          }

          .option {
            background-color: var(--yt-dark-3);
            border: 2px solid #444;
            transition: all 0.2s ease-out;
            position: relative;
            overflow: hidden; /* For pseudo-elements */
            min-height: 60px;
            display: flex;
            align-items: center;
          }
          .option::before { /* Shine effect */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.5s ease-in-out;
          }
          .option:hover::before {
            left: 150%;
          }
          .option:hover {
            background-color: #383838;
            border-color: var(--yt-red);
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 10px var(--yt-red-glow);
          }
          .option.selected {
            background-color: var(--yt-red) !important;
            color: var(--yt-light-1) !important;
            border-color: var(--yt-red-dark) !important;
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 0 25px var(--yt-red), 0 0 10px var(--yt-red-dark) inset;
          }
          .option.correct {
            background-color: var(--yt-green) !important;
            border-color: #00A040 !important;
            box-shadow: 0 0 20px var(--yt-green);
            animation: pulseCorrectOption 0.8s ease-in-out;
          }
          .option.incorrect {
            background-color: var(--yt-orange) !important;
            border-color: #D87B00 !important;
            box-shadow: 0 0 20px var(--yt-orange);
            animation: shakeIncorrectOption 0.5s ease-in-out;
          }
          .option.disabled { pointer-events: none; opacity: 0.6; filter: grayscale(50%); }
          .option.reveal-correct {
             background-color: var(--yt-green) !important; border-color: #00A040 !important;
          }
          .option-letter { color: var(--yt-red); }
          .option.selected .option-letter { color: var(--yt-light-1); }


          .explanation {
            max-height: 0; overflow: hidden; opacity: 0;
            transition: max-height 0.6s ease-in-out, padding 0.6s ease-in-out, opacity 0.4s 0.2s ease-in-out;
          }
          .explanation.show { max-height: 250px; opacity: 1; padding-top: 1rem; padding-bottom: 1rem; }

          .progress-bar-container { height: 10px; background-color: var(--yt-dark-3); box-shadow: 0 0 5px rgba(0,0,0,0.5) inset; }
          .progress-bar { background: linear-gradient(90deg, var(--yt-red-dark), var(--yt-red)); transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 0 12px var(--yt-red-glow); }
          
          .yt-button {
            background: linear-gradient(145deg, var(--yt-red), var(--yt-red-dark));
            border: none;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
            transition: all 0.25s ease-out;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 5px var(--yt-red-glow) inset;
          }
          .yt-button:hover {
            background: linear-gradient(145deg, var(--yt-red), #B00000);
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 15px rgba(255,0,0,0.4), 0 0 10px var(--yt-red) inset;
          }
          .yt-button:disabled {
            background: var(--yt-dark-3); filter: grayscale(80%); opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
          }
          .yt-button-secondary {
            background: linear-gradient(145deg, var(--yt-dark-3), #202020);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 5px #333 inset;
          }
           .yt-button-secondary:hover {
            background: linear-gradient(145deg, #383838, #252525);
            border-color: var(--yt-light-2);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 8px #444 inset;
          }


          @keyframes pulseCorrectOption { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
          @keyframes shakeIncorrectOption { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
          
          .results-screen { animation: fadeInScaleUpResults 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
          @keyframes fadeInScaleUpResults { from{opacity:0;transform:translateY(30px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
          
          .score-circle {
            width: clamp(120px, 30vw, 180px); height: clamp(120px, 30vw, 180px);
            border-radius: 50%;
            background: conic-gradient(var(--yt-red) 0% var(--score-percent, 0%), var(--yt-dark-3) var(--score-percent, 0%) 100%);
            transition: --score-percent 1s ease-out; /* Animate score fill */
            box-shadow: 0 0 30px var(--yt-red-glow), 0 0 15px rgba(0,0,0,0.5) inset;
          }
          .score-text { font-family: 'Orbitron', sans-serif; font-size: clamp(1.8rem, 5vw, 2.8rem); }

        </style>
      </head>
      <body class="selection:bg-red-700 selection:text-white">
        <div class="quiz-wrapper">
          <div id="quiz-main-container" class="w-full max-w-3xl lg:max-w-4xl">
            <header class="mb-8 sm:mb-12 text-center">
              <h1 class="yt-title-main text-red-500">${quiz.title || 'Quiz YTLearn'}</h1>
            </header>
            
            <main id="quiz-content" class="quiz-container relative p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl overflow-hidden">
              <div class="progress-bar-container w-full rounded-full mb-4 sm:mb-6">
                <div id="progress-bar" class="progress-bar h-full rounded-full"></div>
              </div>
              <div class="text-center text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8" id="progress-text">Question 1 / ${quiz.questions.length}</div>

              <div id="questions-container" class="relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px]">
                ${quiz.questions.map((q, qIndex) => `
                  <div class="question-card ${qIndex === 0 ? 'active' : ''}" data-index="${qIndex}" data-answer="${q.reponseCorrecte}">
                    <div class="question-text-container mb-6 sm:mb-8">
                        <p class="question-text font-semibold text-neutral-100 text-center">${q.question}</p>
                    </div>
                    <div class="options-grid">
                      ${q.options.map((opt, optIndex) => `
                        <button class="option text-left p-3 sm:p-4 rounded-lg cursor-pointer text-neutral-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yt-dark-2 focus:ring-yt-red" data-option-index="${optIndex}">
                          <span class="option-letter font-bold mr-2.5 text-lg">${String.fromCharCode(65 + optIndex)}.</span> ${opt}
                        </button>
                      `).join('')}
                    </div>
                    <div class="explanation mt-6 p-4 bg-neutral-900/50 border-l-4 border-green-500 rounded-md text-neutral-200 text-sm sm:text-base">
                      <strong class="text-green-400">Explication :</strong> ${q.explication || 'Pas d\'explication disponible.'}
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="navigation-buttons flex justify-between items-center mt-8 pt-6 border-t border-neutral-700/50">
                <button id="prev-btn" class="yt-button yt-button-secondary text-white font-semibold py-2.5 px-5 sm:px-6 rounded-lg text-sm sm:text-base">Précédent</button>
                <button id="next-btn" class="yt-button text-white font-bold py-2.5 px-5 sm:px-6 rounded-lg text-sm sm:text-base">Suivant</button>
                <button id="validate-btn" class="yt-button text-white font-bold py-2.5 px-5 sm:px-6 rounded-lg text-sm sm:text-base" style="display:none;">Valider & Voir Score</button>
                <button id="results-btn" class="yt-button text-white font-bold py-2.5 px-5 sm:px-6 rounded-lg text-sm sm:text-base" style="display:none;">Voir Résultats Détaillés</button>
              </div>
            </main>

            <div id="results-screen" class="quiz-container p-6 sm:p-8 rounded-2xl shadow-2xl mt-8 text-center" style="display:none;">
              <h2 class="text-3xl sm:text-4xl font-bold text-red-500 yt-title-main mb-6">Bilan du Quiz</h2>
              <div id="score-circle" class="score-circle mx-auto mb-6 flex items-center justify-center">
                <span id="score-display" class="score-text text-white"></span>
              </div>
              <p class="text-xl sm:text-2xl text-neutral-100 mb-2">Score Final : <span id="final-score" class="font-bold text-red-400">0</span> / <span id="total-questions-results">${quiz.questions.length}</span></p>
              <p id="results-message" class="text-lg text-neutral-300 mb-8"></p>
              <div id="detailed-results" class="text-left space-y-4 mb-8 max-h-80 overflow-y-auto p-3 bg-neutral-900/30 rounded-lg"></div>
              <button id="restart-btn" class="yt-button text-white font-bold py-3 px-8 rounded-lg text-base sm:text-lg">Recommencer</button>
            </div>
          </div>
        </div>

        <script>
          // JavaScript from previous advanced version, should largely work with new structure.
          // Minor adjustments for button text or specific class names if changed.
          // The core logic of showQuestion, updateProgressBar, event listeners, validation, results display remains similar.
          // Ensure all element IDs match.
          document.addEventListener('DOMContentLoaded', function() {
            const questions = Array.from(document.querySelectorAll('.question-card'));
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const validateBtn = document.getElementById('validate-btn');
            const resultsBtn = document.getElementById('results-btn'); // This button might be combined with validate
            const restartBtn = document.getElementById('restart-btn');
            
            const quizContent = document.getElementById('quiz-content');
            const resultsScreen = document.getElementById('results-screen');
            const scoreDisplay = document.getElementById('score-display');
            const finalScore = document.getElementById('final-score');
            const totalQuestionsResults = document.getElementById('total-questions-results'); // Ensure this ID exists or is updated
            const resultsMessage = document.getElementById('results-message');
            const detailedResultsContainer = document.getElementById('detailed-results');
            const scoreCircle = document.getElementById('score-circle');

            let currentQuestionIndex = 0;
            const userAnswers = new Array(questions.length).fill(null);
            let quizFinished = false;

            function updateProgressBar() {
              const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
              progressBar.style.width = progressPercent + '%';
              progressText.textContent = \`Question \${currentQuestionIndex + 1} / \${questions.length}\`;
            }

            function showQuestion(index, direction = 'next') {
              questions.forEach((q, i) => {
                q.classList.remove('active', 'exit-left', 'exit-right');
                if (i === index) {
                  q.classList.add('active');
                } else if (i === currentQuestionIndex && index !== currentQuestionIndex) { // Only apply exit to the one that WAS active
                   q.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
                }
              });
              currentQuestionIndex = index;
              updateProgressBar();
              updateNavigationButtons();
              
              const currentQuestionCard = questions[currentQuestionIndex];
              if(currentQuestionCard) {
                const firstOption = currentQuestionCard.querySelector('.option');
                // if(firstOption) firstOption.focus(); // Might be too aggressive with animations
              }
            }
            
            function updateNavigationButtons() {
              prevBtn.disabled = currentQuestionIndex === 0;
              prevBtn.style.display = quizFinished ? 'none' : 'inline-block';
              
              if (currentQuestionIndex === questions.length - 1) {
                nextBtn.style.display = 'none';
                validateBtn.style.display = quizFinished ? 'none' : 'inline-block';
                validateBtn.disabled = userAnswers[currentQuestionIndex] === null && !quizFinished;
              } else {
                nextBtn.style.display = quizFinished ? 'none' : 'inline-block';
                validateBtn.style.display = 'none';
                nextBtn.disabled = userAnswers[currentQuestionIndex] === null && !quizFinished;
              }
              resultsBtn.style.display = quizFinished && !resultsScreen.style.display || resultsScreen.style.display === 'none' ? 'inline-block' : 'none';
              if(quizFinished && resultsScreen.style.display === 'block') resultsBtn.style.display = 'none';
            }

            questions.forEach((questionCard, qIndex) => {
              const options = questionCard.querySelectorAll('.option');
              options.forEach(option => {
                option.addEventListener('click', function() {
                  if (quizFinished && userAnswers[qIndex] !== null) return; // Allow first answer after validate if not answered

                  const selectedOptionIndex = parseInt(this.dataset.optionIndex);
                  userAnswers[qIndex] = selectedOptionIndex;
                  
                  options.forEach(opt => opt.classList.remove('selected'));
                  this.classList.add('selected');
                  
                  if(!quizFinished){
                    if (currentQuestionIndex === questions.length - 1) {
                        validateBtn.disabled = false;
                    } else {
                        nextBtn.disabled = false;
                        // Auto-next on selection if desired:
                        // setTimeout(() => nextBtn.click(), 300); 
                    }
                  } else { // If quiz is finished, re-evaluate and show correctness immediately
                    handleImmediateFeedback(questionCard, qIndex);
                    updateNavigationButtons(); // To show/hide results button
                  }
                });
              });
            });
            
            function handleImmediateFeedback(questionCard, qIndex) {
                const correctAnswer = parseInt(questionCard.dataset.answer);
                const userAnswer = userAnswers[qIndex];
                const options = questionCard.querySelectorAll('.option');
                const explanationDiv = questionCard.querySelector('.explanation');

                options.forEach((opt, optIndex) => {
                    opt.classList.add('disabled');
                    opt.classList.remove('selected', 'correct', 'incorrect', 'reveal-correct'); // Reset styles
                    if (optIndex === correctAnswer) {
                        opt.classList.add('reveal-correct');
                    }
                    if (optIndex === userAnswer) {
                        if (userAnswer === correctAnswer) {
                            opt.classList.add('correct');
                        } else {
                            opt.classList.add('incorrect');
                        }
                    }
                });
                if (explanationDiv) explanationDiv.classList.add('show');
            }


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
                quizFinished = true;
                // Mark all questions
                questions.forEach((qc, qi) => handleImmediateFeedback(qc, qi));
                this.style.display = 'none'; // Hide validate button
                resultsBtn.style.display = 'inline-block'; // Show results button
                resultsBtn.focus();
                updateNavigationButtons();
            });

            resultsBtn.addEventListener('click', () => {
                displayResults();
                resultsBtn.style.display = 'none'; // Hide after clicking
            });

            function displayResults() {
              quizContent.style.display = 'none';
              resultsScreen.style.display = 'block';
              resultsScreen.classList.add('results-screen');
              
              let score = 0;
              detailedResultsContainer.innerHTML = ''; 

              questions.forEach((questionCard, qIndex) => {
                const questionData = quiz.questions[qIndex];
                const userAnswerIndex = userAnswers[qIndex];
                
                if (userAnswerIndex === questionData.reponseCorrecte) {
                  score++;
                }
                let detailHTML = \`<div class="p-3 bg-neutral-800/70 rounded-lg shadow-md">\`;
                detailHTML += \`<p class="font-semibold text-neutral-100 mb-1">\${qIndex + 1}. \${questionData.question}</p>\`;
                const userAnswerText = userAnswerIndex !== null ? questionData.options[userAnswerIndex] : 'Non répondu';
                const correctAnswerText = questionData.options[questionData.reponseCorrecte];

                if (userAnswerIndex === questionData.reponseCorrecte) {
                  detailHTML += \`<p class="text-sm text-green-400"><strong class="font-normal">Votre réponse :</strong> \${userAnswerText} (Correct)</p>\`;
                } else {
                  detailHTML += \`<p class="text-sm text-red-400"><strong class="font-normal">Votre réponse :</strong> \${userAnswerText} (Incorrect)</p>\`;
                  detailHTML += \`<p class="text-sm text-green-300"><strong class="font-normal">Réponse attendue :</strong> \${correctAnswerText}</p>\`;
                }
                detailHTML += \`<p class="text-xs text-neutral-400 mt-1 italic">Explication : \${questionData.explication || 'N/A'}</p>\`;
                detailHTML += \`</div>\`;
                detailedResultsContainer.innerHTML += detailHTML;
              });
              
              const scorePercent = (score / questions.length) * 100;
              // Animate score circle fill
              scoreCircle.style.setProperty('--score-percent', \`\${scorePercent}%\`);
              // Animate score text
              let currentScoreText = 0;
              const interval = setInterval(() => {
                if (currentScoreText >= Math.round(scorePercent)) {
                    clearInterval(interval);
                    currentScoreText = Math.round(scorePercent); // Ensure it ends on the exact rounded score
                }
                scoreDisplay.textContent = \`\${currentScoreText}%\`;
                if (currentScoreText < Math.round(scorePercent)) currentScoreText++;
              }, 20);


              finalScore.textContent = score;
              totalQuestionsResults.textContent = questions.length;

              let message = "";
              if (scorePercent === 100) message = "Incroyable ! Score Parfait ! Vous êtes un maître !";
              else if (scorePercent >= 75) message = "Excellent travail ! Vous connaissez votre sujet !";
              else if (scorePercent >= 50) message = "Bien joué ! Continuez comme ça !";
              else message = "Ne baissez pas les bras ! Chaque erreur est une leçon.";
              resultsMessage.textContent = message;
              
              restartBtn.focus();
            }

            restartBtn.addEventListener('click', () => window.location.reload());
            showQuestion(0); // Initial call
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
     * Transforme un ensemble de flashcards JSON en HTML interactif (grille 2x2) avec styles avancés.
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
            const totalCards = flashcardsDeck.cards.length;

            return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${flashcardsDeck.title || 'Flashcards Interactives YTLearn'} - Mode Grille</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
        <style>
          :root {
            --yt-red: #FF0000;
            --yt-red-dark: #D30000;
            --yt-red-glow: rgba(255,0,0,0.4);
            --yt-dark-1: #0A0A0A;
            --yt-dark-2: #161616;
            --yt-dark-3: #2C2C2C;
            --yt-light-1: #FFFFFF;
            --yt-light-2: #B0B0B0;
          }
          body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--yt-dark-1);
            color: var(--yt-light-1);
            overflow-x: hidden;
          }
          .yt-title-main {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            text-shadow: 0 0 8px var(--yt-red), 0 0 15px var(--yt-red), 0 0 25px var(--yt-red-glow);
          }
          .flashcard-page-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; /* Center content that might not fill height */
            padding: 1rem;
            background: 
              radial-gradient(ellipse at 50% 0%, var(--yt-red-glow) 0%, transparent 50%),
              linear-gradient(180deg, var(--yt-dark-1) 0%, #100000 100%);
          }
          .flashcard-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsive: 1 col on small, up to 2 on larger */
            gap: clamp(1rem, 3vw, 1.5rem); /* Responsive gap */
            width: 100%;
            max-width: 700px; /* Max width for 2 columns */
            margin-bottom: 2rem;
            min-height: 300px; /* Ensure space even if few cards */
          }
          @media (min-width: 600px) { /* Explicitly 2 columns for medium screens */
            .flashcard-grid-container {
                grid-template-columns: repeat(2, 1fr);
            }
          }

          .flashcard-item-wrapper {
            perspective: 1200px;
            min-height: 220px; /* Minimum height for a card */
          }
          .flashcard-item {
            width: 100%;
            height: 100%; /* Fill wrapper */
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy flip */
            cursor: pointer;
            border-radius: 0.75rem; /* Tailwind: rounded-xl */
            box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 10px var(--yt-red-glow) inset;
            background-color: var(--yt-dark-2); /* Base for shadow */
             opacity: 0;
            transform: translateY(20px) scale(0.95);
            animation: cardAppear 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            animation-delay: var(--card-delay, 0s);
          }
          @keyframes cardAppear {
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .flashcard-item.flipped {
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
            padding: clamp(1rem, 4vw, 1.5rem);
            text-align: center;
            background-color: var(--yt-dark-2);
            border-radius: 0.75rem;
            border: 1px solid var(--yt-dark-3);
            overflow-wrap: break-word;
            word-break: break-word;
          }
          .flashcard-side.front {
            font-size: clamp(1.1rem, 4vw, 1.5rem);
            font-weight: 600;
            color: var(--yt-light-1);
          }
          .flashcard-side.back {
            transform: rotateY(180deg);
            font-size: clamp(0.9rem, 3.5vw, 1.25rem);
            color: var(--yt-light-2);
            background-color: var(--yt-dark-3); /* Slightly different back */
          }
          .flashcard-content {
             max-height: calc(100% - 1rem); 
             overflow-y: auto;
             scrollbar-width: thin;
             scrollbar-color: var(--yt-red) var(--yt-dark-3);
          }
          .flashcard-content::-webkit-scrollbar { width: 6px; }
          .flashcard-content::-webkit-scrollbar-track { background: var(--yt-dark-3); border-radius:3px; }
          .flashcard-content::-webkit-scrollbar-thumb { background: var(--yt-red); border-radius:3px; }
          .flashcard-content::-webkit-scrollbar-thumb:hover { background: var(--yt-red-dark); }

          .yt-button { /* Copied from Quiz styles for consistency */
            background: linear-gradient(145deg, var(--yt-red), var(--yt-red-dark));
            border: none;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
            transition: all 0.25s ease-out;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 5px var(--yt-red-glow) inset;
          }
          .yt-button:hover {
            background: linear-gradient(145deg, var(--yt-red), #B00000);
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 15px rgba(255,0,0,0.4), 0 0 10px var(--yt-red) inset;
          }
          .yt-button:disabled {
            background: var(--yt-dark-3); filter: grayscale(80%); opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
          }
          .yt-button-secondary {
            background: linear-gradient(145deg, var(--yt-dark-3), #202020);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 5px #333 inset;
          }
           .yt-button-secondary:hover {
            background: linear-gradient(145deg, #383838, #252525);
            border-color: var(--yt-light-2);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 8px #444 inset;
          }
        </style>
      </head>
      <body class="selection:bg-red-700 selection:text-white">
        <div class="flashcard-page-wrapper">
          <div class="w-full max-w-3xl lg:max-w-4xl flex flex-col items-center">
            <header class="my-8 sm:my-10 text-center">
              <h1 class="yt-title-main text-red-500">${flashcardsDeck.title}</h1>
            </header>

            <main class="w-full flex flex-col items-center">
              <div id="flashcard-grid-container" class="flashcard-grid-container">
                <!-- Flashcards will be injected here by JS -->
              </div>
              
              <div class="controls flex justify-between items-center space-x-3 sm:space-x-4 mb-6 w-full max-w-md">
                <button id="prev-set-btn" title="Précédent" class="yt-button yt-button-secondary text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base">
                  &larr; Préc.
                </button>
                <button id="flip-all-btn" title="Retourner Tout" class="yt-button text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base">
                  Retourner Tout
                </button>
                <button id="next-set-btn" title="Suivant" class="yt-button yt-button-secondary text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base">
                  Suiv. &rarr;
                </button>
              </div>
              
              <div class="progress text-sm sm:text-base text-neutral-300 text-center">
                Cartes <span id="current-cards-display" class="font-bold text-neutral-100">1-0</span> sur <span id="total-cards-display" class="font-bold text-neutral-100">${totalCards}</span>
              </div>
            </main>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const cardsData = ${JSON.stringify(flashcardsDeck.cards)};
            if (!cardsData || cardsData.length === 0) return;

            const CARDS_PER_SET = 4;
            let currentSetIndex = 0;
            const totalSets = Math.ceil(cardsData.length / CARDS_PER_SET);

            const gridContainer = document.getElementById('flashcard-grid-container');
            const prevSetBtn = document.getElementById('prev-set-btn');
            const nextSetBtn = document.getElementById('next-set-btn');
            const flipAllBtn = document.getElementById('flip-all-btn');
            const currentCardsDisplay = document.getElementById('current-cards-display');
            const totalCardsDisplay = document.getElementById('total-cards-display');
            
            function createFlashcardHTML(cardData, indexInSet) {
                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'flashcard-item-wrapper';
                
                const cardElement = document.createElement('div');
                cardElement.className = 'flashcard-item';
                cardElement.style.setProperty('--card-delay', (indexInSet * 0.1) + 's'); // Stagger animation

                cardElement.innerHTML = \`
                  <div class="flashcard-side front">
                     <div class="flashcard-content">\${cardData.front}</div>
                  </div>
                  <div class="flashcard-side back">
                     <div class="flashcard-content">\${cardData.back}</div>
                  </div>
                \`;
                cardElement.addEventListener('click', () => cardElement.classList.toggle('flipped'));
                cardWrapper.appendChild(cardElement);
                return cardWrapper;
            }

            function displayCurrentSet() {
              gridContainer.innerHTML = ''; // Clear previous cards
              const startIndex = currentSetIndex * CARDS_PER_SET;
              const endIndex = Math.min(startIndex + CARDS_PER_SET, cardsData.length);
              const currentSetCards = cardsData.slice(startIndex, endIndex);

              currentSetCards.forEach((card, index) => {
                const cardHTML = createFlashcardHTML(card, index);
                gridContainer.appendChild(cardHTML);
              });
              
              updateControls();
              currentCardsDisplay.textContent = \`\${startIndex + 1}-\${endIndex}\`;
            }
            
            function updateControls() {
              prevSetBtn.disabled = currentSetIndex === 0;
              nextSetBtn.disabled = currentSetIndex >= totalSets - 1;
              flipAllBtn.disabled = gridContainer.children.length === 0;
            }

            prevSetBtn.addEventListener('click', () => {
              if (currentSetIndex > 0) {
                currentSetIndex--;
                displayCurrentSet();
              }
            });

            nextSetBtn.addEventListener('click', () => {
              if (currentSetIndex < totalSets - 1) {
                currentSetIndex++;
                displayCurrentSet();
              }
            });

            flipAllBtn.addEventListener('click', () => {
              const visibleCards = gridContainer.querySelectorAll('.flashcard-item');
              // Check if most cards are flipped to decide action (flip all to front or all to back)
              let flippedCount = 0;
              visibleCards.forEach(card => { if (card.classList.contains('flipped')) flippedCount++; });
              const flipToBack = flippedCount < visibleCards.length / 2;

              visibleCards.forEach(card => {
                if (flipToBack) card.classList.add('flipped');
                else card.classList.remove('flipped');
              });
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
              if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
              if (e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return; // Allow button activation

              if (e.key === 'ArrowLeft' && !prevSetBtn.disabled) prevSetBtn.click();
              else if (e.key === 'ArrowRight' && !nextSetBtn.disabled) nextSetBtn.click();
              else if ((e.key === 'f' || e.key === 'F' || e.key === ' ') && !flipAllBtn.disabled) {
                e.preventDefault();
                flipAllBtn.click();
              }
            });

            displayCurrentSet(); // Initial display
          });
        </script>
      </body>
      </html>
      `;
        } catch (error) {
            console.error("Erreur lors du rendu des flashcards en HTML:", error);
            return this.renderErrorHTML('Impossible de charger les flashcards. Format invalide, aucune carte, ou erreur de configuration de la grille.');
        }
    }

    renderErrorHTML(message: string): string {
        // Using the same advanced error page from the previous response
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erreur YTLearn - Oups !</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
      <style>
        :root { /* Ensure variables are defined */
            --yt-red: #FF0000; --yt-red-dark: #D30000; --yt-red-glow: rgba(255,0,0,0.4);
            --yt-dark-1: #0A0A0A; --yt-dark-2: #161616; --yt-light-1: #FFFFFF;
        }
        body {
          font-family: 'Roboto', sans-serif;
          background-color: var(--yt-dark-1);
          color: var(--yt-light-1);
          display: flex; align-items: center; justify-content: center;
          min-height: 100vh; padding: 1rem;
          background: radial-gradient(ellipse at center, var(--yt-red-glow) 0%, transparent 60%), var(--yt-dark-1);
        }
        .yt-title-font { font-family: 'Orbitron', sans-serif; font-weight: 900; }
        .error-container {
          background-color: var(--yt-dark-2);
          border: 1px solid #282828;
          box-shadow: 0 15px 40px rgba(0,0,0,0.7), 0 0 20px var(--yt-red-glow) inset;
          animation: fadeInDropError 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes fadeInDropError {
          0% { opacity: 0; transform: translateY(-40px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .error-icon {
          font-size: clamp(3rem, 10vw, 5rem); /* Responsive icon */
          color: var(--yt-red);
          animation: pulseErrorIconAnim 2.5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        @keyframes pulseErrorIconAnim {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
        }
        .yt-button { /* Consistent button style */
            background: linear-gradient(145deg, var(--yt-red), var(--yt-red-dark)); border: none;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5); transition: all 0.25s ease-out;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 5px var(--yt-red-glow) inset;
        }
        .yt-button:hover {
            background: linear-gradient(145deg, var(--yt-red), #B00000);
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 15px rgba(255,0,0,0.4), 0 0 10px var(--yt-red) inset;
        }
      </style>
    </head>
    <body class="selection:bg-red-700 selection:text-white">
      <div class="error-container p-6 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg text-center">
        <div class="error-icon mb-6 sm:mb-8">⚠️</div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 yt-title-font mb-3 sm:mb-4">Erreur Cosmique !</h1>
        <p class="text-neutral-300 mb-8 text-base sm:text-lg md:text-xl">${message}</p>
        <button 
          onclick="typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : (typeof window !== 'undefined' ? window.location.reload() : null)"
          class="yt-button text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-4 ring-offset-2 ring-offset-yt-dark-2 focus:ring-red-500/70"
        >
          Retourner ou Réessayer
        </button>
      </div>
    </body>
    </html>
    `;
    }
}

export default new ContentRenderers();