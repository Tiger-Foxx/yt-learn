import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import usePDF from '@/hooks/usePDF';
import APP_CONFIG from '@/config/appConfig';

interface PDFUploaderProps {
    onPDFUploaded: (text: string, title: string, pageCount: number) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFUploaded }) => {
    const { loadPDF, pdfInfo, isLoading, error } = usePDF();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLocalError(null);

            try {
                const success = await loadPDF(file);

                if (success && pdfInfo && pdfInfo.text) {
                    onPDFUploaded(pdfInfo.text, pdfInfo.title, pdfInfo.pageCount);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du PDF:", error);
                setLocalError("Une erreur est survenue lors du chargement du PDF.");
            }
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setLocalError(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            try {
                const success = await loadPDF(file);

                if (success && pdfInfo && pdfInfo.text) {
                    onPDFUploaded(pdfInfo.text, pdfInfo.title, pdfInfo.pageCount);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du PDF:", error);
                setLocalError("Une erreur est survenue lors du chargement du PDF.");
            }
        }
    };

    return (
        <div>
            <div
                className={`border-2 border-dashed ${
                    isDragging
                        ? 'border-youtube-red bg-youtube-red/10'
                        : error || localError
                            ? 'border-red-500 bg-red-500/5'
                            : pdfInfo
                                ? 'border-green-500 bg-green-500/5'
                                : 'border-gray-700'
                } rounded-xl p-8 transition-all duration-300 text-center h-64 flex flex-col justify-center items-center`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                />

                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="w-10 h-10 border-2 border-t-youtube-red border-r-youtube-red border-b-transparent border-l-transparent rounded-full mb-3"
                        />
                        <span className="text-gray-400">Analyse du document en cours...</span>
                    </div>
                ) : pdfInfo ? (
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-2"
                        >
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </motion.div>

                        <h3 className="text-lg font-medium text-white mb-1">{pdfInfo.title}</h3>
                        <p className="text-gray-400 mb-1">{pdfInfo.pageCount} pages • {(pdfInfo.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-green-400 font-medium">Document prêt à utiliser</p>
                    </div>
                ) : (
                    <>
                        <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>

                        <h3 className="text-lg font-medium text-white mb-2">
                            {isDragging ? 'Déposez votre document ici' : 'Glissez-déposez votre PDF ici'}
                        </h3>
                        <p className="text-gray-400 mb-2">ou cliquez pour sélectionner un fichier</p>
                        <p className="text-xs text-gray-500">Format accepté: PDF (max. {Math.round(APP_CONFIG.limits.maxPdfSize / (1024 * 1024))}MB)</p>

                        {(error || localError) && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 mt-2 p-2 bg-red-500/10 rounded-md"
                            >
                                {error || localError}
                            </motion.p>
                        )}
                    </>
                )}
            </div>

            {pdfInfo && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-end"
                >
                    <button
                        className="px-4 py-2 bg-youtube-red hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                        onClick={() => {
                            if (pdfInfo && pdfInfo.text) {
                                onPDFUploaded(pdfInfo.text, pdfInfo.title, pdfInfo.pageCount);
                            }
                        }}
                    >
                        Continuer avec ce document
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default PDFUploader;