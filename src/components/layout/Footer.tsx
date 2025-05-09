import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import APP_CONFIG from '@/config/appConfig';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Footer links sections
    const footerSections = [
        {
            title: 'Plateforme',
            links: [
                { name: 'Accueil', to: APP_CONFIG.routes.home },
                { name: 'Explorer', to: APP_CONFIG.routes.playspace },
                { name: 'Créer', to: APP_CONFIG.routes.creation },
            ]
        },
        {
            title: 'Ressources',
            links: [
                { name: 'Blog', to: 'https://theoldfox.pythonanywhere.com/blog' },
                { name: 'FAQ', to: '/faq' },
            ]
        },
        {
            title: 'Société',
            links: [
                { name: 'À propos', to: '/about' },
                { name: 'Contact', to: '/contact' },

            ]
        },
        {
            title: 'Légal',
            links: [
                { name: 'Conditions d\'utilisation', to: '/privacy' },
                { name: 'Politique de confidentialité', to: '/privacy' },
                { name: 'Mentions légales', to: '/privacy' },
            ]
        }
    ];

    return (
        <motion.footer
            className="bg-darker-bg border-t border-gray-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo and description column */}
                    <motion.div
                        className="lg:col-span-2"
                        variants={itemVariants}
                    >
                        <Link to={APP_CONFIG.routes.home} className="flex items-center">
                            <div className="mr-2">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="transform transition-transform duration-300 hover:scale-110"
                                >
                                    <rect width="40" height="40" rx="8" fill="#FF0000" />
                                    <path
                                        d="M27 20L15 27.5V12.5L27 20Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <span className="text-3xl font-bold text-white">YT<span className="text-youtube-red">Learn</span></span>
                        </Link>

                        <p className="mt-4 text-gray-400 max-w-md">
                            YTLearn transforme n'importe quelle vidéo YouTube en expérience d'apprentissage interactive.
                            Créez des flashcards, des quiz et des jeux éducatifs en quelques clics.
                        </p>

                        <div className="mt-6">
                            <div className="flex space-x-4">
                                <a href="#twitter" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#github" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#youtube" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <span className="sr-only">YouTube</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Newsletter subscription */}
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                Recevez nos actualités
                            </h3>
                            <div className="mt-4 sm:flex sm:max-w-md">
                                <label htmlFor="email-address" className="sr-only">Adresse email</label>
                                <input
                                    type="email"
                                    id="email-address"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none min-w-0 w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-youtube-red focus:border-youtube-red"
                                    placeholder="Votre email"
                                />
                                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                    <button
                                        type="submit"
                                        className="w-full bg-youtube-red border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-youtube-red"
                                    >
                                        S'abonner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <motion.div key={section.title} variants={itemVariants}>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                {section.title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.to} className="text-gray-400 hover:text-youtube-red transition-colors duration-300">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom section with divider */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-800 pt-8 mt-12 md:flex md:items-center md:justify-between"
                >


                    <div className="mt-8 md:mt-0 md:order-1 text-gray-400 text-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                            <p>&copy; {currentYear} YTLearn. Tous droits réservés.</p>
                            <div className="hidden md:block">|</div>
                            <div className="flex space-x-4 mt-2 md:mt-0">
                                <Link to="/privacy" className="hover:text-youtube-red transition-colors">Conditions</Link>
                                <Link to="/privacy" className="hover:text-youtube-red transition-colors">Confidentialité</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Special YouTube attribution */}
                <motion.div
                    variants={itemVariants}
                    className="mt-6 text-center text-xs text-gray-500"
                >
                    YouTube™ est une marque déposée de Google LLC. YTLearn n'est pas affilié à YouTube ou Google.
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;