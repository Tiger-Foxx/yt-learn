import APP_CONFIG from '@/config/appConfig';

/**
 * Types pour le service de stockage
 */
interface StorageItem {
    id: string;
    createdAt: number;
    updatedAt: number;
    [key: string]: any;
}

interface CreationHistoryItem extends StorageItem {
    title: string;
    type: 'youtube' | 'pdf';
    sourceUrl?: string;
    sourceFileName?: string;
    thumbnail?: string;
    gameType: 'quiz' | 'flashcards' | 'interactif';
    content: string; // Contenu HTML généré
    metadata: {
        difficulty?: string;
        questions?: number;
        duration?: number;
        [key: string]: any;
    };
}

interface UserPreferences {
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
    private getKey(key: string): string {
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
    getCreationHistory(): CreationHistoryItem[] {
        return this.getItem<CreationHistoryItem[]>(APP_CONFIG.storage.gameHistoryKey, []);
    }

    /**
     * Ajoute une création à l'historique
     */
    addCreationToHistory(creation: CreationHistoryItem): boolean {
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
            return this.setItem(APP_CONFIG.storage.gameHistoryKey, history);
        } catch (error) {
            console.error('Erreur lors de l\'ajout à l\'historique des créations:', error);
            return false;
        }
    }

    /**
     * Supprime une création de l'historique
     */
    removeCreationFromHistory(id: string): boolean {
        try {
            const history = this.getCreationHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            return this.setItem(APP_CONFIG.storage.gameHistoryKey, updatedHistory);
        } catch (error) {
            console.error('Erreur lors de la suppression de la création:', error);
            return false;
        }
    }

    /**
     * Récupère une création spécifique par ID
     */
    getCreationById(id: string): CreationHistoryItem | null {
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

        return this.getItem<UserPreferences>(APP_CONFIG.storage.userPreferencesKey, defaultPreferences);
    }

    /**
     * Met à jour les préférences utilisateur
     */
    updateUserPreferences(preferences: Partial<UserPreferences>): boolean {
        try {
            const currentPreferences = this.getUserPreferences();
            const updatedPreferences = { ...currentPreferences, ...preferences };
            return this.setItem(APP_CONFIG.storage.userPreferencesKey, updatedPreferences);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des préférences utilisateur:', error);
            return false;
        }
    }

    /**
     * Vérifie si l'alerte d'installation a déjà été affichée
     */
    hasShownInstallPrompt(): boolean|null {
        return this.getItem<boolean>(APP_CONFIG.storage.installPromptKey, false);
    }

    /**
     * Marque l'alerte d'installation comme affichée
     */
    markInstallPromptAsShown(): void {
        this.setItem(APP_CONFIG.storage.installPromptKey, true);
    }

    /**
     * Exporte toutes les données utilisateur sous forme de fichier JSON
     */
    exportUserData(): string {
        const userData = {
            creations: this.getCreationHistory(),
            preferences: this.getUserPreferences(),
            timestamp: new Date().toISOString(),
            appVersion: APP_CONFIG.appVersion
        };

        return JSON.stringify(userData, null, 2);
    }

    /**
     * Importe les données utilisateur depuis un fichier JSON
     */
    importUserData(jsonData: string): boolean {
        try {
            const userData = JSON.parse(jsonData);

            // Valider les données
            if (!userData.creations || !Array.isArray(userData.creations)) {
                throw new Error('Format de données invalide: creations');
            }

            if (!userData.preferences || typeof userData.preferences !== 'object') {
                throw new Error('Format de données invalide: preferences');
            }

            // Importer les données
            this.setItem(APP_CONFIG.storage.gameHistoryKey, userData.creations);
            this.setItem(APP_CONFIG.storage.userPreferencesKey, userData.preferences);

            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation des données:', error);
            return false;
        }
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