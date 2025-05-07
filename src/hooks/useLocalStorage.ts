import { useState, useEffect } from 'react';
import APP_CONFIG from '@/config/appConfig';

/**
 * Hook personnalisé pour gérer le stockage local avec typesûreté et préfixage
 * @param key - Clé pour la valeur stockée
 * @param initialValue - Valeur par défaut si aucune valeur n'existe dans localStorage
 * @param prefix - Préfixe optionnel pour éviter les collisions (défaut à APP_CONFIG.storage.prefix)
 * @returns [storedValue, setValue, removeValue] - La valeur stockée, une fonction pour la modifier et une fonction pour la supprimer
 */
function useLocalStorage<T>(
    key: string,
    initialValue: T,
    prefix: string = APP_CONFIG.storage.prefix
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // Préfixage de la clé
    const prefixedKey = `${prefix}${key}`;

    // Fonction pour obtenir la valeur depuis localStorage
    const readValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(prefixedKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Erreur lors de la lecture de "${prefixedKey}" depuis localStorage:`, error);
            return initialValue;
        }
    };

    // État pour stocker la valeur actuelle
    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Fonction pour mettre à jour localStorage et l'état
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Permettre à la valeur d'être une fonction comme pour setState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Sauvegarder dans l'état
            setStoredValue(valueToStore);

            // Sauvegarder dans localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));

                // Déclencher un événement pour synchroniser entre onglets si nécessaire
                window.dispatchEvent(new Event('local-storage-update'));
            }
        } catch (error) {
            console.warn(`Erreur lors de l'écriture de "${prefixedKey}" dans localStorage:`, error);
        }
    };

    // Fonction pour supprimer l'élément du localStorage
    const removeValue = () => {
        try {
            window.localStorage.removeItem(prefixedKey);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`Erreur lors de la suppression de "${prefixedKey}" du localStorage:`, error);
        }
    };

    // Effet pour synchroniser entre différents onglets/fenêtres
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === prefixedKey) {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [prefixedKey, initialValue]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;