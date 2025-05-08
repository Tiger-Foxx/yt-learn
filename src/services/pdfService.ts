import * as pdfjs from 'pdfjs-dist';
import APP_CONFIG from '@/config/appConfig';

// Initialiser PDFJS Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Service pour manipuler et extraire du contenu à partir de fichiers PDF
 */
class PDFService {
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
     * Extrait les métadonnées basiques d'un PDF
     */
    async extractPdfMetadata(file: File): Promise<{ pageCount: number, title: string }> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            // Obtenir le nombre de pages
            const pageCount = pdfDocument.numPages;

            // Tenter d'obtenir le titre depuis les métadonnées
            let title = file.name.replace(/\.pdf$/i, '');
            try {
                const metadata = await pdfDocument.getMetadata();
                if (metadata.info && metadata.info.Title) {
                    title = metadata.info.Title;
                }
            } catch (metadataError) {
                console.warn("Impossible d'extraire les métadonnées du PDF:", metadataError);
            }

            return { pageCount, title };
        } catch (error) {
            console.error("Erreur lors de l'extraction des métadonnées:", error);
            return { pageCount: 0, title: file.name.replace(/\.pdf$/i, '') };
        }
    }
}

export default new PDFService();