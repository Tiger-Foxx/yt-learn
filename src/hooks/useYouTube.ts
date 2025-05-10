import { useState } from 'react';
import youtubeService from '@/services/youtubeService';

export interface VideoInfo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    duration?: string;
    publishedAt?: string;
}

/**
 * Hook pour gérer les interactions avec les vidéos YouTube
 */
function useYouTube() {
    const [videoId, setVideoId] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Valide une URL YouTube
     */
    const validateYouTubeUrl = async (url: string): Promise<{
        isValid: boolean;
        videoId: string | null;
        videoInfo: VideoInfo | null;
        error?:string|null
    }> => {
        setIsLoading(true);
        setError(null);

        try {
            // Extraire l'ID de la vidéo
            const id = youtubeService.parseYouTubeUrl(url);

            if (!id) {
                setError('URL YouTube invalide');
                setIsLoading(false);
                return {
                    isValid: false,
                    videoId: null,
                    videoInfo: null
                };
            }

            // Récupérer les infos de la vidéo
            const info = await youtubeService.getVideoInfo(url);

            if (!info) {
                setError('Impossible de récupérer les informations de la vidéo');
                setIsLoading(false);
                return {
                    isValid: false,
                    videoId: id,
                    videoInfo: null
                };
            }

            // Mettre à jour les états
            setVideoId(id);
            setVideoInfo(info);
            setEmbedUrl(youtubeService.getEmbedUrl(id));

            setIsLoading(false);
            return {
                isValid: true,
                videoId: id,
                videoInfo: info
            };
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue';
            setError(errorMessage);
            setIsLoading(false);
            return {
                isValid: false,
                videoId: null,
                videoInfo: null
            };
        }
    };

    /**
     * Réinitialise tous les états
     */
    const reset = () => {
        setVideoId(null);
        setVideoInfo(null);
        setEmbedUrl(null);
        setError(null);
    };

    return {
        videoId,
        videoInfo,
        embedUrl,
        isLoading,
        error,
        validateYouTubeUrl,
        reset
    };
}

export default useYouTube;