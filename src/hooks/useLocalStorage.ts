import { useState, useEffect, useCallback } from 'react';
import storageService from '@/services/storageService';

/**
 * Hook personnalisé pour gérer le stockage local avec typesûreté
 * Il utilise le service de stockage pour assurer la cohérence des opérations
 *
 * @param key - Clé pour la valeur stockée (sans préfixe, il sera ajouté par le service)
 * @param initialValue - Valeur par défaut si aucune valeur n'existe dans localStorage
 * @returns [storedValue, setValue, removeValue] - La valeur stockée, une fonction pour la modifier et une fonction pour la supprimer
 */
function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // Fonction pour obtenir la valeur depuis le service de stockage
    const readValue = useCallback((): T => {
        return storageService.getItem<T>(key, initialValue);
    }, [key, initialValue]);

    // État pour stocker la valeur actuelle
    const [storedValue, setStoredValue] = useState<T>(readValue());

    // Fonction pour mettre à jour localStorage et l'état
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Permettre à la valeur d'être une fonction comme pour setState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Sauvegarder dans l'état
            setStoredValue(valueToStore);

            // Sauvegarder dans localStorage via le service
            storageService.setItem(key, valueToStore);
        } catch (error) {
            console.error(`Erreur lors de l'écriture de "${key}" dans localStorage:`, error);
        }
    }, [key, storedValue]);

    // Fonction pour supprimer l'élément du localStorage
    const removeValue = useCallback(() => {
        try {
            storageService.removeItem(key);
            setStoredValue(initialValue);
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
                    setStoredValue(newValue);
                } catch (error) {
                    console.error(`Erreur lors de la synchronisation de "${key}" entre onglets:`, error);
                }
            }
        };

        // Fonction pour vérifier les changements dans les autres onglets
        window.addEventListener('storage', handleStorageChange);

        // Fonction pour vérifier les changements dans le même onglet
        window.addEventListener('local-storage-update', () => {
            setStoredValue(readValue());
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-update', () => {
                setStoredValue(readValue());
            });
        };
    }, [key, initialValue, readValue]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;