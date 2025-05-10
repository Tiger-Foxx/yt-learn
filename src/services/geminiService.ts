// import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI as GoogleGenerativeAI } from "@google/genai";

import APP_CONFIG from '@/config/appConfig';
import {extractHTML, parseJSON} from '@/utils/parsers';
import {
    SPEC_FROM_VIDEO_PROMPT,
    SPEC_FROM_PDF_PROMPT,
    CODE_FROM_SPEC_PROMPT,
    QUIZ_FROM_VIDEO_PROMPT,
    QUIZ_FROM_PDF_PROMPT,
    FLASHCARDS_FROM_VIDEO_PROMPT,
    FLASHCARDS_FROM_PDF_PROMPT,
    SPEC_ADDENDUM
} from '@/utils/prompts';

// Configuration pour la gestion des clés API
interface ApiKeyConfig {
    key: string;
    name: string;
    lastUsed: number;
    quotaExceeded: boolean;
    resetTime?: number; // Timestamp quand la clé sera réinitialisée
}

// Classe pour gérer les clés API
class ApiKeyManager {
    private apiKeys: ApiKeyConfig[] = [];
    private currentKeyIndex: number = 0;
    private readonly RESET_TIME_MS: number = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    constructor() {
        this.initializeKeys();
    }

    private initializeKeys() {
        // Initialiser toutes les clés disponibles depuis les variables d'environnement
        const keyVariables = [
            { env: import.meta.env.VITE_GEMINI_API_KEY, name: 'PRIMARY' },
            { env: import.meta.env.VITE_GEMINI_API_KEY_2, name: 'SECONDARY_1' },
            { env: import.meta.env.VITE_GEMINI_API_KEY_3, name: 'SECONDARY_2' },
            { env: import.meta.env.VITE_GEMINI_API_KEY_4, name: 'SECONDARY_3' }
        ];

        this.apiKeys = keyVariables
            .filter(k => k.env && k.env.trim() !== '')
            .map(k => ({
                key: k.env,
                name: k.name,
                lastUsed: 0,
                quotaExceeded: false
            }));

        if (this.apiKeys.length === 0) {
            console.error("ERREUR CRITIQUE: Aucune clé API Gemini valide n'a été trouvée.");
        }
    }

    public getCurrentKey(): string {
        this.checkKeyResets();

        // Si toutes les clés ont atteint leur quota
        if (this.allKeysExhausted()) {
            throw new Error("Toutes les clés API ont atteint leur quota. Veuillez réessayer plus tard.");
        }

        // Si la clé actuelle a atteint son quota, passer à la suivante
        while (this.apiKeys[this.currentKeyIndex].quotaExceeded) {
            this.rotateToNextKey();
        }

        // Mettre à jour le timestamp de dernière utilisation
        this.apiKeys[this.currentKeyIndex].lastUsed = Date.now();

        return this.apiKeys[this.currentKeyIndex].key;
    }

    public markCurrentKeyAsExhausted() {
        if (this.apiKeys.length === 0) return;

        // Marquer la clé actuelle comme ayant atteint son quota
        this.apiKeys[this.currentKeyIndex].quotaExceeded = true;
        this.apiKeys[this.currentKeyIndex].resetTime = Date.now() + this.RESET_TIME_MS;

        console.warn(`Clé API ${this.apiKeys[this.currentKeyIndex].name} a atteint son quota et sera mise en pause jusqu'à ${new Date(this.apiKeys[this.currentKeyIndex].resetTime || 0).toLocaleString()}`);

        // Passer à la clé suivante
        this.rotateToNextKey();
    }

    private rotateToNextKey() {
        if (this.apiKeys.length <= 1) return;

        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    }

    private checkKeyResets() {
        const now = Date.now();
        this.apiKeys.forEach(key => {
            if (key.quotaExceeded && key.resetTime && now >= key.resetTime) {
                key.quotaExceeded = false;
                key.resetTime = undefined;
                console.info(`Clé API ${key.name} a été réinitialisée et est maintenant disponible`);
            }
        });
    }

    private allKeysExhausted(): boolean {
        return this.apiKeys.every(key => key.quotaExceeded);
    }

    public getCurrentKeyInfo(): string {
        if (this.apiKeys.length === 0) return "Aucune clé API disponible";
        return `Utilisation de la clé ${this.apiKeys[this.currentKeyIndex].name}`;
    }

    public getKeysStatus(): string {
        return this.apiKeys.map(key =>
            `${key.name}: ${key.quotaExceeded ? 'Quota dépassé' : 'Disponible'}`
        ).join(', ');
    }
}

// Instancier le gestionnaire de clés API
const apiKeyManager = new ApiKeyManager();

// Fonction pour obtenir une instance de l'API Gemini avec la clé courante
function getGeminiInstance() {
    const currentKey = apiKeyManager.getCurrentKey();
    return new GoogleGenerativeAI({ apiKey: currentKey });
}

/**
 * Options pour les requêtes Gemini
 */
interface GenerateTextOptions {
    prompt: string;
    modelName?: string;
    temperature?: number;
    maxOutputTokens?: number;
    videoUrl?: string;
    pdfContent?: Blob;
}

/**
 * Interface pour les spécifications de jeu
 */
interface GameSpec {
    title?: string;
    description?: string;
    type?: string;
    mechanics?: string[];
    educationalGoals?: string[];
    difficulty?: string;
    targetAudience?: string;
    additionalDetails?: string;
    addendum?: string;
    summaryOfVideo_origin_of_the_game?: string;
}

/**
 * Interface pour les quiz générés
 */
export interface Quiz {
    title: string;
    questions: {
        question: string;
        options: string[];
        reponseCorrecte: number;
        explication: string;
    }[];
}

/**
 * Interface pour les flashcards générées
 */
export interface Flashcards {
    title: string;
    cards: {
        front: string;
        back: string;
    }[];
}

/**
 * Vérifie si l'erreur est liée à un dépassement de quota
 */
function isQuotaExceededError(error: any): boolean {
    if (!error) return false;

    // Vérifier les différentes formes possibles de l'erreur de quota
    const errorString = error.toString().toLowerCase();
    const errorMessage = error.message?.toLowerCase() || '';
    const responseBody = error.response?.body || error.responseBody || '';

    // Cas 1: Code d'erreur HTTP 429
    if (error.status === 429 || error.code === 429) {
        return true;
    }

    // Cas 2: Message contenant des mots clés liés aux quotas
    if (errorString.includes('quota') ||
        errorString.includes('limit') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('limit') ||
        errorString.includes('resource_exhausted') ||
        errorString.includes('resource has been exhausted')) {
        return true;
    }

    // Cas 3: Analyse du corps de réponse pour les formats JSON
    if (typeof responseBody === 'string') {
        try {
            const parsedBody = JSON.parse(responseBody);
            if (parsedBody.error?.code === 429 ||
                parsedBody.error?.status === 'RESOURCE_EXHAUSTED' ||
                parsedBody.error?.message?.toLowerCase().includes('quota')) {
                return true;
            }
        } catch (e) {
            // Si ce n'est pas du JSON valide, on peut analyser en tant que chaîne
            if (responseBody.toLowerCase().includes('quota') ||
                responseBody.toLowerCase().includes('resource_exhausted')) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Fonction de base pour générer du texte avec Gemini
 * avec gestion automatique des rotations de clés API en cas d'erreur de quota
 */
async function generateText(options: GenerateTextOptions): Promise<string> {
    const MAX_RETRIES = apiKeyManager.getKeysStatus().split(',').length; // Nombre de clés disponibles
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        attempts++;

        try {
            const {
                prompt,
                modelName = APP_CONFIG.api.gemini.models.default,
                temperature = APP_CONFIG.api.gemini.defaultTemperature,
                maxOutputTokens = APP_CONFIG.api.gemini.maxOutputTokens,
                videoUrl,
                pdfContent
            } = options;

            // Obtenir une instance de l'API avec la clé actuelle
            const genAI = getGeminiInstance();

            let result;

            if (videoUrl) {
                // Requête avec URL YouTube
                result = await genAI.models.generateContent({
                    model: APP_CONFIG.api.gemini.models.videoProcessing,
                    contents: [
                        prompt,
                        {
                            fileData: {
                                mimeType: 'video/mp4',
                                fileUri: videoUrl,
                            },
                        },
                    ],
                });
            } else if (pdfContent) {
                // Requête avec fichier PDF
                const fileAsGenerativePart: {
                    inlineData: {
                        data: string;
                        mimeType: string;
                    };
                } = {
                    inlineData: {
                        data: await blobToBase64(pdfContent),
                        mimeType: "application/pdf",
                    },
                };
                result = await genAI.models.generateContent({
                    model: APP_CONFIG.api.gemini.models.pdfProcessing,
                    contents: [prompt, fileAsGenerativePart],
                });
            } else {
                // Requête texte simple
                result = await genAI.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });
            }

            // Si la requête réussit, retourner le résultat
            return result.text || 'NO RESPONSE';

        } catch (error) {
            console.error(`Tentative ${attempts}/${MAX_RETRIES} a échoué:`, error);

            if (isQuotaExceededError(error)) {
                console.warn("Quota dépassé, changement de clé API...");
                apiKeyManager.markCurrentKeyAsExhausted();

                // Si ce n'est pas notre dernière tentative, on réessaie avec une nouvelle clé
                if (attempts < MAX_RETRIES) {
                    console.info(apiKeyManager.getCurrentKeyInfo());
                    continue;
                }
            }

            // Si l'erreur n'est pas liée au quota ou si c'était notre dernière tentative,
            // on propage l'erreur
            throw new Error(`Erreur Gemini: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Si on arrive ici, c'est que toutes les clés ont échoué
    throw new Error("Échec de génération après avoir essayé toutes les clés API disponibles.");
}

/**
 * Convertit un Blob en base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // Enlever le préfixe "data:application/pdf;base64,"
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error("Échec de conversion en base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * 1. Génère une spécification de jeu à partir d'une vidéo YouTube
 */
async function generateSpecFromVideo(videoUrl: string, additionalInstructions?: string): Promise<GameSpec> {
    try {
        // Créer le prompt complet en ajoutant les instructions supplémentaires
        let fullPrompt = SPEC_FROM_VIDEO_PROMPT;
        if (additionalInstructions) {
            fullPrompt += `\n\nAdditional instructions: ${additionalInstructions}`;
        }
        console.log("************** GENERATION DE SPEC DE JEUX PAR VIDEO *****************");
        console.log("************** PROMPT *****************", fullPrompt);
        console.log("************** URL VIDEO *****************", videoUrl);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const specResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.videoProcessing,
            prompt: fullPrompt,
            videoUrl: videoUrl,
        });

        console.log("************** SPEC RESPONSE BRUTE *****************", specResponse);

        // Traiter la réponse pour extraire la spec JSON
        const parsedResponse = parseJSON(specResponse);
        const spec = parsedResponse.spec || specResponse;
        console.log("************** SPEC JUSTE POST PARSING *****************", spec);
        spec.addendum = SPEC_ADDENDUM;

        console.log("************** SPEC RESPONSE TRAITE *****************", spec);

        return spec as GameSpec;
    } catch (error) {
        console.error("Erreur lors de la génération de specs depuis la vidéo:", error);
        throw new Error(`Échec de la génération de spécifications: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 2. Génère une spécification de jeu à partir d'un PDF
 */
async function generateSpecFromPDF(pdfContent: Blob, additionalInstructions?: string): Promise<GameSpec> {
    try {
        // Créer le prompt complet en ajoutant les instructions supplémentaires
        let fullPrompt = SPEC_FROM_PDF_PROMPT;
        if (additionalInstructions) {
            fullPrompt += `\n\nAdditional instructions (from user): ${additionalInstructions}`;
        }
        console.log("************** GENERATION DE SPEC DE JEUX PAR PDF *****************");
        console.log("************** PROMPT *****************", fullPrompt);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const specResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.pdfProcessing,
            prompt: fullPrompt,
            pdfContent: pdfContent,
        });

        // Traiter la réponse pour extraire la spec JSON
        const parsedResponse = parseJSON(specResponse);
        const spec = parsedResponse.spec || specResponse;
        spec.addendum = SPEC_ADDENDUM;

        return spec as GameSpec;
    } catch (error) {
        console.error("Erreur lors de la génération de specs depuis le PDF:", error);
        throw new Error(`Échec de la génération de spécifications: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 3. Génère du code HTML pour un jeu interactif basé sur les spécifications
 */
async function generateCodeFromSpec(spec: string, difficulty: string = APP_CONFIG.gameOptions.defaultDifficulty): Promise<string> {
    try {
        const prompt = `${CODE_FROM_SPEC_PROMPT}\n\nDifficulté: ${difficulty}\n\nSpécifications:\n${spec}`;
        console.log("************** GENERATION DE CODE PAR SPEC *****************");
        console.log("************** PROMPT *****************", prompt);
        console.log("************** SPEC *****************", spec);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const codeResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.codeGeneration,
            prompt: prompt,
            temperature: 0.7, // Légère créativité pour le code
        });

        // Assurez-vous que la réponse est du HTML valide
        if (!codeResponse.includes('<!DOCTYPE html>') && !codeResponse.includes('<html')) {
            throw new Error("Le code généré n'est pas un HTML valide");
        }

        return extractHTML(codeResponse);
    } catch (error) {
        console.error("Erreur lors de la génération de code depuis les specs:", error);
        throw new Error(`Échec de la génération de code: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 4. Génère un quiz directement à partir d'une vidéo YouTube
 */
async function generateQuizFromVideo(
    videoUrl: string,
    difficulty: string = APP_CONFIG.gameOptions.defaultDifficulty,
    questionCount: number = APP_CONFIG.gameOptions.defaultQuestionCount
): Promise<Quiz> {
    try {
        console.log("************** GENERATION DE QUIZZ PAR VIDEO *****************");
        const prompt = `${QUIZ_FROM_VIDEO_PROMPT}\n\nDifficulté: ${difficulty} sur une echelle de 1 a 10 \nNombre de questions: ${questionCount}`;
        console.log("************** PROMPT *****************", prompt);
        console.log("************** URL VIDEO *****************", videoUrl);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const quizResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.quiz,
            prompt: prompt,
            videoUrl: videoUrl,
        });

        // Traiter la réponse pour extraire le quiz JSON
        return parseJSON(quizResponse).quiz;
    } catch (error) {
        console.error("Erreur lors de la génération de quiz depuis la vidéo:", error);
        throw new Error(`Échec de la génération du quiz: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 5. Génère un quiz directement à partir d'un PDF
 */
async function generateQuizFromPDF(
    pdfContent: Blob,
    difficulty: string = APP_CONFIG.gameOptions.defaultDifficulty,
    questionCount: number = APP_CONFIG.gameOptions.defaultQuestionCount
): Promise<Quiz> {
    try {
        const prompt = `${QUIZ_FROM_PDF_PROMPT}\n\nDifficulté: ${difficulty}\nNombre de questions: ${questionCount}`;
        console.log("************** GENERATION DE QUIZZ PAR PDF *****************");
        console.log("************** PROMPT *****************", prompt);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const quizResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.quiz,
            prompt: prompt,
            pdfContent: pdfContent,
        });

        // Traiter la réponse pour extraire le quiz JSON
        return parseJSON(quizResponse).quiz;
    } catch (error) {
        console.error("Erreur lors de la génération de quiz depuis le PDF:", error);
        throw new Error(`Échec de la génération du quiz: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 6. Génère des flashcards à partir d'une vidéo YouTube
 */
async function generateFlashcardsFromVideo(
    videoUrl: string,
    count: number = APP_CONFIG.gameOptions.defaultFlashcardCount
): Promise<Flashcards> {
    try {
        const prompt = `${FLASHCARDS_FROM_VIDEO_PROMPT}\n\nNombre de flashcards: ${count}`;
        console.log("************** GENERATION DE FLASHCARDS PAR VIDEO *****************");
        console.log("************** PROMPT *****************", prompt);
        console.log("************** URL VIDEO *****************", videoUrl);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const flashcardsResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.flashcards,
            prompt: prompt,
            videoUrl: videoUrl,
        });

        // Traiter la réponse pour extraire les flashcards JSON
        return parseJSON(flashcardsResponse).flashcards;
    } catch (error) {
        console.error("Erreur lors de la génération de flashcards depuis la vidéo:", error);
        throw new Error(`Échec de la génération des flashcards: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 7. Génère des flashcards à partir d'un PDF
 */
async function generateFlashcardsFromPDF(
    pdfContent: Blob,
    count: number = APP_CONFIG.gameOptions.defaultFlashcardCount
): Promise<Flashcards> {
    try {
        const prompt = `${FLASHCARDS_FROM_PDF_PROMPT}\n\nNombre de flashcards: ${count}`;
        console.log("************** GENERATION DE FLASHCARDS PAR PDF *****************");
        console.log("************** PROMPT *****************", prompt);
        console.log("************** STATUT CLÉS API *****************", apiKeyManager.getKeysStatus());

        const flashcardsResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.flashcards,
            prompt: prompt,
            pdfContent: pdfContent,
        });

        // Traiter la réponse pour extraire les flashcards JSON
        return parseJSON(flashcardsResponse).flashcards;
    } catch (error) {
        console.error("Erreur lors de la génération de flashcards depuis le PDF:", error);
        throw new Error(`Échec de la génération des flashcards: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 8. Génère une miniature représentative pour une création
 */
function generateThumbnail(gameType: string): string {
    // Génère une fausse miniature basée sur le type de jeu
    const colors = {
        quiz: '#3B82F6', // Bleu
        flashcards: '#10B981', // Vert
        interactive: '#8B5CF6' // Violet
    };

    const color = colors[gameType as keyof typeof colors] || '#FF0000'; // Rouge par défaut

    // Crée un SVG simple
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E`;
}

/**
 * Expose l'état des clés API pour monitoring
 */
function getApiKeyStatus(): { currentKey: string, allKeys: string } {
    return {
        currentKey: apiKeyManager.getCurrentKeyInfo(),
        allKeys: apiKeyManager.getKeysStatus()
    };
}

export default {
    generateSpecFromVideo,
    generateSpecFromPDF,
    generateCodeFromSpec,
    generateQuizFromVideo,
    generateQuizFromPDF,
    generateFlashcardsFromVideo,
    generateFlashcardsFromPDF,
    generateThumbnail,
    getApiKeyStatus
};