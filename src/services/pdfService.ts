/**
 * Service simplifié pour manipuler les fichiers PDF
 * Validant seulement le fichier, puisque Gemini traite le PDF directement
 */
class PDFService {
    /**
     * Valide qu'un fichier est bien un PDF
     */
    validatePdfFile(file: File): boolean {
        if (!file) return false;

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

        // Vérifier la taille (10MB par défaut)
        const maxSizeInBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeInBytes || file.size <= 0) {
            console.warn(`Taille de fichier invalide: ${file.size} bytes (max: ${maxSizeInBytes} bytes)`);
            return false;
        }

        return true;
    }

    /**
     * Extrait les métadonnées basiques du PDF (titre, nombre de pages)
     * sans recourir à l'extraction de texte complète
     */
    async extractBasicInfo(file: File): Promise<{
        title: string;
        pageCount: number;
    }> {
        // Par défaut, utiliser le nom du fichier
        const title = file.name.replace(/\.pdf$/i, '');

        try {
            // Pour la version simplifiée, on ne calcule pas le nombre de pages
            // On pourrait implémenter cela plus tard si nécessaire
            return {
                title,
                pageCount: 0  // Valeur par défaut
            };
        } catch (error) {
            console.warn("Erreur lors de l'extraction des métadonnées:", error);
            return {
                title,
                pageCount: 0
            };
        }
    }
}

export default new PDFService();