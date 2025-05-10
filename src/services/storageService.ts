import APP_CONFIG from '@/config/appConfig';
import {exampleCreations} from "@/data/exampleCreations.ts";

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
     * Vérifie si un objet a un ID commençant par 'fox'
     * @param value La valeur à vérifier
     * @returns true si l'objet doit être filtré (a un ID commençant par 'fox')
     */
    private shouldFilterObject<T>(value: T): boolean {
        try {
            if (typeof value === 'object' && value !== null) {
                // Vérifier si c'est un objet avec une propriété id
                if ('id' in value && typeof (value as any).id === 'string') {
                    const id = (value as any).id as string;
                    return id.toLowerCase().startsWith('fox');
                }

                // Si c'est un tableau, vérifier chaque élément
                if (Array.isArray(value)) {
                    return value.some(item => this.shouldFilterObject(item));
                }
            }
            return false;
        } catch (error) {
            console.warn('Erreur lors de la vérification de filtrage d\'objet:', error);
            return false;
        }
    }

    /**
     * Filtre récursivement les objets avec des IDs commençant par 'fox'
     * @param value La valeur à filtrer
     * @returns La valeur filtrée
     */
    private filterFoxObjects<T>(value: T): T {
        try {
            if (typeof value !== 'object' || value === null) {
                return value;
            }

            // Traitement des tableaux
            if (Array.isArray(value)) {
                return value.filter(item => !this.shouldFilterObject(item))
                    .map(item => this.filterFoxObjects(item)) as unknown as T;
            }

            // Traitement des objets
            if ('id' in value && typeof (value as any).id === 'string' &&
                (value as any).id.toLowerCase().startsWith('fox')) {
                return null as unknown as T;
            }

            // Traitement récursif des propriétés de l'objet
            const filteredObj = { ...value } as any;
            Object.keys(filteredObj).forEach(key => {
                if (typeof filteredObj[key] === 'object' && filteredObj[key] !== null) {
                    filteredObj[key] = this.filterFoxObjects(filteredObj[key]);
                }
            });

            return filteredObj;
        } catch (error) {
            console.warn('Erreur lors du filtrage des objets fox:', error);
            return value;
        }
    }

    /**
     * Enregistre un élément dans le stockage local
     * Ne sauvegarde pas les objets dont l'ID commence par 'fox'
     */
    setItem<T>(key: string, value: T): boolean {
        try {
            // Vérifier si l'objet ou un élément de sa structure a un ID commençant par 'fox'
            if (this.shouldFilterObject(value)) {
                console.warn(`Tentative d'enregistrer un objet avec ID interdit (fox*) ignorée pour la clé ${key}`);
                return false;
            }

            // Filtrer récursivement tout objet avec ID commençant par 'fox'
            const filteredValue = this.filterFoxObjects(value);

            const serializedValue = JSON.stringify(filteredValue);
            localStorage.setItem(this.getKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement dans le stockage local (${key}):`, error);
            return false;
        }
    }

    /**
     * Récupère un élément du stockage local
     * Filtre les objets dont l'ID commence par 'fox'
     */
    getItem<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const serializedValue = localStorage.getItem(this.getKey(key));
            if (serializedValue === null) {
                return defaultValue;
            }

            // Désérialiser et filtrer les objets avec ID commençant par 'fox'
            const value = JSON.parse(serializedValue) as T;
            return this.filterFoxObjects(value);
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
     * Filtre les créations dont l'ID commence par 'fox'
     */
    getCreationHistory(): Creation[] {
        const creations = this.getItem<Partial<Creation>[]>('creations', []);
        if (creations) {
            // Filtrer les créations valides et celles dont l'ID ne commence pas par 'fox'
            const validCreations = creations
                .filter((creation): creation is Creation =>
                    creation.id !== undefined &&
                    creation.title !== undefined &&
                    creation.type !== undefined &&
                    creation.gameType !== undefined &&
                    creation.content !== undefined &&
                    !creation.id.toLowerCase().startsWith('fox')
                );

            // Filtrer les exemples de créations pour exclure ceux avec ID commençant par 'fox'
            const filteredExamples = exampleCreations.filter(
    example => example.id && !example.id.toLowerCase().startsWith('fox')
) as Creation[];

            return validCreations.concat(filteredExamples as ConcatArray<Creation>);
        }

        // Filtrer les exemples de créations pour exclure ceux avec ID commençant par 'fox'
        return exampleCreations.filter(
    example => example.id && !example.id.toLowerCase().startsWith('fox')
) as Creation[];
    }

    /**
     * Ajoute une création à l'historique
     * N'ajoute pas si l'ID commence par 'fox'
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
            // Vérifier si l'ID commence par 'fox'
            if (creation.id.toLowerCase().startsWith('fox')) {
                console.warn(`Tentative d'ajouter une création avec ID interdit (fox*) ignorée: ${creation.id}`);
                return false;
            }

            const history = this.getCreationHistory();

            // Limiter le nombre d'éléments dans l'historique
            if (history.length >= APP_CONFIG.limits.maxStorageItems) {
                // Supprimer l'élément le plus ancien
                history.sort((a, b) => a.createdAt - b.createdAt);
                history.shift();
            }

            // Ajouter la nouvelle création
            history.push(<Creation>creation);

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
     * Ne retourne pas de création si son ID commence par 'fox'
     */
    getCreationById(id: string): Creation | null {
        try {
            // Vérifier si l'ID commence par 'fox'
            if (id.toLowerCase().startsWith('fox')) {
                console.warn(`Tentative d'accès à une création avec ID interdit (fox*) ignorée: ${id}`);
                return null;
            }

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
    getUserPreferences(): UserPreferences  {
        const defaultPreferences: UserPreferences = {
            theme: 'system',
            difficulty: APP_CONFIG.gameOptions.defaultDifficulty,
            defaultGameType: APP_CONFIG.gameOptions.types[0],
            hasSeenTutorial: false
        };

        return this.getItem<UserPreferences>('preferences', defaultPreferences) || defaultPreferences;
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
    hasShownInstallPrompt(): boolean |null {
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