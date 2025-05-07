import { useState } from 'react';
import axios from 'axios';

// Types
export interface VideoInfo {
    title: string;
    channelTitle: string;
    thumbnail: string;
    duration: string;
    url: string;
}

const useYouTube = () => {
    const [videoId, setVideoId] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [transcript, setTranscript] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);

    // Parse YouTube URL to extract video ID
    const parseYouTubeUrl = (url: string): string | null => {
        try {
            const urlObj = new URL(url);

            // Regular YouTube URL format (youtube.com/watch?v=VIDEO_ID)
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            }

            // Short YouTube URL format (youtu.be/VIDEO_ID)
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }

            return null;
        } catch (e) {
            // If the URL is invalid
            return null;
        }
    };

    // Validate YouTube URL
    const validateYouTubeUrl = async (url: string): Promise<{
        isValid: boolean;
        videoId: string | null;
        videoInfo: VideoInfo | null;
        error?: string;
    }> => {
        setIsLoading(true);
        setError(null);

        try {
            const id = parseYouTubeUrl(url);

            if (!id) {
                setError('URL YouTube invalide. Veuillez utiliser un format youtube.com/watch?v=ID ou youtu.be/ID');
                return { isValid: false, videoId: null, videoInfo: null, error: 'URL YouTube invalide' };
            }

            // In a real implementation, you might want to verify if the video exists via YouTube API
            // For now, we'll simulate this with a mock API call
            const response = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);

            if (response.status !== 200 || response.data.error) {
                setError('Cette vidéo YouTube n\'existe pas ou n\'est pas accessible.');
                return { isValid: false, videoId: null, videoInfo: null, error: 'Vidéo inaccessible' };
            }

            const videoInfo: VideoInfo = {
                title: response.data.title || 'Vidéo YouTube',
                channelTitle: response.data.author_name || 'Chaîne inconnue',
                thumbnail: response.data.thumbnail_url || '',
                duration: 'N/A', // Not provided by noembed
                url: url
            };

            setVideoId(id);
            setVideoInfo(videoInfo);
            setEmbedUrl(`https://www.youtube.com/embed/${id}`);

            setIsLoading(false);
            return { isValid: true, videoId: id, videoInfo, error: undefined };
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue lors de la validation de l\'URL YouTube';
            setError(errorMessage);
            setIsLoading(false);
            return { isValid: false, videoId: null, videoInfo: null, error: errorMessage };
        }
    };

    // Fetch transcript for a video
    const fetchTranscript = async (url: string): Promise<string> => {
        setIsLoading(true);
        setError(null);

        try {
            const id = videoId || parseYouTubeUrl(url);

            if (!id) {
                setError('ID de vidéo YouTube invalide');
                setIsLoading(false);
                return '';
            }

            // In a real implementation, you'd use a backend service to fetch the transcript
            // For now, we'll simulate this with a timeout and mock data
            await new Promise(resolve => setTimeout(resolve, 1500));

            // This is where you'd call your backend
            // const response = await axios.get(`/api/transcript/${id}`);
            // const transcriptText = response.data.transcript;

            // For demo, we'll return a mock transcript
            const mockTranscript = `Bienvenue dans cette vidéo sur ${videoInfo?.title || 'YouTube'}. 
Dans cette leçon, nous allons explorer les concepts clés et approfondir notre compréhension du sujet.
Premièrement, nous aborderons les bases fondamentales qui constituent l'essentiel de notre apprentissage.
Ensuite, nous étudierons les applications pratiques et les exemples concrets qui illustrent ces concepts.
N'oubliez pas que la pratique régulière est essentielle pour maîtriser ces compétences.
Pour résumer, retenez ces trois points principaux:
1. La compréhension des fondamentaux
2. L'application pratique des connaissances
3. La révision régulière des concepts appris
Je vous remercie d'avoir suivi cette vidéo et n'hésitez pas à poser vos questions dans les commentaires.`;

            setTranscript(mockTranscript);
            setIsLoading(false);
            return mockTranscript;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue lors de la récupération de la transcription';
            setError(errorMessage);
            setIsLoading(false);
            return '';
        }
    };

    return {
        videoId,
        videoInfo,
        transcript,
        isLoading,
        error,
        embedUrl,
        validateYouTubeUrl,
        fetchTranscript
    };
};

export default useYouTube;