import { useState, useEffect, useCallback } from 'react';
import { Location } from '../types/location';
import { locationService } from '../services/location';
import { storageService } from '../services/storage';

/**
 * Hook pour gérer les fonctionnalités liées à la localisation
 */
export const useLocation = () => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const [locationHistory, setLocationHistory] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Récupérer l'historique des localisations au chargement
    useEffect(() => {
        const history = storageService.getLocationHistory();
        setLocationHistory(history);
    }, []);

    /**
     * Récupère la localisation actuelle de l'utilisateur
     */
    const getCurrentLocation = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const position = await locationService.getCurrentPosition();

            const { latitude, longitude } = position.coords;
            const locationInfo = await locationService.reverseGeocode(latitude, longitude);

            setCurrentLocation(locationInfo);

            // Sauvegarder dans l'historique
            storageService.saveLocationHistory(locationInfo);
            // Mettre à jour l'historique local
            setLocationHistory(storageService.getLocationHistory());

            return locationInfo;
        } catch (err) {
            console.error('Error getting current location:', err);
            setError(err instanceof Error ? err.message : 'Failed to get your location');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Recherche des localisations par nom (ville, pays, etc.)
     */
    const searchLocation = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return [];
        }

        setIsLoading(true);
        setError(null);

        try {
            const results = await locationService.searchLocation(query);
            setSearchResults(results);
            return results;
        } catch (err) {
            console.error('Error searching location:', err);
            setError(err instanceof Error ? err.message : 'Failed to search locations');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Sélectionne une localisation et la sauvegarde dans l'historique
     */
    const selectLocation = useCallback((location: Location) => {
        setCurrentLocation(location);
        storageService.saveLocationHistory(location);
        // Mettre à jour l'historique local
        setLocationHistory(storageService.getLocationHistory());
    }, []);

    /**
     * Efface l'historique des localisations
     */
    const clearLocationHistory = useCallback(() => {
        // Sauvegarde de la localisation actuelle si elle existe
        const current = currentLocation;

        // Effacer l'historique
        localStorage.removeItem('mood_music_user_locations');
        setLocationHistory([]);

        // Restaurer la localisation actuelle dans l'historique si existante
        if (current) {
            storageService.saveLocationHistory(current);
            setLocationHistory([current]);
        }
    }, [currentLocation]);

    return {
        currentLocation,
        searchResults,
        locationHistory,
        isLoading,
        error,
        getCurrentLocation,
        searchLocation,
        selectLocation,
        clearLocationHistory
    };
};