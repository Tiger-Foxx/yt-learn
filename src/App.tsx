import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import CreationPage from '@/pages/CreationPage';
import PlaySpacePage from '@/pages/PlaySpacePage';
import NotFoundPage from '@/pages/NotFoundPage';
import APP_CONFIG from '@/config/appConfig';
import Loader from '@/components/layout/Loader';
import './App.css';

// Composant de routage avec animations
const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Variants pour l'animation des pages
    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 }
    };

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path={APP_CONFIG.routes.home}
                    element={
                        <motion.div {...pageTransition}>
                            <HomePage />
                        </motion.div>
                    }
                />
                <Route
                    path={APP_CONFIG.routes.creation}
                    element={
                        <motion.div {...pageTransition}>
                            <CreationPage />
                        </motion.div>
                    }
                />
                <Route
                    path={APP_CONFIG.routes.playspace}
                    element={
                        <motion.div {...pageTransition}>
                            <PlaySpacePage />
                        </motion.div>
                    }
                />

                <Route
                    path={APP_CONFIG.routes.notFound}
                    element={
                        <motion.div {...pageTransition}>
                            <NotFoundPage />
                        </motion.div>
                    }
                />
                <Route
                    path="*"
                    element={
                        <motion.div {...pageTransition}>
                            <NotFoundPage />
                        </motion.div>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

// Composant principal de l'application
const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [appReady, setAppReady] = useState(false);

    // Simuler un chargement initial avec progression
    useEffect(() => {
        // Fonction pour charger les ressources avec progression
        const loadResources = async () => {
            const steps = [
                { progress: 20, delay: 300, message: "Initialisation de l'application..." },
                { progress: 40, delay: 400, message: "Chargement des composants..." },
                { progress: 60, delay: 500, message: "Préparation des ressources..." },
                { progress: 80, delay: 500, message: "Configuration des services..." },
                { progress: 100, delay: 400, message: "Lancement de l'interface..." }
            ];

            // Simuler le chargement progressif de chaque étape
            for (const step of steps) {
                setLoadingProgress(prev => step.progress);
                await new Promise(resolve => setTimeout(resolve, step.delay));
            }

            // Terminer le chargement avec un léger délai
            setTimeout(() => {
                setIsLoading(false);
                // Après la fin de l'animation de disparition du loader
                setTimeout(() => setAppReady(true), 500);
            }, 400);
        };

        loadResources();
    }, []);

    // Écouteur pour le changement de thème du système
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            document.documentElement.classList.toggle('dark', mediaQuery.matches);
        };

        // Appliquer le thème initial - toujours dark pour notre app
        document.documentElement.classList.add('dark');

        // Écouter les changements
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50"
                    >
                        <Loader
                            variant="youtube"
                            size="lg"
                            color="youtube-red"
                            fullScreen={true}
                            spotlight={true}
                            progress={loadingProgress}
                            showProgress={true}
                            className="bg-dark-bg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AppProvider>
                <div className={`app-container transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
                    <Router>
                        <div className="flex flex-col min-h-screen bg-dark-bg">
                            <Header />

                            <main className="flex-grow mt-16">
                                <AnimatedRoutes />
                            </main>

                            <Footer />
                        </div>
                    </Router>
                </div>
            </AppProvider>
        </>
    );
};

export default App;