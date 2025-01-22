import transcribeFunction from './transcribe.mjs';
import path from 'path';
import { exec } from 'child_process';
import { topics } from './topics.mjs';
import { rm, mkdir, unlink } from 'fs/promises';
import express from 'express'; // Import Express

export const PROCESS_ID = 0;

async function cleanupResources() {
	try {
		await rm(path.join('public', 'srt'), { recursive: true, force: true });
		await rm(path.join('public', 'voice'), { recursive: true, force: true });
		await unlink(path.join('public', `audio-${PROCESS_ID}.mp3`)).catch((e) =>
			console.error(e),
		);
		await unlink(path.join('src', 'tmp', 'context.tsx')).catch((e) =>
			console.error(e),
		);
		await mkdir(path.join('public', 'srt'), { recursive: true });
		await mkdir(path.join('public', 'voice'), { recursive: true });
	} catch (err) {
		console.error(`Error during cleanup: ${err}`);
	}
}

const agents = [
	// 'BARACK_OBAMA',
	// 'BEN_SHAPIRO',
	'JORDAN_PETERSON',
	'JOE_ROGAN',
	// 'DONALD_TRUMP',
	// 'MARK_ZUCKERBERG',
	// 'JOE_BIDEN',
	// 'LIL_YACHTY',
	// 'RICK_SANCHEZ',
];

const local = true;

async function main() {
	const randomTopic = topics[Math.floor(Math.random() * topics.length)];
	let agentAIndex = Math.floor(Math.random() * agents.length);
	let agentBIndex;

	do {
		agentBIndex = Math.floor(Math.random() * agents.length);
	} while (agentAIndex === agentBIndex);

	// CHANGE THIS VALUE FOR YOUR CHOICE OF AGENTS
	const agentA = agents[0];
	const agentB = agents[1];

	// CHANGE THIS VALUE FOR A CUSTOM VIDEO TOPIC
	const videoTopic =
		'Jordan Peterson is being eaten by a bear and joe rogan is trying to kiss the bear';
	const aiGeneratedImages = true;
	const fps = 20;
	const duration = 1; //minute
	//MINECRAFT or TRUCK or GTA
	const background = 'MINECRAFT';
	const music = 'WII_SHOP_CHANNEL_TRAP';
	const cleanSrt = true;

	// await transcribeFunction(
	// 	local,
	// 	videoTopic ? videoTopic : randomTopic,
	// 	agentA,
	// 	agentB,
	// 	aiGeneratedImages,
	// 	fps,
	// 	duration,
	// 	background,
	// 	music,
	// 	cleanSrt,
	// );

	// run in the command line `npm run build`
	exec('npm run build', async (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);

		cleanupResources();
	});
}

(async () => {
	await main();
	return;
	const app = express(); // Create an Express application
	const PORT = 3000; // Define the port for the server

	// Middleware to parse JSON request bodies
	app.use(express.json());

	// Define an API endpoint to run transcribeFunction
	app.post('/transcribe', async (req, res) => {
		const { videoTopic, agentA, agentB, aiGeneratedImages, fps, duration, background, music, cleanSrt } = req.body;

		try {
			await transcribeFunction(
				local,
				videoTopic,
				agentA,
				agentB,
				aiGeneratedImages,
				fps,
				duration,
				background,
				music,
				cleanSrt,
			);
			res.status(200).send('Transcription started successfully.');
		} catch (error) {
			console.error(`Error starting transcription: ${error}`);
			res.status(500).send('Error starting transcription.');
		}
	});

	// Start the Express server
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});

})();
