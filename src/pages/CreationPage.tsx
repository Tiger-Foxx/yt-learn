import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import YouTubeInput from '@/features/youtube/components/YouTubeInput';
import YouTubePlayer from '@/features/youtube/components/YouTubePlayer';
import TranscriptViewer from '@/features/youtube/components/TranscriptViewer';
import PDFUploader from '@/features/pdf/components/PDFUploader';
import PDFViewer from '@/features/pdf/components/PDFViewer';

// Hooks & Config
import APP_CONFIG from '@/config/appConfig';
import useCreation from "@/hooks/useCreation";
import useYouTube from "@/hooks/useYouTube";

const CreationPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'youtube' | 'pdf'>('youtube');
    const [contentSource, setContentSource] = useState<{
        type: 'youtube' | 'pdf',
        content: string,
        title: string,
        id?: string
    } | null>(null);
    const [selectedGameType, setSelectedGameType] = useState<string>(APP_CONFIG.gameOptions.types[0]);
    const [difficulty, setDifficulty] = useState<string>(APP_CONFIG.gameOptions.defaultDifficulty);

    // Refs for animations
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const isHeaderInView = useInView(headerRef);
    const isContentInView = useInView(contentRef);
    const headerControls = useAnimation();
    const contentControls = useAnimation();

    const {
        videoId,
        videoInfo,
        transcript,
        fetchTranscript,
        embedUrl,
        isLoading: isYouTubeLoading,
        error: youtubeError
    } = useYouTube();

    const {
        isGenerating,
        generationProgress,
        generateContent,
        error: generationError
    } = useCreation();

    // Step management
    const [currentStep, setCurrentStep] = useState<'input' | 'configure' | 'generating' | 'result'>('input');
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);

    // Control animations when elements come into view
    useEffect(() => {
        if (isHeaderInView) {
            headerControls.start('visible');
        }
        if (isContentInView) {
            contentControls.start('visible');
        }
    }, [isHeaderInView, isContentInView, headerControls, contentControls]);

    // Handle YouTube video validation
    const handleVideoValidated = async (id: string, info: any) => {
        const transcriptText = await fetchTranscript(info.url);

        if (transcriptText) {
            setContentSource({
                type: 'youtube',
                content: transcriptText,
                title: info.title,
                id: id
            });
            setCurrentStep('configure');
        }
    };

    // Handle PDF upload
    const handlePdfUploaded = (text: string, title: string, pageCount: number) => {
        setContentSource({
            type: 'pdf',
            content: text,
            title: title
        });
        setCurrentStep('configure');
    };

    // Handle generation start
    const handleStartGeneration = async () => {
        if (!contentSource) return;

        setCurrentStep('generating');

        const result = await generateContent({
            type: selectedGameType as any,
            difficulty: difficulty,
            questionCount: 5,
            sourceType: contentSource.type,
            sourceContent: contentSource.content,
            sourceTitle: contentSource.title,
            sourceUrl: contentSource.type === 'youtube' ? `https://www.youtube.com/watch?v=${contentSource.id}` : undefined
        });

        if (result) {
            setGeneratedContent(result);
            setCurrentStep('result');
        } else {
            // Go back to configure step if generation failed
            setCurrentStep('configure');
        }
    };

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.2
            }
        }
    };

    const slideVariants = {
        hidden: { x: 30, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        },
        exit: {
            x: -30,
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    // Steps progress component
    const StepsProgress = () => (
        <div className="max-w-4xl mx-auto mb-10">
            <div className="relative flex justify-between">
                {[
                    { step: 'input', label: 'Source', icon: '📋' },
                    { step: 'configure', label: 'Configuration', icon: '⚙️' },
                    { step: 'generating', label: 'Génération', icon: '💫' },
                    { step: 'result', label: 'Résultat', icon: '🎉' }
                ].map((step, index) => (
                    <div key={step.step} className="flex flex-col items-center relative z-10">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                ${currentStep === step.step
                                ? 'bg-youtube-red text-white'
                                : ['input', 'configure', 'generating'].indexOf(currentStep) >= ['input', 'configure', 'generating'].indexOf(step.step)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-800 text-gray-400'
                            }
                transition-all duration-500
              `}
                        >
                            <span className="text-lg">{step.icon}</span>
                        </div>
                        <p className="text-sm mt-2 font-medium text-gray-300">
                            {step.label}
                        </p>
                    </div>
                ))}

                {/* Connector Line */}
                <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-800 -z-10">
                    <div
                        className="h-full bg-gradient-to-r from-youtube-red via-red-500 to-green-500 transition-all duration-700"
                        style={{
                            width:
                                currentStep === 'input' ? '0%'
                                    : currentStep === 'configure' ? '33%'
                                        : currentStep === 'generating' ? '67%'
                                            : '100%'
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto relative">
                {/* Background decorations */}
                <div className="absolute top-10 right-0 w-72 h-72 bg-youtube-red opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

                {/* Header Section */}
                <motion.div
                    ref={headerRef}
                    variants={headerVariants}
                    initial="hidden"
                    animate={headerControls}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        <span className="text-youtube-red">Créez</span> Votre Contenu Éducatif
                    </h1>
                    <div className="w-20 h-1 bg-youtube-red mb-6"></div>
                    <p className="text-gray-400 text-xl max-w-3xl mb-10">
                        Transformez des vidéos YouTube ou des PDFs en expériences d'apprentissage interactives grâce à l'intelligence artificielle.
                    </p>

                    <StepsProgress />
                </motion.div>

                {/* Content Section */}
                <motion.div
                    ref={contentRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={contentControls}
                    className="max-w-5xl mx-auto"
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Input */}
                        {currentStep === 'input' && (
                            <motion.div
                                key="step-input"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="bg-card-bg rounded-xl shadow-lg border border-gray-800 overflow-hidden">
                                    <div className="flex border-b border-gray-800">
                                        <button
                                            className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors
                        ${activeTab === 'youtube'
                                                ? 'bg-youtube-red/20 text-youtube-red'
                                                : 'text-gray-400 hover:bg-gray-800'}
                      `}
                                            onClick={() => setActiveTab('youtube')}
                                        >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        Vidéo YouTube
                      </span>
                                        </button>
                                        <button
                                            className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors
                        ${activeTab === 'pdf'
                                                ? 'bg-youtube-red/20 text-youtube-red'
                                                : 'text-gray-400 hover:bg-gray-800'}
                      `}
                                            onClick={() => setActiveTab('pdf')}
                                        >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" />
                        </svg>
                        PDF
                      </span>
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        {activeTab === 'youtube' ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <YouTubeInput
                                                    onVideoValidated={handleVideoValidated}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <PDFUploader
                                                    onPDFUploaded={handlePdfUploaded}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Helpful tips */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-youtube-red" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5A1 1 0 1 1 7.6 6.5a3 3 0 0 1 5.4 0A1 1 0 0 1 11 8h0a1 1 0 001 1v1a1 1 0 1 1-2 0V9a1 1 0 00-1-1 1 1 0 00-1-1zm1 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                                        </svg>
                                        Conseils pour de meilleurs résultats
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Choisissez des vidéos YouTube avec <strong>du contenu éducatif clair</strong> et bien structuré.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Pour les PDFs, privilégiez des documents bien <strong>formatés avec du texte extractible</strong>, pas des images scannées.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>La durée idéale pour les vidéos est de <strong>5 à 15 minutes</strong> pour des résultats optimaux.</span>
                                        </li>
                                    </ul>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 2: Configure */}
                        {currentStep === 'configure' && contentSource && (
                            <motion.div
                                key="step-configure"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="bg-card-bg rounded-xl border border-gray-800 p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/3">
                                            {contentSource.type === 'youtube' && embedUrl ? (
                                                <div className="relative rounded-lg overflow-hidden shadow-xl bg-black">
                                                    <YouTubePlayer
                                                        videoId={videoId || ''}
                                                        height={220}
                                                        className="rounded-lg overflow-hidden"
                                                    />
                                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent h-12"></div>
                                                </div>
                                            ) : contentSource.type === 'pdf' ? (
                                                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                                    <div className="flex items-center">
                                                        <div className="bg-red-500/20 p-3 rounded-lg">
                                                            <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                            <p className="font-medium text-white text-lg">
                                                                {contentSource.title || 'Document PDF'}
                                                            </p>
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                {contentSource.content.length > 0 ? `${Math.round(contentSource.content.length / 1000)}K caractères extraits` : 'Document prêt'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-white">
                                                {contentSource.title}
                                            </h3>
                                            <div className="flex items-center text-gray-400 mb-6">
                                                <div className={`w-2 h-2 rounded-full ${contentSource.type === 'youtube' ? 'bg-youtube-red' : 'bg-red-500'} mr-2`}></div>
                                                <span>Source: {contentSource.type === 'youtube' ? 'YouTube' : 'PDF'}</span>
                                            </div>

                                            <h4 className="text-md font-medium mb-3 text-white flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-youtube-red" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                Type de contenu à générer
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                                {APP_CONFIG.gameOptions.types.map(type => (
                                                    <motion.button
                                                        key={type}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setSelectedGameType(type)}
                                                        className={`p-3 border rounded-md text-left transition-colors ${
                                                            selectedGameType === type
                                                                ? 'border-youtube-red bg-youtube-red/10 text-white'
                                                                : 'border-gray-700 hover:border-gray-600 text-gray-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium capitalize">
                                                            {type === 'quiz' ? (
                                                                <div className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                                                                    </svg>
                                                                    Quiz
                                                                </div>
                                                            ) : type === 'flashcards' ? (
                                                                <div className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                                                    </svg>
                                                                    Flashcards
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                                    </svg>
                                                                    Interactif
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>

                                            <h4 className="text-md font-medium mb-3 text-white flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-youtube-red" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
                                                </svg>
                                                Difficulté
                                            </h4>
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                {APP_CONFIG.gameOptions.difficultyLevels.map(level => (
                                                    <motion.button
                                                        key={level}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setDifficulty(level)}
                                                        className={`p-2 border rounded-md text-center transition-colors ${
                                                            difficulty === level
                                                                ? 'border-youtube-red bg-youtube-red/10 text-white'
                                                                : 'border-gray-700 hover:border-gray-600 text-gray-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium capitalize">
                                                            {level}
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setCurrentStep('input')}
                                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Retour
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleStartGeneration}
                                        className="px-6 py-3 bg-youtube-red hover:bg-red-700 text-white rounded-lg flex items-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Générer le contenu
                                    </motion.button>
                                </div>

                                <motion.div
                                    variants={itemVariants}
                                    className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                                >
                                    <h3 className="text-lg font-semibold mb-3 text-white">Aperçu du contenu source</h3>
                                    <div className="max-h-64 overflow-y-auto bg-gray-800 rounded-lg p-4 text-gray-300 text-sm">
                                        {contentSource.content ? (
                                            <pre className="whitespace-pre-wrap font-mono">
                        {contentSource.content.slice(0, 500)}...
                        <span className="text-gray-500">(aperçu des 500 premiers caractères)</span>
                      </pre>
                                        ) : (
                                            <p className="text-gray-500 italic">Aucun contenu textuel disponible</p>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 3: Generating */}
                        {currentStep === 'generating' && (
                            <motion.div
                                key="step-generating"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center py-12 bg-card-bg rounded-xl border border-gray-800 p-8 relative overflow-hidden"
                            >
                                {/* Background animation */}
                                <div className="absolute inset-0 overflow-hidden opacity-30">
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute bg-gradient-to-r from-youtube-red to-red-600 rounded-full"
                                                initial={{
                                                    x: Math.random() * 100 - 50 + "%",
                                                    y: Math.random() * 100 + "%",
                                                    scale: Math.random() * 0.5 + 0.5,
                                                    opacity: Math.random() * 0.5 + 0.25
                                                }}
                                                animate={{
                                                    y: [null, "-100%"],
                                                    opacity: [null, 0]
                                                }}
                                                transition={{
                                                    duration: Math.random() * 10 + 10,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                style={{
                                                    width: Math.random() * 100 + 20,
                                                    height: Math.random() * 100 + 20,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-8 relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 4,
                                                ease: "linear",
                                                repeat: Infinity
                                            }}
                                            className="w-24 h-24 border-4 border-youtube-red border-t-transparent rounded-full mx-auto"
                                        />

                                        {/* Orbit animation */}
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 pointer-events-none"
                                        >
                                            <motion.div
                                                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-youtube-red rounded-full"
                                                animate={{ scale: [1, 1.5, 1] }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.h3
                                        className="text-2xl font-bold text-white mb-3"
                                        variants={itemVariants}
                                    >
                                        Intelligence artificielle en action
                                    </motion.h3>

                                    <motion.div
                                        variants={itemVariants}
                                        className="text-gray-300 text-lg mb-8"
                                    >
                                        <p>{currentStep === "generating" ? "Analyse et génération de contenu en cours..." : ""}</p>
                                        <div className="mt-2 text-youtube-red font-medium">
                                            {generationProgress === 0 && "Initialisation..."}
                                            {generationProgress > 0 && generationProgress < 30 && "Analyse du contenu source..."}
                                            {generationProgress >= 30 && generationProgress < 60 && "Extraction des concepts clés..."}
                                            {generationProgress >= 60 && generationProgress < 90 && "Création de votre contenu éducatif..."}
                                            {generationProgress >= 90 && "Finalisation..."}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="w-full max-w-md mx-auto h-3 bg-gray-800 rounded-full overflow-hidden mb-8"
                                        variants={itemVariants}
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-youtube-red via-red-500 to-youtube-red rounded-full"
                                            initial={{ width: "5%" }}
                                            animate={{ width: `${Math.max(5, generationProgress)}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="text-sm text-gray-500 max-w-lg mx-auto"
                                        variants={itemVariants}
                                    >
                                        <p className="mb-3">
                                            Notre IA analyse le contenu pour créer une expérience d'apprentissage personnalisée.
                                            Ce processus peut prendre une minute ou deux.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-400 text-xs">
                        Extraction de concepts
                      </span>
                                            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-400 text-xs">
                        Génération de questions
                      </span>
                                            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-400 text-xs">
                        Vérification factuelle
                      </span>
                                            <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-400 text-xs">
                        Design interactif
                      </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Result */}
                        {currentStep === 'result' && generatedContent && (
                            <motion.div
                                key="step-result"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-card-bg rounded-xl border border-gray-800 overflow-hidden"
                                >
                                    <div className="bg-green-500/10 p-4 border-b border-gray-800 flex items-center">
                                        <div className="bg-green-500/20 p-2 rounded-full mr-3">
                                            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-400 mb-1">
                                                Génération terminée avec succès !
                                            </h3>
                                            <p className="text-green-300/70 text-sm">
                                                Votre contenu éducatif est prêt à être utilisé.
                                            </p>
                                        </div>
                                        {/* Confetti animation */}
                                        <motion.div
                                            animate={{ y: [-20, 0], opacity: [0, 1] }}
                                            transition={{ delay: 0.5 }}
                                            className="ml-auto"
                                        >
                                            <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 15.39l-3.76 2.27.99-4.28-3.32-2.88 4.38-.37L12 6.09l1.71 4.04 4.38.37-3.32 2.88.99 4.28z"/>
                                            </svg>
                                        </motion.div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                            {contentSource?.title}
                                            <span className="ml-2 px-2 py-1 bg-youtube-red/20 text-youtube-red text-xs rounded-md">
                        {selectedGameType.charAt(0).toUpperCase() + selectedGameType.slice(1)}
                      </span>
                                        </h3>

                                        <div className="rounded-lg overflow-hidden border border-gray-700 bg-black shadow-xl">
                                            <iframe
                                                className="w-full rounded-lg"
                                                style={{ height: '500px' }}
                                                srcDoc={generatedContent}
                                                title="Contenu généré"
                                                sandbox="allow-scripts"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div className="flex justify-between" variants={itemVariants}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setCurrentStep('configure')}
                                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Modifier la configuration
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate(APP_CONFIG.routes.playspace)}
                                        className="px-6 py-3 bg-youtube-red hover:bg-red-700 text-white rounded-lg flex items-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Voir tous mes contenus
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                                >
                                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-youtube-red" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5A1 1 0 1 1 7.6 6.5a3 3 0 0 1 5.4 0A1 1 0 0 1 11 8h0a1 1 0 001 1v1a1 1 0 1 1-2 0V9a1 1 0 00-1-1 1 1 0 00-1-1zm1 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                                        </svg>
                                        Comment utiliser votre contenu
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Accédez à votre contenu depuis la page <strong>PlaySpace</strong> à tout moment</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Vous pouvez partager votre contenu éducatif avec d'autres personnes</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 text-youtube-red mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Vos créations sont sauvegardées automatiquement et disponibles hors ligne</span>
                                        </li>
                                    </ul>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Mobile Animation at Bottom */}
            <motion.div
                className="fixed z-30 bottom-6 right-6 md:hidden"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            >
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-youtube-red text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </motion.button>
            </motion.div>

            {/* PWA Installation Component */}
            <InstallPWA />

            {/* Style specific to this page */}
            <style jsx>{`
        .bg-dark-bg {
          background-color: #0F0F0F;
        }
        
        .bg-card-bg {
          background-color: #1A1A1A;
        }
        
        .text-youtube-red {
          color: #FF0000;
        }
        
        .bg-youtube-red {
          background-color: #FF0000;
        }
      `}</style>
        </div>
    );
};

// PWA Installation Banner Component
const InstallPWA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if user is a first-time visitor
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

        if (!hasVisitedBefore) {
            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (e) => {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Stash the event so it can be triggered later
                setDeferredPrompt(e);
                // Show the install banner
                setIsVisible(true);
            });

            // Set flag in localStorage
            localStorage.setItem('hasVisitedBefore', 'true');
        }

        // Check if app is already installed
        window.addEventListener('appinstalled', () => {
            // Hide the banner if app is installed
            setIsVisible(false);
            // Clear the deferredPrompt
            setDeferredPrompt(null);
        });
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;

        // Reset the deferredPrompt variable
        setDeferredPrompt(null);

        // Hide the banner regardless of user choice
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <motion.div
            className="fixed bottom-0 inset-x-0 z-50 pb-safe"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="mx-auto max-w-md px-4 pb-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-4 flex items-center">
                    <div className="p-2 bg-youtube-red/20 rounded-lg mr-4">
                        <svg className="w-10 h-10 text-youtube-red" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-semibold">Installer YTLearn</h3>
                        <p className="text-gray-400 text-sm">Ajoutez l'app à votre écran d'accueil</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleDismiss}
                            className="p-2 text-gray-400 hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <motion.button
                            onClick={handleInstall}
                            className="bg-youtube-red text-white px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Installer
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreationPage;