import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import APP_CONFIG from '@/config/appConfig';
import Loader from '@/components/layout/Loader';
import contentRenderers from '@/services/contentRenderers';

/**
 * Page affichant un jeu spécifique dans une iframe
 * Gère différemment les types de contenu (quiz, flashcards, jeux interactifs)
 * Accessible via l'URL /game/:id où id est l'identifiant unique du jeu
 */
const GamePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { creationHistory } = useAppContext(); // Ne pas déclencher refreshCreationHistory ici
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processedContent, setProcessedContent] = useState<string | null>(null);
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Rechercher la création correspondante dans l'historique et prétraiter le contenu si nécessaire
    useEffect(() => {
        // Nettoyer le timer au démontage ou quand l'effet est réexécuté
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
        }

        setIsLoading(true);
        setProcessedContent(null);

        loadingTimerRef.current = setTimeout(() => {
            if (!id || !creationHistory.find(item => item.id === id)) {
                setError('Contenu introuvable');
                setIsLoading(false);
                return;
            }

            const creation = creationHistory.find(item => item.id === id);
            if (!creation) {
                setError('Contenu inaccessible');
                setIsLoading(false);
                return;
            }

            try {
                // Selon le type de contenu, nous pourrions avoir à le transformer
                if (creation.gameType === 'quiz' || creation.gameType === 'flashcards') {
                    // Vérifier si le contenu est du JSON brut ou déjà du HTML
                    let htmlContent = creation.content;

                    // Détecter si le contenu est du JSON brut
                    try {
                        // Essayer de parser comme JSON
                        const jsonContent = JSON.parse(creation.content);

                        // Si on arrive ici, c'est que c'est du JSON valide
                        // On doit transformer en HTML
                        if (creation.gameType === 'quiz') {
                            htmlContent = contentRenderers.renderQuizHTML(jsonContent);
                        } else if (creation.gameType === 'flashcards') {
                            htmlContent = contentRenderers.renderFlashcardsHTML(jsonContent);
                        }
                    } catch (e) {
                        // Si on arrive ici, c'est probablement déjà du HTML
                        console.log('Le contenu est probablement déjà au format HTML');
                    }

                    setProcessedContent(htmlContent);
                } else {
                    // Pour les jeux interactifs, on utilise directement le contenu
                    setProcessedContent(creation.content);
                }
            } catch (e) {
                console.error('Erreur lors du traitement du contenu:', e);
                setError('Erreur lors du chargement du contenu');
            }

            setIsLoading(false);
        }, 300);

        // Nettoyer le timer lors du démontage
        return () => {
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
        // Dépendance à creationHistory.length pour ne pas recréer l'effet à chaque changement d'objet
        // mais seulement quand le nombre de créations change
    }, [id, creationHistory.length]);

    // Trouver la création dans l'historique
    const creation = creationHistory.find(item => item.id === id);

    // Icônes pour les différents types de jeux
    const gameTypeIcon = {
        quiz: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 2H8C6.9 2 6 2.9 6 4v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 17c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-8c0 .55-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1z" />
            </svg>
        ),
        flashcards: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
        ),
        interactive: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
        )
    };

    // Obtenir le type de badge en fonction du type de jeu
    const getBadgeColor = (gameType?: string) => {
        switch (gameType) {
            case 'quiz':
                return 'bg-blue-500';
            case 'flashcards':
                return 'bg-green-500';
            case 'interactive':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg py-16 px-4">
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader
                        variant="youtube"
                        size="lg"
                        label="Chargement du jeu..."
                    />
                </div>
            ) : error ? (
                <motion.div
                    className="max-w-xl mx-auto text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
                        <svg className="w-16 h-16 text-youtube-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>

                        <h2 className="text-2xl font-bold text-white mb-4">
                            Contenu introuvable
                        </h2>

                        <p className="text-gray-400 mb-6">
                            Ce jeu n'existe pas ou a été supprimé.
                        </p>

                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(APP_CONFIG.routes.playspace)}
                                className="bg-youtube-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Retour à mes contenus
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : creation && processedContent ? (
                <div>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center"
                            >
                                <button
                                    onClick={() => navigate(-1)}
                                    className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>

                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {creation.title}
                                    </h1>
                                    <div className="flex items-center text-sm text-gray-400 mt-1">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${getBadgeColor(creation.gameType)}`}></span>
                                            <span className="capitalize mr-2">{creation.gameType}</span>
                                        </div>

                                        <span className="text-gray-600 mx-2">•</span>
                                        <span>{creation.difficulty}</span>

                                        {creation.sourceUrl && (
                                            <>
                                                <span className="text-gray-600 mx-2">•</span>
                                                <a
                                                    href={creation.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-youtube-red hover:text-red-400 transition-colors"
                                                >
                                                    Source originale
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-2"
                            >
                                <button
                                    onClick={() => document.getElementById('game-frame')?.requestFullscreen()}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                                    aria-label="Plein écran"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => navigate(APP_CONFIG.routes.playspace)}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                                    aria-label="Retour à mes contenus"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden"
                        >
                            <div className="flex items-center border-b border-gray-800 px-4 py-3">
                                <div className={`w-3 h-3 rounded-full ${getBadgeColor(creation.gameType)} mr-3`}></div>
                                <span className="text-gray-300 flex items-center">
                                    {creation.gameType && gameTypeIcon[creation.gameType as keyof typeof gameTypeIcon]}
                                    <span className="ml-2 capitalize">{creation.gameType}</span>
                                    {creation.metadata?.questions && (
                                        <span className="ml-2 text-gray-500">• {creation.metadata.questions} questions</span>
                                    )}
                                </span>
                            </div>

                            <iframe
                                id="game-frame"
                                srcDoc={processedContent}
                                title={creation.title}
                                className="w-full bg-white dark:bg-gray-900"
                                style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}
                                sandbox="allow-scripts allow-popups allow-same-origin"
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    Contenu non disponible
                </div>
            )}
        </div>
    );
};

export default GamePage;