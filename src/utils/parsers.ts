/**
 * Analyse une chaîne de caractères JSON et retourne l'objet correspondant
 * Gère les cas spéciaux où le JSON pourrait être entouré de texte
 */
export function parseJSON(text: string): any {
    try {
        // Essai direct de parse JSON
        return JSON.parse(text);
    } catch (e) {
        // Si échec, essai de trouver et extraire un objet JSON dans le texte
        try {
            // Chercher le premier caractère '{' et le dernier '}'
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}') + 1;

            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                const jsonString = text.substring(startIndex, endIndex);
                return JSON.parse(jsonString);
            }

            // Si pas trouvé, chercher avec crochets '[]'
            const bracketStart = text.indexOf('[');
            const bracketEnd = text.lastIndexOf(']') + 1;

            if (bracketStart !== -1 && bracketEnd !== -1 && bracketStart < bracketEnd) {
                const jsonString = text.substring(bracketStart, bracketEnd);
                return JSON.parse(jsonString);
            }

            // Si toujours pas trouvé, retourner un objet vide
            return {};
        } catch (innerError) {
            console.error('Erreur lors du parsing JSON:', innerError);
            return {};
        }
    }
}

export function convertJsonToString(jsonObject: object): string {
    try {
        return JSON.stringify(jsonObject);
    } catch (error) {
        console.error("Error converting JSON to string:", error);
        return ""; // Or handle the error as appropriate for your application
    }
}

/**
 * Extrait un code HTML d'une chaîne de caractères (utile pour les réponses d'IA)
 */
/**
 * Extrait un code HTML d'une chaîne de caractères (utile pour les réponses d'IA)
 */
export function extractHTML(text: string): string {
    // Essayer de trouver du HTML dans la réponse
    const htmlPattern = /<(!DOCTYPE|html)[\s\S]*?<\/html>/i;
    const match = text.match(htmlPattern);

    if (match && match[0]) {
        return match[0];
    }

    // Si pas de balise HTML complète, chercher du contenu entre backticks (```)
    const codeBlockPattern = /```(?:html)?\s*([\s\S]*?)```/;
    const codeMatch = text.match(codeBlockPattern);

    if (codeMatch && codeMatch[1]) {
        let extractedContent = codeMatch[1].trim();

        // Vérifier si le contenu extrait commence et se termine par ```html et ```
        const startTag = "```html";
        const endTag = "```";

        if (extractedContent.startsWith(startTag) && extractedContent.endsWith(endTag)) {
            extractedContent = extractedContent.substring(startTag.length, extractedContent.length - endTag.length).trim();
        }
        // Vérifier le cas où il n'y a pas "html" après les premiers backticks
        else if (extractedContent.startsWith(endTag) && extractedContent.endsWith(endTag) && extractedContent.length > 6) {
            extractedContent = extractedContent.substring(endTag.length, extractedContent.length - endTag.length).trim();
        }

        return extractedContent;
    }

    // Sinon retourner le texte original
    return text;
}