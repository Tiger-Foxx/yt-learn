import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage: React.FC = () => {
    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const sections = [
        {
            title: "1. Collecte d'informations",
            content: `Nous collectons des informations lorsque vous utilisez notre application. Ces informations incluent :
        \n• Les données que vous fournissez volontairement : informations personnelles comme l'adresse e-mail lors de l'inscription, les vidéos YouTube ou documents PDF que vous soumettez pour générer du contenu éducatif.
        \n• Données collectées automatiquement : informations sur votre appareil, votre navigateur, votre adresse IP et votre activité sur l'application.`,
        },
        {
            title: "2. Utilisation des informations",
            content: `Nous utilisons les informations que nous collectons pour :
        \n• Fournir, personnaliser et améliorer notre service
        \n• Générer du contenu éducatif basé sur les vidéos et documents que vous soumettez
        \n• Communiquer avec vous concernant votre compte ou nos services
        \n• Détecter, prévenir et résoudre les problèmes techniques ou de sécurité`,
        },
        {
            title: "3. Partage des informations",
            content: `Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf dans les cas suivants :
        \n• Pour respecter la loi ou répondre à une procédure judiciaire
        \n• Pour protéger nos droits ou notre propriété
        \n• En cas d'urgence pour protéger la sécurité personnelle des utilisateurs ou du public`,
        },
        {
            title: "4. Stockage et sécurité",
            content: `Nous mettons en œuvre des mesures de sécurité pour maintenir la sécurité de vos informations personnelles. Les données sont stockées sur des serveurs sécurisés et protégées par des protocoles de chiffrement modernes. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.`,
        },
        {
            title: "5. Cookies et technologies similaires",
            content: `Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser les tendances et administrer le site. Vous pouvez contrôler l'utilisation des cookies au niveau du navigateur, mais cela pourrait affecter certaines fonctionnalités de notre application.`,
        },
        {
            title: "6. Droits des utilisateurs",
            content: `Conformément aux lois sur la protection des données, vous avez le droit :
        \n• D'accéder aux données personnelles que nous détenons sur vous
        \n• De demander la correction des informations inexactes
        \n• De demander la suppression de vos données personnelles
        \n• De vous opposer au traitement de vos données
        \n• De demander la limitation du traitement
        \n• De demander la portabilité de vos données`,
        },
        {
            title: "7. Modifications de la politique de confidentialité",
            content: `Nous nous réservons le droit de modifier cette politique à tout moment. Les changements seront publiés sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé des changements.`,
        },
        {
            title: "8. Mentions légales",
            content: `YT-Learn est une application développée par Fox, opérant en tant qu'auto-entrepreneur.
        \n• Développeur : Fox
        \n• Contact : donfackarthur750@gmail.com
        \n• Site web : https://the-fox.tech/`,
        },
        {
            title: "9. Contact",
            content: `Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à :
        \n• Email : donfackarthur750@gmail.com
        \n• WhatsApp : +237658866639
        \n• Site web : https://the-fox.tech/`,
        },
    ];

    return (
        <div className="min-h-screen bg-dark-bg text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto relative">
                {/* Background decoration */}
                <div className="absolute top-20 right-0 w-64 h-64 bg-youtube-red opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-10 w-80 h-80 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Politique de confidentialité
                        <span className="text-youtube-red"> & Mentions légales</span>
                    </h1>
                    <div className="w-20 h-1 bg-youtube-red mb-6"></div>
                    <p className="text-gray-300 mb-6">
                        Dernière mise à jour : {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-gray-300">
                        Cette politique de confidentialité décrit comment YT-Learn collecte, utilise et partage vos informations personnelles lorsque vous utilisez notre application.
                    </p>
                </motion.div>

                {/* Main content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`mb-8 pb-8 ${index < sections.length - 1 ? "border-b border-gray-800" : ""}`}
                        >
                            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contact section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-xl"
                >
                    <h2 className="text-2xl font-bold mb-4">Des questions sur cette politique ?</h2>
                    <p className="text-gray-300 mb-6">
                        Si vous avez des préoccupations concernant vos données ou notre politique de confidentialité, n'hésitez pas à nous contacter.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href="mailto:donfackarthur750@gmail.com"
                            className="inline-flex items-center px-4 py-2 bg-youtube-red hover:bg-red-700 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Contact par email
                        </a>

                        <a
                            href="https://the-fox.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 2H3a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V3a1 1 0 00-1-1zm-1 11h-4v4h-4v-4H8v-4h4V5h4v4h4v4z"/>
                            </svg>
                            Visiter mon site web
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

export default PrivacyPolicyPage;