import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/ai';
import { musicService } from '../services/music';
import { storageService } from '../services/storage';
import { MoodEntry, MoodTags, ImageTags, ChatMessage } from '../types/mood';
import { Track } from '../types/music';

/**
 * Hook pour gérer l'analyse d'humeur et les recommandations musicales
 */
export const useMood = () => {
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<{
        moodTags?: MoodTags;
        imageTags?: ImageTags;
        response: string;
    } | null>(null);
    const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
    const [historyUpdated, setHistoryUpdated] = useState<boolean>(false);

    // Charger l'historique des humeurs au démarrage
    useEffect(() => {
        const loadMoodHistory = () => {
            const history = storageService.getMoodEntries();
            setMoodHistory(history);
        };

        loadMoodHistory();
    }, [historyUpdated]);

    /**
     * Analyse l'humeur à partir d'une description textuelle
     */
    const analyzeMoodFromText = useCallback(async (text: string) => {
        try {
            setIsAnalyzing(true);

            // Ajouter le message utilisateur à la conversation
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                content: text,
                role: "user",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);

            // Analyser le texte avec l'IA
            const analysis = await aiService.analyzeMood(text);
            console.log("Artistes détectés par l'IA:", analysis.moodTags?.artists);
            console.log("Morceaux suggérés par l'IA:", analysis.moodTags?.tracks);
            console.log("analyse: ", analysis);
            console.log('------------------------------------')

            setAnalysisResult({
                moodTags: analysis.moodTags,
                response: analysis.response,
            });

            // Ajouter la réponse de l'assistant à la conversation
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: analysis.response,
                role: "assistant",
                timestamp: new Date(),
                tags: analysis.moodTags,
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Rechercher des recommandations musicales - UTILISATION DES ARTISTES ICI
            const tracks = await getRecommendationsFromTags(analysis.moodTags);

            // Sauvegarder dans l'historique
            const moodEntry: MoodEntry = {
                description: text,
                tags: analysis.moodTags,
                tracks: tracks, // Utiliser les tracks récupérées
            };
            storageService.saveMoodEntry(moodEntry);
            setHistoryUpdated(!historyUpdated);



            return analysis;
        } catch (error) {
            console.error("Error analyzing mood from text:", error);
            // Ajouter un message d'erreur à la conversation
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: "Désolé, je n'ai pas pu analyser votre humeur. Veuillez réessayer.",
                role: "assistant",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            throw error;
        } finally {
            setIsAnalyzing(false);
        }
    }, [historyUpdated]);

    /**
     * Analyse l'humeur à partir d'une image
     */
    const analyzeMoodFromImage = useCallback(async (imageFile: File) => {
        try {
            setIsAnalyzing(true);

            // Convertir l'image en base64
            const imageBase64 = await fileToBase64(imageFile);

            // Ajouter un message utilisateur avec l'image
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                content: "Analyse cette image pour ma musique",
                role: "user",
                timestamp: new Date(),
                imageUrl: imageBase64,
            };
            setMessages(prev => [...prev, userMessage]);

            // Analyser l'image avec l'IA
            const analysis = await aiService.analyzeImage(imageBase64);
            console.log("Image Analysis Result:", analysis);

            setAnalysisResult({
                imageTags: analysis.imageTags,
                response: analysis.response,
            });

            // Ajouter la réponse de l'assistant à la conversation
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: analysis.response,
                role: "assistant",
                timestamp: new Date(),
                tags: analysis.imageTags,
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Rechercher des recommandations musicales
            const tracks = await getRecommendationsFromTags(analysis.imageTags);

            // Sauvegarder dans l'historique
            const moodEntry: MoodEntry = {
                description: "Analyse d'image",
                imageUrl: imageBase64,
                tags: analysis.imageTags,
                tracks: tracks,
                isImageBased: true,
            };
            storageService.saveMoodEntry(moodEntry);
            setHistoryUpdated(!historyUpdated);

            return analysis;
        } catch (error) {
            console.error("Error analyzing mood from image:", error);
            // Ajouter un message d'erreur à la conversation
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: "Désolé, je n'ai pas pu analyser cette image. Veuillez réessayer.",
                role: "assistant",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            throw error;
        } finally {
            setIsAnalyzing(false);
        }
    }, [historyUpdated]);

    /**
     * Obtient des recommandations musicales basées sur des tags d'humeur
     * MODIFICATION POUR UTILISER LES ARTISTES
     */
    /**
     * Obtient des recommandations musicales basées sur des tags d'humeur
     */
    /**
     * Obtient des recommandations musicales basées sur des tags d'humeur
     * Version améliorée pour une meilleure diversité des résultats
     */
    const getRecommendationsFromTags = useCallback(async (tags: MoodTags | ImageTags) => {
        try {
            console.log('Traitement des tags pour recommandations:', tags);

            // 1. Utiliser la nouvelle méthode searchByMoodTags qui combine artistes, genres et émotions
            if ('artists' in tags || 'genres' in tags) {
                console.log("Utilisation de searchByMoodTags avec approche équilibrée");
                try {
                    const tracks = await musicService.searchByMoodTags(tags as MoodTags, 12);

                    if (tracks && tracks.length > 0) {
                        console.log(`${tracks.length} morceaux trouvés via searchByMoodTags amélioré`);

                        // Vérification de la diversité des résultats
                        const artistIds = new Set(tracks.map(t => t.artists[0].id));
                        console.log(`Diversité: ${artistIds.size} artistes différents sur ${tracks.length} morceaux`);

                        setRecommendedTracks(tracks);
                        return tracks;
                    }
                } catch (moodTagsError) {
                    console.error("Erreur avec searchByMoodTags:", moodTagsError);
                    // Continuer avec les autres méthodes de fallback
                }
            }

            // 2. Si des termes très spécifiques sont identifiés (comme anime, opening, etc.)
            if ('genres' in tags && tags.genres) {
                const specificTerms = tags.genres.filter(g =>
                    g.toLowerCase().includes('anime') ||
                    g.toLowerCase().includes('opening') ||
                    g.toLowerCase().includes('ost')
                );

                if (specificTerms.length > 0) {
                    console.log(`Détection de termes spécifiques: ${specificTerms.join(', ')}`);
                    try {
                        const specificTracks = await musicService.searchBySpecificTerm(specificTerms[0], 12);

                        if (specificTracks.length > 0) {
                            console.log(`${specificTracks.length} morceaux trouvés via searchBySpecificTerm`);
                            setRecommendedTracks(specificTracks);
                            return specificTracks;
                        }
                    } catch (specificError) {
                        console.error("Erreur de recherche spécifique:", specificError);
                    }
                }
            }

            // 3. Fallback: chercher par genre général (code existant)
            console.log("Fallback: utilisation des genres pour les recommandations");

            try {
                const genreBasedTracks = await musicService.searchTracksByGenre(
                    tags.genres && tags.genres.length > 0 ? tags.genres[0] : 'pop',
                    12
                );

                if (genreBasedTracks.length > 0) {
                    setRecommendedTracks(genreBasedTracks);
                    return genreBasedTracks;
                }
            } catch (genreError) {
                console.error("Erreur de recherche par genre:", genreError);
            }

            // 4. Dernier recours: recherche pop générique
            console.log("Dernier recours: recherche générique pop");
            const fallbackTracks = await musicService.searchTracksByGenre('pop', 12);
            setRecommendedTracks(fallbackTracks);
            return fallbackTracks;
        } catch (error) {
            console.error("Erreur lors de la génération des recommandations:", error);
            setRecommendedTracks([]);
            throw error;
        }
    }, []);    /**
     * Supprime une entrée d'humeur de l'historique
     */
    const deleteMoodEntry = useCallback((id: string) => {
        const result = storageService.deleteMoodEntry(id);
        if (result) {
            setHistoryUpdated(!historyUpdated);
        }
        return result;
    }, [historyUpdated]);

    /**
     * Efface l'historique des conversations
     */
    const clearChatHistory = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        isAnalyzing,
        analysisResult,
        recommendedTracks,
        messages,
        moodHistory,
        analyzeMoodFromText,
        analyzeMoodFromImage,
        getRecommendationsFromTags,
        deleteMoodEntry,
        clearChatHistory,
    };
};


/**
 * Convertit un fichier en chaîne base64
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};