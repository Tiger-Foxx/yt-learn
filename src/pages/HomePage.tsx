import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {motion, AnimatePresence, useAnimation} from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import APP_CONFIG from '@/config/appConfig';
import useYouTube from '@/hooks/useYouTube';
import usePDF from '@/hooks/usePDF';
import { exampleCreations } from '@/data/exampleCreations';
import storageService, { Creation } from '@/services/storageService';
import {InstallPWA} from "@/pages/CreationPage.tsx";
import Lottie from 'react-lottie';
import fluidAnimationData from '@/assets/fluid-animation.json';

interface FluidEffectProps {
    loop?: boolean;
    autoplay?: boolean;
    animationData?: any; // Le type exact dépend de votre fichier JSON Lottie
    rendererSettings?: {
        preserveAspectRatio: string;
    };
    height?: string | number;
    width?: string | number;
    opacity?: number;
}
// Composant pour les particules fluides (mobile)
const FluidEffect: React.FC<FluidEffectProps> = ({loop = true, autoplay = true, animationData = fluidAnimationData, rendererSettings = { preserveAspectRatio: 'xMidYMid slice' }, height = "100%", width = "100%", opacity = 0.4,}) => {
    const defaultOptions = {
        loop,
        autoplay,
        animationData,
        rendererSettings,
        height,
        width,
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <Lottie
                options={defaultOptions}
                style={{ opacity }}
            />
        </div>
    );
};

// Composant pour les blobs animés en arrière-plan (desktop)
const AnimatedBlobs: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
            {/* Blob 1 - Rouge */}
            <motion.div
                className="absolute rounded-full bg-gradient-to-r from-youtube-red to-red-600 opacity-50 blur-3xl"
                animate={{
                    x: ['-5%', '5%'],
                    y: ['-5%', '5%'],
                    scale: [1, 1.5]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                style={{
                    top: '10%',
                    right: '10%',
                    width: '40vw',
                    height: '40vw',
                }}
            />

            {/* Blob 2 - Violet */}
            <motion.div
                className="absolute rounded-full bg-gradient-to-r from-red-600 to-red-700 opacity-20 blur-3xl"
                animate={{
                    x: ['5%', '-5%'],
                    y: ['5%', '-5%'],
                    scale: [1.3, 0.7]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 2,
                }}
                style={{
                    bottom: '10%',
                    left: '10%',
                    width: '40vw',
                    height: '40vw',
                }}
            />

            {/* Blob 3 - Plus petit et plus dynamique */}
            <motion.div
                className="absolute rounded-full bg-gradient-to-r from-youtube-red to-yellow-500 opacity-10 blur-3xl"
                animate={{
                    x: ['10%', '30%'],
                    y: ['30%', '10%'],
                    scale: [1, 1.3]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 2,
                }}
                style={{
                    top: '40%',
                    left: '30%',
                    width: '20vw',
                    height: '20vw',
                }}
            />
        </div>
    );
};

// Logo Fox
const FoxLogo: React.FC = () => (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-50 hover:opacity-100 transition-opacity z-10">
        <p className="text-xs text-gray-400 font-light">
            Designed by <span className="font-semibold">Fox</span>
        </p>
    </div>
);

// Composant pour l'effet de texte glitch
const TextGlitch: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
    const [displayText, setDisplayText] = useState(text);
    const originalText = useRef(text);
    const glitchInterval = useRef<NodeJS.Timeout | null>(null);

    // Caractères pour l'effet glitch
    const glitchChars = "!<>-_\\/[]{}—=+*^?#__________";

    // Déclencher l'animation glitch périodiquement
    useEffect(() => {
        const triggerGlitch = () => {
            let iterations = 0;
            const interval = setInterval(() => {
                setDisplayText(prevText => {
                    // Créer un texte avec des caractères aléatoires
                    if (iterations < 10) {
                        const randomChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        return originalText.current
                            .split('')
                            .map((char, idx) => {
                                // 10% de chance de remplacer un caractère
                                if (Math.random() < 0.1) {
                                    return randomChar();
                                }
                                return char;
                            })
                            .join('');
                    }
                    // Restaurer le texte original
                    return originalText.current;
                });

                iterations++;
                if (iterations >= 12) {
                    clearInterval(interval);
                }
            }, 50);
        };

        glitchInterval.current = setInterval(triggerGlitch, 6000);

        return () => {
            if (glitchInterval.current) clearInterval(glitchInterval.current);
        };
    }, []);

    return <span className={className}>{displayText}</span>;
};

// Composant HeroTitle avec animation avancée - Version Mobile Optimisée
const HeroTitle: React.FC<{isMobile: boolean}> = ({ isMobile }) => {
    if (isMobile) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative text-center"
            >
                <motion.h1
                    className="text-4xl md:text-6xl xl:text-7xl font-bold text-white mb-6 relative z-10 tracking-tighter leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.span className="block mb-2 tracking-wide">
                        Vivez votre
                    </motion.span>
                    <motion.span
                        className="block text-youtube-red relative  mb-2"
                        // animate={{ scale: [1, 1.05, 1] }}
                        // transition={{ duration: 2, repeat: Infinity }}
                    >
                        Apprentissage
                    </motion.span>
                    <motion.span className="block text-sm font-light tracking-widest mt-4 text-gray-300">
                        AVEC FUN (et.. un peu d'IA)
                    </motion.span>
                </motion.h1>
                <div className="w-16 h-1 bg-youtube-red rounded-full mx-auto"></div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
        >
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold text-white mb-6 relative z-10 tracking-tighter leading-tight">
                <motion.span
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="block"
                >
                    Transformez vos <TextGlitch text="vidéos" className="text-youtube-red relative glow-text" />
                </motion.span>
                <motion.span
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="block"
                >
                    en <TextGlitch text="expériences" className="relative text-transparent bg-clip-text bg-gradient-to-b from-youtube-red to-red-400" /> d'apprentissage
                </motion.span>
            </h1>
            <div className="absolute -bottom-6 -left-2 w-20 h-2 bg-youtube-red rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-youtube-red opacity-20 blur-lg"></div>
        </motion.div>
    );
};

// Composant pour l'effet 3D au survol
const Card3D: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculer la rotation en fonction de la position de la souris
        const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 10;
        const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
        setScale(1.05);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setScale(1);
    };

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-200 transform-gpu ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={
                isMobile
                    ? {}
                    : {
                        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                        transformStyle: 'preserve-3d'
                    }
            }
        >
            {children}
            {!isMobile && (
                <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-youtube-red to-red-500 opacity-0 hover:opacity-20 transition-opacity"
                    style={{ transform: 'translateZ(-10px)' }}
                />
            )}
        </div>
    );
};

// Composant pour l'animation d'écriture en "typewriter"
const TypewriterText: React.FC<{ texts: string[]; className?: string }> = ({ texts, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentText = texts[index];

            if (!isDeleting) {
                setDisplayText(currentText.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);

                if (charIndex >= currentText.length) {
                    setIsDeleting(true);
                    setTimeout(() => {}, 1500); // Pause avant de commencer à supprimer
                }
            } else {
                setDisplayText(currentText.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);

                if (charIndex <= 0) {
                    setIsDeleting(false);
                    setIndex((index + 1) % texts.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timer);
    }, [charIndex, index, isDeleting, texts]);

    return <div className={`${className}`}>{displayText}<span className="animate-pulse">|</span></div>;
};

// Champ de recherche avec animation avancée
const AnimatedSearchField: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isValid: boolean;
}> = ({ value, onChange, onSubmit, isValid }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-10 w-full"
        >
            <div className="relative">
                <input
                    id="youtube-input"
                    type="text"
                    placeholder="Collez votre lien YouTube ici..."
                    className="w-full px-6 py-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-red/30 transition duration-300"
                    value={value}
                    onChange={onChange}
                    onKeyDown={(e) => e.key === 'Enter' && isValid && onSubmit()}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-youtube-red via-red-500 to-red-300"
                    initial={{ width: 0 }}
                    animate={{ width: isValid ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                />
                <div className="absolute right-2 top-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSubmit}
                        disabled={!isValid}
                        className={`bg-youtube-red hover:bg-red-700 text-white px-3 py-2 rounded-md transition duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            <div className={`absolute top-full left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden transition-all duration-300 ease-in-out ${value && isValid ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
                <div className="p-3 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-youtube-red rounded flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-white">YouTube Détecté</div>
                            <div className="text-sm text-gray-400">Prêt à générer du contenu éducatif</div>
                        </div>
                    </div>
                </div>

                <div className="p-2">
                    <TypewriterText
                        texts={[
                            "Que voulez-vous créer?",
                            "Flashcards pour mémorisation?",
                            "Quiz interactif?",
                            "Jeu éducatif personnalisé?"
                        ]}
                        className="text-sm text-gray-400 p-2"
                    />
                </div>
            </div>
        </motion.div>
    );
};

// Bouton avec effet de pulse et hover avancé
const AnimatedButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    iconOnly?: boolean;
}> = ({ children, onClick, disabled = false, className = '', iconOnly = false }) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`relative overflow-hidden ${
                iconOnly
                    ? "mt-6 bg-youtube-red text-white font-bold w-12 h-12 rounded-full flex items-center justify-center"
                    : "mt-6 bg-youtube-red text-white font-bold py-3 px-8 rounded-full text-lg"
            } transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-youtube-red disabled:hover:shadow-none ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400"
                initial={{ x: '-100%', opacity: 0.5 }}
                animate={{ x: '100%', opacity: 0 }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
            />
            {children}
        </motion.button>
    );
};

// Générer des icônes par défaut pour les miniatures manquantes en fonction du type
const DefaultThumbnail: React.FC<{type: string}> = ({ type }) => {
    let icon;
    let bgColor;

    switch(type) {
        case 'quiz':
            icon = (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            );
            bgColor = 'bg-blue-600';
            break;
        case 'flashcards':
            icon = (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                </svg>
            );
            bgColor = 'bg-green-600';
            break;
        case 'interactive':
        case 'interactif':
        default:
            icon = (
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
                </svg>
            );
            bgColor = 'bg-purple-600';
    }

    return (
        <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
            {icon}
        </div>
    );
};

// Composant pour la grille des exemples
const ExamplesGrid: React.FC = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'flashcards' | 'interactive'>('all');

    // Utiliser à la fois les exemples du fichier de données ET ceux du stockage utilisateur
    const [examples, setExamples] = useState<Creation[]>([]);
    const { creationHistory } = useAppContext();

    // Charger les exemples au montage du composant
    useEffect(() => {
        // Récupérer les exemples statiques et les convertir au format Creation
        const staticExamples = exampleCreations.map(example => ({
            ...example,
            id: example.id || `static-${Math.random().toString(36).substring(2, 11)}`,
            createdAt: example.createdAt || Date.now(),
            updatedAt: example.updatedAt || Date.now()
        })) as Creation[];

        // Combiner avec les créations de l'utilisateur
        const allExamples = [...staticExamples, ...creationHistory];

        // Trier par date de création (plus récents d'abord)
        const sortedExamples = allExamples.sort((a, b) => b.createdAt - a.createdAt);

        setExamples(sortedExamples);
    }, [creationHistory]);

    // Filtrer les exemples en fonction du filtre actif
    const filteredExamples = examples.filter(example => {
        if (activeFilter === 'all') return true;
        return example.gameType === activeFilter;
    });

    // Animation si la liste est vide ou non
    useEffect(() => {
        controls.start('visible');
    }, [controls, filteredExamples]);

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Exemples de créations
                </h2>

                <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'all', label: 'Tous' },
                        { id: 'quiz', label: 'Quiz' },
                        { id: 'flashcards', label: 'Flashcards' },
                        { id: 'interactive', label: 'Jeux' }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.05, backgroundColor: tab.id === activeFilter ? undefined : 'rgba(255, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-lg ${tab.id === activeFilter ? 'bg-youtube-red text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {filteredExamples.length > 0 ? (
                <motion.div
                    variants={container}
                    animate={controls}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredExamples.map((example) => (
                        <Card3D
                            key={example.id}
                            className="h-full"
                            onClick={() => navigate(`/game/${example.id}`)}
                        >
                            <motion.div
                                variants={item}
                                className="bg-gray-900 rounded-xl overflow-hidden h-full cursor-pointer group"
                            >
                                <div className="relative h-48">
                                    {example.thumbnail ? (
                                        <img
                                            src={example.thumbnail}
                                            alt={example.title}
                                            className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <DefaultThumbnail type={example.gameType || 'interactive'} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <div className="p-3 w-full">
                                            <div className="flex items-center justify-between text-white text-sm">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 11.5l-5-3v-6h1.5v5.1l4 2.4-1 1.5z" />
                                                    </svg>
                                                    <span>Jouer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-youtube-red rounded-full p-2 transform rotate-0 hover:rotate-90 transition-transform duration-300">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-medium leading-tight mb-1 group-hover:text-youtube-red transition-colors">{example.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span className="capitalize">{example.type === 'youtube' ? 'Vidéo YouTube' : 'Document PDF'}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-youtube-red capitalize">{example.gameType}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
                                        <div className="flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 12l-18 12v-24l18 12z" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-sm px-3 py-1 rounded-full border border-youtube-red text-youtube-red hover:bg-youtube-red hover:text-white transition-colors"
                                        >
                                            Voir
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </Card3D>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900 rounded-xl p-12 text-center"
                >
                    <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h-2v2H9v-2H7v-1h2v-2h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">Aucun résultat trouvé</h3>
                    <p className="text-gray-400 mb-6">Aucune création ne correspond à ce filtre.</p>
                    <button
                        onClick={() => setActiveFilter('all')}
                        className="px-4 py-2 bg-youtube-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Voir tous les exemples
                    </button>
                </motion.div>
            )}
        </div>
    );
};

// Composant pour l'affichage des statistiques avec compteur animé
const StatsCounter: React.FC = () => {
    const [stats, setStats] = useState({
        contenus: 0,
        apprenants: 0,
        satisfaction: 0,
    });

    const targetStats = {
        contenus: 15879,
        apprenants: 342940,
        satisfaction: 98,
    };

    const inViewRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (inViewRef.current) {
            observer.observe(inViewRef.current);
        }

        return () => {
            if (inViewRef.current) {
                observer.unobserve(inViewRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000; // 2 secondes pour l'animation
        const steps = 30; // Nombre d'étapes de l'animation
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setStats({
                contenus: Math.floor(targetStats.contenus * progress),
                apprenants: Math.floor(targetStats.apprenants * progress),
                satisfaction: Math.floor(targetStats.satisfaction * progress),
            });

            if (step === steps) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [isInView]);

    return (
        <div ref={inViewRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-16">
            {[
                {
                    label: 'Contenus créés',
                    value: stats.contenus.toLocaleString(),
                    icon: (
                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    )
                },
                {
                    label: 'Apprenants satisfaits',
                    value: stats.apprenants.toLocaleString(),
                    icon: (
                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                    )
                },
                {
                    label: 'Taux de satisfaction',
                    value: `${stats.satisfaction}%`,
                    icon: (
                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    )
                },
            ].map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="bg-gray-900 rounded-2xl p-6 text-center relative overflow-hidden group backdrop-blur-sm bg-opacity-80"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-youtube-red to-red-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-youtube-red/10 transition-colors">
                        {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    );
};

// Section "Comment ça marche"
const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            title: "Partagez votre contenu source",
            description: "Collez simplement l'URL d'une vidéo YouTube ou téléchargez un document PDF. Laissez notre système se charger de tout analyser.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
            ),
        },
        {
            title: "Personnalisez votre expérience",
            description: "Choisissez entre quiz interactifs, flashcards ou jeux immersifs. Ajustez la difficulté et ajoutez vos instructions spécifiques.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v4h-4v2h4v4h2v-4h4v-2h-4V8z" />
                </svg>
            ),
        },
        {
            title: "Profitez de l'apprentissage interactif",
            description: "Notre IA crée votre contenu personnalisé, prêt à être utilisé. Apprenez efficacement et partagez vos créations.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Comment ça marche
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transformez n'importe quelle vidéo ou document en expérience d'apprentissage interactive en quelques étapes simples
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-gray-900 rounded-xl p-8 relative backdrop-blur-sm bg-opacity-80"
                        >
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-youtube-red rounded-full flex items-center justify-center font-bold text-white">
                                {index + 1}
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "tween" }}
                                className="bg-gray-800 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            >
                                {step.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                            <p className="text-gray-400 text-center">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Mobile Hero Section spécifique
const MobileHero: React.FC<{
    youtubeUrl: string,
    isValidUrl: boolean,
    handleYouTubeSubmit: () => void,
    setYoutubeUrl: (url: string) => void,
    navigateToCreation: () => void,
}> = ({
          youtubeUrl,
          isValidUrl,
          handleYouTubeSubmit,
          setYoutubeUrl,
          navigateToCreation
      }) => {
    return (
        <section className="min-h-screen flex flex-col items-center  relative px-6 py-8">
            {/* Animation de particules fluides */}
            <FluidEffect />

            {/* Contenu principal */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="z-10 w-full max-w-sm"
            >
                {/* Logo ou marque */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-5"
                >
                    <div className="w-16 h-16  flex items-center justify-center">
                        <img src={"logo-fox-light.png"}/>
                    </div>
                </motion.div>

                {/* Titre principal */}
                <HeroTitle isMobile={true} />

                {/* Description */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-gray-300 mt-8"
                >
                    Transformez n'importe quelle vidéo ou document en expérience d'apprentissage interactive
                </motion.p>

                {/* Boutons d'action */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center mt-12"
                >
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className="bg-youtube-red text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.button>
                    <span className="text-gray-400 text-sm mt-3">Commencer</span>
                </motion.div>
            </motion.div>

            <FoxLogo />
        </section>
    );
};

// Component principal HomePage
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { refreshCreationHistory } = useAppContext();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // États pour le contenu source
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<'youtube' | 'pdf'>('youtube');

    // Hooks pour YouTube et PDF
    const { validateYouTubeUrl } = useYouTube();
    const { loadPDF } = usePDF();

    // Détecter si l'appareil est mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Valider l'URL YouTube lorsqu'elle change
    useEffect(() => {
        const validateUrl = async () => {
            if (youtubeUrl) {
                const result = await validateYouTubeUrl(youtubeUrl);
                setIsValidUrl(result.isValid);
            } else {
                setIsValidUrl(false);
            }
        };

        validateUrl();
    }, [youtubeUrl, validateYouTubeUrl]);

    // Charger les exemples au chargement du composant
    useEffect(() => {
        refreshCreationHistory();
    }, [refreshCreationHistory]);

    // Gérer la soumission du formulaire YouTube
    const handleYouTubeSubmit = () => {
        if (isValidUrl) {
            navigate(APP_CONFIG.routes.creation, {
                state: {
                    sourceType: 'youtube',
                    youtubeUrl
                }
            });
        }
    };

    // Naviguer vers la page de création PDF
    const navigateToCreationPDF = () => {
        navigate(APP_CONFIG.routes.creation, {
            state: {
                sourceType: 'pdf'
            }
        });
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
            {/* Blobs animés en arrière-plan (desktop) */}
            {/*<AnimatedBlobs />*/}
            {/* Animation de particules fluides */}
            <FluidEffect />

            {/* Hero Section différent selon la plateforme */}
            {isMobile ? (
                <>
                    {/* Version mobile */}
                    <MobileHero
                        youtubeUrl={youtubeUrl}
                        isValidUrl={isValidUrl}
                        handleYouTubeSubmit={handleYouTubeSubmit}
                        setYoutubeUrl={setYoutubeUrl}
                        navigateToCreation={navigateToCreationPDF}
                    />

                    {/* Section d'action mobile (après le scroll) */}
                    <section className="py-12 px-4 bg-dark-bg relative" id="action-section">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="max-w-lg mx-auto"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                Commencer avec
                            </h2>

                            <div className="flex bg-gray-900 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => setActiveTab('youtube')}
                                    className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                                        activeTab === 'youtube'
                                            ? 'bg-youtube-red text-white font-medium'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                    Vidéo YouTube
                                </button>
                                <button
                                    onClick={() => setActiveTab('pdf')}
                                    className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                                        activeTab === 'pdf'
                                            ? 'bg-youtube-red text-white font-medium'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" />
                                    </svg>
                                    Document PDF
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'youtube' ? (
                                    <motion.div
                                        key="youtube"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <AnimatedSearchField
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            onSubmit={handleYouTubeSubmit}
                                            isValid={isValidUrl}
                                        />
                                        {youtubeUrl && !isValidUrl && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-2 text-red-500 text-sm"
                                            >
                                                URL YouTube invalide. Veuillez entrer une URL valide.
                                            </motion.p>
                                        )}
                                        <div className="mt-6 text-center">
                                            <AnimatedButton
                                                onClick={handleYouTubeSubmit}
                                                disabled={!isValidUrl}
                                            >
                                                <span className="flex items-center">
                                                    <span>Créer avec YouTube</span>
                                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </AnimatedButton>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pdf"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col items-center"
                                    >
                                        <p className="text-gray-300 mb-6 text-center">
                                            Pour créer avec un PDF, vous serez redirigé vers notre outil de création spécialisé.
                                        </p>
                                        <AnimatedButton
                                            onClick={navigateToCreationPDF}
                                        >
                                            <span className="flex items-center">
                                                <span>Créer avec PDF</span>
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </AnimatedButton>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                </>
            ) : (
                /* Version desktop */
                <section className="relative pt-16 md:pt-16 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto relative z-10">
                        <HeroTitle isMobile={false} />

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
                        >
                            Intelligence artificielle de pointe au service de l'éducation.
                        </motion.p>

                        <div className="max-w-2xl mx-auto">
                            {/* Tabs pour choisir entre YouTube et PDF */}
                            <div className="flex bg-gray-900 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => setActiveTab('youtube')}
                                    className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                                        activeTab === 'youtube'
                                            ? 'bg-youtube-red text-white font-medium'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                    Vidéo YouTube
                                </button>
                                <button
                                    onClick={() => setActiveTab('pdf')}
                                    className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                                        activeTab === 'pdf'
                                            ? 'bg-youtube-red text-white font-medium'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" />
                                    </svg>
                                    Document PDF
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'youtube' ? (
                                    <motion.div
                                        key="youtube"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <AnimatedSearchField
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            onSubmit={handleYouTubeSubmit}
                                            isValid={isValidUrl}
                                        />
                                        {youtubeUrl && !isValidUrl && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-2 text-red-500 text-sm"
                                            >
                                                URL YouTube invalide. Veuillez entrer une URL valide.
                                            </motion.p>
                                        )}
                                        <div className="mt-8 text-center">
                                            <AnimatedButton
                                                onClick={handleYouTubeSubmit}
                                                disabled={!isValidUrl}
                                            >
                                                <span className="flex items-center">
                                                    <span>Créer avec YouTube</span>
                                                    <motion.svg
                                                        className="w-5 h-5 ml-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        initial={{ x: 0 }}
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 1,
                                                            repeatDelay: 1,
                                                            type: "tween"
                                                        }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </motion.svg>
                                                </span>
                                            </AnimatedButton>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pdf"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col items-center"
                                    >
                                        <p className="text-gray-300 mb-6 text-center">
                                            Pour créer avec un PDF, vous serez redirigé vers notre outil de création spécialisé.
                                        </p>
                                        <AnimatedButton
                                            onClick={navigateToCreationPDF}
                                        >
                                            <span className="flex items-center">
                                                <span>Créer avec PDF</span>
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </AnimatedButton>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <StatsCounter />

                        <div className="mt-12 text-center">
                            <FoxLogo />
                        </div>
                    </div>
                </section>
            )}

            {/* Section Exemples de créations */}
            <section className="py-16 px-4 md:px-8 bg-dark-bg/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <AnimatedBlobs/>
                    <ExamplesGrid />
                </div>
            </section>

            {/* Section Comment ça marche */}
            <HowItWorksSection />

            <InstallPWA />

            {/* Section CTA finale */}
            <section className="py-24 px-4 md:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-youtube-red/20 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                            Prêt à <span className="text-youtube-red">révolutionner</span> votre façon d'apprendre?
                        </h2>

                        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                            Commencez dès maintenant et transformez n'importe quelle vidéo YouTube ou PDF en une expérience d'apprentissage interactive et mémorable.
                        </p>

                    </motion.div>
                </div>
            </section>

            {/* Mobile Floating Button */}
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
        </div>
    );
};

export default HomePage;