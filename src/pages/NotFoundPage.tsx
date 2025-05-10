import React from 'react';
import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import APP_CONFIG from '@/config/appConfig';

const NotFoundPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8"
                >
                    <svg
                        className="mx-auto h-40 w-40 text-gray-400 dark:text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 8l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </motion.div>

                <motion.h1
                    className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                >
                    404
                </motion.h1>

                <motion.h2
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Page non trouvée
                </motion.h2>

                <motion.p
                    className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Oups ! La page que vous recherchez semble avoir disparu dans l'univers de l'apprentissage.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Button
                        asLink
                        to={APP_CONFIG.routes.home}
                        size="lg"
                        variant="primary"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        }
                        iconPosition="left"
                    >
                        Retour à l'accueil
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;