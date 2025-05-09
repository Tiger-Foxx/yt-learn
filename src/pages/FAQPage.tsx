import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage: React.FC = () => {
    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // FAQ data
    const faqs = [
        {
            question: "Qu'est-ce que YT-Learn et comment ça marche ?",
            answer: "YT-Learn est une plateforme qui utilise l'intelligence artificielle pour transformer des vidéos YouTube et des documents PDF en expériences d'apprentissage interactives. Notre système analyse automatiquement le contenu, en extrait les concepts clés, et génère des quiz, des flashcards et des jeux éducatifs personnalisés."
        },
        {
            question: "Est-ce que YT-Learn est gratuit ?",
            answer: "La version de base de YT-Learn est entièrement gratuite. Elle vous permet de créer un nombre limité de contenus éducatifs chaque mois. Pour une utilisation plus intensive ou des fonctionnalités avancées, nous proposons également des formules premium."
        },
        {
            question: "Quels types de contenus éducatifs puis-je créer ?",
            answer: "Actuellement, YT-Learn vous permet de créer trois types de contenus éducatifs : des quiz interactifs avec des questions à choix multiples, des flashcards pour la mémorisation, et des jeux interactifs qui rendent l'apprentissage plus engageant."
        },
        {
            question: "Puis-je utiliser n'importe quelle vidéo YouTube ?",
            answer: "Oui, vous pouvez utiliser n'importe quelle vidéo YouTube publique. Cependant, les meilleurs résultats sont obtenus avec des vidéos éducatives, des cours, des tutoriels ou des documentaires qui contiennent des informations structurées."
        },
        {
            question: "Quels types de documents PDF sont compatibles ?",
            answer: "YT-Learn prend en charge tous les documents PDF standards. Pour de meilleurs résultats, nous recommandons d'utiliser des PDF bien structurés, comme des articles, des cours, ou des manuels scolaires. Les documents scannés sous forme d'image peuvent ne pas fonctionner optimalement."
        },
        {
            question: "Comment puis-je partager mes créations avec d'autres personnes ?",
            answer: "Chaque contenu éducatif que vous créez reçoit un lien unique que vous pouvez partager par email, messagerie ou sur les réseaux sociaux. Les destinataires pourront accéder au contenu directement dans leur navigateur, sans avoir besoin de créer un compte."
        },
        {
            question: "Puis-je télécharger mes créations pour une utilisation hors ligne ?",
            answer: "Oui, YT-Learn vous permet de télécharger vos créations au format HTML pour une utilisation hors ligne. Vous pouvez également les intégrer dans votre propre site web ou plateforme d'apprentissage."
        },
        {
            question: "Mes données sont-elles sécurisées ?",
            answer: "Absolument. Chez YT-Learn, nous prenons la sécurité des données très au sérieux. Nous utilisons des protocoles de chiffrement avancés pour protéger vos informations personnelles et vos contenus. Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite."
        },
        {
            question: "Comment puis-je contacter l'équipe de support ?",
            answer: "Pour toute question ou assistance, vous pouvez nous contacter par email à donfackarthur750@gmail.com ou via WhatsApp au +237658866639. Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures."
        }
    ];

    const [openItem, setOpenItem] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto relative">
                {/* Background decoration */}
                <div className="absolute top-20 right-0 w-80 h-80 bg-youtube-red opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-0 w-80 h-80 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Questions fréquentes
                    </h1>
                    <div className="w-20 h-1 bg-youtube-red mx-auto mb-6"></div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Trouvez des réponses aux questions les plus fréquentes sur YT-Learn
                        et son fonctionnement
                    </p>
                </motion.div>

                {/* FAQ accordion */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mb-16"
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`mb-4 bg-gray-900 rounded-xl border ${
                                openItem === index ? "border-youtube-red" : "border-gray-800"
                            } overflow-hidden transition-colors duration-300`}
                        >
                            <button
                                className="w-full text-left py-5 px-6 flex justify-between items-center focus:outline-none"
                                onClick={() => toggleItem(index)}
                            >
                                <span className="font-medium text-lg">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-youtube-red transform transition-transform ${
                                        openItem === index ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>

                            <AnimatePresence>
                                {openItem === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-300 bg-gray-800/50 rounded-b-xl">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Still have questions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-xl text-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Vous avez encore des questions ?</h2>
                    <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                        N'hésitez pas à nous contacter directement. Notre équipe est là pour
                        vous aider et répondre à toutes vos questions.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="mailto:donfackarthur750@gmail.com"
                            className="inline-flex items-center px-6 py-3 bg-youtube-red hover:bg-red-700 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Nous contacter par email
                        </a>

                        <a
                            href="https://wa.me/+237658866639"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-green-700 hover:bg-green-800 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.943 1.395 5.625l-.866 3.241 3.34-.835A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.623-.524-5.118-1.423l-3.676.964.983-3.596a9.742 9.742 0 01-1.565-5.295c0-5.385 4.383-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
                            </svg>
                            WhatsApp
                        </a>
                    </div>

                    <div className="mt-8">
                        <a
                            href="/contact"
                            className="text-youtube-red hover:text-red-400 inline-flex items-center transition-colors"
                        >
                            <span>Voir toutes nos coordonnées</span>
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
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

export default FAQPage;