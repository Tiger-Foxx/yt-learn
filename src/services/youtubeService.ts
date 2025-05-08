import axios from 'axios';

interface VideoInfo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    duration?: string;
    publishedAt?: string;
}

class YouTubeService {
    /**
     * Parse une URL YouTube pour en extraire l'ID de la vidéo
     */
    parseYouTubeUrl(url: string): string | null {
        try {
            // Formats d'URL YouTube possibles:
            // - youtube.com/watch?v=VIDEO_ID
            // - youtu.be/VIDEO_ID
            // - youtube.com/embed/VIDEO_ID
            // - youtube.com/v/VIDEO_ID

            let videoId = null;

            // Vérifier si l'URL est valide
            try {
                const urlObj = new URL(url);

                // Format standard: youtube.com/watch?v=ID
                if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
                    videoId = urlObj.searchParams.get('v');
                }
                // Format court: youtu.be/ID
                else if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.substring(1);
                }
                // Format embed: youtube.com/embed/ID
                else if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
                    videoId = urlObj.pathname.split('/embed/')[1];
                }
                // Format v: youtube.com/v/ID
                else if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/v/')) {
                    videoId = urlObj.pathname.split('/v/')[1];
                }
            } catch (e) {
                // L'URL n'est pas valide
                return null;
            }

            // Nettoyage de l'ID de la vidéo
            if (videoId) {
                // Supprimer tout ce qui suit & ou #
                const cleanId = videoId.split('&')[0].split('#')[0];

                // Vérifier que l'ID a une longueur valide (généralement 11 caractères)
                if (cleanId && cleanId.length > 8) {
                    return cleanId;
                }
            }

            return null;
        } catch (error) {
            console.error("Erreur lors de l'analyse de l'URL YouTube:", error);
            return null;
        }
    }

    /**
     * Récupère les informations d'une vidéo YouTube via l'API oEmbed
     */
    async getVideoInfo(url: string): Promise<VideoInfo | null> {
        try {
            const videoId = this.parseYouTubeUrl(url);

            if (!videoId) {
                throw new Error('URL YouTube invalide');
            }

            // Utiliser noembed.com qui ne nécessite pas de clé API
            const response = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);

            if (response.status !== 200 || response.data.error) {
                throw new Error('Impossible de récupérer les informations de la vidéo');
            }

            return {
                id: videoId,
                title: response.data.title || 'Vidéo sans titre',
                channelTitle: response.data.author_name || 'Chaîne inconnue',
                thumbnailUrl: response.data.thumbnail_url || '',
                publishedAt: response.data.upload_date || undefined
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de la vidéo:', error);
            return null;
        }
    }

    /**
     * Génère l'URL d'embed pour une vidéo YouTube
     */
    getEmbedUrl(videoId: string, autoplay: boolean = false): string {
        return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&rel=0`;
    }
}

export default new YouTubeService();