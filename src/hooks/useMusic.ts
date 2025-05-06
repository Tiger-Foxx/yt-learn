import { useState, useEffect, useCallback } from 'react';
import { musicService } from '../services/music';
import {  Playlist } from '../types/music';

/**
 * Hook pour gérer les fonctionnalités liées à la musique
 */
export const useMusic = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Vérifier l'état d'authentification au chargement et lors des changements
    useEffect(() => {
        const checkAuthStatus = () => {
            const authenticated = musicService.isAuthenticated();
            setIsAuthenticated(authenticated);

            // Si l'utilisateur n'est pas authentifié et qu'on n'a pas de token client
            if (!authenticated && !musicService.hasValidClientToken()) {
                initClientToken();
            }
        };

        // Vérifier immédiatement
        checkAuthStatus();

        // Mettre en place un intervalle pour vérifier périodiquement
        const interval = setInterval(checkAuthStatus, 60000); // Chaque minute

        // Nettoyer l'intervalle lors du démontage
        return () => clearInterval(interval);
    }, []);

    // Initialiser le token client pour les API sans authentification
    const initClientToken = async () => {
        try {
            await musicService.getClientCredentialsToken();
        } catch (err) {
            console.error("Erreur lors de l'initialisation du token client", err);
        }
    };

    /**
     * Connecte l'utilisateur à Spotify
     */
    const login = useCallback(() => {
        const authUrl = musicService.generateAuthUrl();
        window.location.href = authUrl;
    }, []);

    /**
     * Déconnecte l'utilisateur de Spotify
     */
    const logout = useCallback(() => {
        musicService.logout();
        setIsAuthenticated(false);
    }, []);

    /**
     * Recherche de musique
     */
    const searchMusic = useCallback(async (query: string, type: string = "track,artist,album", limit: number = 20) => {
        if (!query.trim()) {
            return {
                tracks: { items: [], total: 0 },
                artists: { items: [], total: 0 },
                albums: { items: [], total: 0 }
            };
        }

        setIsLoading(true);
        setError(null);

        try {
            const results = await musicService.search(query, type, limit);
            return results;
        } catch (err: any) {
            setError(`Erreur de recherche : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Récupère les playlists de l'utilisateur
     */
    const getUserPlaylists = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (isAuthenticated) {
                const userPlaylists = await musicService.getUserPlaylists();
                setPlaylists(userPlaylists);
            } else {
                setPlaylists([]);
                setError("Vous devez être connecté pour voir vos playlists");
            }
        } catch (err: any) {
            console.error("Error fetching playlists:", err);
            setError(`Impossible de récupérer les playlists : ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    /**
     * Crée une nouvelle playlist avec des pistes
     */
    const createPlaylist = useCallback(async (name: string, description: string = "", isPublic: boolean = true, trackUris: string[] = []) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!isAuthenticated) {
                throw new Error("Vous devez être connecté pour créer une playlist");
            }

            // Créer la playlist
            const newPlaylist = await musicService.createPlaylist(name, description, isPublic);

            // Ajouter des pistes si fournies
            if (trackUris.length > 0) {
                await musicService.addTracksToPlaylist(newPlaylist.id, trackUris);
            }

            // Rafraîchir la liste des playlists
            await getUserPlaylists();

            return newPlaylist;
        } catch (err: any) {
            console.error("Error creating playlist:", err);
            setError(`Impossible de créer la playlist : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getUserPlaylists]);

    /**
     * Obtient des recommandations musicales basées sur des graines (genres, artistes, pistes)
     */
    const getRecommendations = useCallback(async (params: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const recommendations = await musicService.getRecommendations(params);
            return recommendations;
        } catch (err: any) {
            console.error("Error getting recommendations:", err);
            setError(`Impossible d'obtenir des recommandations : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Recherche de la musique par localisation
     */
    const getMusicByLocation = useCallback(async (countryCode: string, limit: number = 10) => {
        setIsLoading(true);
        setError(null);

        try {
            const tracks = await musicService.getTopTracksByCountry(countryCode, limit);
            return tracks;
        } catch (err: any) {
            console.error("Error getting music by location:", err);
            setError(`Impossible d'obtenir de la musique pour cette localisation : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtient les playlists en vedette
     */
    const getFeaturedPlaylists = useCallback(async (limit: number = 10, country: string = 'FR') => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await musicService.getFeaturedPlaylists(limit, country);
            return response.playlists.items;
        } catch (err: any) {
            console.error("Error getting featured playlists:", err);
            setError(`Impossible d'obtenir les playlists en vedette : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtient les nouvelles sorties
     */
    const getNewReleases = useCallback(async (limit: number = 10, country: string = 'FR') => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await musicService.getNewReleases(limit, country);
            return response.albums.items;
        } catch (err: any) {
            console.error("Error getting new releases:", err);
            setError(`Impossible d'obtenir les nouvelles sorties : ${err.message}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        playlists,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        searchMusic,
        getUserPlaylists,
        createPlaylist,
        getRecommendations,
        getMusicByLocation,
        getFeaturedPlaylists,
        getNewReleases
    };
};