import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import APP_CONFIG from '@/config/appConfig';

interface NavigationProps {
    className?: string;
    vertical?: boolean;
    showLabels?: boolean;
    showDescriptions?: boolean;
    onNavItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
                                                   className = '',
                                                   vertical = false,
                                                   showLabels = true,
                                                   showDescriptions = false,
                                                   onNavItemClick
                                               }) => {
    const navigationItems = [
        {
            name: 'Accueil',
            href: APP_CONFIG.routes.home,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            description: 'Retour à la page d\'accueil'
        },
        {
            name: 'Créer',
            href: APP_CONFIG.routes.creation,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Créer un nouveau contenu éducatif'
        },
        {
            name: 'Mes créations',
            href: APP_CONFIG.routes.playspace,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            description: 'Accéder à vos cours sauvegardés'
        }
    ];

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

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

    const containerClasses = `
    ${vertical ? 'flex flex-col space-y-2' : 'flex items-center gap-1 md:gap-2'} 
    ${className}
  `;

    return (
        <motion.nav
            className={containerClasses}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {navigationItems.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                    <NavLink
                        to={item.href}
                        onClick={onNavItemClick} // Gardez le onClick ici s'il est pour le NavLink lui-même
                    >
                        {({ isActive }) => ( // Utilisez la fonction "render prop" ici
                            // On ajoute un div ou un span parent pour appliquer les classes conditionnelles
                            // qui étaient sur le NavLink, car NavLink lui-même est le <a>
                            <div // Ou React.Fragment si ce div n'a pas besoin de classes spécifiques autres que celles du lien
                                className={`
                                    relative flex items-center ${vertical ? 'w-full' : ''} 
                                    px-3 py-2 rounded-lg transition-colors
                                    ${isActive
                                    ? 'text-white font-medium before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-r before:from-youtube-red/20 before:to-transparent before:rounded-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }
                                    group
                                `}
                                // Si onNavItemClick doit être déclenché par cet élément visuel et non le <a> sous-jacent,
                                // déplacez-le ici. Mais typiquement, on le laisse sur NavLink/Link.
                            >
                                <span className="flex-shrink-0 relative">
                                    {item.icon}
                                    {/* Active indicator for vertical layout */}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-youtube-red transform scale-x-0 transition-transform group-hover:scale-x-100 ${
                                        isActive && vertical ? 'scale-x-100' : '' // Ajustement pour l'indicateur vertical s'il doit dépendre de isActive
                                    } ${vertical ? '' : 'hidden'}`}>
                                    </span>
                                </span>

                                {showLabels && (
                                    <div className={`${vertical ? 'ml-3' : 'ml-1 md:ml-2'}`}>
                                        {showLabels && (
                                            <span className={`${showDescriptions ? 'block font-medium' : ''} ${vertical ? 'text-base' : 'text-sm'}`}>
                                                {item.name}
                                            </span>
                                        )}
                                        {showDescriptions && item.description && (
                                            <span className="text-xs text-gray-400 hidden md:inline-block">
                                                {item.description}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Animated dot for active state (only in horizontal layout) */}
                                {!vertical && (
                                    <span // Changé NavLink en span (ou div)
                                        className={`
                                            absolute -bottom-1 left-1/2 transform -translate-x-1/2
                                            w-1 h-1 bg-youtube-red rounded-full
                                            transition-all duration-300
                                            ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                                        `}
                                        aria-hidden="true" // C'est décoratif
                                    >
                                        <span className="sr-only">Lien actif</span> {/* Texte pour lecteur d'écran */}
                                    </span>
                                )}
                            </div>
                        )}
                    </NavLink>
                </motion.div>
            ))}
        </motion.nav>
    );
};

export default Navigation;