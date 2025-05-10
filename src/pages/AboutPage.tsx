import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-dark-bg text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto relative">
                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-youtube-red opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mb-16 relative z-10"
                >
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
                        À propos de <span className="text-youtube-red">YT-Learn</span>
                    </motion.h1>
                    <motion.div variants={itemVariants} className="w-20 h-1 bg-youtube-red mb-6"></motion.div>
                    <motion.p variants={itemVariants} className="text-xl text-gray-300">
                        Transformez votre manière d'apprendre avec l'intelligence artificielle
                    </motion.p>
                </motion.div>

                {/* Main content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    {/* App section */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-2 bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold mb-6">Notre Mission</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            YT-Learn est né d'une vision simple mais puissante : transformer le contenu éducatif
                            existant en expériences d'apprentissage interactives et personnalisées. Notre plateforme
                            utilise l'intelligence artificielle de pointe pour analyser des vidéos YouTube et documents PDF,
                            puis les convertir en quizz, flashcards et jeux interactifs.
                        </p>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Notre objectif est de démocratiser l'accès à l'apprentissage actif et efficace,
                            en permettant à chacun de transformer facilement du contenu passif en outils
                            d'apprentissage engageants qui favorisent la mémorisation à long terme et une
                            compréhension plus profonde.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                            <div className="bg-gray-800 rounded-xl p-5 text-center">
                                <h3 className="font-bold text-3xl text-youtube-red mb-2">100%</h3>
                                <p className="text-gray-400 text-sm">Automatisé</p>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-5 text-center">
                                <h3 className="font-bold text-3xl text-youtube-red mb-2">3</h3>
                                <p className="text-gray-400 text-sm">Types de jeux</p>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-5 text-center">
                                <h3 className="font-bold text-3xl text-youtube-red mb-2">2</h3>
                                <p className="text-gray-400 text-sm">Sources de contenu</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Creator section */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl flex flex-col items-center text-center"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-youtube-red mb-6">
                                <img
                                    src="https://avatars.githubusercontent.com/u/118616410?v=4"
                                    alt="Pascal Arthur Donfack"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-1 border border-gray-800">
                                <svg className="w-6 h-6 text-youtube-red" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Pascal Arthur Montgomery</h2>
                        <p className="text-gray-400 mb-4 text-sm">Fox</p>
                        <p className="text-gray-300 text-sm mb-6">
                            <p><strong>Computer Engineering scientist</strong> </p>  Je crée des outils innovants pour améliorer l'éducation.
                        </p>

                        <a
                            href="https://github.com/Tiger-Foxx/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z" />
                            </svg>
                            Voir mon GitHub
                        </a>
                        <a
                            href="https://the-fox.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-youtube-red hover:bg-red-700 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Visiter mon site
                        </a>
                    </motion.div>
                </motion.div>

                {/* App features */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="mb-16"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8">
                        Comment fonctionne YT-Learn?
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "1. Partagez votre contenu",
                                desc: "Importez n'importe quelle vidéo YouTube ou document PDF pour commencer",
                                icon: (
                                    <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                ),
                            },
                            {
                                title: "2. L'IA analyse et crée",
                                desc: "Notre technologie extrait les concepts clés et génère du contenu éducatif",
                                icon: (
                                    <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/>
                                    </svg>
                                ),
                            },
                            {
                                title: "3. Apprenez et partagez",
                                desc: "Participez aux quiz, flashcards et jeux pour ancrer votre apprentissage",
                                icon: (
                                    <svg className="w-10 h-10 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                                    </svg>
                                ),
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg"
                            >
                                <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact widget */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-youtube-red opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <motion.div variants={itemVariants} className="md:w-2/3">
                            <h2 className="text-2xl font-bold mb-3">Une idée pour améliorer YT-Learn?</h2>
                            <p className="text-gray-300 mb-6">
                                Nous sommes toujours à l'écoute de vos suggestions et retours pour améliorer l'expérience d'apprentissage.
                                N'hésitez pas à nous contacter!
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="mailto:donfackarthur750@gmail.com"
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    Email
                                </a>
                                <a
                                    href="https://wa.me/+237658866639"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.943 1.395 5.625l-.866 3.241 3.34-.835A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.623-.524-5.118-1.423l-3.676.964.983-3.596a9.742 9.742 0 01-1.565-5.295c0-5.385 4.383-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
                                    </svg>
                                    WhatsApp
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center px-4 py-2 bg-youtube-red hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    Contact
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="md:w-1/3 flex justify-center"
                        >
                            <img
                                src="https://avatars.githubusercontent.com/u/118616410?v=4"
                                alt="Fox"
                                className="w-24 h-24 rounded-full border-2 border-youtube-red shadow-lg"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm mt-16 pt-6 border-t border-gray-800">
                    <p>© {new Date().getFullYear()} YT-Learn. Tous droits réservés.</p>
                    <p className="mt-2">
                        Conçu et développé par{" "}
                        <a
                            href="https://the-fox.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-youtube-red hover:underline"
                        >
                            Fox
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;