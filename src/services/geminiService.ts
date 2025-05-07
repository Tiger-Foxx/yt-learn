/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */

import {
    FinishReason,
    GenerateContentConfig,
    GenerateContentParameters,
    GoogleGenAI,
    HarmBlockThreshold,
    HarmCategory,
    Part,
    SafetySetting,
} from '@google/genai';
import APP_CONFIG from '@/config/appConfig';
import { parseJSON, parseHTML } from '@/utils/parsers';
import {
    SPEC_FROM_VIDEO_PROMPT,
    CODE_REGION_OPENER,
    CODE_REGION_CLOSER,
    SPEC_ADDENDUM
} from '@/utils/prompts';
import { GenerateTextOptions } from '@/types/gemini.types';

const GEMINI_API_KEY = APP_CONFIG.api.gemini.apiKey;

/**
 * Generate text content using the Gemini API, optionally including video data.
 *
 * @param options - Configuration options for the generation request.
 * @returns The response from the Gemini API.
 */
export async function generateText(
    options: GenerateTextOptions,
): Promise<string> {
    const {modelName, prompt, videoUrl, temperature = 0.75} = options;

    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is missing or empty');
    }

    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

    const parts: Part[] = [{text: prompt}];

    if (videoUrl) {
        try {
            parts.push({
                fileData: {
                    mimeType: 'video/mp4',
                    fileUri: videoUrl,
                },
            });
        } catch (error) {
            console.error('Error processing video input:', error);
            throw new Error(`Failed to process video input from URL: ${videoUrl}`);
        }
    }

    const generationConfig: GenerateContentConfig = {
        temperature,
        maxOutputTokens: APP_CONFIG.api.gemini.maxOutputTokens,
    };

    const request: GenerateContentParameters = {
        model: modelName,
        contents: [{role: 'user', parts}],
        config: generationConfig,
    };

    try {
        const response = await ai.models.generateContent(request);

        // Check for prompt blockage
        if (response.promptFeedback?.blockReason) {
            throw new Error(
                `Content generation failed: Prompt blocked (reason: ${response.promptFeedback.blockReason})`,
            );
        }

        // Check for response blockage
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('Content generation failed: No candidates returned.');
        }

        const firstCandidate = response.candidates[0];

        // Check for finish reasons other than STOP
        if (
            firstCandidate.finishReason &&
            firstCandidate.finishReason !== FinishReason.STOP
        ) {
            if (firstCandidate.finishReason === FinishReason.SAFETY) {
                throw new Error(
                    'Content generation failed: Response blocked due to safety settings.',
                );
            } else {
                throw new Error(
                    `Content generation failed: Stopped due to ${firstCandidate.finishReason}.`,
                );
            }
        }

        return response.text;
    } catch (error) {
        console.error(
            'An error occurred during Gemini API call or response processing:',
            error,
        );
        throw error;
    }
}

/**
 * Génère une spécification d'application à partir d'une vidéo YouTube
 */
export async function generateSpecFromVideo(videoUrl: string): Promise<string> {
    const specResponse = await generateText({
        modelName: APP_CONFIG.api.gemini.models.videoProcessing,
        prompt: SPEC_FROM_VIDEO_PROMPT,
        videoUrl: videoUrl,
    });

    let spec = parseJSON(specResponse).spec;
    spec += SPEC_ADDENDUM;

    return spec;
}

/**
 * Génère du code HTML à partir d'une spécification
 */
export async function generateCodeFromSpec(spec: string): Promise<string> {
    const codeResponse = await generateText({
        modelName: APP_CONFIG.api.gemini.models.codeGeneration,
        prompt: spec,
    });

    const code = parseHTML(
        codeResponse,
        CODE_REGION_OPENER,
        CODE_REGION_CLOSER,
    );

    console.log('Generated code:', code);

    return code;
}

/**
 * Génère un quiz basé sur le contenu fourni
 */
export async function generateQuiz(
    content: string,
    difficulty: string = APP_CONFIG.gameOptions.defaultDifficulty,
    questionCount: number = 14
): Promise<string> {
    const prompt = `
  Génère un quiz interactif à propos du contenu suivant. Le quiz doit être de difficulté ${difficulty} sur une echelle de 1 à 10 et contenir ${questionCount} questions.
  
  Pour chaque question, fournir:
  1. La question elle-même
  2. 4 options de réponse dont une seule est correcte
  3. L'option correcte
  4. Une explication concise de la réponse correcte
  
  Formate le résultat en JSON valide avec la structure suivante:
  {
    "quiz": {
      "titre": "Titre du quiz",
      "questions": [
        {
          "question": "Texte de la question",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "reponseCorrecte": 0, // Index de la réponse correcte (0-3)
          "explication": "Explication de la réponse correcte"
        },
        // autres questions
      ]
    }
  }
  
  Contenu:
  ${content}
  `;

    return await generateText({
        prompt,
        modelName: APP_CONFIG.api.gemini.models.quiz
    });
}

/**
 * Génère des flashcards basées sur le contenu fourni
 */
export async function generateFlashcards(
    content: string,
    cardCount: number = 10
): Promise<string> {
    const prompt =`
  Crée un ensemble de ${cardCount} flashcards pédagogiques basées sur le contenu suivant.
  
  Les flashcards doivent:
  - Couvrir les concepts et informations clés du contenu
  - Présenter une question ou un concept sur le recto
  - Fournir une réponse ou explication concise sur le verso
  - Être organisées du concept le plus fondamental au plus avancé
  
  Formate le résultat en JSON valide avec la structure suivante:
  {
    "flashcards": {
      "titre": "Titre approprié",
      "cards": [
        {
          "recto": "Question ou concept",
          "verso": "Réponse ou explication"
        },
        // autres cartes
      ]
    }
  }
  
  Contenu:
  ${content}
  `;

    return await generateText({
        prompt,
        modelName: APP_CONFIG.api.gemini.models.flashcards
    });
}

/**
 * Génère un jeu interactif basé sur le contenu fourni
 * Le jeu sera généré sous forme de document HTML autonome
 */
export async function generateInteractiveGame(
    content: string,
    gameType: string = APP_CONFIG.gameOptions.types[0]
): Promise<string> {
    const prompt = `
  Crée un jeu interactif de type "${gameType}" basé sur le contenu suivant.
  
  Le jeu DOIT être un document HTML autonome et complet incluant tous les styles et scripts nécessaires en ligne ou dans des balises (tu peux aussi te servir de tailwind css en cdn) (inline). 
  Le jeu doit être prêt à être affiché dans un navigateur, sans dépendances externes (sauf tailwindcss) (du genre a tenir dans un iframe).
  En fait, tu es un agent IA charge de generer des jeux instructifs et educatifs a partir de sujets de vieos yotube , et toi , tu es l'agent en charge du code , un agent a deja traite la video youtube et extrait le sujet 
  Le jeu doit:
  - Être engageant et éducatif
  - Comporter des éléments interactifs appropriés au type de jeu
  - Inclure un système de score ou de progression (si necessaire)
  - Fournir un feedback instructif
  - Être entièrement fonctionnel dans un seul fichier HTML
  - Utiliser des styles CSS modernes et attrayants
  - Être responsive pour s'adapter à différentes tailles d'écran (ca doit meme etre tellement bien responsive que ce sera du mobile first c'est tres important qu'il doit tres mobile friendly)
  
  Structure obligatoire:
  1. Un doctype HTML5 complet
  2. Tous les styles CSS dans une section <style> dans le <head>
  3. Tous les scripts JavaScript dans une section <script> à la fin du <body>
  4. Un design responsive avec des interfaces adaptées mobile et desktop
  5. Des instructions claires pour l'utilisateur
  
  Contenu:
  ${content}
  `;

    return await generateText({
        prompt,
        modelName: APP_CONFIG.api.gemini.models.interactiveGame,
        temperature: 0.8
    });
}

export default {
    generateText,
    generateSpecFromVideo,
    generateCodeFromSpec,
    generateQuiz,
    generateFlashcards,
    generateInteractiveGame,
};