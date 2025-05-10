import { useState, useEffect, useCallback } from 'react';
import storageService from '@/services/storageService';

// Type utilitaire pour vérifier si un objet possède une propriété id
type HasId = { id: string | number };
// type MaybeHasId = { id?: string | number };

/**
 * Hook personnalisé pour gérer le stockage local avec typesûreté
 * Il utilise le service de stockage pour assurer la cohérence des opérations
 *
 * Fonctionnalité spéciale: Si la valeur est un objet avec un attribut 'id',
 * alors en cas de collision d'id avec un objet existant, l'ancien sera écrasé.
 *
 * @param key - Clé pour la valeur stockée (sans préfixe, il sera ajouté par le service)
 * @param initialValue - Valeur par défaut si aucune valeur n'existe dans localStorage
 * @returns [storedValue, setValue, removeValue] - La valeur stockée, une fonction pour la modifier et une fonction pour la supprimer
 */
function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    /**
     * Vérifie si la valeur est un objet non-null avec un attribut id
     */
    const isObjectWithId = (value: unknown): value is HasId => {
        try {
            return typeof value === 'object' &&
                value !== null &&
                'id' in value &&
                (typeof (value as HasId).id === 'string' || typeof (value as HasId).id === 'number');
        } catch (error) {
            console.warn('Erreur lors de la vérification de l\'objet avec ID:', error);
            return false;
        }
    };

    /**
     * Vérifie si la valeur est un tableau d'objets avec id
     */
    const isArrayOfObjectsWithId = (value: unknown): value is HasId[] => {
        try {
            return Array.isArray(value) &&
                value.length > 0 &&
                value.every(item => isObjectWithId(item));
        } catch (error) {
            console.warn('Erreur lors de la vérification du tableau d\'objets avec ID:', error);
            return false;
        }
    };

    /**
     * Gère le cas spécial où nous sauvegardons un objet avec id
     * dans une collection d'objets déjà existante
     */
    const handleObjectWithId = (existingValue: any, newValue: HasId): any => {
        try {
            // Cas 1: existingValue est un tableau d'objets avec id
            if (isArrayOfObjectsWithId(existingValue)) {
                const newArray = existingValue.filter(item => item.id !== newValue.id);
                return [...newArray, newValue];
            }
            // Cas 2: existingValue est un objet avec un id identique
            else if (isObjectWithId(existingValue) && existingValue.id === newValue.id) {
                return { ...existingValue, ...newValue };
            }
            // Cas 3: existingValue est un objet SANS id ou avec un id différent
            else if (typeof existingValue === 'object' && existingValue !== null) {
                return newValue; // On remplace complètement
            }
            // Cas 4: les valeurs sont incompatibles, on remplace simplement
            return newValue;
        } catch (error) {
            console.warn(`Erreur lors de la fusion des objets avec id "${key}":`, error);
            // En cas d'erreur, on préfère conserver la nouvelle valeur
            return newValue;
        }
    };

    /**
     * Gère le cas d'un tableau d'objets avec id
     */
    const handleArrayOfObjectsWithId = (existingValue: any, newArray: HasId[]): any => {
        try {
            // Si la valeur existante n'est pas un tableau, on remplace simplement
            if (!Array.isArray(existingValue)) {
                return newArray;
            }

            // Création d'une Map pour un accès rapide aux objets par ID
            const idMap = new Map<string | number, HasId>();
            newArray.forEach(item => idMap.set(item.id, item));

            // Filtrer les objets existants dont l'id n'est pas dans le nouveau tableau
            const existingFiltered = existingValue
                .filter((item: any) => {
                    // Garder les objets sans id et ceux dont l'id n'est pas dans le nouveau tableau
                    return !isObjectWithId(item) || !idMap.has(item.id);
                });

            // Combiner les objets existants (non écrasés) avec les nouveaux objets
            return [...existingFiltered, ...newArray];
        } catch (error) {
            console.warn(`Erreur lors de la fusion des tableaux avec id "${key}":`, error);
            // En cas d'erreur, on préfère conserver le nouveau tableau
            return newArray;
        }
    };

    /**
     * Fonction pour obtenir la valeur depuis le service de stockage
     * Garantit qu'une valeur (initiale ou du storage) est toujours retournée
     */
    const readValue = useCallback((): T => {
        try {
            // Correction ici: nous devons garantir que nous retournons toujours T, pas T | null
            const storedValue = storageService.getItem<T>(key, initialValue);
            // Si null retourné, on utilise initialValue
            return storedValue !== null ? storedValue : initialValue;
        } catch (error) {
            console.error(`Erreur lors de la lecture de "${key}" dans localStorage:`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    // État pour stocker la valeur actuelle
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            return readValue();
        } catch (error) {
            console.error(`Erreur lors de l'initialisation de "${key}" depuis localStorage:`, error);
            return initialValue;
        }
    });

    /**
     * Fonction pour mettre à jour localStorage et l'état
     * avec gestion spéciale pour les objets avec id
     */
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Permettre à la valeur d'être une fonction comme pour setState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Vérifier si on doit gérer un cas spécial (objet avec id)
            let finalValueToStore: any = valueToStore;

            try {
                // Récupérer la valeur existante directement du localStorage
                const existingValue = storageService.getItem<any>(key, null);

                // Appliquer la logique spéciale pour les objets avec id
                if (isObjectWithId(valueToStore)) {
                    finalValueToStore = handleObjectWithId(existingValue, valueToStore);
                } else if (isArrayOfObjectsWithId(valueToStore)) {
                    finalValueToStore = handleArrayOfObjectsWithId(existingValue, valueToStore);
                }
            } catch (error) {
                console.warn(`Erreur lors du traitement spécial pour "${key}":`, error);
                // En cas d'erreur, utiliser la valeur originale
                finalValueToStore = valueToStore;
            }

            // Sauvegarder dans l'état
            setStoredValue(finalValueToStore as T);

            // Sauvegarder dans localStorage via le service
            storageService.setItem(key, finalValueToStore);

            // Émettre un événement pour informer les autres parties de l'application
            window.dispatchEvent(new CustomEvent('local-storage-update', {
                detail: { key: storageService.getKey(key) }
            }));

        } catch (error) {
            console.error(`Erreur lors de l'écriture de "${key}" dans localStorage:`, error);
        }
    }, [key, storedValue]);

    /**
     * Fonction pour supprimer l'élément du localStorage
     */
    const removeValue = useCallback(() => {
        try {
            storageService.removeItem(key);
            setStoredValue(initialValue);

            // Émettre un événement pour informer les autres parties de l'application
            window.dispatchEvent(new CustomEvent('local-storage-update', {
                detail: { key: storageService.getKey(key) }
            }));
        } catch (error) {
            console.error(`Erreur lors de la suppression de "${key}" du localStorage:`, error);
        }
    }, [key, initialValue]);

    // Effet pour synchroniser avec d'autres onglets/fenêtres
    useEffect(() => {
        // Fonction pour mettre à jour l'état lors d'un changement dans localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === storageService.getKey(key)) {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                    setStoredValue(newValue as T);
                } catch (error) {
                    console.error(`Erreur lors de la synchronisation de "${key}" entre onglets:`, error);
                    // En cas d'erreur de parsing, revenir à la valeur initiale
                    setStoredValue(initialValue);
                }
            }
        };

        // Fonction pour gérer les mises à jour dans le même onglet
        const handleLocalUpdate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.key === storageService.getKey(key)) {
                setStoredValue(readValue());
            }
        };

        // Ajouter les écouteurs d'événements
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage-update', handleLocalUpdate);

        return () => {
            // Nettoyer les écouteurs d'événements
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-update', handleLocalUpdate);
        };
    }, [key, initialValue, readValue]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;