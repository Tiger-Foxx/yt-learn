import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import APP_CONFIG from '@/config/appConfig';
// Supposons que ces hooks existent et fonctionnent comme prévu
// Si ce n'est pas le cas, la logique de validation/chargement devra être ajustée
import useYouTube from '@/hooks/useYouTube'; // Doit exporter validateYouTubeUrl
import usePDF from '@/hooks/usePDF'; // Doit exporter loadPDF

// ----- NOUVEAU COMPOSANT : Animation de fond "Big Tech" -----
const BackgroundBlobs: React.FC = () => {
    const blobVariants = {
        animate: {
            x: [0, 100, -50, 0, 50, -100, 0],
            y: [0, -50, 100, 50, -100, 0, 0],
            scale: [1, 1.2, 0.8, 1.1, 0.9, 1.3, 1],
            opacity: [0.3, 0.5, 0.2, 0.6, 0.4, 0.5, 0.3],
            transition: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
                repeatType: "mirror" as "mirror",
            }
        }
    };

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
                className="absolute w-96 h-96 bg-youtube-red rounded-full blur-3xl"
                style={{ top: '10%', left: '20%' }}
                variants={blobVariants}
                animate="animate"
            />
            <motion.div
                className="absolute w-80 h-80 bg-red-400 rounded-full blur-3xl"
                style={{ top: '50%', left: '60%' }}
                variants={blobVariants}
                animate="animate"
                transition={{ ...blobVariants.animate.transition, delay: -10 }}
            />
            <motion.div
                className="absolute w-92 h-72 bg-red-700 rounded-full blur-3xl" // Gris clair/blanc
                style={{ top: '30%', left: '80%' }}
                variants={blobVariants}
                animate="animate"
                transition={{ ...blobVariants.animate.transition, delay: -20 }}
            />
            <motion.div
                className="absolute w-64 h-64 bg-gray-800 rounded-full blur-3xl" // Autre nuance de gris
                style={{ bottom: '10%', left: '10%' }}
                variants={blobVariants}
                animate="animate"
                transition={{ ...blobVariants.animate.transition, delay: -30 }}
            />
        </div>
    );
};


// Composant pour l'effet de texte glitch
const TextGlitch: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
    const [displayText, setDisplayText] = useState(text);
    const originalText = useRef(text);
    const glitchInterval = useRef<NodeJS.Timeout | null>(null);
    const glitchChars = "!<>-_\\/[]{}—=+*^?#__________";

    useEffect(() => {
        const triggerGlitch = () => {
            let iterations = 0;
            const interval = setInterval(() => {
                setDisplayText(() => {
                    if (iterations < 10) {
                        const randomChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        return originalText.current
                            .split('')
                            .map((char) => (Math.random() < 0.1 ? randomChar() : char))
                            .join('');
                    }
                    return originalText.current;
                });
                iterations++;
                if (iterations >= 12) clearInterval(interval);
            }, 50);
        };
        glitchInterval.current = setInterval(triggerGlitch, 6000);
        return () => { if (glitchInterval.current) clearInterval(glitchInterval.current); };
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

// Composant pour l'effet 3D au survol
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
        const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 8; // Reduced rotation
        const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * 8; // Reduced rotation
        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
        setScale(1.03); // Reduced scale
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setScale(1);
    };

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-300 transform-gpu ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: 'preserve-3d'
            }}
        >
            {children}
            <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-youtube-red/50 to-red-500/50 opacity-0 hover:opacity-10 transition-opacity pointer-events-none" // Adjusted opacity
                style={{ transform: 'translateZ(-20px)' }} // Further back
            />
        </div>
    );
};

// Composant pour une section animée en fonction du scroll
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 }); // Changed once to true, amount to 0.2
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

// Composant pour l'animation d'écriture en "typewriter"
const TypewriterText: React.FC<{ texts: string[]; className?: string }> = ({ texts, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 1500;

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[index];
            if (!isDeleting) {
                if (charIndex < currentText.length) {
                    setDisplayText(currentText.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                if (charIndex > 0) {
                    setDisplayText(currentText.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setIndex((prevIndex) => (prevIndex + 1) % texts.length);
                }
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timer);
    }, [charIndex, index, isDeleting, texts]);

    return <div className={`${className}`}>{displayText}<span className="animate-pulse">|</span></div>;
};

// Champ de recherche avec animation avancée
const AnimatedSearchField: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void; // Assurez-vous que ce onSubmit est bien celui de HomePage
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
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSubmit} // Ce bouton déclenche aussi la soumission
                        disabled={!isValid}
                        className={`bg-youtube-red hover:bg-red-700 text-white p-2 rounded-md transition duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Soumettre le lien YouTube"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {value && isValid && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className={`bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden`}
                    >
                        <div className="p-3 border-b border-gray-700">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-youtube-red rounded flex items-center justify-center mr-3 shrink-0">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Composant pour le téléchargement de PDF avec animation
const AnimatedPDFUploader: React.FC<{
    onFileSelect: (file: File) => void; // Ceci sera handlePDFUpload de HomePage
    pdfFile: File | null; // Prop pour savoir si un PDF est déjà chargé (pour le bouton continuer)
    handlePDFSubmit: () => void; // Fonction pour soumettre le PDF explicitement
}> = ({ onFileSelect, pdfFile, handlePDFSubmit }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(pdfFile);

    useEffect(() => {
        setSelectedFile(pdfFile); // Synchroniser avec l'état du parent
    }, [pdfFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file); // Informe HomePage du nouveau fichier (pour pré-validation/état)
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
        >
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed ${isDragging ? 'border-youtube-red bg-youtube-red/10' : selectedFile ? 'border-green-500 bg-green-500/10' : 'border-gray-600'} rounded-xl p-10 text-center cursor-pointer transition-colors duration-300 hover:border-youtube-red hover:bg-youtube-red/5`}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                {selectedFile ? (
                    <div className="space-y-2">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, 0] }} transition={{ type: "spring", damping: 10 }} className="w-14 h-14 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                        <h3 className="text-lg font-medium text-white">{selectedFile.name}</h3>
                        <p className="text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-green-400 font-medium">PDF prêt pour la génération</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <svg className="w-14 h-14 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-white">Déposez votre PDF ici</h3>
                        <p className="text-gray-400">ou cliquez pour parcourir vos fichiers</p>
                        <p className="text-gray-500 text-sm">Format supporté: PDF (max 10MB)</p>
                    </div>
                )}
            </div>
            {selectedFile && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex justify-end">
                    <button
                        className="bg-youtube-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        onClick={handlePDFSubmit} // Utilise la fonction de soumission explicite
                    >
                        <span>Continuer avec ce PDF</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

// Bouton avec effet de pulse et hover avancé
const AnimatedButton: React.FC<{ children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string, type?: "button" | "submit" | "reset" }> =
    ({ children, onClick, disabled = false, className = '', type = "button" }) => {
        return (
            <motion.button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`relative overflow-hidden mt-6 bg-youtube-red text-white font-bold py-3 px-8 rounded-full text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-youtube-red disabled:hover:shadow-none ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: disabled ? 1 : 1.05, boxShadow: disabled ? 'none' : '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
            >
                {!disabled && (
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
                )}
                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    };

// Composant pour la grille des exemples - CORRIGÉ pour utiliser creationHistory
const ExamplesGrid: React.FC = () => {
    const navigate = useNavigate();
    const { creationHistory, refreshCreationHistory } = useAppContext(); // Utiliser creationHistory
    const controls = useAnimation();
    const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'flashcards' | 'interactive'>('all');

    useEffect(() => {
        refreshCreationHistory(); // S'assurer que l'historique est à jour
    }, [refreshCreationHistory]);

    const filteredExamples = creationHistory.filter(example => {
        if (activeFilter === 'all') return true;
        // Assurez-vous que example.gameType correspond aux valeurs de activeFilter
        return example.gameType === activeFilter;
    });

    const displayedExamples = filteredExamples.slice(0, 6); // Limiter à 6 exemples

    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [controls, isInView, displayedExamples]); // Ajouter displayedExamples aux dépendances pour relancer si les exemples changent

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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

    // Icônes génériques pour les types de jeux si pas de thumbnail
    const GameTypeIcon: React.FC<{ gameType: string }> = ({ gameType }) => {
        let iconSvg;
        let colorClass = 'text-gray-500'; // Couleur par défaut

        switch (gameType) {
            case 'quiz':
                iconSvg = <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 12h-3v-2h3v-2h-3V8h3V6h-5v10h5v-2zm3-8h-2V4h-3v2h2v8h3v-2z" />;
                colorClass = 'text-blue-500';
                break;
            case 'flashcards':
                iconSvg = <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />;
                colorClass = 'text-green-500';
                break;
            case 'interactive':
                iconSvg = <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />;
                colorClass = 'text-purple-500';
                break;
            default:
                iconSvg = <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />;
        }
        return (
            <svg className={`w-12 h-12 ${colorClass}`} fill="currentColor" viewBox="0 0 24 24">
                {iconSvg}
            </svg>
        );
    };


    return (
        <div ref={ref} className="relative z-10">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Exemples de créations
                </h2>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: 'Tous' },
                        { id: 'quiz', label: 'Quiz' },
                        { id: 'flashcards', label: 'Flashcards' },
                        { id: 'interactive', label: 'Jeux Interactifs' } // Libellé ajusté
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.05, backgroundColor: tab.id === activeFilter ? undefined : 'rgba(255, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab.id === activeFilter ? 'bg-youtube-red text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {displayedExamples.length > 0 ? (
                <motion.div
                    key={activeFilter} // Pour forcer la ré-animation des enfants lors du changement de filtre
                    variants={container}
                    initial="hidden"
                    animate={controls} // Utiliser les controls pour l'animation au scroll
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayedExamples.map((example) => (
                        <Card3D key={example.id} className="h-full">
                            <motion.div
                                variants={item}
                                className="bg-card-bg rounded-xl overflow-hidden h-full cursor-pointer group flex flex-col"
                                onClick={() => navigate(`/game/${example.id}`)}
                            >
                                <div className="relative">
                                    {example.thumbnail ? (
                                        <img
                                            src={example.thumbnail}
                                            alt={example.title}
                                            className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className={`w-full h-48 flex items-center justify-center bg-gray-700`}>
                                            <GameTypeIcon gameType={example.gameType || 'interactive'} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <div className="p-3 w-full">
                                            <div className="absolute top-2 right-2 bg-black/70 rounded-full py-1 px-3 text-xs text-white">
                                                {example.gameType === 'quiz' ? 'Quiz' :
                                                    example.gameType === 'flashcards' ? 'Flashcards' :
                                                        'Jeu interactif'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-white font-medium leading-tight mb-1 group-hover:text-youtube-red transition-colors">{example.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span>{example.sourceType === 'youtube' ? 'Vidéo YouTube' : 'Document PDF'}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-youtube-red capitalize">{example.difficulty || 'Normal'}</span>
                                    </div>
                                    <div className="flex-grow"></div> {/* Pousse le contenu suivant vers le bas */}
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
                                        <div className="text-gray-400 text-sm">
                                            {new Date(example.createdAt).toLocaleDateString()}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-sm px-3 py-1 rounded-full border border-youtube-red text-youtube-red hover:bg-youtube-red hover:text-white transition-colors"
                                        >
                                            Jouer
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
                    className="bg-gray-800 rounded-xl p-12 text-center"
                >
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                    </svg>
                    <p className="text-gray-400 mb-4">Aucun exemple disponible pour le moment.</p>
                    <p className="text-gray-500 text-sm">Créez votre premier contenu pour le voir apparaître ici !</p>
                </motion.div>
            )}
        </div>
    );
};

// Composant pour l'affichage des statistiques avec compteur animé
const StatsCounter: React.FC = () => {
    const [stats, setStats] = useState({ contenus: 0, apprenants: 0, satisfaction: 0 });
    const targetStats = { contenus: 15879, apprenants: 342940, satisfaction: 98 };
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 }); // once: true pour animer une seule fois

    useEffect(() => {
        if (!isInView) return;
        const duration = 2000;
        const steps = 50; // Augmenter pour plus de fluidité
        const intervalTime = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            setStats({
                contenus: Math.min(Math.floor(targetStats.contenus * progress), targetStats.contenus),
                apprenants: Math.min(Math.floor(targetStats.apprenants * progress), targetStats.apprenants),
                satisfaction: Math.min(Math.floor(targetStats.satisfaction * progress), targetStats.satisfaction),
            });
            if (currentStep >= steps) clearInterval(timer);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [isInView, targetStats.contenus, targetStats.apprenants, targetStats.satisfaction]); // Ajouter targetStats aux dépendances

    const statItems = [
        { label: 'Contenus créés', value: stats.contenus.toLocaleString(), icon: <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg> },
        { label: 'Apprenants satisfaits', value: stats.apprenants.toLocaleString(), icon: <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" /></svg> },
        { label: 'Taux de satisfaction', value: `${stats.satisfaction}%`, icon: <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> },
    ];

    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {statItems.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
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

// Section "Comment ça marche"
const HowItWorksSection: React.FC = () => {
    const steps = [
        { title: "Partagez votre contenu source", description: "Collez simplement l'URL d'une vidéo YouTube ou téléchargez un document PDF. Laissez notre système se charger de tout analyser.", icon: <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg> },
        { title: "Personnalisez votre expérience", description: "Choisissez entre quiz interactifs, flashcards ou jeux immersifs. Ajustez la difficulté et ajoutez vos instructions spécifiques.", icon: <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v4h-4v2h4v4h2v-4h4v-2h-4V8z" /></svg> },
        { title: "Profitez de l'apprentissage interactif", description: "Notre IA crée votre contenu personnalisé, prêt à être utilisé. Apprenez efficacement et partagez vos créations.", icon: <svg className="w-10 h-10 text-youtube-red mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg> },
    ];

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-16"> {/* Utilisation de AnimatedSection */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Comment ça marche
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transformez n'importe quelle vidéo ou document en expérience d'apprentissage interactive en quelques étapes simples
                    </p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-card-bg rounded-xl p-8 relative"
                        >
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-youtube-red rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                {index + 1}
                            </div>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-gray-800 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-md">
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

// Section des fonctionnalités
const FeaturesSection: React.FC = () => {
    const featureColorMapping: { [key: string]: { bg: string, text: string, bgOpacity: string } } = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-500', bgOpacity: 'bg-blue-500/20' },
        green: { bg: 'bg-green-500', text: 'text-green-500', bgOpacity: 'bg-green-500/20' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', bgOpacity: 'bg-purple-500/20' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', bgOpacity: 'bg-yellow-500/20' },
        red: { bg: 'bg-red-500', text: 'text-red-500', bgOpacity: 'bg-red-500/20' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', bgOpacity: 'bg-indigo-500/20' },
    };

    const features = [
        { title: "Quiz Interactifs", description: "Transformez vos vidéos en quiz ludiques avec questions à choix multiples, explications et suivi de progression.", icon: <svg className={`w-8 h-8 ${featureColorMapping.blue.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M16 2H8C6.9 2 6 2.9 6 4v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 17c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-8c0 .55-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1z" /></svg>, color: "blue" },
        { title: "Flashcards Intelligentes", description: "Créez des flashcards de mémorisation qui s'adaptent à votre progression et mettent en avant les concepts clés.", icon: <svg className={`w-8 h-8 ${featureColorMapping.green.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" /></svg>, color: "green" },
        { title: "Jeux Éducatifs Immersifs", description: "Explorez des concepts complexes avec des jeux interactifs qui rendent l'apprentissage engageant et efficace.", icon: <svg className={`w-8 h-8 ${featureColorMapping.purple.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>, color: "purple" },
        { title: "Intelligence Artificielle Avancée", description: "Notre IA analyse votre contenu pour extraire les concepts importants et créer une expérience d'apprentissage sur mesure.", icon: <svg className={`w-8 h-8 ${featureColorMapping.yellow.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-3-9h6m-3-3v6" /></svg>, color: "yellow" },
        { title: "Multi-formats Supportés", description: "Compatible avec n'importe quelle vidéo YouTube ou document PDF, pour un apprentissage sans limites.", icon: <svg className={`w-8 h-8 ${featureColorMapping.red.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>, color: "red" },
        { title: "Bibliothèque Personnelle", description: "Toutes vos créations sont sauvegardées dans votre espace personnel, accessible à tout moment.", icon: <svg className={`w-8 h-8 ${featureColorMapping.indigo.text}`} fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>, color: "indigo" },
    ];

    return (
        <section className="py-20 px-4 md:px-8 bg-card-bg bg-opacity-50">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection className="text-center mb-16"> {/* Utilisation de AnimatedSection */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Des outils puissants pour votre apprentissage
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Découvrez toutes les fonctionnalités qui rendent l'apprentissage interactif et mémorable
                    </p>
                </AnimatedSection>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ translateY: -10 }}
                            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
                        >
                            <div className={`h-2 ${featureColorMapping[feature.color]?.bg || 'bg-gray-500'} w-full`}></div>
                            <div className="p-6">
                                <div className={`w-14 h-14 rounded-lg mb-4 flex items-center justify-center ${featureColorMapping[feature.color]?.bgOpacity || 'bg-gray-500/20'}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- LOGIQUE DE SERVICE YOUTUBE (similaire à l'ancien youtubeService) ---
const youtubeServiceHelper = {
    parseYouTubeUrl: (url: string): string | null => {
        // Regex améliorée pour divers formats d'URL YouTube
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
};

// Component principal HomePage
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { refreshCreationHistory } = useAppContext();

    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<'youtube' | 'pdf'>('youtube');
    const [isProcessing, setIsProcessing] = useState(false);


    // Hooks pour YouTube et PDF (supposés exister)
    // Si ces hooks ont des méthodes spécifiques, adaptez les appels ci-dessous.
    // Par exemple, si useYouTube().validateYouTubeUrl est async:
    // const { validateYouTubeUrl } = useYouTube();
    // const { loadPDF } = usePDF(); // Supposons que loadPDF est une validation rapide ou un pré-chargement

    // Valider l'URL YouTube lorsqu'elle change
    useEffect(() => {
        // Utilisation de la logique de service helper, ou de votre hook useYouTube
        // const result = await validateYouTubeUrl(youtubeUrl); setIsValidUrl(result.isValid);
        const videoId = youtubeServiceHelper.parseYouTubeUrl(youtubeUrl);
        setIsValidUrl(!!videoId);
    }, [youtubeUrl]);

    // Charger l'historique des créations au montage
    useEffect(() => {
        refreshCreationHistory();
    }, [refreshCreationHistory]);

    // Gérer la soumission du formulaire YouTube - CORRIGÉ
    const handleYouTubeSubmit = () => {
        if (isValidUrl && !isProcessing) {
            setIsProcessing(true);
            navigate(APP_CONFIG.routes.creation, {
                state: {
                    sourceType: 'youtube',
                    youtubeUrl
                }
            });
            // setIsProcessing(false); // Normalement géré par le changement de page
        }
    };

    // Gérer la sélection d'un fichier PDF (pas la soumission)
    const handlePDFFileSelect = async (file: File) => {
        setPdfFile(file); // Met à jour l'état pour que le bouton "Continuer" s'active
        // Optionnel: validation via usePDF si loadPDF est juste une validation
        // try {
        //   const isValidPDF = await loadPDF(file); // loadPDF hook
        //   if (!isValidPDF) {
        //     setPdfFile(null); // Réinitialiser si invalide
        //     // Afficher une erreur
        //   }
        // } catch (error) {
        //   console.error("Erreur validation PDF:", error);
        //   setPdfFile(null);
        // }
    };

    // Gérer la soumission du PDF - CORRIGÉ
    const handlePDFSubmit = () => {
        if (pdfFile && !isProcessing) {
            setIsProcessing(true);
            // Validation simple ici si loadPDF du hook n'est pas utilisé ou est déjà fait
            if (pdfFile.size > 10 * 1024 * 1024) { // Max 10MB
                alert("Le fichier PDF est trop volumineux (max 10MB).");
                setIsProcessing(false);
                return;
            }
            if (pdfFile.type !== "application/pdf") {
                alert("Format de fichier invalide. Veuillez sélectionner un PDF.");
                setIsProcessing(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                if (event.target && event.target.result) {
                    try {
                        sessionStorage.setItem('pdf-upload-name', pdfFile.name);
                        sessionStorage.setItem('pdf-upload-size', String(pdfFile.size));
                        sessionStorage.setItem('pdf-upload-type', pdfFile.type);
                        sessionStorage.setItem('pdf-upload-data', event.target.result as string);

                        navigate(APP_CONFIG.routes.creation, {
                            state: {
                                sourceType: 'pdf',
                                pdfFileName: pdfFile.name
                            }
                        });
                    } catch (e) {
                        console.error("Erreur de sessionStorage (quota dépassé?)", e);
                        alert("Erreur lors de la préparation du PDF. Il est peut-être trop volumineux pour être stocké temporairement.");
                        setIsProcessing(false);
                    }
                } else {
                    setIsProcessing(false);
                }
            };
            reader.onerror = () => {
                alert("Erreur lors de la lecture du fichier PDF.");
                setIsProcessing(false);
            }
            reader.readAsDataURL(pdfFile);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
            <BackgroundBlobs /> {/* Arrière-plan animé */}

            <section className="relative pt-16 md:pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center"> {/* Centrage du texte */}
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

                    <div className="max-w-2xl mx-auto">
                        <div className="flex bg-gray-900 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => { setActiveTab('youtube'); setPdfFile(null); }}
                                className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${activeTab === 'youtube' ? 'bg-youtube-red text-white font-medium shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                Vidéo YouTube
                            </button>
                            <button
                                onClick={() => { setActiveTab('pdf'); setYoutubeUrl(''); setIsValidUrl(false); }}
                                className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${activeTab === 'pdf' ? 'bg-youtube-red text-white font-medium shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" /></svg>
                                Document PDF
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'youtube' ? (
                                <motion.div
                                    key="youtube"
                                    initial={{ opacity: 0, y: 20 }} // Ajout de y pour un slide en douceur
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AnimatedSearchField
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        onSubmit={handleYouTubeSubmit}
                                        isValid={isValidUrl}
                                    />
                                    {youtubeUrl && !isValidUrl && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-red-500 text-sm">
                                            URL YouTube invalide. Veuillez vérifier le lien.
                                        </motion.p>
                                    )}
                                    <div className="mt-8 text-center">
                                        <AnimatedButton onClick={handleYouTubeSubmit} disabled={!isValidUrl || isProcessing}>
                                            <span className="flex items-center justify-center">
                                                <span>{isProcessing ? "Traitement..." : "Créer avec YouTube"}</span>
                                                {!isProcessing && <motion.svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" initial={{ x: 0 }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1, repeatDelay: 1 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></motion.svg>}
                                            </span>
                                        </AnimatedButton>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="pdf"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AnimatedPDFUploader
                                        onFileSelect={handlePDFFileSelect}
                                        pdfFile={pdfFile}
                                        handlePDFSubmit={handlePDFSubmit}
                                    />
                                    {/* Le bouton "Continuer" est maintenant dans AnimatedPDFUploader */}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <StatsCounter />
                </div>
            </section>

            <HowItWorksSection />

            <section className="py-16 px-4 md:px-8 bg-darker-bg">
                <div className="max-w-6xl mx-auto">
                    <ExamplesGrid />
                </div>
            </section>

            <FeaturesSection />

            <section className="py-24 px-4 md:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-youtube-red/10 via-dark-bg/50 to-dark-bg"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <AnimatedSection>
                        <motion.h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                            Prêt à <span className="text-youtube-red">révolutionner</span> votre façon d'apprendre?
                        </motion.h2>
                        <motion.p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} viewport={{ once: true }}>
                            Commencez dès maintenant et transformez n'importe quelle vidéo YouTube ou PDF en une expérience d'apprentissage interactive et mémorable.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            <AnimatedButton
                                onClick={() => {
                                    setActiveTab('youtube');
                                    document.querySelector('html')?.scrollTo({ top: document.getElementById('youtube-input')?.offsetTop || 0, behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                    <span>Commencer avec YouTube</span>
                                </span>
                            </AnimatedButton>
                            <AnimatedButton
                                onClick={() => {
                                    setActiveTab('pdf');
                                    document.querySelector('html')?.scrollTo({ top: document.getElementById('youtube-input')?.offsetTop || 0, behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-gray-500"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8V3.5L18.5 8H14zm2 11v-1h-5v1h5zm0-4v-1h-5v1h5zm0-4h-2v1h2v-1zm-8 8v-1H6v1h2zm0-4v-1H6v1h2zm0-4v-1H6v1h2z" /></svg>
                                    <span>Utiliser un PDF</span>
                                </span>
                            </AnimatedButton>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </section>

            <motion.div className="fixed z-30 bottom-6 right-6 md:hidden" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: "spring", stiffness: 300 }}>
                <motion.button whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)' }} whileTap={{ scale: 0.95 }} className="bg-youtube-red text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Remonter en haut de la page">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default HomePage;