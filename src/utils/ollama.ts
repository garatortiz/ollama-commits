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
		const prompt = `${generatePrompt(locale, maxLength, type)}\n\n${diff}`;
		console.log('Sending prompt to Ollama:', prompt); // Debug log

		const response = await fetch('http://127.0.0.1:11434/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model,
				prompt,
				stream: false,
				options: {
					temperature: 0.7,
					top_p: 1,
					repeat_penalty: 1.1,
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Ollama API Error:', errorText); // Debug log
			throw new KnownError(
				`Ollama API Error: ${response.status} - ${response.statusText}\n${errorText}`
			);
		}

		const data = await response.json();
		console.log('Ollama API Response:', data); // Debug log

		if (!data.response) {
			throw new KnownError('No response received from Ollama');
		}

		const message = sanitizeMessage(data.response);
		return [message];
	} catch (error) {
		const errorAsAny = error as any;
		console.error('Error details:', errorAsAny); // Debug log

		if (errorAsAny.code === 'ECONNREFUSED') {
			throw new KnownError(
				'Could not connect to Ollama. Make sure Ollama is running locally on port 11434.'
			);
		}
		if (errorAsAny.code === 'ENOTFOUND') {
			throw new KnownError(
				'Could not resolve Ollama host. Make sure Ollama is running locally.'
			);
		}
		if (errorAsAny.message.includes('fetch failed')) {
			throw new KnownError(
				'Failed to connect to Ollama. Make sure Ollama is running locally on port 11434.'
			);
		}

		throw new KnownError(
			`Error generating commit message: ${errorAsAny.message}`
		);
	}
};
