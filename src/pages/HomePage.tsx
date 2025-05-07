import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import APP_CONFIG from '@/config/appConfig';

// Composant pour les particules animées avancées
const AnimatedParticles: React.FC = () => {
    const particlesRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (particlesRef.current) {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight * 2 // Pour couvrir toute la page au scroll
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Générer des particules de différentes tailles et vitesses
    const createParticles = () => {
        const particles = [];
        const particleCount = Math.floor(dimensions.width / 2); // Nombre adaptatif basé sur la largeur d'écran

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 8 + 1;
            const x = Math.random() * dimensions.width;
            const y = Math.random() * dimensions.height;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.3 + 0.1;
            const scale = Math.random() * 0.5 + 0.5;
            const glow = Math.random() > 0.8; // 20% des particules brillent

            particles.push(
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${glow ? 'bg-youtube-red shadow-glow' : 'bg-white'}`}
                    style={{
                        width: size,
                        height: size,
                        x,
                        y,
                        opacity
                    }}
                    animate={{
                        y: y - 300 - Math.random() * 300,
                        x: x + (Math.random() * 200 - 100),
                        opacity: [opacity, opacity * 0.7, 0],
                        scale: [scale, scale * 0.8, scale * 1.2, 0]
                    }}
                    transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                    }}
                />
            );
        }
        return particles;
    };

    return (
        <div ref={particlesRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {dimensions.width > 0 && createParticles()}
        </div>
    );
};


// Composant TextGlitch pour animation de texte
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

// Composant HeroTitle avec animation avancée
const HeroTitle: React.FC = () => {
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
                    en <TextGlitch text="expériences" className="relative text-transparent bg-clip-text bg-gradient-to-r from-youtube-red to-red-400" /> d'apprentissage
                </motion.span>
            </h1>
            <div className="absolute -bottom-6 -left-2 w-20 h-2 bg-youtube-red rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-youtube-red opacity-20 blur-lg"></div>
        </motion.div>
    );
};

// Composant pour l'effet de hover 3D
const Card3D: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [scale, setScale] = useState(1);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

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
            style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: 'preserve-3d'
            }}
        >
            {children}
            <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-youtube-red to-red-500 opacity-0 hover:opacity-20 transition-opacity"
                style={{ transform: 'translateZ(-10px)' }}
            />
        </div>
    );
};

// Composant pour une section animée en fonction du scroll
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [controls, isInView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.8,
                        ease: [0.1, 0.35, 0.5, 1]
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Composant pour l'effet de défilement parallaxe
const ParallaxScroll: React.FC<{ children: React.ReactNode; speed?: number; className?: string }> =
    ({ children, speed = 0.2, className = '' }) => {
        const [scrollY, setScrollY] = useState(0);

        useEffect(() => {
            const handleScroll = () => {
                setScrollY(window.scrollY);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }, []);

        return (
            <div
                className={`transform ${className}`}
                style={{ transform: `translateY(${scrollY * speed}px)` }}
            >
                {children}
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
const AnimatedSearchField: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> =
    ({ value, onChange }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative z-10 w-full"
            >
                <div className="relative">
                    <input
                        id="main-input"
                        type="text"
                        placeholder="Collez votre lien YouTube ou importez votre PDF"
                        className="w-full px-6 py-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-red/30 transition duration-300"
                        value={value}
                        onChange={onChange}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-youtube-red via-red-500 to-red-300"
                        initial={{ width: 0 }}
                        animate={{ width: value ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="absolute right-2 top-2 flex space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-md transition duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-youtube-red hover:bg-red-700 text-white px-3 py-2 rounded-md transition duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                <div className="absolute top-full left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden" hidden={!value}>
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
                                "Jeu de positionnement?"
                            ]}
                            className="text-sm text-gray-400 p-2"
                        />
                    </div>
                </div>
            </motion.div>
        );
    };

// Bouton avec effet de pulse et hover avancé
const AnimatedButton: React.FC<{ children: React.ReactNode; onClick?: () => void; disabled?: boolean }> =
    ({ children, onClick, disabled = false }) => {
        return (
            <motion.button
                onClick={onClick}
                disabled={disabled}
                className={`relative overflow-hidden mt-6 bg-youtube-red text-white font-bold py-3 px-8 rounded-full text-lg transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-youtube-red disabled:hover:shadow-none`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
            >
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400"
                    initial={{ x: '-100%', opacity: 0.5 }}
                    animate={{ x: ['0%', '100%'], opacity: [0.5, 0] }}
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

// Composant pour la grille dynamique de vidéos avec animation
const VideoGrid: React.FC = () => {
    const controls = useAnimation();
    const [videos, setVideos] = useState([
        {
            id: 'dQw4w9WgXcQ',
            title: 'Apprendre les bases du baseball',
            type: 'Jeu de positionnement interactif',
            img: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '1.2M',
            creator: 'SportsMaster',
        },
        {
            id: '9bZkp7q19f0',
            title: 'Vocabulaire anglais avancé',
            type: 'Flashcards interactives',
            img: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
            views: '845K',
            creator: 'LanguageLearner',
        },
        {
            id: 'J---aiyznGQ',
            title: 'Physique quantique simplifiée',
            type: 'Quiz interactif avec explications',
            img: 'https://i.ytimg.com/vi/J---aiyznGQ/maxresdefault.jpg',
            views: '652K',
            creator: 'ScienceGuru',
        },


    ]);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [controls, isInView]);

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
        <div ref={ref} className="relative z-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Dernières créations de la communauté
                </h2>

                <div className="hidden md:flex space-x-2">
                    {['Tous', 'Quiz', 'Flashcards', 'Jeux'].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'Tous' ? 'bg-youtube-red text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate={controls}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {videos.map((video) => (
                    <Card3D key={video.id} className="h-full">
                        <motion.div
                            variants={item}
                            className="bg-card-bg rounded-xl overflow-hidden h-full cursor-pointer group"
                        >
                            <div className="relative">
                                <img src={video.img} alt={video.title} className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <div className="p-3 w-full">
                                        <div className="flex items-center justify-between text-white text-sm">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 11.5l-5-3v-6h1.5v5.1l4 2.4-1 1.5z" />
                                                </svg>
                                                <span>3:45</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                </svg>
                                                <span>{video.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3 bg-youtube-red rounded-full p-2 transform rotate-0 hover:rotate-90 transition-transform duration-300">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-medium leading-tight mb-1 group-hover:text-youtube-red transition-colors">{video.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span>{video.creator}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-youtube-red">{video.type}</span>
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
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M5 21h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
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
        </div>
    );
};

// Composant pour l'affichage des statistiques en temps réel avec compteur animé
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

    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

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
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
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
                    className="bg-card-bg rounded-2xl p-6 text-center relative overflow-hidden group"
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

// Composant principal HomePage
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveringFeature, setHoveringFeature] = useState(-1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Animation de transformation futuriste
        setTimeout(() => {
            navigate(APP_CONFIG.routes.creation, {
                state: {
                    youtubeUrl,
                    prompt
                }
            });
            setIsSubmitting(false);
        }, 1500);
    };

    // Données pour la section fonctionnalités
    const features = [
        {
            title: "Flashcards Interactives",
            description: "Générez automatiquement des flashcards intelligentes qui s'adaptent à votre rythme d'apprentissage et mettent en évidence les concepts clés.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                </svg>
            )
        },
        {
            title: "Quiz Dynamiques",
            description: "Créez des quiz personnalisés qui s'adaptent à vos réponses, offrant des explications détaillées et des rétroactions immédiates.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM9 17H5v-2h4v2zm0-4H5v-2h4v2zm0-4H5V7h4v2zm4 4H11v-2h2v2zm0-4H11V7h2v2zm-1 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
                </svg>
            )
        },
        {
            title: "Jeux Éducatifs Immersifs",
            description: "Transformez n'importe quel contenu en jeux interactifs visuellement époustouflants qui améliorent la rétention des connaissances.",
            icon: (
                <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM6 15h2v-2h2v-2H8V9H6v2H4v2h2z" />
                    <circle cx="14.5" cy="13.5" r="1.5" />
                    <circle cx="18.5" cy="10.5" r="1.5" />
                </svg>
            )
        },
    ];

    // Exemples de jeux générés
    const exampleGames = [
        {
            title: "Base du Baseball",
            description: "Jeu de positionnement interactif des joueurs avec explications des règles et stratégies.",
            image: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            preview: "Où doit se positionner le joueur de champ extérieur lorsque le frappeur est gaucher?"
        },
        {
            title: "Neuroanatomie 3D",
            description: "Exploration interactive du cerveau humain avec identification des structures et fonctions.",
            image: "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
            preview: "Identifiez les régions activées lors d'une tâche de mémoire à court terme."
        }
    ];

    return (
        <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
            {/* Particle background */}
            <AnimatedParticles />

            {/* Hero Section avec animation avancée */}
            <section className="relative pt-12 md:pt-20 lg:pt-20 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto relative z-10">
                    <HeroTitle />

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
                    >
                        Créez instantanément des <span className="text-youtube-red font-semibold">expériences d'apprentissage captivantes</span> à partir de n'importe quelle vidéo YouTube ou document PDF. Intelligence artificielle de pointe au service de l'éducation.
                    </motion.p>

                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <AnimatedSearchField value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-4"
                        >
                            <input
                                type="text"
                                placeholder="Ajoutez un texte d'orientation (ex. 'focus vocabulaire', 'jeu de positionnement baseball')"
                                className="w-full px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-red/30 transition duration-300"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="absolute -bottom-1 left-0 h-0.5 bg-youtube-red"></div>
                        </motion.div>

                        <AnimatedButton
                            onClick={handleSubmit}
                            disabled={isSubmitting || !youtubeUrl}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    <span>Analyse de votre vidéo...</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span>Générer mon jeu</span>
                                    <motion.svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        initial={{ x: 0 }}
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1, repeatDelay: 1 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </motion.svg>
                                </div>
                            )}
                        </AnimatedButton>
                    </form>

                    {/* Live indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="flex justify-center mt-8"
                    >
                        <div className="flex items-center px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-gray-400 mr-3">1,243 utilisateurs en ligne</span>
                            <span className="text-gray-500">|</span>
                            <div className="ml-3 flex items-center">
                                <div className="w-2 h-2 bg-youtube-red rounded-full mr-2 animate-pulse"></div>
                                <span className="text-gray-400">23 jeux générés dans la dernière minute</span>
                            </div>
                        </div>
                    </motion.div>

                    <StatsCounter />
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-gray-500 text-sm mb-2">Découvrir plus</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <svg className="w-6 h-6 text-youtube-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Videos Section with 3D effect */}
            <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-darker-bg">
                <div className="max-w-7xl mx-auto">
                    <VideoGrid />
                </div>
            </AnimatedSection>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-youtube-red/30 to-transparent my-8"></div>

            {/* Example Game Section with advanced animations */}
            <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="lg:w-1/2"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <ParallaxScroll speed={-0.1} className="relative z-10">
                                <div className="relative">
                                    <img
                                        src={exampleGames[0].image}
                                        alt={exampleGames[0].title}
                                        className="rounded-xl shadow-2xl w-full"
                                    />
                                    <div className="absolute -inset-4 bg-youtube-red rounded-xl opacity-20 blur-lg -z-10"></div>

                                    {/* Interactive overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-xl flex items-end">
                                        <div className="p-6 w-full">
                                            <div className="flex items-center justify-between">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-youtube-red text-white rounded-full p-3 shadow-lg"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </motion.button>

                                                <div className="flex space-x-2">
                                                    {['Defense', 'Stratégie', 'Positions'].map((tag, idx) => (
                                                        <motion.span
                                                            key={tag}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                                            className="bg-gray-800/80 text-gray-200 text-xs px-3 py-1 rounded-full backdrop-blur-sm"
                                                        >
                                                            {tag}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3D baseball field overlay */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                                    >
                                        <svg width="300" height="300" viewBox="0 0 300 300" className="opacity-70">
                                            <path d="M150 50 L250 250 L50 250 Z" fill="none" stroke="#FF0000" strokeWidth="2" />
                                            <circle cx="150" cy="150" r="5" fill="#FFFFFF" />
                                            <circle cx="150" cy="180" r="5" fill="#FFFFFF" />
                                            <circle cx="120" cy="220" r="5" fill="#FFFFFF" />
                                            <circle cx="180" cy="220" r="5" fill="#FFFFFF" />
                                            <circle cx="100" cy="150" r="5" fill="#FFFFFF" />
                                            <circle cx="200" cy="150" r="5" fill="#FFFFFF" />
                                            <circle cx="80" cy="100" r="5" fill="#FF0000" strokeWidth="2" stroke="#FFFFFF" />
                                            <path d="M150 50 L150 250" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="5,5" />
                                            <path d="M50 250 L250 250" stroke="#FFFFFF" strokeWidth="2" />
                                        </svg>
                                    </motion.div>
                                </div>
                            </ParallaxScroll>
                        </motion.div>

                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Découvrez en direct un exemple de jeu généré
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                À partir d'une vidéo YouTube sur le baseball, nous avons créé un <span className="text-youtube-red font-semibold">jeu interactif de positionnement</span> des joueurs avec des explications visuelles.
                            </p>

                            <div className="bg-card-bg p-6 rounded-xl mb-8 border border-gray-800 shadow-inner">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-youtube-red flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                                        </svg>
                                    </div>
                                    <div className="text-gray-400 text-sm">Question interactive</div>
                                </div>

                                <h3 className="text-white font-medium text-lg mb-4">
                                    "Où doit se positionner le joueur de champ extérieur lorsque le frappeur est gaucher?"
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {['Champ gauche', 'Champ centre', 'Champ droit', 'Arrêt-court'].map((option, idx) => (
                                        <motion.button
                                            key={option}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`py-2 px-4 rounded-lg border ${
                                                option === 'Champ droit'
                                                    ? 'bg-youtube-red border-red-700 text-white'
                                                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center">
                        <span className="w-5 h-5 rounded-full border flex items-center justify-center mr-2">
                          {option === 'Champ droit' && (
                              <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-white rounded-full"
                              />
                          )}
                        </span>
                                                {option}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-green-900/20 border border-green-900 text-green-200 p-3 rounded-lg text-sm"
                                >
                                    <div className="font-medium mb-1">Correct!</div>
                                    <p>
                                        Le champ droit se positionne plus à l'extérieur car les frappeurs gauchers ont tendance à frapper davantage vers la droite du terrain.
                                    </p>
                                </motion.div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-youtube-red text-white font-bold py-3 px-6 rounded-lg flex items-center"
                            >
                                <span>Voir en action</span>
                                <motion.svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    initial={{ x: 0 }}
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, repeatDelay: 1 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </motion.svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Features Section with hover effects */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-darker-bg relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-youtube-red/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-youtube-red/5 rounded-full blur-3xl"></div>

                    <AnimatedSection>
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
                            Une nouvelle dimension d'apprentissage
                        </h2>
                        <div className="w-24 h-1 bg-youtube-red mx-auto mb-12"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-card-bg rounded-xl p-8 border border-gray-800 relative z-10"
                                    onMouseEnter={() => setHoveringFeature(idx)}
                                    onMouseLeave={() => setHoveringFeature(-1)}
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: 'rgba(40, 40, 40, 1)',
                                        boxShadow: '0 25px 50px -12px rgba(255, 0, 0, 0.25)'
                                    }}
                                >
                                    <motion.div
                                        className="bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mb-6"
                                        animate={hoveringFeature === idx ? {
                                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                            scale: 1.1,
                                            rotate: [0, 5, -5, 0]
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>

                                    <motion.div
                                        className="mt-6 flex items-center text-youtube-red"
                                        animate={hoveringFeature === idx ? { x: 5 } : { x: 0 }}
                                    >
                                        <span className="font-medium">En savoir plus</span>
                                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.div>

                                    {/* Animated border on hover */}
                                    <motion.div
                                        className="absolute inset-0 border border-youtube-red rounded-xl"
                                        initial={{ opacity: 0 }}
                                        animate={hoveringFeature === idx ? { opacity: 1 } : { opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Final CTA Section with perspective effect */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-youtube-red/20 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <AnimatedSection className="text-center">
                        <motion.h2
                            className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Prêt à <span className="text-youtube-red">révolutionner</span> votre façon d'apprendre?
                        </motion.h2>

                        <motion.p
                            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Commencez dès maintenant et transformez n'importe quelle vidéo YouTube ou PDF en une expérience d'apprentissage interactive et mémorable.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row items-center justify-center gap-6"
                        >
                            <div className="relative w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Collez votre lien YouTube ici..."
                                    className="w-full md:w-96 px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-red/30 transition duration-300"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                />
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-youtube-red via-red-500 to-red-300"
                                    initial={{ width: 0 }}
                                    animate={{ width: youtubeUrl ? '100%' : '0%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting || !youtubeUrl}
                                className="w-full md:w-auto bg-youtube-red text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                        <span>Traitement...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span>Commencer</span>
                                        <motion.svg
                                            className="w-5 h-5 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            initial={{ x: 0 }}
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, repeatDelay: 1 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </motion.svg>
                                    </div>
                                )}
                            </motion.button>
                        </motion.div>
                    </AnimatedSection>



                </div>

                {/* Floating CTA button for mobile */}
                <motion.div
                    className="md:hidden fixed bottom-6 right-6 z-50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: 'spring' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-youtube-red text-white w-16 h-16 rounded-full shadow-lg shadow-youtube-red/30 flex items-center justify-center"
                        onClick={() => document.getElementById('main-input')?.focus()}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </motion.button>
                </motion.div>
            </section>

            {/* Add these styles to make the animations work */}
            <style jsx>{`
        @keyframes particle {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-1000px) translateX(1000px); opacity: 0; }
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3);
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.3);
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .bg-dark-bg {
          background-color: #0F0F0F;
        }
        
        .bg-darker-bg {
          background-color: #0A0A0A;
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
        
        .hover\:bg-red-700:hover {
          background-color: #CC0000;
        }
      `}</style>
        </div>
    );
};

export default HomePage;