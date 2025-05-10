import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'youtube' | 'pulse' | 'dots' | 'progress';
    color?: 'youtube-red' | 'white' | 'gray';
    label?: string;
    message?: string;
    progress?: number;
    fullScreen?: boolean;
    showProgress?: boolean;
    className?: string;
    labelPosition?: 'top' | 'bottom' | 'right' | 'left';
    animationDuration?: number;
    spotlight?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
                                           size = 'md',
                                           variant = 'youtube',
                                           color = 'youtube-red',
                                           label,
                                           message,
                                           progress,
                                           fullScreen = false,
                                           showProgress = false,
                                           className = '',
                                           labelPosition = 'bottom',
                                           animationDuration = 1.5,
                                           spotlight = false
                                       }) => {
    const [progressValue, setProgressValue] = useState(progress || 0);
    const [randomTips] = useState<string[]>([
        "Les vidéos éducatives sont plus efficaces avec des quiz interactifs",
        "Testez différents types de jeux pour maximiser l'engagement",
        "Les flashcards sont idéales pour la mémorisation à long terme",
        "Nos algorithmes d'IA identifient les concepts clés automatiquement",
        "Partagez vos créations pour enrichir l'expérience d'apprentissage",
        "Vous pouvez utiliser YTLearn hors ligne après la génération"
    ]);
    const [currentTip, setCurrentTip] = useState(0);
    const [particles] = useState<{id: number, x: number, y: number, size: number, speed: number}[]>([]);

    // Effet pour l'animation de progression fluide
    useEffect(() => {
        if (progress !== undefined) {
            const diff = progress - progressValue;
            const step = diff / 10;

            if (Math.abs(diff) > 0.5) {
                const timer = setTimeout(() => {
                    setProgressValue(prev => prev + step);
                }, 30);
                return () => clearTimeout(timer);
            } else {
                setProgressValue(progress);
            }
        }
    }, [progress, progressValue]);

    // Changement périodique des tips
    useEffect(() => {
        if (message || !fullScreen) return;

        const interval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % randomTips.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [randomTips, message, fullScreen]);

    // // Génération des particules pour l'effet d'arrière-plan
    // useEffect(() => {
    //     if (!spotlight) return;
    //
    //     const newParticles = Array.from({ length: 20 }, (_, i) => ({
    //         id: i,
    //         x: Math.random() * 100,
    //         y: Math.random() * 100,
    //         size: Math.random() * 4 + 2,
    //         speed: Math.random() * 2 + 0.5
    //     }));
    //
    //     setParticles(newParticles);
    // }, [spotlight]);

    // Maps pour les tailles et couleurs
    const sizeMap = {
        xs: {
            container: 'w-3 h-3',
            fontSize: 'text-xs',
            strokeWidth: 2
        },
        sm: {
            container: 'w-5 h-5',
            fontSize: 'text-xs',
            strokeWidth: 2.5
        },
        md: {
            container: 'w-8 h-8',
            fontSize: 'text-sm',
            strokeWidth: 3
        },
        lg: {
            container: 'w-12 h-12',
            fontSize: 'text-base',
            strokeWidth: 3.5
        },
        xl: {
            container: 'w-16 h-16',
            fontSize: 'text-lg',
            strokeWidth: 4
        }
    };

    const colorMap = {
        'youtube-red': 'text-youtube-red',
        'white': 'text-white',
        'gray': 'text-gray-400'
    };

    // Couleur CSS réelle
    const colorValue = color === 'youtube-red' ? '#FF0000' : color === 'white' ? '#FFFFFF' : '#9CA3AF';

    // Flex direction selon la position du label
    const labelFlexDirection =
        labelPosition === 'right' ? 'flex-row' :
            labelPosition === 'left' ? 'flex-row-reverse' :
                labelPosition === 'top' ? 'flex-col-reverse' :
                    'flex-col';

    // Espacement selon la position du label
    const labelSpacing =
        labelPosition === 'right' || labelPosition === 'left' ? 'space-x-2' :
            'space-y-2';

    // Rendu du spinner selon la variante
    const renderLoader = () => {
        switch (variant) {
            case 'youtube':
                return (
                    <div className={`${sizeMap[size].container} relative`}>
                        <motion.div
                            className={`w-full h-full rounded-full border-t-transparent ${color === 'youtube-red' ? 'border-youtube-red' : color === 'white' ? 'border-white' : 'border-gray-400'}`}
                            style={{
                                borderWidth: sizeMap[size].strokeWidth,
                                borderStyle: 'solid'
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: animationDuration,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className={`w-1/3 h-1/3 ${colorMap[color]}`}
                                animate={{
                                    scale: [1.8, 5.5, 1.8],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: animationDuration,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 15L15.19 12L10 9V15Z" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                );

            case 'pulse':
                return (
                    <div className={sizeMap[size].container}>
                        <div className="relative w-full h-full">
                            <motion.div
                                className={`absolute inset-0 rounded-full ${colorMap[color]}`}
                                animate={{
                                    scale: [1, 1.5],
                                    opacity: [0.7, 0]
                                }}
                                transition={{
                                    duration: animationDuration,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                style={{ background: colorValue }}
                            />
                            <motion.div
                                className={`absolute inset-0 rounded-full ${colorMap[color]} opacity-70`}
                                animate={{
                                    scale: [1, 1.3],
                                    opacity: [0.7, 0]
                                }}
                                transition={{
                                    duration: animationDuration * 0.8,
                                    delay: 0.3,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                style={{ background: colorValue }}
                            />
                            <motion.div
                                className={`absolute inset-[15%] rounded-full ${colorMap[color]}`}
                                animate={{
                                    scale: [0.9, 1.1, 0.9],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: animationDuration,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{ background: colorValue }}
                            />
                        </div>
                    </div>
                );

            case 'dots':
                return (
                    <div className={`flex ${size === 'xs' || size === 'sm' ? 'space-x-1' : 'space-x-2'}`}>
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className={`rounded-full ${colorMap[color]}`}
                                style={{
                                    width: size === 'xs' ? 4 : size === 'sm' ? 6 : size === 'md' ? 8 : size === 'lg' ? 10 : 12,
                                    height: size === 'xs' ? 4 : size === 'sm' ? 6 : size === 'md' ? 8 : size === 'lg' ? 10 : 12,
                                    background: colorValue
                                }}
                                animate={{
                                    y: [0, -8, 0],
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                );

            case 'progress':
                return (
                    <div className={`w-full ${fullScreen ? 'max-w-md' : ''}`}>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1">
                            <motion.div
                                className={`h-full ${color === 'youtube-red' ? 'bg-youtube-red' : color === 'white' ? 'bg-white' : 'bg-gray-400'}`}
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.max(3, progressValue)}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>{Math.round(progressValue)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                );

            case 'spinner':
            default:
                return (
                    <svg
                        className={`animate-spin ${sizeMap[size].container} ${colorMap[color]}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={sizeMap[size].strokeWidth}
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                );
        }
    };

    // Particules d'arrière-plan pour le fullscreen
    const renderParticles = () => {
        if (!spotlight) return null;

        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="absolute bg-youtube-red rounded-full"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        animate={{
                            y: [0, -50],
                            opacity: [0.3, 0],
                        }}
                        transition={{
                            duration: particle.speed * 4,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                ))}
            </div>
        );
    };

    // Container du loader avec label éventuel
    const renderLoaderWithLabel = () => {
        if (!label) return renderLoader();

        return (
            <div className={`flex items-center ${labelFlexDirection} ${labelSpacing}`}>
                {renderLoader()}
                <span className={`${sizeMap[size].fontSize} ${colorMap[color]} font-medium text-center`}>
          {label}
        </span>
            </div>
        );
    };

    // Rendu fullscreen avec fond
    if (fullScreen) {
        return (
            <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/70 backdrop-blur-sm ${className}`}>
                {renderParticles()}

                <div className="relative z-10 flex flex-col items-center">
                    {showProgress && variant !== 'progress' ? (
                        <>
                            <div className="mb-6">
                                {renderLoaderWithLabel()}
                            </div>
                            <div className="w-64 mb-6">
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-youtube-red rounded-full"
                                        style={{ width: `${Math.max(3, progressValue)}%` }}
                                    />
                                </div>
                                <div className="mt-1 text-right text-xs text-gray-400">
                                    {Math.round(progressValue)}%
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mb-6">
                            {variant === 'progress' ? (
                                <div className="w-64">
                                    {renderLoader()}
                                </div>
                            ) : (
                                renderLoaderWithLabel()
                            )}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={message || randomTips[currentTip]}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center max-w-md px-4"
                        >
                            {message ? (
                                <p className="text-white/80">{message}</p>
                            ) : (
                                <>
                                    <p className="text-gray-300 text-lg font-semibold mb-1">
                                        {progressValue < 33 ? "Préparation..." :
                                            progressValue < 66 ? "Analyse en cours..." :
                                                progressValue < 99 ? "Finalisation..." :
                                                    "Terminé !"}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {randomTips[currentTip]}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Rays of light effect */}
                    {spotlight && (
                        <motion.div
                            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-youtube-red/10 to-transparent pointer-events-none -z-10 blur-3xl"
                            animate={{
                                rotate: 360,
                                scale: [0.8, 1, 0.8]
                            }}
                            transition={{
                                rotate: {
                                    repeat: Infinity,
                                    duration: 20,
                                    ease: "linear"
                                },
                                scale: {
                                    repeat: Infinity,
                                    duration: 8,
                                    ease: "easeInOut"
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Rendu inline sans fond
    return (
        <div className={`${className}`}>
            {renderLoaderWithLabel()}
        </div>
    );
};

export default Loader;