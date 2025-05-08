import { GoogleGenerativeAI } from '@google/generative-ai';
import APP_CONFIG from '@/config/appConfig';
import { parseJSON } from '@/utils/parsers';
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

// Modèle et configuration de l'API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

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
 * Fonction de base pour générer du texte avec Gemini
 */
async function generateText(options: GenerateTextOptions): Promise<string> {
    try {
        const {
            prompt,
            modelName = APP_CONFIG.api.gemini.models.default,
            temperature = APP_CONFIG.api.gemini.defaultTemperature,
            maxOutputTokens = APP_CONFIG.api.gemini.maxOutputTokens,
            videoUrl,
            pdfContent
        } = options;

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature,
                maxOutputTokens,
            },
        });

        let result;

        if (videoUrl) {
            // Requête avec URL YouTube
            result = await model.generateContent([prompt, {  fileData: {
                    mimeType: 'video/mp4',
                    fileUri: videoUrl,
                }, }]);
        } else if (pdfContent) {
            // Requête avec fichier PDF
            const fileAsGenerativePart = {
                inlineData: {
                    data: await blobToBase64(pdfContent),
                    mimeType: "application/pdf"
                }
            };
            result = await model.generateContent([prompt, fileAsGenerativePart]);
        } else {
            // Requête texte simple
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erreur lors de la génération de contenu avec Gemini:", error);
        throw new Error(`Erreur Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
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
        console.log("************** GENERATION DE SPEC DE JEUX PAR VIDEO *****************")
        console.log("************** PROMPT *****************",fullPrompt , videoUrl)

        const specResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.videoProcessing,
            prompt: fullPrompt,
            videoUrl: videoUrl,
        });

        console.log("************** SPEC RESPONSE BRUTE *****************",specResponse )

        // Traiter la réponse pour extraire la spec JSON
        const parsedResponse = parseJSON(specResponse);
        let spec =  parsedResponse.spec || specResponse;
        console.log("************** SPEC JUSTE POST PARSING *****************",spec )
        spec.addendum = SPEC_ADDENDUM;

        console.log("************** SPEC RESPONSE TRAITE *****************",spec )

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
        console.log("************** GENERATION DE SPEC DE JEUX PAR pdf *****************")
        console.log("************** PROMPT *****************",fullPrompt )

        const specResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.pdfProcessing,
            prompt: fullPrompt,
            pdfContent: pdfContent,
        });

        // Traiter la réponse pour extraire la spec JSON
        const parsedResponse = parseJSON(specResponse);
        let spec = parsedResponse.spec || specResponse;
        spec.addendum= SPEC_ADDENDUM;

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
        console.log("************** GENERATION DE CODE PAR SPEC *****************")
        console.log("************** PROMPT *****************",prompt , spec )
        console.log("********** SPEC *****************",spec )

        const codeResponse = await generateText({
            modelName: APP_CONFIG.api.gemini.models.codeGeneration,
            prompt: prompt,
            temperature: 0.7, // Légère créativité pour le code
        });

        // Assurez-vous que la réponse est du HTML valide
        if (!codeResponse.includes('<!DOCTYPE html>') && !codeResponse.includes('<html')) {
            throw new Error("Le code généré n'est pas un HTML valide");
        }

        return codeResponse;
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
        console.log("************** GENERATION DE QUIZZ PAR VIDEO *****************")
        const prompt = `${QUIZ_FROM_VIDEO_PROMPT}\n\nDifficulté: ${difficulty} sur une echelle de 1 a 10 \nNombre de questions: ${questionCount}`;
        console.log("************** PROMPT *****************",prompt , videoUrl )
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
        console.log("************** GENERATION DE QUIZZ PAR PDF *****************")
        console.log("************** PROMPT *****************",prompt , pdfContent.slice(0,20) )
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

export default {
    generateSpecFromVideo,
    generateSpecFromPDF,
    generateCodeFromSpec,
    generateQuizFromVideo,
    generateQuizFromPDF,
    generateFlashcardsFromVideo,
    generateFlashcardsFromPDF,
    generateThumbnail
};