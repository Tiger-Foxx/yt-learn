import { Creation } from '@/services/storageService';

/**
 * Exemples de créations pour les nouveaux utilisateurs
 * Note : Ces créations sont simplifiées et serviront de base pour de meilleures
 * versions que vous pourrez créer ultérieurement.
 */
export const exampleCreations: Partial<Creation>[] = [
    // --- Exemple de Quiz (Thème Noir & Rouge affirmé) ---
    {
        id:"fox-1-61257c64-7ed7-4b30-a689-147",
        title: "Les bases de la programmation",
        type: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23101010'/%3E%3Cpolygon points='120,70 120,130 180,100' fill='%23FF0000'/%3E%3Ctext x='50%25' y='170' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='white' font-weight='bold'%3EQUIZ: CODE%3C/text%3E%3C/svg%3E",
        gameType: "quiz",
        difficulty: "moyen",
        content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz - Les bases de la programmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --yt-black: #0F0F0F;
            --yt-dark-gray: #222222;
            --yt-medium-gray: #383838;
            --yt-light-gray: #555555;
            --yt-text-primary: #FFFFFF;
            --yt-text-secondary: #AAAAAA;
            --yt-red: #FF0000;
            --yt-red-darker: #CC0000;
        }
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--yt-black);
            color: var(--yt-text-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .container {
            background-color: var(--yt-dark-gray);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 650px;
        }
        h1 {
            color: var(--yt-text-primary);
            text-align: center;
            font-size: 2em;
            margin-bottom: 30px;
            font-weight: 700;
        }
        .question-card {
            background-color: var(--yt-medium-gray);
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 5px solid var(--yt-red);
        }
        .question-card h3 {
            color: var(--yt-text-primary);
            font-size: 1.4em;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .option {
            background-color: var(--yt-light-gray);
            border: 2px solid transparent; /* Pour éviter le décalage au hover/selected */
            padding: 15px 20px;
            margin: 12px 0;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            font-size: 1em;
            color: var(--yt-text-secondary);
        }
        .option:hover {
            background-color: #656565; /* Gris un peu plus clair pour hover */
            border-color: #757575;
            color: var(--yt-text-primary);
        }
        .option.selected {
            background-color: var(--yt-red);
            border-color: var(--yt-red-darker);
            color: var(--yt-text-primary);
            font-weight: 500;
        }
        button {
            background-color: var(--yt-red);
            color: var(--yt-text-primary);
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 700;
            text-transform: uppercase;
            transition: background-color 0.2s ease, transform 0.1s ease;
            display: block;
            width: 100%;
            margin-top: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        button:hover {
            background-color: var(--yt-red-darker);
        }
        button:active {
            transform: translateY(1px);
        }
        button:disabled {
            background-color: var(--yt-light-gray);
            color: var(--yt-text-secondary);
            cursor: not-allowed;
            box-shadow: none;
        }
        .result-view {
            text-align: center;
            padding: 30px;
            background-color: var(--yt-medium-gray);
            border-radius: 8px;
        }
        .result-view h2 {
            font-size: 1.8em;
            margin-bottom: 15px;
            color: var(--yt-text-primary);
        }
        .result-view p {
            font-size: 1.2em;
            color: var(--yt-text-secondary);
            margin-bottom: 25px;
        }
        .result-view p span {
            color: var(--yt-text-primary);
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Les bases de la programmation</h1>
        <div id="quiz-area">
            <div class="question-card">
                <h3>Qu'est-ce qu'une variable en programmation ?</h3>
                <div class="option" onclick="selectAnswer(this, 0, 0)">Un espace mémoire nommé pour stocker des données</div>
                <div class="option" onclick="selectAnswer(this, 0, 1)">Une fonction mathématique</div>
                <div class="option" onclick="selectAnswer(this, 0, 2)">Un type de boucle</div>
                <div class="option" onclick="selectAnswer(this, 0, 3)">Un opérateur logique</div>
            </div>
            
            <div class="question-card">
                <h3>Quelle est la différence entre = et == en programmation ?</h3>
                <div class="option" onclick="selectAnswer(this, 1, 0)">= est utilisé pour la multiplication, == pour la division</div>
                <div class="option" onclick="selectAnswer(this, 1, 1)">= est utilisé pour l'affectation, == pour la comparaison</div>
                <div class="option" onclick="selectAnswer(this, 1, 2)">= est utilisé pour la déclaration, == pour l'initialisation</div>
                <div class="option" onclick="selectAnswer(this, 1, 3)">Il n'y a pas de différence</div>
            </div>
            
            <button id="submit-btn" onclick="submitQuiz()">Vérifier</button>
        </div>
        
        <div id="result-view" class="result-view" style="display:none;">
            <h2>Résultat du Quiz</h2>
            <p>Votre score : <span id="score-value">0</span> / <span id="total-questions">2</span></p>
            <button onclick="restartQuiz()">Recommencer</button>
        </div>
    </div>

    <script>
        const questions = [ { correctAnswerIndex: 0 }, { correctAnswerIndex: 1 } ];
        let userAnswers = Array(questions.length).fill(null);

        function selectAnswer(optionElement, questionIndex, answerIndex) {
            const questionCard = optionElement.closest('.question-card');
            questionCard.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            optionElement.classList.add('selected');
            userAnswers[questionIndex] = answerIndex;
        }

        function submitQuiz() {
            let score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === questions[index].correctAnswerIndex) score++;
            });
            document.getElementById('score-value').textContent = score;
            document.getElementById('total-questions').textContent = questions.length;
            document.getElementById('quiz-area').style.display = 'none';
            document.getElementById('result-view').style.display = 'block';
        }

        function restartQuiz() {
            userAnswers.fill(null);
            document.querySelectorAll('.option.selected').forEach(opt => opt.classList.remove('selected'));
            document.getElementById('quiz-area').style.display = 'block';
            document.getElementById('result-view').style.display = 'none';
        }
    </script>
</body>
</html>`
    },

    // --- Exemple de Flashcards (Thème Noir & Rouge affirmé) ---
    {
        id:"fox-2-61257c64-7ed7-4b30-a459-147",
        title: "Vocabulaire français-anglais",
        type: "pdf",
        sourceFileName: "vocabulaire.pdf",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23101010'/%3E%3Crect x='60' y='40' width='180' height='120' rx='10' ry='10' fill='%23222222' stroke='%23FF0000' stroke-width='3'/%3E%3Ctext x='150' y='90' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' fill='white'%3EFR%3C/text%3E%3Cpath d='M140 110 L160 110' stroke='white' stroke-width='2'/%3E%3Ctext x='150' y='130' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' fill='white'%3EEN%3C/text%3E%3C/svg%3E",
        gameType: "flashcards",
        difficulty: "facile",
        content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flashcards - Vocabulaire</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --yt-black: #0F0F0F;
            --yt-dark-gray: #222222;
            --yt-medium-gray: #383838;
            --yt-text-primary: #FFFFFF;
            --yt-text-secondary: #AAAAAA;
            --yt-red: #FF0000;
            --yt-red-darker: #CC0000;
        }
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--yt-black);
            color: var(--yt-text-primary);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            box-sizing: border-box;
        }
        .container {
            background-color: var(--yt-dark-gray);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 450px;
        }
        h1 { 
            color: var(--yt-text-primary);
            margin-bottom: 10px;
            font-size: 2em;
            font-weight: 700;
        }
        p.instructions { 
            color: var(--yt-text-secondary);
            margin-bottom: 30px;
            font-size: 0.95em;
        }
        .flashcard-viewport {
            perspective: 1200px; /* Increased perspective for more depth */
            width: 100%;
            height: 280px; /* Slightly larger card */
            margin-bottom: 30px;
        }
        .flashcard {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smoother, slightly slower flip */
            cursor: pointer;
        }
        .flashcard.is-flipped {
            transform: rotateY(180deg);
        }
        .flashcard-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column; /* Allow for language label */
            align-items: center;
            justify-content: center;
            font-size: 2.2em; /* Larger text on card */
            font-weight: 500;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            padding: 20px;
            box-sizing: border-box;
        }
        .flashcard-face .lang-label {
            font-size: 0.5em;
            color: var(--yt-text-secondary);
            position: absolute;
            top: 15px;
            left: 20px;
            font-weight: 400;
        }
        .flashcard-front {
            background-color: var(--yt-medium-gray);
            color: var(--yt-text-primary);
            border: 2px solid var(--yt-light-gray);
        }
        .flashcard-front .lang-label { color: var(--yt-red); }
        .flashcard-back {
            background-color: var(--yt-red);
            color: var(--yt-text-primary);
            border: 2px solid var(--yt-red-darker);
            transform: rotateY(180deg);
        }
        .flashcard-back .lang-label { color: rgba(255,255,255,0.7); }

        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        .controls button {
            background-color: var(--yt-medium-gray);
            color: var(--yt-text-secondary);
            border: 2px solid var(--yt-light-gray);
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: 110px; /* Ensure buttons have same width */
        }
        .controls button:hover:not(:disabled) {
            background-color: var(--yt-light-gray);
            border-color: var(--yt-text-secondary);
            color: var(--yt-text-primary);
        }
        .controls button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .progress-text {
            font-size: 1em;
            color: var(--yt-text-secondary);
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Vocabulaire</h1>
        <p class="instructions">Cliquez sur la carte pour la retourner.</p>

        <div class="flashcard-viewport">
            <div class="flashcard" id="flashcard" onclick="flipCard()">
                <div class="flashcard-face flashcard-front">
                    <span class="lang-label">Français</span>
                    <span id="card-front-text"></span>
                </div>
                <div class="flashcard-face flashcard-back">
                    <span class="lang-label">Anglais</span>
                    <span id="card-back-text"></span>
                </div>
            </div>
        </div>
        
        <div class="controls">
            <button id="prev-btn" onclick="prevCard()">Précédent</button>
            <span class="progress-text" id="progress">1 / 5</span>
            <button id="next-btn" onclick="nextCard()">Suivant</button>
        </div>
    </div>

    <script>
        const flashcardData = [
            { front: "Maison", back: "House" }, { front: "Voiture", back: "Car" },
            { front: "Chien", back: "Dog" }, { front: "Chat", back: "Cat" }, { front: "Arbre", back: "Tree" }
        ];
        let currentCardIndex = 0;
        const flashcardEl = document.getElementById('flashcard');
        const frontTextEl = document.getElementById('card-front-text');
        const backTextEl = document.getElementById('card-back-text');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressEl = document.getElementById('progress');

        function displayCard() {
            const card = flashcardData[currentCardIndex];
            frontTextEl.textContent = card.front;
            backTextEl.textContent = card.back;
            flashcardEl.classList.remove('is-flipped'); // Ensure card is reset to front
            setTimeout(() => { // Small delay to ensure the text content is updated before any potential re-flip animation
                 flashcardEl.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }, 50);
            updateNavigation();
        }
        function flipCard() {
            flashcardEl.classList.toggle('is-flipped');
        }
        function nextCard() {
            if (currentCardIndex < flashcardData.length - 1) {
                flashcardEl.style.transition = 'none'; // Temporarily disable transition for instant content update
                currentCardIndex++;
                displayCard();
            }
        }
        function prevCard() {
            if (currentCardIndex > 0) {
                flashcardEl.style.transition = 'none'; // Temporarily disable transition for instant content update
                currentCardIndex--;
                displayCard();
            }
        }
        function updateNavigation() {
            prevBtn.disabled = currentCardIndex === 0;
            nextBtn.disabled = currentCardIndex === flashcardData.length - 1;
            progressEl.textContent = \`\${currentCardIndex + 1} / \${flashcardData.length}\`;
        }
        displayCard();
    </script>
</body>
</html>`
    },

    // --- Exemple de Jeu interactif (Association - Thème Noir & Rouge affirmé) ---
    {
        id:"fox-3-61257c64-78957-4b30-a689-147",
        title: "Les planètes du système solaire lol",
        type: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=libKVRa01L8",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23101010'/%3E%3Ccircle cx='150' cy='100' r='70' fill='%23222222' stroke='%23FF0000' stroke-width='3'/%3E%3Ccircle cx='110' cy='70' r='12' fill='%23FF0000'/%3E%3Ccircle cx='190' cy='130' r='15' fill='%23FF0000'/%3E%3Ctext x='150' y='105' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='white' font-weight='bold'%3EMATCH%3C/text%3E%3C/svg%3E",
        gameType: "interactive",
        difficulty: "moyen",
        content: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeu d'association - Planètes</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --yt-black: #0F0F0F;
            --yt-dark-gray: #222222;
            --yt-medium-gray: #383838;
            --yt-light-gray: #555555;
            --yt-text-primary: #FFFFFF;
            --yt-text-secondary: #AAAAAA;
            --yt-red: #FF0000;
            --yt-red-darker: #CC0000;
            --yt-green-success: #1DB954; /* Spotify Green, distinct success color */
            --yt-green-success-darker: #179443;
        }
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--yt-black);
            color: var(--yt-text-primary);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .container {
            background-color: var(--yt-dark-gray);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 750px; /* Slightly wider */
            text-align: center;
        }
        h1 { 
            color: var(--yt-text-primary);
            font-size: 2em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        p.instructions {
            color: var(--yt-text-secondary);
            margin-bottom: 30px;
            font-size: 0.95em;
        }
        .game-board {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 30px;
        }
        .column {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .item {
            background-color: var(--yt-medium-gray);
            border: 2px solid var(--yt-light-gray);
            padding: 18px 15px; /* More padding */
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease-out;
            font-size: 1em;
            color: var(--yt-text-secondary);
            text-align: left;
            min-height: 60px;
            display: flex;
            align-items: center;
            line-height: 1.4;
        }
        .item:hover:not(.matched):not(.selected) {
            background-color: var(--yt-light-gray);
            border-color: var(--yt-text-secondary);
            color: var(--yt-text-primary);
            transform: translateY(-2px); /* Subtle lift effect */
        }
        .item.selected {
            background-color: var(--yt-red);
            border-color: var(--yt-red-darker);
            color: var(--yt-text-primary);
            font-weight: 500;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
        }
        .item.matched {
            background-color: var(--yt-green-success);
            border-color: var(--yt-green-success-darker);
            color: var(--yt-text-primary);
            font-weight: 500;
            opacity: 0.9;
            cursor: default;
            pointer-events: none; /* Make non-interactive */
        }
        .item.incorrect {
            background-color: var(--yt-red) !important; /* Use important to override other states if needed */
            border-color: var(--yt-red-darker) !important;
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .status-panel {
            background-color: var(--yt-medium-gray);
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 1em;
            color: var(--yt-text-secondary);
        }
        .status-panel p { margin: 8px 0; }
        .status-panel span { color: var(--yt-text-primary); font-weight: 700; }

        .completion-message {
            display: none;
            padding: 30px;
            background-color: var(--yt-medium-gray);
            border-radius: 8px;
            border-top: 5px solid var(--yt-green-success);
        }
        .completion-message h2 {
            font-size: 1.8em;
            color: var(--yt-green-success);
            margin-bottom: 10px;
        }
        .completion-message p {
            font-size: 1.1em;
            color: var(--yt-text-secondary);
            margin-bottom: 25px;
        }
        .completion-message span { color: var(--yt-text-primary); font-weight: bold; }
        .completion-message button {
            background-color: var(--yt-red);
            color: var(--yt-text-primary);
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 700;
            text-transform: uppercase;
            transition: background-color 0.2s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .completion-message button:hover { background-color: var(--yt-red-darker); }
    </style>
</head>
<body>
    <div class="container">
        <h1>Les planètes du système solaire</h1>
        <p class="instructions">Associez chaque planète à sa caractéristique principale.</p>
        
        <div id="game-area">
            <div class="game-board">
                <div class="column" id="planets-column"></div>
                <div class="column" id="facts-column"></div>
            </div>
            <div class="status-panel">
                <p>Paires trouvées: <span id="score">0</span> / <span id="total-pairs">0</span></p>
                <p>Tentatives: <span id="attempts">0</span></p>
            </div>
        </div>
        
        <div id="completion-message">
            <h2>Félicitations !</h2>
            <p>Vous avez associé toutes les planètes en <span id="final-attempts">0</span> tentatives.</p>
            <button onclick="initGame()">Rejouer</button>
        </div>
    </div>

    <script>
        const gameData = [
            { id: "mercure", planet: "Mercure", fact: "La plus proche du Soleil" }, { id: "venus", planet: "Vénus", fact: "La plus chaude du système" },
            { id: "terre", planet: "Terre", fact: "Notre planète, seule avec eau liquide" }, { id: "mars", planet: "Mars", fact: "La fameuse planète rouge" },
            { id: "jupiter", planet: "Jupiter", fact: "La plus grande planète gazeuse" }, { id: "saturne", planet: "Saturne", fact: "Célèbre pour ses anneaux" }
        ];
        let selectedPlanetEl = null, selectedFactEl = null, score = 0, attempts = 0, totalPairs = gameData.length;
        const planetsCol = document.getElementById('planets-column'), factsCol = document.getElementById('facts-column');
        const scoreDisplay = document.getElementById('score'), totalPairsDisplay = document.getElementById('total-pairs');
        const attemptsDisplay = document.getElementById('attempts'), completionMsgEl = document.getElementById('completion-message');
        const finalAttemptsDisplay = document.getElementById('final-attempts'), gameAreaEl = document.getElementById('game-area');

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        function createItem(text, id, type) {
            const el = document.createElement('div');
            el.classList.add('item');
            el.textContent = text;
            el.dataset.id = id;
            el.dataset.type = type;
            el.onclick = () => handleItemClick(el);
            return el;
        }
        function initGame() {
            score = 0; attempts = 0; selectedPlanetEl = null; selectedFactEl = null;
            planetsCol.innerHTML = ''; factsCol.innerHTML = '';
            completionMsgEl.style.display = 'none';
            gameAreaEl.style.display = 'block';

            shuffleArray([...gameData]).forEach(d => planetsCol.appendChild(createItem(d.planet, d.id, 'planet')));
            shuffleArray([...gameData]).forEach(d => factsCol.appendChild(createItem(d.fact, d.id, 'fact')));
            updateStatus();
        }
        function handleItemClick(itemEl) {
            if (itemEl.classList.contains('matched') || itemEl.classList.contains('selected')) return;
            const type = itemEl.dataset.type;

            if (type === 'planet') {
                if (selectedPlanetEl) selectedPlanetEl.classList.remove('selected');
                selectedPlanetEl = itemEl;
            } else { // type === 'fact'
                if (selectedFactEl) selectedFactEl.classList.remove('selected');
                selectedFactEl = itemEl;
            }
            itemEl.classList.add('selected');

            if (selectedPlanetEl && selectedFactEl) checkMatch();
        }
        function checkMatch() {
            attempts++;
            if (selectedPlanetEl.dataset.id === selectedFactEl.dataset.id) {
                score++;
                [selectedPlanetEl, selectedFactEl].forEach(el => {
                    el.classList.remove('selected'); el.classList.add('matched');
                });
                if (score === totalPairs) {
                    gameAreaEl.style.display = 'none';
                    completionMsgEl.style.display = 'block';
                    finalAttemptsDisplay.textContent = attempts;
                }
            } else {
                [selectedPlanetEl, selectedFactEl].forEach(el => el.classList.add('incorrect'));
                setTimeout(() => {
                    if(selectedPlanetEl) selectedPlanetEl.classList.remove('incorrect', 'selected');
                    if(selectedFactEl) selectedFactEl.classList.remove('incorrect', 'selected');
                    // Ne pas réinitialiser selectedPlanetEl et selectedFactEl ici pour permettre à l'utilisateur de changer seulement un des deux
                }, 600); // durée de l'anim + petit délai
            }
            // Réinitialiser la sélection uniquement si ce n'est pas un match,
            // ou si c'est un match mais que le jeu n'est pas fini, pour la prochaine paire.
            // Si c'est un match, les éléments sont marqués 'matched' et ne seront plus sélectionnables.
            if (!(selectedPlanetEl.dataset.id === selectedFactEl.dataset.id && score < totalPairs)) {
                 // Selected items are kept if incorrect, so user can change one.
                 // If match, they are .matched and effectively unselectable by handleItemClick.
                 // So, only clear here if they were incorrect.
                 if (selectedPlanetEl.dataset.id !== selectedFactEl.dataset.id) {
                    setTimeout(() => { // Clear selection after shake animation
                        if (selectedPlanetEl && !selectedPlanetEl.classList.contains('matched')) selectedPlanetEl.classList.remove('selected');
                        if (selectedFactEl && !selectedFactEl.classList.contains('matched')) selectedFactEl.classList.remove('selected');
                        selectedPlanetEl = null; selectedFactEl = null;
                    }, 600);
                 } else { // If it was a match
                    selectedPlanetEl = null; selectedFactEl = null;
                 }
            }
            updateStatus();
        }
        function updateStatus() {
            scoreDisplay.textContent = score;
            totalPairsDisplay.textContent = totalPairs;
            attemptsDisplay.textContent = attempts;
        }
        initGame();
    </script>
</body>
</html>`
    }
];