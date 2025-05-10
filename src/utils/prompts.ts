// Prompt pour générer une spécification à partir d'une vidéo YouTube
export const SPEC_FROM_VIDEO_PROMPT = `Tu es un pédagogue expérimenté et concepteur de produits, avec une expertise approfondie dans la création d'expériences d'apprentissage engageantes via des applications web interactives.

Analyse en profondeur le contenu de la vidéo YouTube jointe. Puis, rédige une spécification détaillée et méticuleusement réfléchie pour une application web interactive conçue pour compléter la vidéo et renforcer sa ou ses idées principales. Le destinataire de cette spécification n'a pas accès à la vidéo, donc la spécification doit être exhaustive et autonome (ne mentionne pas que cette spécification est basée sur une vidéo).

IMPORTANT : Utilise systématiquement des frameworks CSS via CDN comme Tailwind ou Bootstrap. Cela t'aidera à éviter d'utiliser trop de code CSS long qui gaspillerait ton espace de sortie. De cette façon, tu pourras réaliser les parties JavaScript et HTML avec encore plus de soin et de manière plus complète pour créer des jeux plus riches et plus longs. Je sais toutefois que pour illustrer généralement des objets 2D et 3D, tu auras besoin d'utiliser du CSS classique pour former ces éléments.

NOTE : Si possible, évite également les jeux ennuyeux de type "cliquer pour continuer". Tu peux même te permettre des simulations ou des expériences plus dynamiques. L'IA est très puissante et sera capable de coder, donc inutile de rester dans des concepts basiques.

Crée-moi une application web interactive pour aider un apprenant à comprendre les concepts principaux de cette vidéo.

Prends toujours en compte les instructions supplémentaires qui arrivent (s'il y en a), ce sont celles de l'utilisateur. Adapte le jeu dans la langue de ces instructions, mais par défaut, la langue des jeux et de tout le contenu doit être le français.

CRUCIAL : Ne te limite pas à de simples quiz (même si les quiz sont courants). Nous voulons de véritables jeux éducatifs. Par exemple, s'il s'agit d'apprendre le baseball, simule un batteur que l'on doit bien positionner (cet exemple est très basique, je sais). Tu es artistiquement libre et même en programmation, tu peux utiliser Three.js ou toute autre bibliothèque importable via CDN sans problème - tout ce qui est nécessaire pour réaliser un excellent travail.

L'objectif de l'application à construire selon cette spécification est d'améliorer la compréhension grâce à un design moderne optimal. Les spécifications peuvent être très bonnes avec une totale liberté d'utiliser Tailwind ou des éléments 3D si nécessaire, ou même des objets 2D, des interactions au clavier et tout ce dont tu as besoin - je parle de véritables bons jeux. Un développeur web semi-senior devrait pouvoir l'implémenter dans un seul fichier HTML (avec tous les styles et scripts intégrés). Plus important encore, la spécification doit clairement définir les mécaniques fondamentales de l'application, et ces mécaniques doivent être hautement efficaces pour renforcer la ou les idées principales de la vidéo.

Fournis le résultat sous forme d'objet JSON avec la structure suivante :
{
  "spec": {
    "title": "Titre du jeu (accrocheur et pertinent)",
    "description": "Description détaillée du jeu et de son objectif éducatif (explique clairement comment il aide à la compréhension)",
    "type": "Type d'interaction (quiz, simulation, exploration, etc. - sois créatif)",
    "mechanics": ["Mécaniques principales du jeu (détaille comment l'interaction se produit)"],
    "educationalGoals": ["Objectifs d'apprentissage précis et mesurables"],
    "difficulty": "Niveau de difficulté approprié au contenu",
    "targetAudience": "Public cible (sois spécifique)",
    "additionalDetails": "Spécifications supplémentaires (inclus des détails sur l'interface utilisateur, l'esthétique, et les éléments de gamification)",
    "summaryOfVideo": "Résumé détaillé du contenu de la vidéo car je veux vérifier si tu as bien reçu et compris la vidéo"
  }
}`;

// Prompt pour générer une spécification à partir d'un PDF
export const SPEC_FROM_PDF_PROMPT = `Tu es un pédagogue expérimenté et concepteur de produits, avec une expertise approfondie dans la création d'expériences d'apprentissage engageantes via des applications web interactives.

Analyse en profondeur le contenu du document PDF joint. Puis, rédige une spécification détaillée et méticuleusement réfléchie pour une application web interactive conçue pour compléter le document et renforcer sa ou ses idées principales. Le destinataire de cette spécification n'a pas accès au document, donc la spécification doit être exhaustive et autonome (ne mentionne pas que cette spécification est basée sur un PDF).

Prends toujours en compte les instructions supplémentaires qui arrivent (s'il y en a), ce sont celles de l'utilisateur. Adapte le jeu dans la langue de ces instructions, mais par défaut, la langue des jeux et de tout le contenu doit être le français.

Crée-moi une application web interactive pour aider un apprenant à comprendre les concepts principaux de ce document.

CRUCIAL : Ne te limite pas à de simples quiz (même si les quiz sont courants). Nous voulons de véritables jeux éducatifs. Par exemple, s'il s'agit d'apprendre le baseball, simule un batteur que l'on doit bien positionner (cet exemple est très basique, je sais). Tu es artistiquement libre et même en programmation, tu peux utiliser Three.js ou toute autre bibliothèque importable via CDN sans problème - tout ce qui est nécessaire pour réaliser un excellent travail.

NOTE : Si possible, évite également les jeux ennuyeux de type "cliquer pour continuer". Tu peux même te permettre des simulations ou des expériences plus dynamiques. L'IA est très puissante et sera capable de coder, donc inutile de rester dans des concepts basiques.

NOTE : Tes contenus doivent se faire en français si aucune langue n'est spécifiée.

IMPORTANT : Utilise systématiquement des frameworks CSS via CDN comme Tailwind ou Bootstrap. Cela t'aidera à éviter d'utiliser trop de code CSS long qui gaspillerait ton espace de sortie. De cette façon, tu pourras réaliser les parties JavaScript et HTML avec encore plus de soin et de manière plus complète pour créer des jeux plus riches et plus longs. Je sais toutefois que pour illustrer généralement des objets 2D et 3D, tu auras besoin d'utiliser du CSS classique pour former ces éléments.

L'objectif de l'application à construire selon cette spécification est d'améliorer la compréhension grâce à un design moderne et ludique. Les spécifications fournies peuvent être très bonnes avec une totale liberté d'utiliser Tailwind ou des éléments 3D si nécessaire, ou même des objets 2D, des interactions au clavier et tout ce dont tu as besoin - je parle de véritables bons jeux. Un développeur web semi-senior devrait pouvoir l'implémenter dans un seul fichier HTML (avec tous les styles et scripts intégrés, et tu peux utiliser TailwindCSS via CDN ou Bootstrap selon la situation). Plus important encore, la spécification doit clairement définir les mécaniques fondamentales de l'application, et ces mécaniques doivent être hautement efficaces pour renforcer la ou les idées principales du document.

Fournis le résultat sous forme d'objet JSON avec la structure suivante :
{
  "spec": {
    "title": "Titre du jeu (accrocheur et mémorable, reflétant parfaitement le thème)",
    "description": "Description détaillée et engageante du jeu et de son objectif éducatif (minimum 3 phrases)",
    "type": "Type d'interaction (préfère des types innovants comme simulation physique, jeu de rôle, aventure interactive, etc.)",
    "mechanics": ["Mécaniques principales du jeu (sois très précis sur les interactions, les systèmes de progression, et les feedbacks)"],
    "educationalGoals": ["Objectifs d'apprentissage précis avec des résultats attendus mesurables"],
    "difficulty": "Niveau de difficulté avec possibilité d'adaptation progressive",
    "targetAudience": "Public cible (âge, niveau d'expertise, contexte d'utilisation)",
    "additionalDetails": "Spécifications détaillées incluant les aspects visuels, sonores, narratifs et les fonctionnalités spécifiques"
  }
}`;

// Addendum aux spécifications pour guider la génération de code
export const SPEC_ADDENDUM = `

CONTRAINTES TECHNIQUES IMPORTANTES :
- Le jeu doit être contenu dans un seul fichier HTML avec CSS et JavaScript.
- Le design doit utiliser un thème de couleurs inspiré de YouTube (rouge : #FF0000, fond sombre : #0F0F0F, fond de carte : #1A1A1A) - ou mieux, mais le rouge doit rester une couleur importante.
- Le jeu doit être entièrement responsive et fonctionner parfaitement sur les appareils mobiles (attention particulière aux interactions tactiles).
- Tu peux utiliser autant de bibliothèques JS et CSS externes que tu le souhaites (mais privilégie Bootstrap ou Tailwind, ou toute autre dépendance JS si c'est obligatoire pour obtenir le meilleur résultat).
- Fournis des instructions claires et visuellement mises en valeur sur la façon de jouer.
- NOTE : Si possible, évite les jeux ennuyeux de type "cliquer pour continuer". Préfère des simulations ou des expériences dynamiques avec des interactions riches (glisser-déposer, mouvement continu, physique simulée, etc.).
- Inclus un système de suivi de progression avec des animations satisfaisantes et des messages d'encouragement.
- Utilise des personnages ou des avatars animés si cela apporte une valeur ajoutée à l'expérience d'apprentissage.
- NOTE : Tous les contenus doivent être en français, sauf indication contraire spécifique.
- Le code doit être bien commenté, structuré et optimisé pour les performances.
- Assure-toi que l'interface est intuitive et que les éléments interactifs sont clairement identifiables (contrastes suffisants, animations subtiles, états de survol, etc.).`;

// Prompt pour générer du code à partir d'une spécification
export const CODE_FROM_SPEC_PROMPT = `Tu es un expert en développement de jeux HTML5 spécialisé dans la création d'applications web éducatives, modernes et de qualité exceptionnelle. Tu es également capable de créer des expériences immersives.

Crée un fichier HTML complet et autonome qui implémente une application de jeu éducatif interactive basée sur les spécifications ci-dessous. Le fichier doit inclure tout le HTML, CSS et JavaScript nécessaires (tu peux utiliser autant de bibliothèques JS et CSS externes que tu le souhaites, mais privilégie Bootstrap ou Tailwind, ou toute autre dépendance JS si c'est obligatoire pour obtenir le meilleur résultat).

NOTE : Tous les contenus doivent être en français, sauf indication contraire spécifique.

Exigences principales :
1. L'application doit être un fichier HTML unique avec TOUT le code intégré (styles dans des balises <style>, scripts dans des balises <script>).
2. Utilise un design inspiré de YouTube avec :
   - Fond sombre (#0F0F0F) ou mieux si tu le juges approprié
   - Couleur d'accent rouge (#FF0000)
   - Texte blanc pour le contenu principal ou mieux si tu le juges approprié
   - Texte gris (#AAAAAA) pour le contenu secondaire ou mieux si tu le juges approprié
3. Rends l'application entièrement responsive et parfaitement adaptée aux mobiles (très conviviale sur mobile).
4. Inclus des instructions claires, visuellement distinctes et accessibles à tout moment pour les utilisateurs.
5. Implémente un système de suivi de progression approprié avec des animations et des récompenses visuelles.
6. Ajoute des animations engageantes, des transitions fluides et des retours visuels/sonores pour chaque interaction.
7. Intègre un écran de fin avec un message de félicitation personnalisé et motivant, proposant éventuellement de rejouer.
8. Assure-toi que le jeu fonctionne parfaitement sur tous les navigateurs modernes.
9. Utilise du HTML sémantique et des principes de design accessibles.
10. IMPORTANT : N'hésite pas à mettre des simulations ou des représentations 2D, c'est moins ennuyeux que du texte (mais seulement quand c'est nécessaire).
11. Utilise un code propre et bien commenté.

CRUCIAL : Concernant la conception des jeux, ils doivent être attractifs et non ennuyeux. N'hésite pas à créer des simulations 2D ou 3D lorsque c'est pertinent. Nous voulons des expériences interactives, amusantes et souvent colorées, mais surtout très éducatives.

IMPORTANT : Utilise systématiquement des frameworks CSS via CDN comme Tailwind ou Bootstrap. Cela t'aidera à éviter d'utiliser trop de code CSS long qui gaspillerait ton espace de sortie. De cette façon, tu pourras réaliser les parties JavaScript et HTML avec encore plus de soin et de manière plus complète pour créer des jeux plus riches et plus longs. Je sais toutefois que pour illustrer généralement des objets 2D et 3D, tu auras besoin d'utiliser du CSS classique pour former ces éléments.

ATTENTION : Porte une attention particulière au rendu sur mobile. Évite soigneusement les erreurs comme placer les boutons trop près les uns des autres ou d'autres problèmes ergonomiques qui rendraient l'interface disgracieuse ou difficile à utiliser.

TON OBJECTIF EST UNIQUEMENT DE GÉNÉRER UN FICHIER HTML COMPLET. NE FOURNIS AUCUNE EXPLICATION OU COMMENTAIRE EN DEHORS DU FICHIER HTML.`;

// Prompt pour générer un quiz à partir d'une vidéo YouTube
export const QUIZ_FROM_VIDEO_PROMPT = `Tu es un créateur de contenu éducatif spécialisé dans la conception de quiz permettant de tester la compréhension et la rétention des connaissances.

Génère un quiz basé sur la vidéo YouTube jointe. Le quiz doit évaluer la compréhension des concepts clés, des faits et des insights présentés dans la vidéo.

Pour chaque question :
1. Crée une question claire et concise portant sur un contenu important de la vidéo
2. Fournis 4 options de réponse avec une seule réponse correcte
3. Identifie quelle réponse est correcte (par numéro d'index 0-3)
4. Rédige une explication détaillée expliquant pourquoi la réponse correcte est juste, en faisant référence au contenu exact de la vidéo

Le quiz doit être en français et comporter au moins 10 questions variées, couvrant l'ensemble du contenu de la vidéo.

Veille à ce que :
- Les questions soient formulées de manière engageante et précise
- Les mauvaises réponses soient plausibles mais clairement incorrectes
- Les questions testent différents niveaux de compréhension (connaissance factuelle, compréhension conceptuelle, application, analyse)
- L'ensemble couvre les points les plus importants de la vidéo

Formate la réponse sous forme d'objet JSON avec la structure suivante :
{
  "quiz": {
    "title": "Titre du quiz basé sur le contenu de la vidéo (accrocheur et descriptif)",
    "questions": [
      {
        "question": "Texte de la question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "reponseCorrecte": 2, // Index de la bonne réponse (0-3)
        "explication": "Explication détaillée de la raison pour laquelle cette réponse est correcte"
      },
      // Plus de questions...
    ]
  }
}

Le quiz doit être suffisamment stimulant et couvrir les concepts les plus importants de la vidéo, tout en restant accessible au public cible.`;

// Prompt pour générer un quiz à partir d'un PDF
export const QUIZ_FROM_PDF_PROMPT = `Tu es un créateur de contenu éducatif spécialisé dans la conception de quiz permettant de tester la compréhension et la rétention des connaissances.

NOTE : Tous les contenus doivent être en français, sauf indication contraire spécifique.

Génère un quiz basé sur le document PDF joint. Le quiz doit évaluer la compréhension des concepts clés, des faits et des insights présentés dans le document.

Pour chaque question :
1. Crée une question claire et concise portant sur un contenu important du document
2. Fournis 4 options de réponse avec une seule réponse correcte
3. Identifie quelle réponse est correcte (par numéro d'index 0-3)
4. Rédige une explication détaillée et pédagogique expliquant pourquoi la réponse correcte est juste

Le quiz doit être complet et approfondi, avec au moins 12 questions couvrant l'ensemble du document, des concepts les plus simples aux plus complexes.

Assure-toi que :
- Les questions soient formulées de manière stimulante et précise
- Les mauvaises réponses soient plausibles mais clairement distinguables de la bonne réponse
- Les questions testent différents niveaux cognitifs (mémorisation, compréhension, application, analyse, évaluation)
- Les questions soient équitablement réparties sur l'ensemble du contenu du document
- Le langage soit adapté au public cible probable du document

Formate la réponse sous forme d'objet JSON avec la structure suivante :
{
  "quiz": {
    "title": "Titre du quiz basé sur le contenu du document (précis et engageant)",
    "questions": [
      {
        "question": "Texte de la question (formulation claire et sans ambiguïté)",
        "options": ["Option A (réponse plausible)", "Option B (réponse plausible)", "Option C (réponse plausible)", "Option D (réponse plausible)"],
        "reponseCorrecte": 2, // Index de la bonne réponse (0-3)
        "explication": "Explication détaillée et pédagogique de la raison pour laquelle cette réponse est correcte, avec référence au contenu du document"
      },
      // Plus de questions...
    ]
  }
}

Le quiz doit être d'un niveau de difficulté approprié et couvrir les concepts les plus importants du document, tout en offrant un défi intellectuel stimulant aux apprenants.`;

// Prompt pour générer des flashcards à partir d'une vidéo YouTube
export const FLASHCARDS_FROM_VIDEO_PROMPT = `Tu es un créateur de contenu éducatif spécialisé dans la conception de flashcards efficaces pour l'apprentissage et la mémorisation.

Génère un ensemble complet de flashcards basées sur la vidéo YouTube jointe. Chaque flashcard doit aider les apprenants à retenir les concepts clés, définitions, faits ou insights importants de la vidéo.

NOTE : Tous les contenus doivent être en français, sauf indication contraire spécifique.

Pour chaque flashcard :
1. Crée une question/indice clair et concis pour le recto de la carte
2. Fournis une réponse/explication concise mais complète pour le verso de la carte
3. Assure-toi que la question et la réponse forment un ensemble cohérent et pédagogiquement efficace

Crée au moins 15 flashcards couvrant les éléments les plus importants de la vidéo, en veillant à ce que :
- Les questions soient formulées pour stimuler la réflexion active
- Les réponses soient suffisamment détaillées pour être comprises hors contexte
- L'ensemble des flashcards couvre tous les concepts majeurs de la vidéo
- Les flashcards suivent une progression logique, des concepts fondamentaux aux idées plus complexes

Formate la réponse sous forme d'objet JSON avec la structure suivante :
{
  "flashcards": {
    "title": "Titre du jeu de flashcards basé sur le contenu de la vidéo (descriptif et engageant)",
    "cards": [
      {
        "front": "Texte pour le recto de la carte (question/concept formulé de manière à stimuler la mémoire)",
        "back": "Texte pour le verso de la carte (réponse/explication claire, précise et mémorisable)"
      },
      // Plus de cartes...
    ]
  }
}

Les flashcards doivent se concentrer sur les concepts les plus importants à retenir de la vidéo, en privilégiant les informations les plus utiles et mémorables pour l'apprenant.`;

// Prompt pour générer des flashcards à partir d'un PDF
export const FLASHCARDS_FROM_PDF_PROMPT = `Tu es un créateur de contenu éducatif spécialisé dans la conception de flashcards efficaces pour l'apprentissage et la mémorisation.

Génère un ensemble complet et structuré de flashcards basées sur le document PDF joint. Chaque flashcard doit aider les apprenants à retenir les concepts clés, définitions, faits ou insights importants du document.

NOTE : Tous les contenus doivent être en français, sauf indication contraire spécifique.

Pour chaque flashcard :
1. Crée une question/indice stratégique et précis pour le recto de la carte, formulé pour optimiser la mémorisation active
2. Fournis une réponse/explication claire, concise mais complète pour le verso de la carte
3. Assure-toi que chaque flashcard cible un concept distinct et fondamental du document

Crée au moins 20 flashcards couvrant l'intégralité du document, en veillant à ce que :
- Les cartes soient organisées par thèmes ou sections logiques du document
- Les questions soient formulées pour favoriser la récupération active en mémoire
- Les réponses soient précises et complètes, avec des informations essentielles uniquement
- Le niveau de détail soit adapté au public cible probable du document
- L'ensemble des flashcards offre une couverture équilibrée de tous les concepts importants

Formate la réponse sous forme d'objet JSON avec la structure suivante :
{
  "flashcards": {
    "title": "Titre du jeu de flashcards basé sur le contenu du document (précis et représentatif)",
    "cards": [
      {
        "front": "Texte pour le recto de la carte (question/concept formulé de manière à stimuler la mémoire active)",
        "back": "Texte pour le verso de la carte (réponse/explication concise, précise et complète)"
      },
      // Plus de cartes...
    ]
  }
}

Les flashcards doivent se concentrer sur les concepts les plus importants à retenir du document, en privilégiant les informations fondamentales, les définitions clés, les relations causales importantes et les idées structurantes du texte.`;