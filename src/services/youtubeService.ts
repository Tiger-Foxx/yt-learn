import APP_CONFIG from '@/config/appConfig';

/**
 * Types pour le service YouTube
 */
interface YoutubeVideoInfo {
    id: string;
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
        default: string;
        medium: string;
        high: string;
        standard?: string;
        maxres?: string;
    };
    duration?: string; // Durée formatée (ex: "10:30")
    durationInSeconds?: number;
    viewCount?: string;
}

interface YouTubeTranscriptSegment {
    text: string;
    start: number;
    duration: number;
}

interface TranscriptResult {
    success: boolean;
    transcript?: string;
    segments?: YouTubeTranscriptSegment[];
    error?: string;
}

interface ValidationResult {
    isValid: boolean;
    id?: string;
    error?: string;
}

/**
 * Service pour interagir avec les vidéos YouTube
 */
class YouTubeService {
    private embedBaseUrl: string;

    constructor() {
        this.embedBaseUrl = APP_CONFIG.api.youtube.embedBaseUrl;
    }

    /**
     * Valide une URL YouTube et extrait l'ID de la vidéo
     */
    validateYouTubeUrl(url: string): ValidationResult {
        if (!url || typeof url !== 'string') {
            return {
                isValid: false,
                error: 'URL non valide'
            };
        }

        try {
            // Expressions régulières pour extraire l'ID vidéo YouTube depuis différents formats d'URL
            const patterns = [
                // youtu.be/ID
                /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
                // youtube.com/watch?v=ID
                /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=([a-zA-Z0-9_-]{11}))(?:\S+)?$/,
                // youtube.com/v/ID
                /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\S+)?$/,
                // youtube.com/embed/ID
                /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\S+)?$/
            ];

            // Tester chaque pattern pour extraire l'ID
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    return {
                        isValid: true,
                        id: match[1]
                    };
                }
            }

            return {
                isValid: false,
                error: 'Format d\'URL YouTube non reconnu'
            };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Erreur lors de la validation de l\'URL'
            };
        }
    }

    /**
     * Obtient l'URL d'intégration pour une vidéo YouTube
     */
    getEmbedUrl(urlOrId: string, autoplay: boolean = false): string {
        const validation = this.validateYouTubeUrl(urlOrId);
        const videoId = validation.isValid ? validation.id : urlOrId.length === 11 ? urlOrId : '';

        if (!videoId) {
            console.error('ID vidéo YouTube non valide');
            return '';
        }

        const params = autoplay ? '?autoplay=1' : '';
        return `${this.embedBaseUrl}${videoId}${params}`;
    }

    /**
     * Récupère les informations d'une vidéo YouTube via l'API oEmbed
     */
    async getVideoInfo(urlOrId: string): Promise<YoutubeVideoInfo | null> {
        try {
            // Valider et extraire l'ID vidéo
            const validation = this.validateYouTubeUrl(urlOrId);
            const videoId = validation.isValid ? validation.id : urlOrId.length === 11 ? urlOrId : '';

            if (!videoId) {
                console.error('ID vidéo YouTube non valide');
                return null;
            }

            // Utiliser l'API oEmbed de YouTube pour récupérer les informations basiques
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await fetch(oEmbedUrl);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des infos vidéo: ${response.status}`);
            }

            const data = await response.json();

            // Construire l'objet d'information de la vidéo
            const videoInfo: YoutubeVideoInfo = {
                id: videoId,
                title: data.title || 'Titre non disponible',
                description: '', // Non disponible via oEmbed
                channelTitle: data.author_name || 'Chaîne inconnue',
                publishedAt: '', // Non disponible via oEmbed
                thumbnails: {
                    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                }
            };

            return videoInfo;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de la vidéo:', error);
            return null;
        }
    }

    /**
     * Tente de récupérer la transcription d'une vidéo YouTube
     * Note: Cette fonction utilise une API non officielle et pourrait ne pas fonctionner pour toutes les vidéos
     */
    async getVideoTranscript(urlOrId: string, lang: string = 'fr'): Promise<TranscriptResult> {
        try {
            // Valider et extraire l'ID vidéo
            const validation = this.validateYouTubeUrl(urlOrId);
            const videoId = validation.isValid ? validation.id : urlOrId.length === 11 ? urlOrId : '';

            if (!videoId) {
                return {
                    success: false,
                    error: 'ID vidéo YouTube non valide'
                };
            }

            // Pour récupérer la transcription, nous utilisons un service proxy externe
            // Note: Dans une application de production, il est recommandé d'implémenter votre propre service backend
            const transcriptUrl = `https://yt-transcript-proxy.vercel.app/api/transcript?videoId=${videoId}&lang=${lang}`;

            const response = await fetch(transcriptUrl);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération de la transcription: ${response.status}`);
            }

            const data = await response.json();

            if (!data.transcript) {
                return {
                    success: false,
                    error: 'Aucune transcription disponible pour cette vidéo'
                };
            }

            // Formater la transcription en texte continu
            const fullTranscript = data.transcript.map((segment: any) => segment.text).join(' ');

            return {
                success: true,
                transcript: fullTranscript,
                segments: data.transcript
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de la transcription:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur lors de la récupération de la transcription'
            };
        }
    }

    /**
     * Génère une miniature HTML pour une vidéo YouTube avec overlay de lecture
     */
    generateThumbnailHTML(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;

        return `
      <div class="youtube-thumbnail" style="position: relative; width: 100%; padding-bottom: 56.25%; border-radius: 8px; overflow: hidden; cursor: pointer;">
        <img 
          src="${thumbnailUrl}" 
          alt="Miniature YouTube" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
          loading="lazy"
        />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255, 0, 0, 0.8); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white"/>
          </svg>
        </div>
      </div>
    `;
    }

    /**
     * Extrait des mots-clés d'une vidéo YouTube à partir de son titre et de sa description
     */
    extractKeywords(title: string, description: string = ''): string[] {
        // Combinaison du titre et de la description
        const text = `${title} ${description}`;

        // Mots à exclure (articles, prépositions, etc.)
        const stopWords = [
            'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'ce', 'ces', 'cette',
            'au', 'aux', 'en', 'dans', 'sur', 'avec', 'pour', 'par', 'et', 'ou',
            'à', 'qui', 'que', 'quoi', 'dont', 'comment', 'pourquoi', 'car'
        ];

        // Nettoyer le texte et extraire les mots
        const words = text.toLowerCase()
            .replace(/[^\wéèêëàâäôöùûüÿçœ\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));

        // Compter la fréquence des mots
        const wordFrequency: { [key: string]: number } = {};
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        // Trier les mots par fréquence
        const sortedWords = Object.keys(wordFrequency).sort((a, b) => {
            return wordFrequency[b] - wordFrequency[a];
        });

        // Retourner les X mots les plus fréquents
        return sortedWords.slice(0, 10);
    }
}

export default new YouTubeService();