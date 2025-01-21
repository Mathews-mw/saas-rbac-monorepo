/**
 * Generate a slug from a text input. The input cannot have accents, symbols, spaces and must be url friendly.
 *
 * @param text string
 * @returns string
 */
export function generateSlugFromText(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]g/, '')
		.replace(/[^\w\s]gi/, '')
		.trim()
		.replace(/\s+/g, '')
		.toLowerCase();
}
