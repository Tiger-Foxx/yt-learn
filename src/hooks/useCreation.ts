import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import geminiService from '@/services/geminiService';
import storageService, { Creation } from '@/services/storageService';
import { exampleCreations } from '@/data/exampleCreations';

interface CreationOptions {
    type: 'quiz' | 'flashcards' | 'interactive';
    difficulty?: string;
    questionCount?: number;
    sourceType: 'youtube' | 'pdf';
    sourceContent: {
        url?: string;
        file?: File;
        title: string;
        id?: string;
    };
    additionalInstructions?: string;
}

/**
 * Hook pour gérer la création et le stockage des contenus éducatifs
 */
function useCreation() {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationProgress, setGenerationProgress] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [creationHistory, setCreationHistory] = useState<Creation[]>(
        storageService.getCreationHistory()
    );

    /**
     * Lors du premier montage, vérifier si nous devons ajouter des exemples
     */
    useEffect(() => {
        const history = storageService.getCreationHistory();

        // Si l'historique est vide, ajouter les exemples
        if (history.length === 0) {
            exampleCreations.forEach(example => {
                storageService.addCreation({
                    ...example,
                    id: uuidv4(),
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
            });

            // Rafraîchir l'historique
            refreshHistory();
        }
    }, []);

    /**
     * Met à jour l'historique des créations depuis le stockage
     */
    const refreshHistory = useCallback(() => {
        setCreationHistory(storageService.getCreationHistory());
    }, []);

    /**
     * Met à jour la progression de la génération
     */
    const updateProgress = async (step: string, targetProgress: number) => {
        setCurrentStep(step);

        const startProgress = generationProgress;
        const increment = (targetProgress - startProgress) / 10;

        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1));
            setGenerationProgress(prev => Math.min(prev + increment, targetProgress));
        }
    };

    /**
     * Génère le contenu éducatif en fonction du type et de la source
     */
    const generateContent = async (options: CreationOptions): Promise<string | null> => {
        setIsGenerating(true);
        setGenerationProgress(0);
        setCurrentStep(null);
        setError(null);

        try {
            const {
                type,
                sourceType,
                sourceContent,
                difficulty = 'moyen',
                questionCount = 10,
                additionalInstructions
            } = options;

            // Vérifications des entrées
            if (!sourceContent) {
                throw new Error('Contenu source manquant');
            }

            // Étape initiale commune
            await updateProgress('Initialisation', 10);

            let generatedContent: string;

            // Traitement selon le type de contenu à générer
            if (type === 'interactive') {
                // Pour les jeux interactifs : génération en deux étapes (spec → code)
                await updateProgress('Analyse du contenu', 20);

                // 1. Générer les spécifications
                let spec: any;
                if (sourceType === 'youtube') {
                    if (!sourceContent.url) {
                        throw new Error('URL YouTube manquante');
                    }

                    await updateProgress('Génération des spécifications', 40);
                    spec = await geminiService.generateSpecFromVideo(sourceContent.url, additionalInstructions);
                } else {
                    // Source PDF
                    if (!sourceContent.file) {
                        throw new Error('Fichier PDF manquant');
                    }

                    await updateProgress('Génération des spécifications', 40);
                    spec = await geminiService.generateSpecFromPDF(sourceContent.file, additionalInstructions);
                }

                // 2. Générer le code HTML à partir des specs
                await updateProgress('Création du jeu interactif', 70);
                generatedContent = await geminiService.generateCodeFromSpec(JSON.stringify(spec), difficulty);
            }
            else if (type === 'quiz') {
                // Pour les quiz : génération directe
                await updateProgress('Analyse du contenu', 25);

                if (sourceType === 'youtube') {
                    if (!sourceContent.url) {
                        throw new Error('URL YouTube manquante');
                    }

                    await updateProgress('Génération du quiz', 60);
                    const quiz = await geminiService.generateQuizFromVideo(
                        sourceContent.url,
                        difficulty,
                        questionCount
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Notez que dans une implémentation réelle, vous devriez avoir une fonction
                    // qui convertit le quiz en HTML complet, mais pour l'exemple:
                    generatedContent = JSON.stringify(quiz); // En production, utilisez une fonction comme generateQuizHTML
                } else {
                    if (!sourceContent.file) {
                        throw new Error('Fichier PDF manquant');
                    }

                    await updateProgress('Génération du quiz', 60);
                    const quiz = await geminiService.generateQuizFromPDF(
                        sourceContent.file,
                        difficulty,
                        questionCount
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Pareil ici, utilisez une vraie fonction de rendu
                    generatedContent = JSON.stringify(quiz); // En production, utilisez une fonction comme generateQuizHTML
                }
            }
            else if (type === 'flashcards') {
                // Pour les flashcards : génération directe
                await updateProgress('Analyse du contenu', 25);

                if (sourceType === 'youtube') {
                    if (!sourceContent.url) {
                        throw new Error('URL YouTube manquante');
                    }

                    await updateProgress('Génération des flashcards', 60);
                    const flashcards = await geminiService.generateFlashcardsFromVideo(
                        sourceContent.url,
                        questionCount // Utiliser questionCount comme nombre de cartes
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Pareil ici, utilisez une vraie fonction de rendu
                    generatedContent = JSON.stringify(flashcards); // En production, utilisez une fonction comme generateFlashcardsHTML
                } else {
                    if (!sourceContent.file) {
                        throw new Error('Fichier PDF manquant');
                    }

                    await updateProgress('Génération des flashcards', 60);
                    const flashcards = await geminiService.generateFlashcardsFromPDF(
                        sourceContent.file,
                        questionCount // Utiliser questionCount comme nombre de cartes
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Pareil ici, utilisez une vraie fonction de rendu
                    generatedContent = JSON.stringify(flashcards); // En production, utilisez une fonction comme generateFlashcardsHTML
                }
            }
            else {
                throw new Error(`Type de contenu non supporté: ${type}`);
            }

            // Générer une miniature (ou en utiliser une par défaut)
            const thumbnail = geminiService.generateThumbnail(type);

            // Enregistrer dans le localStorage
            await updateProgress('Sauvegarde', 90);

            const newCreation: Creation = {
                id: uuidv4(),
                title: sourceContent.title,
                type: sourceType,
                sourceUrl: sourceContent.url,
                sourceFileName: sourceType === 'pdf' ? sourceContent.file?.name : undefined,
                thumbnail,
                gameType: type,
                content: generatedContent, // Contenu HTML complet du jeu
                difficulty,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                metadata: {
                    questions: type === 'quiz' || type === 'flashcards' ? questionCount : undefined
                }
            };

            // Sauvegarder et mettre à jour l'état
            storageService.addCreation(newCreation);
            refreshHistory();

            // Finaliser
            await updateProgress('Terminé!', 100);
            setIsGenerating(false);

            return generatedContent;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue lors de la génération';
            setError(errorMessage);
            setIsGenerating(false);
            return null;
        }
    };

    /**
     * Supprime une création par son ID
     */
    const deleteCreation = (id: string): void => {
        storageService.deleteCreation(id);
        refreshHistory();
    };

    return {
        creationHistory,
        isGenerating,
        generationProgress,
        currentStep,
        error,
        generateContent,
        deleteCreation,
        refreshHistory
    };
}

export default useCreation;