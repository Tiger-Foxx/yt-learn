import * as pdfjs from 'pdfjs-dist';
import APP_CONFIG from '@/config/appConfig';

// Configuration du chemin du worker avec une copie locale
// Note: Vous devrez ajouter ce fichier à votre dossier public ou le configurer avec Webpack/Vite
const pdfjsWorkerPath = '/pdf.worker.min.js';

// Initialiser PDFJS Worker avec un chemin relatif
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerPath;

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
            console.warn(`Type de fichier invalide: ${file.type}`);
            return false;
        }

        // Vérifier l'extension du fichier
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.pdf')) {
            console.warn(`Extension de fichier invalide: ${fileName}`);
            return false;
        }

        // Vérifier la taille
        const maxSizeInBytes = APP_CONFIG.limits.maxPdfSize || 10 * 1024 * 1024; // 10MB par défaut
        if (file.size > maxSizeInBytes || file.size <= 0) {
            console.warn(`Taille de fichier invalide: ${file.size} bytes (max: ${maxSizeInBytes} bytes)`);
            return false;
        }

        return true;
    }

    /**
     * Génère une miniature du PDF à partir de la première page
     */
    async generatePdfThumbnail(file: File, width: number = 200): Promise<string | null> {
        try {
            // Convertir le fichier en ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);

            // Charger le document PDF
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdfDocument = await loadingTask.promise;

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
            // Convertir le fichier en ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);

            // Charger le document PDF
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdfDocument = await loadingTask.promise;

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

    /**
     * Extrait le texte d'un PDF
     */
    async extractTextFromPdf(file: File): Promise<string> {
        try {
            // Convertir le fichier en ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);

            // Charger le document PDF
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdfDocument = await loadingTask.promise;

            // Extraire le texte de toutes les pages
            let fullText = '';
            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map((item: any) => item.str).join(' ');
                fullText += textItems + '\n\n';
            }

            return fullText;
        } catch (error) {
            console.error("Erreur lors de l'extraction du texte:", error);
            return '';
        }
    }

    /**
     * Convertit un fichier en ArrayBuffer
     * @private
     */
    private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error("Le résultat n'est pas un ArrayBuffer"));
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
}

export default new PDFService();