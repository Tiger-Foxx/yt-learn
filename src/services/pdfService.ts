import * as pdfjs from 'pdfjs-dist';

// Configuration pour utiliser le worker de PDF.js correctement
// Une approche solide qui fonctionne en développement et production
let pdfjsWorker: any;

// Fonction d'initialisation du worker
const initializeWorker = async () => {
    if (!pdfjsWorker) {
        try {
            // Charger le worker dynamiquement
            pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');

            // Créer une URL de blob pour le worker
            const workerBlob = new Blob(
                [`importScripts("${window.location.origin}/pdf.worker.js");`],
                { type: 'application/javascript' }
            );

            // Assigner l'URL du blob comme worker source
            pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);

            console.log("Worker PDF.js initialisé avec succès");
            return true;
        } catch (error) {
            console.error("Échec de l'initialisation du worker PDF.js:", error);

            // Fallback: utiliser le mode sans worker
            console.warn("Utilisation du mode sans worker (moins performant)");
            pdfjs.GlobalWorkerOptions.workerSrc = '';
            return false;
        }
    }
    return true;
};

// Initialiser le worker immédiatement
initializeWorker();

/**
 * Service pour manipuler et extraire du contenu à partir de fichiers PDF
 * Version simplifiée et robuste qui fonctionne même sans worker
 */
class PDFService {
    /**
     * Valide qu'un fichier est bien un PDF
     */
    validatePdfFile(file: File): boolean {
        if (!file) return false;

        // Vérifier le type MIME
        if (file.type !== 'application/pdf') {
            return false;
        }

        // Vérifier l'extension du fichier
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.pdf')) {
            return false;
        }

        // Vérifier la taille (10MB par défaut)
        const maxSizeInBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeInBytes || file.size <= 0) {
            return false;
        }

        return true;
    }

    /**
     * Extrait les métadonnées et le texte du PDF en une seule opération
     */
    async processPdf(file: File): Promise<{
        title: string;
        pageCount: number;
        text: string;
        thumbnail: string | null;
    }> {
        if (!this.validatePdfFile(file)) {
            throw new Error("Fichier PDF invalide");
        }

        try {
            // Lire le fichier comme ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);

            // Préparer les objets par défaut en cas d'erreur
            const defaultTitle = file.name.replace(/\.pdf$/i, '');
            const defaultThumbnail = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOHB4IiBmaWxsPSIjOTk5Ij5QREYgRG9jdW1lbnQ8L3RleHQ+PC9zdmc+';

            try {
                // Charger le PDF en mode désactivant la validation stricte des fonctionnalités
                const loadingTask = pdfjs.getDocument({
                    data: arrayBuffer,
                    disableStream: true,
                    disableAutoFetch: true,
                    disableRange: true,
                });

                // Obtenir le document PDF
                const pdfDocument = await loadingTask.promise;

                // Extraire les métadonnées
                let title = defaultTitle;
                try {
                    const metadata = await pdfDocument.getMetadata();
                    if (metadata.info && metadata.info.Title) {
                        title = metadata.info.Title;
                    }
                } catch (metadataError) {
                    console.warn("Impossible d'extraire les métadonnées:", metadataError);
                }

                // Extraire le texte des premières pages
                let fullText = '';
                try {
                    const maxPages = Math.min(pdfDocument.numPages, 15); // Limiter à 15 pages pour la performance
                    for (let i = 1; i <= maxPages; i++) {
                        try {
                            const page = await pdfDocument.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map((item: any) => item.str).join(' ');
                            fullText += `[Page ${i}]\n${pageText}\n\n`;

                            // Si c'est la première page, créer une miniature
                            if (i === 1) {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const viewport = page.getViewport({ scale: 1 });
                                    const scale = 200 / viewport.width; // Width = 200px
                                    const scaledViewport = page.getViewport({ scale });

                                    canvas.width = scaledViewport.width;
                                    canvas.height = scaledViewport.height;

                                    const context = canvas.getContext('2d');
                                    if (context) {
                                        await page.render({
                                            canvasContext: context,
                                            viewport: scaledViewport
                                        }).promise;

                                        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
                                        return {
                                            title,
                                            pageCount: pdfDocument.numPages,
                                            text: fullText || "Texte non disponible",
                                            thumbnail
                                        };
                                    }
                                } catch (thumbnailError) {
                                    console.warn("Impossible de créer la miniature:", thumbnailError);
                                }
                            }
                        } catch (pageError) {
                            console.warn(`Erreur lors du traitement de la page ${i}:`, pageError);
                            fullText += `[Page ${i} - Non extractible]\n\n`;
                        }
                    }
                } catch (textError) {
                    console.warn("Impossible d'extraire le texte:", textError);
                }

                return {
                    title,
                    pageCount: pdfDocument.numPages,
                    text: fullText || "Texte non disponible",
                    thumbnail: defaultThumbnail
                };

            } catch (pdfError) {
                console.error("Erreur lors du traitement du PDF:", pdfError);

                // Fallback avec extraction de texte brute (plus simple)
                const text = await this.extractTextBruteForce(file);

                return {
                    title: defaultTitle,
                    pageCount: 1,
                    text: text || "Impossible d'extraire le texte de ce PDF.",
                    thumbnail: defaultThumbnail
                };
            }

        } catch (error) {
            console.error("Erreur critique lors du traitement du PDF:", error);
            throw new Error("Impossible de traiter le PDF");
        }
    }

    /**
     * Méthode de secours pour extraire le texte d'un PDF
     * sans utiliser le worker (moins fiable mais fonctionne dans plus de cas)
     */
    private async extractTextBruteForce(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Extraction brutale de texte
                const extractedText = result
                        ?.replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Supprimer caractères de contrôle
                        ?.match(/\/([\w])[^\n\r]*[\n\r]+/g) // Trouver les lignes qui semblent contenir du texte
                        ?.join(' ')
                        ?.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ') // Garder uniquement les caractères imprimables
                        ?.replace(/\s+/g, ' ') // Normaliser les espaces
                    || "Impossible d'extraire le texte de ce PDF.";

                resolve(extractedText);
            };
            reader.onerror = () => {
                resolve("Erreur lors de la lecture du fichier PDF.");
            };
            reader.readAsText(file);
        });
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