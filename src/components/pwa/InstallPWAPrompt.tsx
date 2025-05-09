import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWAPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOSDevice, setIsIOSDevice] = useState(false);
    const [showIOSTip, setShowIOSTip] = useState(false);

    // Check if the device is iOS
    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOSDevice(isIOS);

        // Check if we should show the iOS tip (once per day)
        if (isIOS) {
            const lastIOSTip = localStorage.getItem('lastIOSTip');
            const now = new Date().getTime();
            if (!lastIOSTip || (now - parseInt(lastIOSTip)) > 86400000) { // More than 1 day
                setShowIOSTip(true);
            }
        }
    }, []);

    useEffect(() => {
        const checkPWAStatus = () => {
            // Check if app is already installed
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://');

            if (isStandalone) {
                // App is already installed, don't show prompt
                return;
            }

            // Check if user has already dismissed the prompt recently
            const lastPromptDismissed = localStorage.getItem('pwaPromptDismissed');
            if (lastPromptDismissed) {
                const now = new Date().getTime();
                // Only show prompt again after 7 days
                if ((now - parseInt(lastPromptDismissed)) < 604800000) {
                    return;
                }
            }

            // Show prompt after a small delay for better UX
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            checkPWAStatus();
        });

        // Check PWA status on component mount
        checkPWAStatus();

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
            });
        };
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) {
            // If there's no deferred prompt but we're on iOS, show instructions
            if (isIOSDevice) {
                setShowIOSTip(true);
                return;
            }
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Clear the deferredPrompt for next time
            setDeferredPrompt(null);
            setShowPrompt(false);
        });
    };

    const handleDismiss = () => {
        // Store the timestamp when user dismissed the prompt
        localStorage.setItem('pwaPromptDismissed', new Date().getTime().toString());
        setShowPrompt(false);
    };

    const handleDismissIOSTip = () => {
        // Store the timestamp when user dismissed the iOS tip
        localStorage.setItem('lastIOSTip', new Date().getTime().toString());
        setShowIOSTip(false);
    };

    if (!showPrompt && !showIOSTip) return null;

    return (
        <AnimatePresence>
            {(showPrompt || showIOSTip) && (
                <motion.div
                    className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:bottom-4 sm:w-96"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                >
                    <div className="bg-gray-900 rounded-xl p-4 shadow-2xl border border-gray-800 backdrop-blur-sm bg-opacity-95">
                        {showIOSTip ? (
                            <div className="flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="bg-youtube-red rounded-lg p-2 mr-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Installez sur iOS</h3>
                                    </div>
                                    <button
                                        onClick={handleDismissIOSTip}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-gray-300 text-sm mb-3">
                                    <p className="mb-2">Pour installer YT-Learn sur votre appareil :</p>
                                    <ol className="list-decimal pl-5 space-y-1">
                                        <li>Appuyez sur le bouton de partage <span className="inline-block bg-gray-700 px-2 py-1 rounded">
                      <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </span></li>
                                        <li>Faites défiler et appuyez sur <span className="font-medium">Sur l'écran d'accueil</span></li>
                                        <li>Appuyez sur <span className="font-medium">Ajouter</span></li>
                                    </ol>
                                </div>
                                <button
                                    onClick={handleDismissIOSTip}
                                    className="self-end mt-2 px-4 py-2 bg-youtube-red text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Compris
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="bg-youtube-red rounded-lg p-2 mr-3">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Installez YT-Learn</h3>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">
                                    Installez notre application pour un accès rapide, même hors ligne. Une expérience optimisée vous attend !
                                </p>
                                <div className="flex justify-between space-x-3">
                                    <button
                                        onClick={handleDismiss}
                                        className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Plus tard
                                    </button>
                                    <button
                                        onClick={handleInstallClick}
                                        className="flex-1 py-2 px-4 bg-youtube-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                        </svg>
                                        Installer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPWAPrompt;