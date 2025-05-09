import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Contact links data
    const contactLinks = [
        {
            name: "Email",
            value: "donfackarthur750@gmail.com",
            href: "mailto:donfackarthur750@gmail.com",
            color: "bg-orange-600",
            hoverColor: "hover:bg-orange-700",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
            ),
        },
        {
            name: "WhatsApp",
            value: "+237 658 866 639",
            href: "https://wa.me/+237658866639",
            color: "bg-green-600",
            hoverColor: "hover:bg-green-700",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.943 1.395 5.625l-.866 3.241 3.34-.835A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.623-.524-5.118-1.423l-3.676.964.983-3.596a9.742 9.742 0 01-1.565-5.295c0-5.385 4.383-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
                </svg>
            ),
        },
        {
            name: "GitHub",
            value: "Tiger-Foxx",
            href: "https://github.com/Tiger-Foxx/",
            color: "bg-gray-800",
            hoverColor: "hover:bg-gray-700",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            value: "Fox",
            href: "https://www.linkedin.com/in/pascal-arthur-donfack-567575327/",
            color: "bg-blue-700",
            hoverColor: "hover:bg-blue-800",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            ),
        },
        {
            name: "Instagram",
            value: "@i_am_the_fox_coder",
            href: "https://www.instagram.com/i_am_the_fox_coder/",
            color: "bg-gradient-to-br from-purple-500 via-pink-600 to-orange-400",
            hoverColor: "hover:from-purple-600 hover:via-pink-700 hover:to-orange-500",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            ),
        },
        {
            name: "Site Web",
            value: "the-fox.tech",
            href: "https://the-fox.tech/",
            color: "bg-purple-600",
            hoverColor: "hover:bg-purple-700",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907z"/>
                </svg>
            ),
        },
    ];

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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
        tap: {
            scale: 0.98,
        },
    };

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
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Contactez-moi
                    </h1>
                    <div className="w-20 h-1 bg-youtube-red mx-auto mb-6"></div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        N'hésitez pas à me contacter pour toute question, suggestion ou collaboration.
                    </p>
                </motion.div>

                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-youtube-red opacity-10 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3 flex justify-center">
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                                    className="w-40 h-40 rounded-full overflow-hidden border-4 border-youtube-red/30 shadow-xl"
                                >
                                    <img
                                        src="https://avatars.githubusercontent.com/u/118616410?v=4"
                                        alt="Fox"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 border-2 border-gray-800"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                >
                                    <svg className="w-8 h-8 text-youtube-red" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>

                        <div className="md:w-2/3">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-3xl font-bold mb-2">Fox</h2>
                                <p className="text-youtube-red mb-4 font-medium">Computer engineering scientist</p>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Je suis un passionné des sciences de l'ingénieur et charmé par la création d'expériences numériques innovantes
                                    et l'application de l'intelligence artificielle dans l'éducation.
                                    N'hésitez pas à me contacter pour des collaborations, questions ou retours sur YT-Learn.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://the-fox.tech/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-youtube-red hover:bg-red-700 rounded-lg transition-colors flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907z" />
                                        </svg>
                                        Mon Portfolio
                                    </a>
                                    <a
                                        href="https://github.com/Tiger-Foxx/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact links */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
                >
                    {contactLinks.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className={`${link.color} ${link.hoverColor} rounded-xl p-6 flex items-center gap-5 transition-all shadow-lg`}
                        >
                            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                                {link.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{link.name}</h3>
                                <p className="text-white/80">{link.value}</p>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Direct contact section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-xl mb-16"
                >
                    <h2 className="text-2xl font-bold mb-4">Contactez-moi rapidement</h2>
                    <p className="text-gray-300 mb-6">
                        Choisissez votre méthode préférée pour me contacter. Je vous répondrai dans les plus brefs délais.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a
                            href="mailto:donfackarthur750@gmail.com"
                            className="flex items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors"
                        >
                            <div className="bg-orange-600/20 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-gray-400">Réponse en 24-48h</p>
                            </div>
                        </a>

                        <a
                            href="https://wa.me/+237658866639"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors"
                        >
                            <div className="bg-green-600/20 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.943 1.395 5.625l-.866 3.241 3.34-.835A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.623-.524-5.118-1.423l-3.676.964.983-3.596a9.742 9.742 0 01-1.565-5.295c0-5.385 4.383-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">WhatsApp</p>
                                <p className="text-sm text-gray-400">Réponse rapide</p>
                            </div>
                        </a>
                    </div>
                </motion.div>

                {/* Map/Location Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        <iframe
                            title="Fox Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15924.009738349223!2d11.5050931!3d3.833521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a615f%3A0x8c8f5e52a1a85e1b!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2scm!4v1678761610709!5m2!1sfr!2scm"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            loading="lazy"
                            className="rounded-t-xl grayscale hover:grayscale-0 transition-all duration-700"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="p-6">
                            <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Yaoundé, Cameroun</h3>
                                    <p className="text-gray-400">Développeur disponible pour des collaborations à distance</p>
                                </div>
                                <a
                                    href="https://goo.gl/maps/QP7tz9TBSzExyB916"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 md:mt-0 px-4 py-2 bg-youtube-red hover:bg-red-700 rounded-lg transition-colors inline-flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    Voir sur Google Maps
                                </a>
                            </div>
                        </div>
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

export default ContactPage;