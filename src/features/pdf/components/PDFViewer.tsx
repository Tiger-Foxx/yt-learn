import React, { useState } from 'react';
import Loader from '@/components/layout/Loader';
import Button from '@/components/ui/Button';

interface PDFViewerProps {
    url?: string;
    file?: File;
    title?: string;
    pageCount?: number;
    className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
                                                 url,
                                                 file,
                                                 title,
                                                 pageCount = 0,
                                                 className = ''
                                             }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Generate PDF object URL from File if provided
    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (file && !url) {
            const newUrl = URL.createObjectURL(file);
            setObjectUrl(newUrl);

            return () => {
                URL.revokeObjectURL(newUrl);
            };
        }
    }, [file, url]);

    const pdfUrl = url || objectUrl;

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, pageCount));
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]" title={title}>
            {title || 'Document PDF'}
          </span>
                </div>

                {pageCount > 0 && (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} / {pageCount}
            </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === pageCount}
                            className={`p-1 rounded-full ${currentPage === pageCount ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* PDF Content */}
            <div className="h-[500px] relative">
                {pdfUrl ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
                                <Loader size="md" label="Chargement du PDF..." />
                            </div>
                        )}

                        <iframe
                            src={`${pdfUrl}#page=${currentPage}`}
                            className="w-full h-full border-0"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setError("Impossible de charger le PDF. Le fichier est peut-être corrompu ou inaccessible.");
                            }}
                            title="PDF Viewer"
                        />

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
                                <div className="text-center p-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => window.open(pdfUrl, '_blank')}
                                    >
                                        Ouvrir dans un nouvel onglet
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                        <p className="text-gray-500 dark:text-gray-400">
                            Aucun document PDF à afficher
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;