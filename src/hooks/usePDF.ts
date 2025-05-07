import { useState } from 'react';
import pdfService from '@/services/pdfService';
import APP_CONFIG from '@/config/appConfig';

/**
 * Hook personnalisé pour gérer les opérations liées aux fichiers PDF
 */
function usePDF() {
    // État du PDF actuel
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    // États pour la gestion des erreurs et du chargement
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isTooLarge, setIsTooLarge] = useState<boolean>(false);

    /**
     * Valide un fichier PDF (type, taille)
     */
    const validateFile = (fileToCheck: File): boolean => {
        setError(null);

        // Vérifier le type de fichier
        if (!pdfService.validatePdfFile(fileToCheck)) {
            setError('Le fichier doit être un PDF valide');
            return false;
        }

        // Vérifier la taille du fichier
        if (fileToCheck.size > APP_CONFIG.limits.maxPdfSize) {
            setError(`Le fichier est trop volumineux (max: ${APP_CONFIG.limits.maxPdfSize / (1024 * 1024)}MB)`);
            setIsTooLarge(true);
            return false;
        }

        setIsTooLarge(false);
        return true;
    };

    /**
     * Charge et traite un fichier PDF
     */
    const loadPDF = async (fileToLoad: File): Promise<boolean> => {
        // Valider le fichier
        if (!validateFile(fileToLoad)) {
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Extraire le texte du PDF
            const extractionResult = await pdfService.extractTextFromPdf(fileToLoad);

            if (!extractionResult.success) {
                throw new Error(extractionResult.error || 'Échec de l\'extraction du texte');
            }

            // Mettre à jour les états avec les informations extraites
            setFile(fileToLoad);
            setText(extractionResult.text || null);
            setPageCount(extractionResult.pageCount || 0);
            setTitle(extractionResult.title || fileToLoad.name);

            // Générer une miniature
            const thumbnailDataUrl = await pdfService.generatePdfThumbnail(fileToLoad);
            setThumbnail(thumbnailDataUrl);

            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erreur lors du traitement du PDF');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Extrait le texte d'une plage de pages spécifique
     */
    const extractPageRange = async (startPage: number, endPage: number): Promise<string | null> => {
        if (!file) {
            setError('Aucun fichier PDF chargé');
            return null;
        }

        setIsLoading(true);

        try {
            const extractionResult = await pdfService.extractTextFromPageRange(file, startPage, endPage);

            if (!extractionResult.success) {
                throw new Error(extractionResult.error || 'Échec de l\'extraction des pages');
            }

            return extractionResult.text || null;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erreur lors de l\'extraction des pages');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Réinitialise tous les états du hook
     */
    const reset = () => {
        setFile(null);
        setText(null);
        setPageCount(0);
        setTitle('');
        setThumbnail(null);
        setError(null);
        setIsLoading(false);
        setIsTooLarge(false);
    };

    return {
        // États
        file,
        text,
        pageCount,
        title,
        thumbnail,
        isLoading,
        error,
        isTooLarge,

        // Actions
        validateFile,
        loadPDF,
        extractPageRange,
        reset
    };
}

export default usePDF;