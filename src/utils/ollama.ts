import { KnownError } from './error.js';
import type { CommitType } from './config.js';
import { generatePrompt } from './prompt.js';

const sanitizeMessage = (message: string) =>
	message
		.trim()
		.replace(/[\n\r]/g, '')
		.replace(/(\w)\.$/, '$1');

const deduplicateMessages = (array: string[]) => Array.from(new Set(array));

export const generateCommitMessage = async (
	model: string,
	locale: string,
	diff: string,
	completions: number,
	maxLength: number,
	type: CommitType,
	timeout: number
) => {
	try {
		const response = await fetch('http://localhost:11434/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model,
				prompt: `${generatePrompt(locale, maxLength, type)}\n\n${diff}`,
				stream: false,
			}),
		});

		if (!response.ok) {
			throw new KnownError(
				`Ollama API Error: ${response.status} - ${response.statusText}`
			);
		}

		const data = await response.json();
		const message = sanitizeMessage(data.response);

		// Para mantener la compatibilidad con el código existente, devolvemos un array
		return [message];
	} catch (error) {
		const errorAsAny = error as any;
		if (errorAsAny.code === 'ENOTFOUND') {
			throw new KnownError(
				`Error connecting to Ollama (${errorAsAny.syscall}). Is Ollama running?`
			);
		}

		throw errorAsAny;
	}
};
