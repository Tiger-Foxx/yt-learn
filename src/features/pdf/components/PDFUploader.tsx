import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import pdfService from '@/services/pdfService';

interface PDFUploaderProps {
    onPDFUploaded: (text: string, title: string, pageCount: number) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFUploaded }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pdfInfo, setPdfInfo] = useState<{
        title: string;
        pageCount: number;
        text: string;
        thumbnail: string | null;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setFile(null);
        setPdfInfo(null);
        setError(null);
    };

    const handleProcessPdf = async (selectedFile: File) => {
        try {
            setIsLoading(true);
            setError(null);

            // Valider le fichier
            if (!pdfService.validatePdfFile(selectedFile)) {
                throw new Error("Le fichier doit être un PDF valide (maximum 10MB)");
            }

            // Traiter le PDF
            const processedPdf = await pdfService.processPdf(selectedFile);
            setPdfInfo(processedPdf);

            // Appeler le callback parent avec les données
            onPDFUploaded(
                processedPdf.text,
                processedPdf.title,
                processedPdf.pageCount
            );

            return true;
        } catch (error) {
            console.error("Erreur lors du traitement du PDF:", error);
            setError(error instanceof Error ? error.message : "Erreur lors du traitement du PDF");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        resetState();

        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            await handleProcessPdf(selectedFile);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        resetState();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            await handleProcessPdf(droppedFile);
        }
    };

    return (
        <div>
            <div
                className={`border-2 border-dashed ${
                    isDragging
                        ? 'border-youtube-red bg-youtube-red/10'
                        : error
                            ? 'border-red-500 bg-red-500/5'
                            : file && pdfInfo
                                ? 'border-green-500 bg-green-500/5'
                                : 'border-gray-700'
                } rounded-xl p-8 transition-all duration-300 text-center min-h-[200px] flex flex-col justify-center items-center`}
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
                ) : file && pdfInfo ? (
                    <div className="flex flex-col items-center">
                        {pdfInfo.thumbnail && (
                            <div className="w-32 h-40 bg-gray-800 rounded-md overflow-hidden mb-3 flex items-center justify-center">
                                <img
                                    src={pdfInfo.thumbnail}
                                    alt="Aperçu PDF"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        <h3 className="text-lg font-medium text-white mb-1">{pdfInfo.title}</h3>
                        <p className="text-gray-400 mb-1">{pdfInfo.pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
                        <p className="text-xs text-gray-500">Format accepté: PDF (max. 10MB)</p>
                    </>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm max-w-md mx-auto"
                    >
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                        <button
                            className="mt-2 text-white bg-red-500/30 hover:bg-red-500/50 px-3 py-1 rounded text-xs font-medium w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                resetState();
                            }}
                        >
                            Réessayer
                        </button>
                    </motion.div>
                )}
            </div>

            {file && pdfInfo && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-end"
                >
                    <button
                        className="px-4 py-2 bg-youtube-red hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (pdfInfo) {
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