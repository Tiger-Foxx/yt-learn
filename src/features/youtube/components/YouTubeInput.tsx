import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useYouTube from '@/hooks/useYouTube';
import Loader from '@/components/layout/Loader';

interface YouTubeInputProps {
    onVideoValidated: (id: string, info: any) => void;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ onVideoValidated }) => {
    const [url, setUrl] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { validateYouTubeUrl, isLoading, error } = useYouTube();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowError(false);

        if (!url.trim()) {
            setErrorMessage('Veuillez entrer une URL YouTube');
            setShowError(true);
            return;
        }

        try {
            const result = await validateYouTubeUrl(url);

            if (result.isValid && result.videoId && result.videoInfo) {
                onVideoValidated(result.videoId, result.videoInfo);
            } else {
                setErrorMessage(result.error || 'URL YouTube invalide');
                setShowError(true);
            }
        } catch (err) {
            setErrorMessage('Une erreur est survenue lors de la validation de l\'URL');
            setShowError(true);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="youtube-url" className="block text-lg font-medium text-gray-900 dark:text-white mb-2">
                        URL de la vidéo YouTube
                    </label>
                    <div className="relative">
                        <input
                            id="youtube-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-red/30 transition duration-300"
                        />

                        <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-youtube-red via-red-500 to-red-300"
                            initial={{ width: 0 }}
                            animate={{ width: url ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {showError && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-red-500"
                        >
                            {errorMessage}
                        </motion.p>
                    )}

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Exemple: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                    </p>
                </div>

                <div className="flex justify-end">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-3 bg-youtube-red hover:bg-red-700 text-white rounded-lg flex items-center transition-colors ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.97 }}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader size="sm" variant="dots" color="white" className="mr-2" />
                                <span>Validation en cours...</span>
                            </div>
                        ) : (
                            <>
                                <span>Valider la vidéo</span>
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default YouTubeInput;