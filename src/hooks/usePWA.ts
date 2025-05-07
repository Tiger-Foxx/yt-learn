import { useState, useEffect } from 'react';
import APP_CONFIG from '@/config/appConfig';
import useLocalStorage from './useLocalStorage';

/**
 * Types pour le hook PWA
 */
interface PWAInstallEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook personnalisé pour gérer les fonctionnalités PWA
 */
function usePWA() {
    // État pour le mode d'affichage PWA
    const [isPWA, setIsPWA] = useState(false);

    // État pour l'événement d'installation différé
    const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<PWAInstallEvent | null>(null);

    // État pour la disponibilité de l'installation
    const [isInstallAvailable, setIsInstallAvailable] = useState(false);

    // État pour la détection des plateformes
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    // Suivi de si le prompt d'installation a été montré
    const [installPromptShown, setInstallPromptShown] = useLocalStorage<boolean>(
        APP_CONFIG.storage.installPromptKey,
        false
    );

    // Effet pour la détection initiale
    useEffect(() => {
        // Vérifier si l'app est déjà installée (mode standalone)
        const checkIfPWA = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;
            setIsPWA(isStandalone);
        };

        // Détecter le système d'exploitation
        const detectOS = () => {
            const userAgent = window.navigator.userAgent || '';
            setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
            setIsAndroid(/Android/.test(userAgent));
        };

        // Écouter l'événement beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            // Empêcher le comportement par défaut
            e.preventDefault();

            // Stocker l'événement pour utilisation ultérieure
            setDeferredInstallPrompt(e as PWAInstallEvent);
            setIsInstallAvailable(true);
        };

        // Écouter l'événement appinstalled
        const handleAppInstalled = () => {
            setIsInstallAvailable(false);
            setInstallPromptShown(true);
            console.log('PWA installée avec succès');
        };

        checkIfPWA();
        detectOS();

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    /**
     * Déclenche le prompt d'installation
     */
    const promptInstall = async (): Promise<boolean> => {
        if (!deferredInstallPrompt) {
            console.warn('Le prompt d\'installation n\'est pas disponible');
            return false;
        }

        try {
            // Afficher le prompt d'installation
            await deferredInstallPrompt.prompt();

            // Attendre la décision de l'utilisateur
            const choiceResult = await deferredInstallPrompt.userChoice;

            // Réinitialiser l'événement différé
            setDeferredInstallPrompt(null);
            setIsInstallAvailable(false);

            // Si l'utilisateur a accepté l'installation
            if (choiceResult.outcome === 'accepted') {
                setInstallPromptShown(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erreur lors de la tentative d\'installation:', error);
            return false;
        }
    };

    /**
     * Affiche les instructions d'installation spécifiques à iOS
     */
    const showIOSInstallInstructions = () => {
        return {
            title: 'Installer YTLearn sur iOS',
            steps: [
                'Appuyez sur l\'icône "Partager" en bas de l\'écran',
                'Faites défiler et appuyez sur "Ajouter à l\'écran d\'accueil"',
                'Appuyez sur "Ajouter" dans le coin supérieur droit'
            ]
        };
    };

    /**
     * Marquer le prompt comme affiché, pour ne pas le montrer à nouveau trop tôt
     */
    const markPromptAsShown = () => {
        setInstallPromptShown(true);
    };

    /**
     * Réinitialiser l'état d'affichage du prompt, pour permettre de l'afficher à nouveau
     */
    const resetPromptShown = () => {
        setInstallPromptShown(false);
    };

    return {
        isPWA,
        isInstallAvailable,
        isIOS,
        isAndroid,
        installPromptShown,
        promptInstall,
        showIOSInstallInstructions,
        markPromptAsShown,
        resetPromptShown
    };
}

export default usePWA;