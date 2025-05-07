import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import APP_CONFIG from '@/config/appConfig';
import useCreation from "@/hooks/useCreation";

const PlaySpacePage: React.FC = () => {
    const navigate = useNavigate();
    const { creationHistory, deleteCreation } = useCreation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string | null>(null);
    const [selectedCreation, setSelectedCreation] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contentToDelete, setContentToDelete] = useState<string | null>(null);
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });
    const headerControls = useAnimation();
    const gridRef = useRef(null);
    const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });
    const gridControls = useAnimation();

    // Trigger animations when elements come into view
    useEffect(() => {
        if (isHeaderInView) {
            headerControls.start('visible');
        }
        if (isGridInView) {
            gridControls.start('visible');
        }
    }, [isHeaderInView, isGridInView, headerControls, gridControls]);

    // Filter creations based on search term and filter
    const filteredCreations = creationHistory.filter(creation => {
        return (
            (filterType === null || creation.gameType === filterType) &&
            (searchTerm === '' || creation.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (contentToDelete) {
            deleteCreation(contentToDelete);
            setIsDeleteModalOpen(false);
            setContentToDelete(null);
            setSelectedCreation(null);
        }
    };

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                when: "beforeChildren",
                staggerChildren: 0.1,
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const searchBarVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    // Filter button animations
    const renderFilterButtons = () => {
        return (
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilterType(null)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filterType === null
                            ? 'bg-youtube-red text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    Tous
                </motion.button>

                {APP_CONFIG.gameOptions.types.map(type => (
                    <motion.button
                        key={type}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filterType === type
                                ? 'bg-youtube-red text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </motion.button>
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(APP_CONFIG.routes.creation)}
                    className="px-4 py-1 bg-youtube-red text-white rounded-full flex items-center ml-2 transition-transform"
                >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                    Créer
                </motion.button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">
                {/* Background decorations */}
                <div className="absolute top-20 right-0 w-64 h-64 bg-youtube-red opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-10 w-80 h-80 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

                {/* Header Section */}
                <motion.div
                    ref={headerRef}
                    variants={headerVariants}
                    initial="hidden"
                    animate={headerControls}
                    className="mb-10"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-bold mb-3"
                    >
                        Mes <span className="text-youtube-red">Espaces</span> d'Apprentissage
                    </motion.h1>

                    <motion.div
                        variants={itemVariants}
                        className="w-20 h-1 bg-youtube-red mb-6"
                    ></motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-400 text-xl max-w-3xl mb-10"
                    >
                        Retrouvez et jouez avec tous vos contenus éducatifs générés par l'IA pour une expérience d'apprentissage immersive.
                    </motion.p>

                    {/* Search and filter section */}
                    <motion.div
                        variants={searchBarVariants}
                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-10"
                    >
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="w-full md:max-w-md relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher par titre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-youtube-red transition-colors"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {renderFilterButtons()}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Content Grid */}
                <motion.div
                    ref={gridRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={gridControls}
                >
                    {filteredCreations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {filteredCreations.map((creation, index) => (
                                <motion.div
                                    key={creation.id}
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -8,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                    className="h-full"
                                >
                                    <div
                                        className="bg-card-bg rounded-xl overflow-hidden h-full border border-gray-800 shadow-lg cursor-pointer transform transition-transform duration-300"
                                        onClick={() => setSelectedCreation(creation.id === selectedCreation ? null : creation.id)}
                                    >
                                        {/* Card Header - Thumbnail */}
                                        <div className="relative overflow-hidden">
                                            <div className="h-40 bg-gradient-to-br from-gray-900 to-youtube-red/40 flex items-center justify-center overflow-hidden">
                                                {creation.thumbnail ? (
                                                    <img
                                                        src={creation.thumbnail}
                                                        alt={creation.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="transform transition-transform">
                                                        {creation.gameType === 'quiz' ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v2h2V6h-2zm0 4v8h2v-8h-2z"/>
                                                            </svg>
                                                        ) : creation.gameType === 'flashcards' ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8V9zm0-3h8v2h-8V6zm0 6h4v2h-4v-2z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM6 15h2v-2h2v-2H8V9H6v2H4v2h2z"/>
                                                                <circle cx="14.5" cy="13.5" r="1.5"/>
                                                                <circle cx="18.5" cy="10.5" r="1.5"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Play button overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4">
                                                    <div>
                            <span className="px-2 py-1 bg-youtube-red/80 text-white text-xs rounded-md backdrop-blur-sm">
                              {creation.gameType.toUpperCase()}
                            </span>
                                                    </div>
                                                    <div>
                            <span className="text-xs text-white/80">
                              {new Date(creation.createdAt).toLocaleDateString()}
                            </span>
                                                    </div>
                                                </div>

                                                {/* Type indicator */}
                                                <div className="absolute top-3 right-3">
                                                    <div className={`
                            w-2 h-2 rounded-full
                            ${creation.gameType === 'quiz' ? 'bg-blue-500' :
                                                        creation.gameType === 'flashcards' ? 'bg-green-500' :
                                                            'bg-purple-500'} 
                            animate-pulse
                          `}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-4 flex-grow flex flex-col">
                                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                                {creation.title}
                                            </h3>

                                            <div className="mt-auto flex justify-between items-center">
                                                <div className="flex items-center text-sm text-gray-400">
                                                    {creation.type === 'youtube' ? (
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1 text-youtube-red" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                                            </svg>
                                                            YouTube
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                                                            </svg>
                                                            PDF
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Actions */}
                                        {selectedCreation === creation.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="p-4 border-t border-gray-800 bg-gray-900/50"
                                            >
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`${APP_CONFIG.routes.game.replace(':id', creation.id)}`);
                                                        }}
                                                        className="flex-1 bg-youtube-red hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                        Jouer
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setContentToDelete(creation.id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-900 rounded-xl p-10 border border-gray-800 text-center shadow-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mb-6"
                            >
                                <svg className="w-20 h-20 mx-auto text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.div>

                            <motion.h3
                                className="text-2xl font-bold text-white mb-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {searchTerm || filterType
                                    ? 'Aucun résultat trouvé'
                                    : 'Votre espace est vide'}
                            </motion.h3>

                            <motion.p
                                className="text-gray-400 mb-8 max-w-md mx-auto"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {searchTerm || filterType
                                    ? 'Essayez de modifier vos filtres ou votre recherche'
                                    : "Commencez par créer votre premier contenu éducatif. L'IA transformera vos vidéos YouTube ou documents en expériences d'apprentissage interactives."}
                            </motion.p>

                            {!searchTerm && !filterType && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button
                                        onClick={() => navigate(APP_CONFIG.routes.creation)}
                                        className="bg-youtube-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 4v16m8-8H4" />
                                        </svg>
                                        Créer mon premier contenu
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Stats Section */}
                {filteredCreations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mt-16"
                    >
                        <h2 className="text-2xl font-bold mb-6">Statistiques d'apprentissage</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Contenus créés</p>
                                        <p className="text-3xl font-bold text-white">{creationHistory.length}</p>
                                    </div>
                                    <div className="bg-youtube-red/10 p-2 rounded-lg">
                                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Type le plus créé</p>
                                        <p className="text-3xl font-bold text-white capitalize">
                                            {creationHistory.length > 0
                                                ? Object.entries(
                                                    creationHistory.reduce((acc, curr) => {
                                                        acc[curr.gameType] = (acc[curr.gameType] || 0) + 1;
                                                        return acc;
                                                    }, {} as Record<string, number>)
                                                ).sort((a, b) => b[1] - a[1])[0][0]
                                                : '-'
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-youtube-red/10 p-2 rounded-lg">
                                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 3L1 9l11 6 9.5-5.2L22 9.8V17h2V9L12 3zm0 3.8L6 10l6 3.2L18 10l-6-3.2zM2 15v2h5v-2H2zm0 4v2h7v-2H2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Dernier contenu</p>
                                        <p className="text-xl font-bold text-white truncate max-w-[180px]">
                                            {creationHistory.length > 0
                                                ? creationHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].title.substring(0, 20)
                                                : '-'
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-youtube-red/10 p-2 rounded-lg">
                                        <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-md w-full"
                    >
                        <div className="text-center mb-6">
                            <div className="bg-red-500/10 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-400 mb-6">
                                Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Mobile Floating Button */}
            <motion.div
                className="fixed bottom-6 right-6 md:hidden z-30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(APP_CONFIG.routes.creation)}
                    className="bg-youtube-red text-white w-14 h-14 rounded-full shadow-lg shadow-youtube-red/30 flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                </motion.button>
            </motion.div>

            {/* Style specific to this page */}

        </div>
    );
};

export default PlaySpacePage;