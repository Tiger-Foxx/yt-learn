import { useState } from 'react';
import pdfService from '@/services/pdfService';
import APP_CONFIG from '@/config/appConfig';

export interface PDFInfo {
    file: File;
    title: string;
    pageCount: number;
    thumbnail: string | null;
    text?: string; // Ajout du texte extrait
}

/**
 * Hook pour gérer les opérations liées aux fichiers PDF
 */
function usePDF() {
    // État du PDF actuel
    const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);

    // États pour la gestion des erreurs et du chargement
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Valide et charge un fichier PDF
     */
    const loadPDF = async (file: File): Promise<boolean> => {
        if (!file) {
            setError('Aucun fichier fourni');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Valider le type et la taille du fichier
            const isValidPdf = pdfService.validatePdfFile(file);
            if (!isValidPdf) {
                setError(`Le fichier doit être un PDF valide de moins de ${Math.round(APP_CONFIG.limits.maxPdfSize / (1024 * 1024))}MB`);
                setIsLoading(false);
                return false;
            }

            // Extraire les métadonnées
            const { title, pageCount } = await pdfService.extractPdfMetadata(file);

            // Extraire le texte
            const text = await pdfService.extractTextFromPdf(file);

            // Générer une miniature
            const thumbnail = await pdfService.generatePdfThumbnail(file);

            // Mettre à jour l'état avec les informations du PDF
            setPdfInfo({
                file,
                title,
                pageCount,
                thumbnail,
                text
            });

            setIsLoading(false);
            return true;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Une erreur est survenue lors du traitement du PDF';
            console.error(errorMessage);
            setError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    /**
     * Réinitialise l'état du PDF
     */
    const reset = () => {
        setPdfInfo(null);
        setError(null);
    };

    return {
        pdfInfo,
        isLoading,
        error,
        loadPDF,
        reset
    };
}

export default usePDF;