import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import geminiService from '@/services/geminiService';
import contentRenderers from '@/services/contentRenderers';
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
            await new Promise(resolve => setTimeout(resolve, 100));
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

            let rawContent: any; // Contenu JSON brut généré par Gemini
            let generatedContent: string; // Contenu HTML final

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

                // Pour les jeux interactifs, on utilise directement le HTML généré
                rawContent = spec; // Stocker les specs pour références futures
            }
            else if (type === 'quiz') {
                // Pour les quiz : génération directe
                await updateProgress('Analyse du contenu', 25);

                if (sourceType === 'youtube') {
                    if (!sourceContent.url) {
                        throw new Error('URL YouTube manquante');
                    }

                    await updateProgress('Génération du quiz', 60);
                    rawContent = await geminiService.generateQuizFromVideo(
                        sourceContent.url,
                        difficulty,
                        questionCount
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Utilisation du renderer pour transformer JSON en HTML interactif
                    generatedContent = contentRenderers.renderQuizHTML(rawContent);
                } else {
                    if (!sourceContent.file) {
                        throw new Error('Fichier PDF manquant');
                    }

                    await updateProgress('Génération du quiz', 60);
                    rawContent = await geminiService.generateQuizFromPDF(
                        sourceContent.file,
                        difficulty,
                        questionCount
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Utilisation du renderer pour transformer JSON en HTML interactif
                    generatedContent = contentRenderers.renderQuizHTML(rawContent);
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
                    rawContent = await geminiService.generateFlashcardsFromVideo(
                        sourceContent.url,
                        questionCount // Utiliser questionCount comme nombre de cartes
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Utilisation du renderer pour transformer JSON en HTML interactif
                    generatedContent = contentRenderers.renderFlashcardsHTML(rawContent);
                } else {
                    if (!sourceContent.file) {
                        throw new Error('Fichier PDF manquant');
                    }

                    await updateProgress('Génération des flashcards', 60);
                    rawContent = await geminiService.generateFlashcardsFromPDF(
                        sourceContent.file,
                        questionCount // Utiliser questionCount comme nombre de cartes
                    );

                    await updateProgress('Création de l\'interface', 80);
                    // Utilisation du renderer pour transformer JSON en HTML interactif
                    generatedContent = contentRenderers.renderFlashcardsHTML(rawContent);
                }
            }
            else {
                throw new Error(`Type de contenu non supporté: ${type}`);
            }

            // Générer une miniature (ou en utiliser une par défaut)
            let thumbnail;
            // Vérifier si l'URL de la source est une URL YouTube
            if (sourceContent.url && sourceContent.url.includes('youtube.com')) {
                // Extraire l'ID de la vidéo YouTube
                const videoIdMatch = sourceContent.url.match(/(?:v=|youtu\.be\/)([\w-]+)(?:&|$)/);
                if (videoIdMatch && videoIdMatch[1]) {
                    thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg`;
                    console.log("Miniature YouTube utilisée:", thumbnail);
                } else {
                    // Si l'URL YouTube n'est pas au format attendu, générer une miniature par défaut
                    thumbnail = geminiService.generateThumbnail(type);
                    console.warn("URL YouTube invalide, miniature par défaut utilisée.");
                }
            } else {
                thumbnail = geminiService.generateThumbnail(type);
                console.warn("Service de génération de miniature non disponible, miniature par défaut utilisée.");
            }

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
                content: generatedContent, // HTML complet du jeu
                difficulty,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                metadata: {
                    questions: type === 'quiz' || type === 'flashcards' ?
                        (rawContent?.questions?.length || rawContent?.cards?.length || questionCount) :
                        undefined,
                    rawContent: type !== 'interactive' ? JSON.stringify(rawContent) : undefined // Stocker le contenu brut pour édition future
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
            console.error("Erreur lors de la génération:", e);
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