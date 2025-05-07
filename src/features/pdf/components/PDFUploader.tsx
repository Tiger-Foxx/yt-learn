import React, { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import APP_CONFIG from '@/config/appConfig';
import usePDF from "@/hooks/usePDF.ts";

interface PDFUploaderProps {
    onPDFUploaded: (text: string, title: string, pageCount: number) => void;
    className?: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({
                                                     onPDFUploaded,
                                                     className = ''
                                                 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const {
        file,
        text,
        title,
        pageCount,
        thumbnail,
        isLoading,
        error,
        isTooLarge,
        loadPDF,
        validateFile
    } = usePDF();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const pdfFile = e.target.files[0];
            if (validateFile(pdfFile)) {
                const success = await loadPDF(pdfFile);
                if (success && text) {
                    onPDFUploaded(text, title || pdfFile.name, pageCount);
                }
            }
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const pdfFile = e.dataTransfer.files[0];
            if (validateFile(pdfFile)) {
                const success = await loadPDF(pdfFile);
                if (success && text) {
                    onPDFUploaded(text, title || pdfFile.name, pageCount);
                }
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Format file size for display
    const formatFileSize = (sizeInBytes: number): string => {
        if (sizeInBytes < 1024) {
            return `${sizeInBytes} B`;
        } else if (sizeInBytes < 1048576) {
            return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        } else {
            return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
        }
    };

    const maxSizeMB = APP_CONFIG.limits.maxPdfSize / (1024 * 1024);

    return (
        <div className={`${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
            />

            <div
                className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'}
          ${isLoading ? 'bg-gray-100 dark:bg-gray-800 opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        `}
                onClick={handleButtonClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-gray-700 dark:text-gray-300">Traitement du PDF en cours...</p>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">{title || file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{formatFileSize(file.size)} • {pageCount} pages</p>
                        <Button
                            variant="tertiary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                fileInputRef.current?.click();
                            }}
                        >
                            Changer de fichier
                        </Button>
                    </div>
                ) : (
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            Importer un fichier PDF
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Glissez et déposez ou cliquez pour sélectionner un fichier
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            PDF uniquement (max. {maxSizeMB} MB)
                        </p>
                    </div>
                )}
            </div>

            {error && !isTooLarge && (
                <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm dark:bg-red-900/30 dark:text-red-200">
                    {error}
                </div>
            )}

            {isTooLarge && (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 text-sm dark:bg-yellow-900/30 dark:text-yellow-200">
                    Ce fichier dépasse la taille maximale autorisée de {maxSizeMB} MB.
                </div>
            )}
        </div>
    );
};

export default PDFUploader;