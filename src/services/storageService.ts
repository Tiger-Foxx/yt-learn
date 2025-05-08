import APP_CONFIG from '@/config/appConfig';

/**
 * Types pour le service de stockage
 */
export interface StorageItem {
    id: string;
    createdAt: number;
    updatedAt: number;
    [key: string]: any;
}

export interface Creation extends StorageItem {
    id: string;
    title: string;
    type: 'youtube' | 'pdf';
    sourceUrl?: string;
    sourceFileName?: string;
    thumbnail?: string;
    gameType: 'quiz' | 'flashcards' | 'interactive';
    content: string; // Contenu HTML complet du jeu
    difficulty?: string;
    metadata?: {
        questions?: number;
        duration?: number;
        [key: string]: any;
    };
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    difficulty: string;
    defaultGameType: string;
    hasSeenTutorial: boolean;
    [key: string]: any;
}

/**
 * Service pour gérer le stockage local
 */
class StorageService {
    private prefix: string;

    constructor() {
        this.prefix = APP_CONFIG.storage.prefix;
    }

    /**
     * Génère une clé préfixée pour le stockage
     */
    getKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    /**
     * Vérifie si le stockage local est disponible
     */
    isStorageAvailable(): boolean {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.error('Le stockage local n\'est pas disponible:', error);
            return false;
        }
    }

    /**
     * Enregistre un élément dans le stockage local
     */
    setItem<T>(key: string, value: T): boolean {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.getKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement dans le stockage local (${key}):`, error);
            return false;
        }
    }

    /**
     * Récupère un élément du stockage local
     */
    getItem<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const serializedValue = localStorage.getItem(this.getKey(key));
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error(`Erreur lors de la récupération depuis le stockage local (${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Supprime un élément du stockage local
     */
    removeItem(key: string): boolean {
        try {
            localStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression dans le stockage local (${key}):`, error);
            return false;
        }
    }

    /**
     * Récupère l'historique des créations
     */
    getCreationHistory(): Creation[] {
        return this.getItem<Creation[]>('creations', []);
    }

    /**
     * Ajoute une création à l'historique
     */
    addCreation(creation: {
        sourceUrl?: string;
        difficulty?: string;
        gameType?: "quiz" | "flashcards" | "interactive";
        createdAt: number;
        sourceFileName?: string;
        thumbnail?: string;
        metadata?: { questions?: number; duration?: number; [p: string]: any };
        id: string;
        title?: string;
        type?: "youtube" | "pdf";
        content?: string;
        updatedAt: number
    }): boolean {
        try {
            const history = this.getCreationHistory();

            // Limiter le nombre d'éléments dans l'historique
            if (history.length >= APP_CONFIG.limits.maxStorageItems) {
                // Supprimer l'élément le plus ancien
                history.sort((a, b) => a.createdAt - b.createdAt);
                history.shift();
            }

            // Ajouter la nouvelle création
            history.push(creation);

            // Enregistrer l'historique mis à jour
            return this.setItem('creations', history);
        } catch (error) {
            console.error('Erreur lors de l\'ajout à l\'historique des créations:', error);
            return false;
        }
    }

    /**
     * Supprime une création de l'historique
     */
    deleteCreation(id: string): boolean {
        try {
            const history = this.getCreationHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            return this.setItem('creations', updatedHistory);
        } catch (error) {
            console.error('Erreur lors de la suppression de la création:', error);
            return false;
        }
    }

    /**
     * Récupère une création spécifique par ID
     */
    getCreationById(id: string): Creation | null {
        try {
            const history = this.getCreationHistory();
            return history.find(item => item.id === id) || null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la création:', error);
            return null;
        }
    }

    /**
     * Récupère les préférences utilisateur
     */
    getUserPreferences(): UserPreferences {
        const defaultPreferences: UserPreferences = {
            theme: 'system',
            difficulty: APP_CONFIG.gameOptions.defaultDifficulty,
            defaultGameType: APP_CONFIG.gameOptions.types[0],
            hasSeenTutorial: false
        };

        return this.getItem<UserPreferences>('preferences', defaultPreferences);
    }

    /**
     * Met à jour les préférences utilisateur
     */
    updateUserPreferences(preferences: Partial<UserPreferences>): boolean {
        try {
            const currentPreferences = this.getUserPreferences();
            const updatedPreferences = { ...currentPreferences, ...preferences };
            return this.setItem('preferences', updatedPreferences);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des préférences utilisateur:', error);
            return false;
        }
    }

    /**
     * Vérifie si l'alerte d'installation a déjà été affichée
     */
    hasShownInstallPrompt(): boolean {
        return this.getItem<boolean>('install-prompt', false);
    }

    /**
     * Marque l'alerte d'installation comme affichée
     */
    markInstallPromptAsShown(): void {
        this.setItem('install-prompt', true);
    }

    /**
     * Efface toutes les données utilisateur
     */
    clearAllUserData(): boolean {
        try {
            // Récupérer toutes les clés du localStorage qui commencent par le préfixe
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }

            // Supprimer toutes les clés trouvées
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression des données utilisateur:', error);
            return false;
        }
    }
}

export default new StorageService();