/**
 * Configuration principale de l'application YTLearn
 */

export const APP_CONFIG = {
    // Informations générales
    appName: 'YTLearn',
    appDescription: 'Transformez vos vidéos YouTube en jeux interactifs et flashcards',
    appVersion: '1.0.0',

    // Configuration API
    api: {
        gemini: {
            apiKey: import.meta.env.VITE_GEMINI_API_KEY,
            models: {
                default: 'gemini-pro',
                videoProcessing: 'gemini-2.0-flash',
                codeGeneration: 'gemini-2.5-pro-preview-03-25',
                quiz: 'gemini-2.0-flash',
                flashcards: 'gemini-2.0-flash',
                interactiveGame: 'gemini-2.0-flash'
            },
            maxOutputTokens: 8192,
            temperature: 0.7,
        },
        youtube: {
            baseUrl: 'https://www.googleapis.com/youtube/v3',
            embedBaseUrl: 'https://www.youtube.com/embed/',
            maxResults: 10,
        }
    },

    // Limites et paramètres
    limits: {
        maxVideoLength: 20 * 60, // 20 minutes en secondes
        maxPdfSize: 10 * 1024 * 1024, // 10 MB
        maxStorageItems: 50, // Nombre maximum d'éléments dans le localStorage
    },

    // Options de jeu
    gameOptions: {
        types: ['quiz', 'flashcards', 'interactif'],
        difficultyLevels: ['facile', 'moyen', 'difficile'],
        defaultDifficulty: 'moyen'
    },

    // Chemins des routes
    routes: {
        home: '/',
        playspace: '/playspace',
        creation: '/creation',
        game: '/game/:id',
        notFound: '*'
    },

    // Configuration PWA
    pwa: {
        appName: 'YTLearn',
        shortName: 'YTLearn',
        description: 'Transformez vos vidéos en expériences d\'apprentissage',
        themeColor: '#FF0000',
        backgroundColor: '#0F0F0F',
        display: 'standalone',
        orientation: 'portrait',
        iconSizes: [72, 96, 128, 144, 152, 192, 384, 512]
    },

    // Configuration du stockage
    storage: {
        prefix: 'ytl_',
        gameHistoryKey: 'game_history',
        userPreferencesKey: 'user_prefs',
        installPromptKey: 'install_prompt_shown'
    }
};

export default APP_CONFIG;