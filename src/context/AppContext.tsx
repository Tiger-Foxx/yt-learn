import React, { createContext, useState, useEffect, ReactNode } from 'react';
import storageService from '@/services/storageService';
import APP_CONFIG from '@/config/appConfig';

/**
 * Types pour le contexte
 */
interface AppContextType {
    // Thème
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    currentTheme: 'light' | 'dark'; // Thème actuel après calcul basé sur les préférences système

    // PWA
    isPWA: boolean;
    isInstallPromptAvailable: boolean;
    showInstallPrompt: () => void;

    // État global de l'application
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    // État des créations
    creationHistory: any[];
    refreshCreationHistory: () => void;
    deleteCreation: (id: string) => void;

    // Préférences utilisateur
    userPreferences: {
        difficulty: string;
        defaultGameType: string;
        hasSeenTutorial: boolean;
        [key: string]: any;
    };
    updatePreferences: (preferences: Record<string, any>) => void;

    // États divers
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;

    // Notifications et alertes
    showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;

    // Gestion des erreurs
    hasError: boolean;
    errorMessage: string | null;
    clearError: () => void;
    setError: (message: string) => void;
}

/**
 * Valeurs par défaut du contexte
 */
const defaultContextValue: AppContextType = {
    theme: 'system',
    setTheme: () => {},
    currentTheme: 'dark', // Par défaut en mode sombre

    isPWA: false,
    isInstallPromptAvailable: false,
    showInstallPrompt: () => {},

    isLoading: false,
    setIsLoading: () => {},

    creationHistory: [],
    refreshCreationHistory: () => {},
    deleteCreation: () => {},

    userPreferences: {
        difficulty: 'moyen',
        defaultGameType: 'quiz',
        hasSeenTutorial: false
    },
    updatePreferences: () => {},

    isMenuOpen: false,
    setIsMenuOpen: () => {},

    showNotification: () => {},

    hasError: false,
    errorMessage: null,
    clearError: () => {},
    setError: () => {}
};

/**
 * Création du contexte avec les valeurs par défaut
 */
export const AppContext = createContext<AppContextType>(defaultContextValue);

/**
 * Props pour le fournisseur de contexte
 */
interface AppProviderProps {
    children: ReactNode;
}

/**
 * Composant fournisseur de contexte
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // État pour le thème
    const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

    // État pour l'installation PWA
    const [isPWA, setIsPWA] = useState(false);
    const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState(false);
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

    // État de chargement global
    const [isLoading, setIsLoading] = useState(false);

    // État des créations
    const [creationHistory, setCreationHistory] = useState<any[]>([]);

    // État des préférences utilisateur
    const [userPreferences, setUserPreferences] = useState(defaultContextValue.userPreferences);

    // État du menu (mobile)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // État des erreurs
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // État des notifications
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
        visible: boolean;
    } | null>(null);

    /**
     * Effet pour charger les préférences utilisateur depuis le localStorage
     */
    useEffect(() => {
        // Charger les préférences utilisateur
        const storedPreferences = storageService.getUserPreferences();
        if (storedPreferences) {
            setUserPreferences(storedPreferences);
            setThemeState(storedPreferences.theme || 'system');
        }

        // Charger l'historique des créations
        refreshCreationHistory();

        // Vérifier si l'application est exécutée en mode PWA
        if (window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true) {
            setIsPWA(true);
        }

        // Écouter l'événement beforeinstallprompt pour l'installation PWA
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    /**
     * Effet pour gérer le thème système
     */
    useEffect(() => {
        const updateThemeBasedOnPreference = () => {
            if (theme === 'system') {
                // Vérifier la préférence système
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
            } else {
                setCurrentTheme(theme);
            }
        };

        updateThemeBasedOnPreference();

        // Écouter les changements de préférence système
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateThemeBasedOnPreference();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    /**
     * Effet pour appliquer le thème au document
     */
    useEffect(() => {
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [currentTheme]);

    /**
     * Gestionnaire pour l'événement beforeinstallprompt (PWA)
     */
    const handleBeforeInstallPrompt = (e: Event) => {
        // Empêcher Chrome d'afficher automatiquement la bannière d'installation
        e.preventDefault();
        // Stocker l'événement pour l'utiliser plus tard
        setInstallPromptEvent(e);
        setIsInstallPromptAvailable(true);
    };

    /**
     * Fonction pour afficher le prompt d'installation PWA
     */
    const showInstallPrompt = async () => {
        if (installPromptEvent) {
            // Afficher le prompt d'installation
            await installPromptEvent.prompt();
            // Attendre que l'utilisateur réponde au prompt
            const choiceResult = await installPromptEvent.userChoice;

            // Réinitialiser l'état après la réponse de l'utilisateur
            setIsInstallPromptAvailable(false);
            setInstallPromptEvent(null);

            // Marquer comme affiché dans le stockage
            if (choiceResult.outcome === 'accepted') {
                storageService.markInstallPromptAsShown();
            }
        }
    };

    /**
     * Fonction pour mettre à jour le thème
     */
    const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
        setThemeState(newTheme);

        // Mettre à jour les préférences dans le stockage
        storageService.updateUserPreferences({ theme: newTheme });

        // Mettre à jour l'état actuel du thème
        if (newTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
        } else {
            setCurrentTheme(newTheme);
        }
    };

    /**
     * Fonction pour rafraîchir l'historique des créations
     */
    const refreshCreationHistory = () => {
        const history = storageService.getCreationHistory();
        setCreationHistory(history);
    };

    /**
     * Fonction pour supprimer une création
     */
    const deleteCreation = (id: string) => {
        if (storageService.removeCreationFromHistory(id)) {
            refreshCreationHistory();
            showNotification('La création a été supprimée', 'success');
        } else {
            setError('Erreur lors de la suppression de la création');
        }
    };

    /**
     * Fonction pour mettre à jour les préférences utilisateur
     */
    const updatePreferences = (preferences: Record<string, any>) => {
        const updatedPreferences = { ...userPreferences, ...preferences };

        // Mettre à jour le state
        setUserPreferences(updatedPreferences);

        // Mettre à jour dans le stockage
        storageService.updateUserPreferences(preferences);

        // Mettre à jour le thème si nécessaire
        if (preferences.theme && preferences.theme !== theme) {
            setTheme(preferences.theme);
        }
    };

    /**
     * Fonction pour afficher une notification
     */
    const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setNotification({
            message,
            type,
            visible: true
        });

        // Masquer la notification après un délai
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    /**
     * Fonctions pour la gestion des erreurs
     */
    const setError = (message: string) => {
        setHasError(true);
        setErrorMessage(message);
        showNotification(message, 'error');
    };

    const clearError = () => {
        setHasError(false);
        setErrorMessage(null);
    };

    /**
     * Valeur du contexte à fournir
     */
    const contextValue: AppContextType = {
        theme,
        setTheme,
        currentTheme,

        isPWA,
        isInstallPromptAvailable,
        showInstallPrompt,

        isLoading,
        setIsLoading,

        creationHistory,
        refreshCreationHistory,
        deleteCreation,

        userPreferences,
        updatePreferences,

        isMenuOpen,
        setIsMenuOpen,

        showNotification,

        hasError,
        errorMessage,
        clearError,
        setError
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
            {/* Affichage des notifications */}
            {notification && notification.visible && (
                <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'error' ? 'bg-red-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                } text-white min-w-[300px] max-w-md animate-fade-in-up`}>
                    <p>{notification.message}</p>
                </div>
            )}
        </AppContext.Provider>
    );
};

export default AppProvider;