import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types for our creation state management
export interface CreationOptions {
    type: 'quiz' | 'flashcards' | 'interactive';
    difficulty: string;
    questionCount: number;
    sourceType: 'youtube' | 'pdf';
    sourceContent: string;
    sourceTitle: string;
    sourceUrl?: string;
}

export interface Creation {
    id: string;
    title: string;
    gameType: 'quiz' | 'flashcards' | 'interactive';
    difficulty: string;
    type: 'youtube' | 'pdf';
    content: string;
    thumbnail?: string;
    createdAt: string;
    url?: string;
}

const useCreation = () => {
    // Load initial data from localStorage if available
    const loadCreations = (): Creation[] => {
        const storedCreations = localStorage.getItem('ytlearn-creations');
        if (storedCreations) {
            try {
                return JSON.parse(storedCreations);
            } catch (e) {
                console.error('Error parsing stored creations', e);
                return [];
            }
        }
        return [];
    };

    const [creationHistory, setCreationHistory] = useState<Creation[]>(loadCreations());
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationProgress, setGenerationProgress] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Save creations to localStorage
    const saveCreations = (creations: Creation[]) => {
        localStorage.setItem('ytlearn-creations', JSON.stringify(creations));
    };

    // Generate content based on provided options
    const generateContent = async (options: CreationOptions): Promise<string | null> => {
        setIsGenerating(true);
        setGenerationProgress(0);
        setCurrentStep('Initialisation');
        setError(null);

        try {
            // Simulate the generation process with progress updates
            await simulateProgress('Analyse du contenu source', 30);
            await simulateProgress('Extraction des concepts clés', 60);
            await simulateProgress('Création du contenu éducatif', 90);
            await simulateProgress('Finalisation', 100);

            // In a real implementation, we would call an AI service here
            // For now, we'll generate a mock HTML content
            const generatedHtml = generateMockContent(options);

            // Save the creation to history
            const newCreation: Creation = {
                id: uuidv4(),
                title: options.sourceTitle,
                gameType: options.type,
                difficulty: options.difficulty,
                type: options.sourceType,
                content: generatedHtml,
                createdAt: new Date().toISOString(),
                url: options.sourceUrl
            };

            const updatedHistory = [...creationHistory, newCreation];
            setCreationHistory(updatedHistory);
            saveCreations(updatedHistory);

            setIsGenerating(false);
            return generatedHtml;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue lors de la génération du contenu';
            setError(errorMessage);
            setIsGenerating(false);
            return null;
        }
    };

    // Helper: Simulate progress steps
    const simulateProgress = async (step: string, targetProgress: number) => {
        setCurrentStep(step);

        const startProgress = generationProgress;
        const increment = (targetProgress - startProgress) / 10;

        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setGenerationProgress(prev => Math.min(prev + increment, targetProgress));
        }
    };

    // Delete a creation by ID
    const deleteCreation = (id: string) => {
        const updatedHistory = creationHistory.filter(creation => creation.id !== id);
        setCreationHistory(updatedHistory);
        saveCreations(updatedHistory);
    };

    // Helper: Generate mock content based on options
    const generateMockContent = (options: CreationOptions): string => {
        // This would normally be done by an AI service
        // Here we just generate some mock HTML based on the selected game type

        switch (options.type) {
            case 'quiz':
                return generateMockQuiz(options);
            case 'flashcards':
                return generateMockFlashcards(options);
            case 'interactive':
                return generateMockInteractive(options);
            default:
                return '<div>Contenu non généré</div>';
        }
    };

    // Generate mock quiz HTML
    const generateMockQuiz = (options: CreationOptions): string => {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quiz: ${options.sourceTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0F0F0F;
            color: white;
            margin: 0;
            padding: 20px;
          }
          .quiz-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .quiz-header {
            background-color: #FF0000;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            margin-bottom: 20px;
          }
          .quiz-title {
            margin: 0;
            font-size: 24px;
          }
          .quiz-subtitle {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.8;
          }
          .question {
            background-color: #1A1A1A;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .question-text {
            font-size: 18px;
            margin-bottom: 15px;
          }
          .options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .option {
            background-color: #2A2A2A;
            border: 2px solid #444;
            border-radius: 8px;
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .option:hover {
            background-color: #3A3A3A;
          }
          .option.selected {
            background-color: #FF0000;
            border-color: #FF0000;
          }
          .option.correct {
            background-color: #4CAF50;
            border-color: #4CAF50;
          }
          .option.incorrect {
            background-color: #F44336;
            border-color: #F44336;
          }
          .feedback {
            margin-top: 15px;
            padding: 10px 15px;
            border-radius: 8px;
            display: none;
          }
          .feedback.correct {
            background-color: rgba(76, 175, 80, 0.2);
            border: 1px solid #4CAF50;
            display: block;
          }
          .feedback.incorrect {
            background-color: rgba(244, 67, 54, 0.2);
            border: 1px solid #F44336;
            display: block;
          }
          .result {
            background-color: #1A1A1A;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
            display: none;
          }
          .result.show {
            display: block;
          }
          .result-score {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .progress-container {
            height: 8px;
            background-color: #2A2A2A;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            background-color: #FF0000;
            width: 0%;
            transition: width 0.3s;
          }
          button.next, button.retry {
            background-color: #FF0000;
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          button.next:hover, button.retry:hover {
            background-color: #D70000;
          }
          button:disabled {
            background-color: #444;
            cursor: not-allowed;
          }
          .navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          
          @media (min-width: 600px) {
            .options {
              grid-template-columns: 1fr 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="quiz-container">
          <div class="quiz-header">
            <h1 class="quiz-title">Quiz: ${options.sourceTitle}</h1>
            <p class="quiz-subtitle">Difficulté: ${options.difficulty}</p>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar" id="progress"></div>
          </div>
          
          <div id="question-container">
            <div class="question" id="q1">
              <h2 class="question-text">Quelle est la première étape importante mentionnée dans la vidéo?</h2>
              <div class="options">
                <div class="option" onclick="selectOption(this, 1, 0)">La recherche avancée</div>
                <div class="option" onclick="selectOption(this, 1, 1)">La compréhension des fondamentaux</div>
                <div class="option" onclick="selectOption(this, 1, 2)">L'analyse comparative</div>
                <div class="option" onclick="selectOption(this, 1, 3)">La visualisation des données</div>
              </div>
              <div class="feedback" id="feedback1"></div>
            </div>
            
            <div class="question" id="q2" style="display: none;">
              <h2 class="question-text">Selon le contenu, combien de points principaux sont à retenir?</h2>
              <div class="options">
                <div class="option" onclick="selectOption(this, 2, 0)">2 points</div>
                <div class="option" onclick="selectOption(this, 2, 1)">3 points</div>
                <div class="option" onclick="selectOption(this, 2, 2)">4 points</div>
                <div class="option" onclick="selectOption(this, 2, 3)">5 points</div>
              </div>
              <div class="feedback" id="feedback2"></div>
            </div>
            
            <div class="question" id="q3" style="display: none;">
              <h2 class="question-text">Quelle recommandation est faite à la fin de la vidéo?</h2>
              <div class="options">
                <div class="option" onclick="selectOption(this, 3, 0)">S'abonner à la chaîne</div>
                <div class="option" onclick="selectOption(this, 3, 1)">Partager la vidéo</div>
                <div class="option" onclick="selectOption(this, 3, 2)">Poser des questions dans les commentaires</div>
                <div class="option" onclick="selectOption(this, 3, 3)">Acheter du contenu premium</div>
              </div>
              <div class="feedback" id="feedback3"></div>
            </div>
            
            <div class="question" id="q4" style="display: none;">
              <h2 class="question-text">Quel est l'élément essentiel pour maîtriser les compétences selon la vidéo?</h2>
              <div class="options">
                <div class="option" onclick="selectOption(this, 4, 0)">L'intelligence artificielle</div>
                <div class="option" onclick="selectOption(this, 4, 1)">La pratique régulière</div>
                <div class="option" onclick="selectOption(this, 4, 2)">La documentation exhaustive</div>
                <div class="option" onclick="selectOption(this, 4, 3)">Le mentorat professionnel</div>
              </div>
              <div class="feedback" id="feedback4"></div>
            </div>
            
            <div class="question" id="q5" style="display: none;">
              <h2 class="question-text">Quel aspect est abordé après les bases fondamentales?</h2>
              <div class="options">
                <div class="option" onclick="selectOption(this, 5, 0)">Les évaluations</div>
                <div class="option" onclick="selectOption(this, 5, 1)">Les statistiques</div>
                <div class="option" onclick="selectOption(this, 5, 2)">Les applications pratiques</div>
                <div class="option" onclick="selectOption(this, 5, 3)">L'histoire du sujet</div>
              </div>
              <div class="feedback" id="feedback5"></div>
            </div>
            
            <div class="navigation">
              <button class="next" id="next-btn" disabled onclick="nextQuestion()">Question suivante</button>
            </div>
          </div>
          
          <div class="result" id="result">
            <div class="result-score">Votre score: <span id="score">0</span>/5</div>
            <p id="result-message">Vous avez terminé le quiz!</p>
            <button class="retry" onclick="restartQuiz()">Recommencer</button>
          </div>
        </div>
        
        <script>
          // Quiz data
          const correctAnswers = [1, 1, 2, 1, 2];
          const feedback = {
            1: {
              correct: "C'est exact! La compréhension des fondamentaux est la première étape importante mentionnée.",
              incorrect: "Incorrect. La vidéo mentionne que la compréhension des fondamentaux est la première étape importante."
            },
            2: {
              correct: "Bravo! La vidéo mentionne effectivement 3 points principaux.",
              incorrect: "Ce n'est pas correct. La vidéo résume avec 3 points principaux à retenir."
            },
            3: {
              correct: "Parfait! La vidéo se termine en invitant les viewers à poser leurs questions dans les commentaires.",
              incorrect: "Incorrect. À la fin de la vidéo, il est recommandé de poser des questions dans les commentaires."
            },
            4: {
              correct: "C'est exact! La pratique régulière est mentionnée comme essentielle pour maîtriser ces compétences.",
              incorrect: "Ce n'est pas correct. La vidéo indique que la pratique régulière est essentielle."
            },
            5: {
              correct: "Bravo! Les applications pratiques sont abordées après les bases fondamentales.",
              incorrect: "Incorrect. Après les bases fondamentales, la vidéo aborde les applications pratiques."
            }
          };
          
          // Quiz variables
          let currentQuestion = 1;
          let score = 0;
          let answered = false;
          
          // Quiz functions
          function selectOption(option, questionNumber, selectedIndex) {
            if (answered) return;
            
            const options = option.parentElement.children;
            const feedbackElement = document.getElementById('feedback' + questionNumber);
            const correctIndex = correctAnswers[questionNumber - 1];
            
            // Mark selected option
            for (let i = 0; i < options.length; i++) {
              options[i].classList.remove('selected');
            }
            option.classList.add('selected');
            
            // Check if correct
            const isCorrect = selectedIndex === correctIndex;
            if (isCorrect) {
              score++;
              option.classList.add('correct');
              feedbackElement.textContent = feedback[questionNumber].correct;
              feedbackElement.className = 'feedback correct';
            } else {
              option.classList.add('incorrect');
              options[correctIndex].classList.add('correct');
              feedbackElement.textContent = feedback[questionNumber].incorrect;
              feedbackElement.className = 'feedback incorrect';
            }
            
            // Enable next button
            document.getElementById('next-btn').disabled = false;
            answered = true;
          }
          
          function nextQuestion() {
            if (currentQuestion >= 5) {
              // Show results
              document.getElementById('question-container').style.display = 'none';
              document.getElementById('result').classList.add('show');
              document.getElementById('score').textContent = score;
              
              // Set result message based on score
              const resultMessage = document.getElementById('result-message');
              if (score === 5) {
                resultMessage.textContent = "Parfait! Vous avez tout compris!";
              } else if (score >= 3) {
                resultMessage.textContent = "Bon travail! Vous avez bien compris l'essentiel.";
              } else {
                resultMessage.textContent = "Vous pourriez revoir le contenu pour mieux comprendre les concepts.";
              }
              
              return;
            }
            
            // Hide current question
            document.getElementById('q' + currentQuestion).style.display = 'none';
            
            // Show next question
            currentQuestion++;
            document.getElementById('q' + currentQuestion).style.display = 'block';
            
            // Update progress bar
            document.getElementById('progress').style.width = ((currentQuestion - 1) / 5 * 100) + '%';
            
            // Reset answered state
            answered = false;
            
            // Disable next button
            document.getElementById('next-btn').disabled = true;
          }
          
          function restartQuiz() {
            // Reset variables
            currentQuestion = 1;
            score = 0;
            answered = false;
            
            // Show first question, hide others
            for (let i = 1; i <= 5; i++) {
              const q = document.getElementById('q' + i);
              q.style.display = i === 1 ? 'block' : 'none';
              
              // Reset options
              const options = q.getElementsByClassName('option');
              for (let j = 0; j < options.length; j++) {
                options[j].classList.remove('selected', 'correct', 'incorrect');
              }
              
              // Reset feedback
              document.getElementById('feedback' + i).className = 'feedback';
              document.getElementById('feedback' + i).textContent = '';
            }
            
            // Reset progress
            document.getElementById('progress').style.width = '0%';
            
            // Show questions, hide result
            document.getElementById('question-container').style.display = 'block';
            document.getElementById('result').classList.remove('show');
            
            // Disable next button
            document.getElementById('next-btn').disabled = true;
          }
          
          // Initialize progress bar
          document.getElementById('progress').style.width = '0%';
        </script>
      </body>
      </html>
    `;
    };

    // Generate mock flashcards HTML
    const generateMockFlashcards = (options: CreationOptions): string => {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flashcards: ${options.sourceTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0F0F0F;
            color: white;
            margin: 0;
            padding: 20px;
          }
          .flashcards-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            background-color: #FF0000;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            margin-bottom: 20px;
          }
          .title {
            margin: 0;
            font-size: 24px;
          }
          .subtitle {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.8;
          }
          .flashcard-scene {
            perspective: 1000px;
            height: 300px;
            margin-bottom: 20px;
          }
          .flashcard {
            position: relative;
            width: 100%;
            height: 100%;
            cursor: pointer;
            transform-style: preserve-3d;
            transform-origin: center right;
            transition: transform 0.7s;
          }
          .flashcard.flipped {
            transform: translateX(-100%) rotateY(-180deg);
          }
          .flashcard-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .flashcard-front {
            background-color: #1A1A1A;
            border: 2px solid #FF0000;
            transform: rotateY(0deg);
          }
          .flashcard-back {
            background-color: #1A1A1A;
            border: 2px solid #444;
            transform: rotateY(180deg);
          }
          .flashcard-question {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .flashcard-hint {
            font-size: 16px;
            color: #888;
            margin-top: 15px;
          }
          .flashcard-answer {
            font-size: 20px;
          }
          .navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .progress-container {
            height: 8px;
            background-color: #2A2A2A;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            background-color: #FF0000;
            width: 0%;
            transition: width 0.3s;
          }
          .stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 14px;
            color: #888;
          }
          button.nav-btn {
            background-color: #FF0000;
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          button.nav-btn:hover {
            background-color: #D70000;
          }
          button.nav-btn:disabled {
            background-color: #444;
            cursor: not-allowed;
          }
          .center-text {
            text-align: center;
            margin: 15px 0;
            color: #888;
          }
          
          @media (max-width: 600px) {
            .flashcard-scene {
              height: 250px;
            }
            .flashcard-question {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="flashcards-container">
          <div class="header">
            <h1 class="title">Flashcards: ${options.sourceTitle}</h1>
            <p class="subtitle">Difficulté: ${options.difficulty}</p>
          </div>
          
          <div class="stats">
            <div id="card-count">Carte 1 / 5</div>
            <div id="known-count">Connues: 0 / 5</div>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar" id="progress"></div>
          </div>
          
          <div class="flashcard-scene">
            <div class="flashcard" id="flashcard-current" onclick="flipCard()">
              <div class="flashcard-face flashcard-front">
                <div class="flashcard-question">Quelle est la première étape importante dans le processus d'apprentissage?</div>
                <div class="flashcard-hint">Cliquez sur la carte pour voir la réponse</div>
              </div>
              <div class="flashcard-face flashcard-back">
                <div class="flashcard-answer">La compréhension des fondamentaux</div>
                <div class="flashcard-hint">Cliquez à nouveau pour revenir à la question</div>
              </div>
            </div>
          </div>
          
          <p class="center-text" id="flip-instruction">Cliquez sur la carte pour voir la réponse</p>
          
          <div class="navigation">
            <button class="nav-btn" id="prev-btn" disabled onclick="prevCard()">Précédent</button>
            <div>
              <button class="nav-btn" id="unknown-btn" onclick="markUnknown()">Je ne sais pas</button>
              <button class="nav-btn" id="known-btn" onclick="markKnown()">Je sais</button>
            </div>
            <button class="nav-btn" id="next-btn" onclick="nextCard()">Suivant</button>
          </div>
        </div>
        
        <script>
          // Flashcard data
          const flashcards = [
            {
              question: "Quelle est la première étape importante dans le processus d'apprentissage?",
              answer: "La compréhension des fondamentaux"
            },
            {
              question: "Combien de points principaux sont mentionnés à retenir?",
              answer: "Trois points principaux"
            },
            {
              question: "Qu'est-ce qui est essentiel pour maîtriser les compétences?",
              answer: "La pratique régulière"
            },
            {
              question: "Qu'est-ce qui est exploré après les bases fondamentales?",
              answer: "Les applications pratiques et les exemples concrets"
            },
            {
              question: "Quelle action est suggérée à la fin de la vidéo?",
              answer: "Poser des questions dans les commentaires"
            }
          ];
          
          // Variables
          let currentCard = 0;
          let knownCards = new Set();
          let isFlipped = false;
          
          // DOM elements
          const flashcardElement = document.getElementById('flashcard-current');
          const progressBar = document.getElementById('progress');
          const cardCountElement = document.getElementById('card-count');
          const knownCountElement = document.getElementById('known-count');
          const prevButton = document.getElementById('prev-btn');
          const nextButton = document.getElementById('next-btn');
          const flipInstruction = document.getElementById('flip-instruction');
          
          // Functions
          function flipCard() {
            isFlipped = !isFlipped;
            flashcardElement.classList.toggle('flipped', isFlipped);
            flipInstruction.textContent = isFlipped 
              ? "Cliquez à nouveau pour revenir à la question" 
              : "Cliquez sur la carte pour voir la réponse";
          }
          
          function updateCard() {
            // Reset flip state
            isFlipped = false;
            flashcardElement.classList.remove('flipped');
            flipInstruction.textContent = "Cliquez sur la carte pour voir la réponse";
            
            // Update card content
            const frontFace = flashcardElement.querySelector('.flashcard-front');
            const backFace = flashcardElement.querySelector('.flashcard-back');
            
            frontFace.querySelector('.flashcard-question').textContent = flashcards[currentCard].question;
            backFace.querySelector('.flashcard-answer').textContent = flashcards[currentCard].answer;
            
            // Update progress and stats
            updateProgress();
          }
          
          function nextCard() {
            if (currentCard < flashcards.length - 1) {
              currentCard++;
              updateCard();
            } else {
              // Show completion message or loop back
              alert("Vous avez complété toutes les flashcards! Votre score: " + knownCards.size + " / " + flashcards.length);
              currentCard = 0;
              updateCard();
            }
          }
          
          function prevCard() {
            if (currentCard > 0) {
              currentCard--;
              updateCard();
            }
          }
          
          function markKnown() {
            knownCards.add(currentCard);
            updateProgress();
            nextCard();
          }
          
          function markUnknown() {
            knownCards.delete(currentCard);
            updateProgress();
            nextCard();
          }
          
          function updateProgress() {
            // Update progress bar
            progressBar.style.width = ((currentCard + 1) / flashcards.length * 100) + '%';
            
            // Update card count
            cardCountElement.textContent = 'Carte ' + (currentCard + 1) + ' / ' + flashcards.length;
            
            // Update known count
            knownCountElement.textContent = 'Connues: ' + knownCards.size + ' / ' + flashcards.length;
            
            // Update button states
            prevButton.disabled = currentCard === 0;
            nextButton.disabled = currentCard === flashcards.length - 1;
          }
          
          // Initialize
          updateCard();
        </script>
      </body>
      </html>
    `;
    };

    // Generate mock interactive content HTML
    const generateMockInteractive = (options: CreationOptions): string => {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jeu interactif: ${options.sourceTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0F0F0F;
            color: white;
            margin: 0;
            padding: 20px;
          }
          .game-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            background-color: #FF0000;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            margin-bottom: 20px;
          }
          .title {
            margin: 0;
            font-size: 24px;
          }
          .subtitle {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.8;
          }
          .game-area {
            background-color: #1A1A1A;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            min-height: 400px;
          }
          .game-instruction {
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
          }
          .matching-game {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .matching-item {
            background-color: #2A2A2A;
            border: 2px solid #444;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 80px;
          }
          .matching-item:hover {
            background-color: #3A3A3A;
          }
          .matching-item.selected {
            background-color: #FF0000;
            border-color: #FF0000;
          }
          .matching-item.matched {
            background-color: #4CAF50;
            border-color: #4CAF50;
            cursor: default;
          }
          .game-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .game-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .progress-container {
            height: 8px;
            background-color: #2A2A2A;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            background-color: #FF0000;
            width: 0%;
            transition: width 0.3s;
          }
          .game-result {
            background-color: #1A1A1A;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            display: none;
          }
          .game-result.show {
            display: block;
          }
          .result-score {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          button.control-btn {
            background-color: #FF0000;
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          button.control-btn:hover {
            background-color: #D70000;
          }
          button.control-btn:disabled {
            background-color: #444;
            cursor: not-allowed;
          }
          .timer {
            font-size: 18px;
            font-weight: bold;
          }
          .concept-item {
            padding: 10px;
            background-color: #2A2A2A;
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: move;
          }
          .concept-container {
            border: 2px dashed #444;
            padding: 15px;
            border-radius: 10px;
            min-height: 120px;
            margin-bottom: 20px;
          }
          .concept-container.highlight {
            border-color: #FF0000;
            background-color: rgba(255, 0, 0, 0.1);
          }
          .concept-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #CCC;
          }
          
          @media (max-width: 600px) {
            .matching-game {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="game-container">
          <div class="header">
            <h1 class="title">Jeu interactif: ${options.sourceTitle}</h1>
            <p class="subtitle">Difficulté: ${options.difficulty}</p>
          </div>
          
          <div class="game-stats">
            <div id="score-display">Score: 0</div>
            <div id="timer" class="timer">01:00</div>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar" id="progress"></div>
          </div>
          
          <div class="game-area" id="game-area">
            <div class="game-instruction">
              <h2>Associez les concepts à leurs définitions</h2>
              <p>Cliquez sur un élément de chaque colonne pour créer une association</p>
            </div>
            
            <div class="matching-game" id="matching-game">
              <div class="matching-item" data-id="1" onclick="selectItem(this, 'concept')">Les fondamentaux</div>
              <div class="matching-item" data-id="1" onclick="selectItem(this, 'definition')">L'essentiel pour comprendre le sujet</div>
              
              <div class="matching-item" data-id="2" onclick="selectItem(this, 'concept')">Applications pratiques</div>
              <div class="matching-item" data-id="2" onclick="selectItem(this, 'definition')">Exemples concrets qui illustrent les concepts</div>
              
              <div class="matching-item" data-id="3" onclick="selectItem(this, 'concept')">Révision régulière</div>
              <div class="matching-item" data-id="3" onclick="selectItem(this, 'definition')">Élément essentiel pour maîtriser les compétences</div>
            </div>
          </div>
          
          <div class="game-controls">
            <button class="control-btn" onclick="restartGame()">Recommencer</button>
            <button class="control-btn" id="next-game-btn" disabled onclick="nextGame()">Jeu suivant</button>
          </div>
          
          <div class="game-result" id="game-result">
            <div class="result-score">Votre score: <span id="final-score">0</span></div>
            <p id="result-message">Vous avez terminé le jeu!</p>
            <button class="control-btn" onclick="restartGame()">Jouer à nouveau</button>
          </div>
        </div>
        
        <script>
          // Game variables
          let score = 0;
          let seconds = 60;
          let timerInterval;
          let selectedConcept = null;
          let selectedDefinition = null;
          let matchedPairs = 0;
          let currentGame = 1;
          const totalGames = 2;
          
          // Start the game
          function startGame() {
            // Reset variables
            score = 0;
            seconds = 60;
            matchedPairs = 0;
            
            // Update score display
            document.getElementById('score-display').textContent = 'Score: ' + score;
            
            // Update progress bar
            document.getElementById('progress').style.width = '0%';
            
            // Start timer
            startTimer();
            
            // Reset next game button
            document.getElementById('next-game-btn').disabled = true;
          }
          
          // Start timer countdown
          function startTimer() {
            clearInterval(timerInterval);
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
              seconds--;
              updateTimerDisplay();
              
              if (seconds <= 0) {
                clearInterval(timerInterval);
                endGame();
              }
            }, 1000);
          }
          
          // Update timer display
          function updateTimerDisplay() {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('timer').textContent = 
              (minutes < 10 ? '0' : '') + minutes + ':' + 
              (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
          }
          
          // Select an item in the matching game
          function selectItem(element, type) {
            // If the item is already matched, ignore click
            if (element.classList.contains('matched')) {
              return;
            }
            
            if (type === 'concept') {
              // Deselect previously selected concept
              if (selectedConcept) {
                selectedConcept.classList.remove('selected');
              }
              
              // Select this concept
              selectedConcept = element;
              element.classList.add('selected');
            } else {
              // Deselect previously selected definition
              if (selectedDefinition) {
                selectedDefinition.classList.remove('selected');
              }
              
              // Select this definition
              selectedDefinition = element;
              element.classList.add('selected');
            }
            
            // Check for a match if both items are selected
            if (selectedConcept && selectedDefinition) {
              checkMatch();
            }
          }
          
          // Check if selected items match
          function checkMatch() {
            // Get the IDs of selected items
            const conceptId = selectedConcept.getAttribute('data-id');
            const definitionId = selectedDefinition.getAttribute('data-id');
            
            // Check if they match
            if (conceptId === definitionId) {
              // It's a match!
              selectedConcept.classList.remove('selected');
              selectedDefinition.classList.remove('selected');
              
              selectedConcept.classList.add('matched');
              selectedDefinition.classList.add('matched');
              
              // Increase score and matched pairs
              score += 10;
              matchedPairs++;
              
              document.getElementById('score-display').textContent = 'Score: ' + score;
              
              // Reset selections
              selectedConcept = null;
              selectedDefinition = null;
              
              // Check if all pairs are matched
              if (matchedPairs === 3) {
                // All matched - game completed
                clearInterval(timerInterval);
                
                // Add time bonus
                const timeBonus = seconds;
                score += timeBonus;
                document.getElementById('score-display').textContent = 'Score: ' + score;
                
                // Enable next game button
                document.getElementById('next-game-btn').disabled = false;
                
                // Update progress
                document.getElementById('progress').style.width = ((currentGame) / totalGames * 100) + '%';
              }
            } else {
              // Not a match - deselect after a brief delay
              setTimeout(() => {
                selectedConcept.classList.remove('selected');
                selectedDefinition.classList.remove('selected');
                selectedConcept = null;
                selectedDefinition = null;
              }, 1000);
              
              // Penalize score
              score = Math.max(0, score - 2);
              document.getElementById('score-display').textContent = 'Score: ' + score;
            }
          }
          
          // Move to the next game (drag and drop)
          function nextGame() {
            currentGame++;
            
            // Update progress bar
            document.getElementById('progress').style.width = ((currentGame - 1) / totalGames * 100) + '%';
            
            // Clear the game area
            const gameArea = document.getElementById('game-area');
            gameArea.innerHTML = '';
            
            // Create new game content - drag and drop game
            const gameInstruction = document.createElement('div');
            gameInstruction.className = 'game-instruction';
            gameInstruction.innerHTML = '<h2>Organisez les concepts</h2><p>Glissez les concepts dans leurs catégories appropriées</p>';
            gameArea.appendChild(gameInstruction);
            
            // Create containers
            const containersDiv = document.createElement('div');
            containersDiv.style.display = 'grid';
            containersDiv.style.gridTemplateColumns = '1fr 1fr';
            containersDiv.style.gap = '15px';
            gameArea.appendChild(containersDiv);
            
            // Create two concept containers
            const container1 = document.createElement('div');
            container1.className = 'concept-container';
            container1.setAttribute('data-type', 'important');
            container1.innerHTML = '<div class="concept-title">Concepts importants</div>';
            container1.ondragover = allowDrop;
            container1.ondrop = drop;
            container1.ondragenter = dragEnter;
            container1.ondragleave = dragLeave;
            containersDiv.appendChild(container1);
            
            const container2 = document.createElement('div');
            container2.className = 'concept-container';
            container2.setAttribute('data-type', 'secondary');
            container2.innerHTML = '<div class="concept-title">Concepts secondaires</div>';
            container2.ondragover = allowDrop;
            container2.ondrop = drop;
            container2.ondragenter = dragEnter;
            container2.ondragleave = dragLeave;
            containersDiv.appendChild(container2);
            
            // Create draggable items
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'concept-items';
            itemsContainer.style.marginTop = '20px';
            gameArea.appendChild(itemsContainer);
            
            // Create items
            const concepts = [
              { id: 'c1', text: 'La compréhension des fondamentaux', type: 'important' },
              { id: 'c2', text: 'L\'application pratique des connaissances', type: 'important' },
              { id: 'c3', text: 'La révision régulière des concepts appris', type: 'important' },
              { id: 'c4', text: 'Exemples spécifiques de cas d\'études', type: 'secondary' },
              { id: 'c5', text: 'Mentions historiques sur le sujet', type: 'secondary' },
              { id: 'c6', text: 'Références bibliographiques additionnelles', type: 'secondary' },
            ];
            
            // Shuffle the concepts
            concepts.sort(() => Math.random() - 0.5);
            
            concepts.forEach(concept => {
              const conceptItem = document.createElement('div');
              conceptItem.className = 'concept-item';
              conceptItem.setAttribute('draggable', 'true');
              conceptItem.setAttribute('id', concept.id);
              conceptItem.setAttribute('data-type', concept.type);
              conceptItem.textContent = concept.text;
              conceptItem.ondragstart = drag;
              itemsContainer.appendChild(conceptItem);
            });
            
            // Reset the next button
            document.getElementById('next-game-btn').disabled = true;
          }
          
          // Drag and Drop functions
          function allowDrop(ev) {
            ev.preventDefault();
          }
          
          function dragEnter(ev) {
            ev.preventDefault();
            this.classList.add('highlight');
          }
          
          function dragLeave() {
            this.classList.remove('highlight');
          }
          
          function drag(ev) {
            ev.dataTransfer.setData('text', ev.target.id);
          }
          
          function drop(ev) {
            ev.preventDefault();
            this.classList.remove('highlight');
            
            const data = ev.dataTransfer.getData('text');
            const draggedElement = document.getElementById(data);
            
            // Check if the concept is placed in the correct container
            const conceptType = draggedElement.getAttribute('data-type');
            const containerType = this.getAttribute('data-type');
            
            if (conceptType === containerType) {
              // Correct placement
              score += 5;
              draggedElement.style.backgroundColor = '#4CAF50';
            } else {
              // Incorrect placement
              score = Math.max(0, score - 3);
              draggedElement.style.backgroundColor = '#F44336';
            }
            
            // Update score and add the element to the container
            document.getElementById('score-display').textContent = 'Score: ' + score;
            this.appendChild(draggedElement);
            
            // Check if all concepts are placed
            const itemsContainer = document.querySelector('.concept-items');
            if (itemsContainer.children.length === 0) {
              // Game completed
              endGame();
            }
          }
          
          // End game and show results
          function endGame() {
            clearInterval(timerInterval);
            
            document.getElementById('game-area').style.display = 'none';
            document.getElementById('game-result').classList.add('show');
            document.getElementById('final-score').textContent = score;
            
            // Set result message
            const resultMessage = document.getElementById('result-message');
            if (score >= 30) {
              resultMessage.textContent = "Excellent travail! Vous maîtrisez parfaitement les concepts!";
            } else if (score >= 15) {
              resultMessage.textContent = "Bon travail! Vous avez une bonne compréhension des concepts.";
            } else {
              resultMessage.textContent = "Continuez à pratiquer pour améliorer votre compréhension.";
            }
            
            // Update progress bar to completion
            document.getElementById('progress').style.width = '100%';
          }
          
          // Restart the game
          function restartGame() {
            document.getElementById('game-area').style.display = 'block';
            document.getElementById('game-result').classList.remove('show');
            
            // Reset game to first state
            currentGame = 1;
            
            // Reset game area to initial state
            const gameArea = document.getElementById('game-area');
            gameArea.innerHTML = \`
              <div class="game-instruction">
                <h2>Associez les concepts à leurs définitions</h2>
                <p>Cliquez sur un élément de chaque colonne pour créer une association</p>
              </div>
              
              <div class="matching-game" id="matching-game">
                <div class="matching-item" data-id="1" onclick="selectItem(this, 'concept')">Les fondamentaux</div>
                <div class="matching-item" data-id="1" onclick="selectItem(this, 'definition')">L'essentiel pour comprendre le sujet</div>
                
                <div class="matching-item" data-id="2" onclick="selectItem(this, 'concept')">Applications pratiques</div>
                <div class="matching-item" data-id="2" onclick="selectItem(this, 'definition')">Exemples concrets qui illustrent les concepts</div>
                
                <div class="matching-item" data-id="3" onclick="selectItem(this, 'concept')">Révision régulière</div>
                <div class="matching-item" data-id="3" onclick="selectItem(this, 'definition')">Élément essentiel pour maîtriser les compétences</div>
              </div>
            \`;
            
            // Start a new game
            startGame();
          }
          
          // Initialize the game
          startGame();
        </script>
      </body>
      </html>
    `;
    };

    return {
        creationHistory,
        isGenerating,
        generationProgress,
        currentStep,
        error,
        generateContent,
        deleteCreation
    };
};

export default useCreation;