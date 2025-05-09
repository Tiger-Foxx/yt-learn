import { useState } from 'react';
import pdfService from '@/services/pdfService';

/**
 * Hook pour gérer les interactions avec les fichiers PDF
 */
function usePDF() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pdfInfo, setPdfInfo] = useState<{
        file: File;
        title: string;
    } | null>(null);

    /**
     * Charge et traite un fichier PDF
     */
    const loadPDF = async (file: File) => {
        try {
            setIsLoading(true);
            setError(null);

            // Valider le fichier
            if (!pdfService.validatePdfFile(file)) {
                throw new Error('Fichier PDF invalide');
            }

            // Extraire les informations de base (titre)
            const info = await pdfService.extractBasicInfo(file);

            // Stocker les informations pour utilisation ultérieure
            setPdfInfo({
                file,
                title: info.title,
            });

            return true;
        } catch (error) {
            console.error('Erreur lors du chargement du PDF:', error);
            setError(error instanceof Error ? error.message : 'Erreur lors du chargement du PDF');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        pdfInfo,
        loadPDF,
        isLoading,
        error,
    };
}

export default usePDF;