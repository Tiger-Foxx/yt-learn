import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface TranscriptViewerProps {
    transcript: string;
    isLoading?: boolean;
    error?: string | null;
    onFetchTranscript?: () => void;
    className?: string;
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
                                                               transcript,
                                                               isLoading = false,
                                                               error = null,
                                                               onFetchTranscript,
                                                               className = ''
                                                           }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formattedTranscript = transcript?.split('\n').filter(Boolean);
    const previewLength = 5;

    return (
        <Card
            title="Transcription"
            className={`${className}`}
        >
            {error ? (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-200">
                    <p>{error}</p>
                    {onFetchTranscript && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onFetchTranscript}
                            className="mt-2"
                        >
                            Réessayer
                        </Button>
                    )}
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-36"></div>
                        <span className="sr-only">Chargement...</span>
                    </div>
                </div>
            ) : transcript ? (
                <div className="space-y-2">
                    <div className="text-gray-700 dark:text-gray-300">
                        {isExpanded
                            ? formattedTranscript.map((paragraph, i) => (
                                <p key={i} className="mb-2">{paragraph}</p>
                            ))
                            : formattedTranscript.slice(0, previewLength).map((paragraph, i) => (
                                <p key={i} className="mb-2">{paragraph}</p>
                            ))
                        }

                        {!isExpanded && formattedTranscript.length > previewLength && (
                            <p className="text-gray-500 italic">
                                {formattedTranscript.length - previewLength} paragraphes supplémentaires...
                            </p>
                        )}
                    </div>

                    {formattedTranscript.length > previewLength && (
                        <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Afficher moins' : 'Afficher tout'}
                        </Button>
                    )}
                </div>
            ) : onFetchTranscript ? (
                <div className="text-center py-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        La transcription n'est pas encore chargée.
                    </p>
                    <Button
                        variant="primary"
                        onClick={onFetchTranscript}
                        isLoading={isLoading}
                    >
                        Récupérer la transcription
                    </Button>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    Aucune transcription disponible pour cette vidéo.
                </p>
            )}
        </Card>
    );
};

export default TranscriptViewer;