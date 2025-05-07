/**
 * Service pour manipuler et extraire du contenu à partir de fichiers PDF
 */

import * as pdfjs from 'pdfjs-dist';
import APP_CONFIG from '@/config/appConfig';

// Initialiser PDFJS Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfExtractionResult {
    success: boolean;
    text?: string;
    pageCount?: number;
    title?: string;
    error?: string;
}

class PDFService {
    /**
     * Charge un fichier PDF et extrait son contenu textuel
     */
    async extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
        // Vérifier la taille du fichier
        if (file.size > APP_CONFIG.limits.maxPdfSize) {
            return {
                success: false,
                error: `Le fichier est trop volumineux (max: ${APP_CONFIG.limits.maxPdfSize / (1024 * 1024)}MB)`
            };
        }

        try {
            // Convertir le fichier en ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            // Charger le document PDF
            const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const pageCount = pdfDocument.numPages;

            // Extraire le texte de chaque page
            const textContent: string[] = [];

            for (let i = 1; i <= pageCount; i++) {
                const page = await pdfDocument.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => 'str' in item ? item.str : '').join(' ');
                textContent.push(`--- Page ${i} ---\n${pageText}`);
            }

            // Récupérer des métadonnées (si disponibles)
            let title = file.name.replace(/\.pdf$/i, '');
            try {
                const metadata = await pdfDocument.getMetadata();
                if (metadata.info && metadata.info.Title) {
                    title = metadata.info.Title;
                }
            } catch (metadataError) {
                console.warn('Impossible d\'extraire les métadonnées du PDF:', metadataError);
            }

            return {
                success: true,
                text: textContent.join('\n\n'),
                pageCount: pageCount,
                title: title
            };
        } catch (error) {
            console.error('Erreur lors de l\'extraction du texte du PDF:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur lors du traitement du PDF'
            };
        }
    }

    /**
     * Génère une miniature du PDF à partir de la première page
     */
    async generatePdfThumbnail(file: File, width: number = 200): Promise<string | null> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            // Récupérer la première page
            const page = await pdfDocument.getPage(1);

            // Calculer les dimensions proportionnelles
            const viewport = page.getViewport({ scale: 1 });
            const scale = width / viewport.width;
            const scaledViewport = page.getViewport({ scale });

            // Créer un canvas pour le rendu
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            if (!context) {
                throw new Error('Impossible de créer le contexte canvas');
            }

            // Rendre la page sur le canvas
            await page.render({
                canvasContext: context,
                viewport: scaledViewport
            }).promise;

            // Convertir le canvas en image data URL
            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Erreur lors de la génération de la miniature:', error);
            return null;
        }
    }

    /**
     * Extraire le texte d'une plage de pages spécifique
     */
    async extractTextFromPageRange(file: File, startPage: number, endPage: number): Promise<PdfExtractionResult> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const pageCount = pdfDocument.numPages;

            // Valider les limites de pages
            const actualStartPage = Math.max(1, startPage);
            const actualEndPage = Math.min(pageCount, endPage);

            if (actualStartPage > actualEndPage) {
                return {
                    success: false,
                    error: 'Plage de pages non valide'
                };
            }

            // Extraire le texte des pages sélectionnées
            const textContent: string[] = [];

            for (let i = actualStartPage; i <= actualEndPage; i++) {
                const page = await pdfDocument.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => 'str' in item ? item.str : '').join(' ');
                textContent.push(`--- Page ${i} ---\n${pageText}`);
            }

            return {
                success: true,
                text: textContent.join('\n\n'),
                pageCount: (actualEndPage - actualStartPage) + 1
            };
        } catch (error) {
            console.error('Erreur lors de l\'extraction du texte des pages:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur lors du traitement du PDF'
            };
        }
    }

    /**
     * Valide qu'un fichier est bien un PDF
     */
    validatePdfFile(file: File): boolean {
        // Vérifier le type MIME
        if (file.type !== 'application/pdf') {
            return false;
        }

        // Vérifier l'extension du fichier
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.pdf')) {
            return false;
        }

        // Vérifier la taille
        if (file.size > APP_CONFIG.limits.maxPdfSize || file.size <= 0) {
            return false;
        }

        return true;
    }
}

export default new PDFService();