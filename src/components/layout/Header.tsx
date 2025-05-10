import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import APP_CONFIG from '@/config/appConfig';
import logo from '@/assets/logo.png';


const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isSearchOpen) setIsSearchOpen(false);
    };

    // Toggle search bar
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    // Handle search submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled ?
                    'bg-black/90 backdrop-blur-md shadow-lg shadow-black/20' :
                    'bg-gradient-to-b from-black/80 to-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to={APP_CONFIG.routes.home}
                            className="flex items-center"
                            aria-label="YTLearn Homepage"
                        >
                            <motion.div
                                initial={{ rotate: -10, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mr-1"
                            >
                                <img src={logo} width={115} height={115}/>
                            </motion.div>

                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <Navigation showLabels={true} vertical={false} className="mx-4" />
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center">
                        {/* Search button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSearch}
                            className="p-2 ml-2 text-gray-300 hover:text-white focus:outline-none"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </motion.button>

                        {/* Create button (desktop) */}
                        <div className="hidden md:block ml-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={APP_CONFIG.routes.creation}
                                    className="bg-youtube-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-300 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Créer
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMobileMenu}
                            className="p-2 ml-3 text-gray-300 hover:text-white focus:outline-none md:hidden"
                            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            <div className="w-6 h-6 relative flex items-center justify-center">
                <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                        isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                    }`}
                />
                                <span
                                    className={`absolute h-0.5 bg-current transform transition-all duration-300 ${
                                        isMobileMenuOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
                                    }`}
                                />
                                <span
                                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                                        isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                                    }`}
                                />
                            </div>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        key="search-bar"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    ref={searchInputRef}
                                    placeholder="Rechercher un contenu..."
                                    className="w-full py-2 pl-10 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-youtube-red transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-gray-900 border-t border-gray-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Navigation showLabels={true} vertical={true} onNavItemClick={() => setIsMobileMenuOpen(false)} />

                            <div className="pt-4 mt-3 border-t border-gray-800">
                                <Link
                                    to={APP_CONFIG.routes.creation}
                                    className="flex items-center justify-center w-full bg-youtube-red text-white px-4 py-3 rounded-md font-medium hover:bg-red-700 transition duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Créer un contenu
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;