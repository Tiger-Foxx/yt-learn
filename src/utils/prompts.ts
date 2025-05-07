/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */

export const SPEC_FROM_VIDEO_PROMPT = `You are a pedagogist and product designer with deep expertise in crafting engaging learning experiences via interactive web apps.

Examine the contents of the attached video. Then, write a detailed and carefully considered spec for an interactive web app designed to complement the video and reinforce its key idea or ideas. The recipient of the spec does not have access to the video, so the spec must be thorough and self-contained (the spec must not mention that it is based on a video). Here is an example of a spec written in response to a video about functional harmony:

"In music, chords create expectations of movement toward certain other chords and resolution towards a tonal center. This is called functional harmony.

Build me an interactive web app to help a learner understand the concept of functional harmony.

SPECIFICATIONS:
1. The app must feature an interactive keyboard.
2. The app must showcase all 7 diatonic triads that can be created in a major key (i.e., tonic, supertonic, mediant, subdominant, dominant, submediant, leading chord).
3. The app must somehow describe the function of each of the diatonic triads, and state which other chords each triad tends to lead to.
4. The app must provide a way for users to play different chords in sequence and see the results.
[etc.]"

The goal of the app that is to be built based on the spec is to enhance understanding through simple and playful design. The provided spec should not be overly complex, i.e., a junior web developer should be able to implement it in a single html file (with all styles and scripts inline). Most importantly, the spec must clearly outline the core mechanics of the app, and those mechanics must be highly effective in reinforcing the given video's key idea(s).

Provide the result as a JSON object containing a single field called "spec", whose value is the spec for the web app.`;

export const CODE_REGION_OPENER = '```';
export const CODE_REGION_CLOSER = '```';

export const SPEC_ADDENDUM = `\n\nThe app must be fully responsive and function properly on both desktop and mobile. Provide the code as a single, self-contained HTML document. All styles and scripts must be inline. In the result, encase the code between "${CODE_REGION_OPENER}" and "${CODE_REGION_CLOSER}" for easy parsing.`;

// Prompts pour les quiz
export const QUIZ_PROMPT = `
Génère un quiz interactif à propos du contenu suivant. Le quiz doit être de difficulté {difficulty} et contenir {questionCount} questions.

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
{content}
`;

// Prompts pour les flashcards
export const FLASHCARDS_PROMPT = `
Crée un ensemble de {cardCount} flashcards pédagogiques basées sur le contenu suivant.

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
{content}
`;

// Prompts pour les jeux interactifs
export const INTERACTIVE_GAME_PROMPT = `
Crée un jeu interactif de type "{gameType}" basé sur le contenu suivant.

Le jeu DOIT être un document HTML autonome et complet incluant tous les styles et scripts nécessaires en ligne (inline). 
Le jeu doit être prêt à être affiché dans un navigateur, sans dépendances externes.

Le jeu doit:
- Être engageant et éducatif
- Comporter des éléments interactifs appropriés au type de jeu
- Inclure un système de score ou de progression
- Fournir un feedback instructif
- Être entièrement fonctionnel dans un seul fichier HTML
- Utiliser des styles CSS modernes et attrayants
- Être responsive pour s'adapter à différentes tailles d'écran
- Avoir un design professionnel et bien pensé

Structure obligatoire:
1. Un doctype HTML5 complet
2. Tous les styles CSS dans une section <style> dans le <head>
3. Tous les scripts JavaScript dans une section <script> à la fin du <body>
4. Un design responsive avec des interfaces adaptées mobile et desktop
5. Des instructions claires pour l'utilisateur

Fournis le jeu complet sous forme de code HTML dans un format qui peut être sauvegardé directement en tant que fichier HTML fonctionnel.

Contenu:
{content}
`;