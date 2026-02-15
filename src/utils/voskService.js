import { createModel } from 'vosk-browser';

// This is a minimal wrapper. In a real scenario, you'd load the model file (approx 50MB) 
// locally or from a CDN. For this demo, we assume the user has internet access
// and use the default model from the library or handle the missing model case.
// IMPORTANT: Vosk-browser requires a model URL.

const MODEL_URL = '/models/vosk-model-small-en-us-0.15.zip';

export const initVosk = async () => {
    try {
        const model = await createModel(MODEL_URL);
        const recognizer = new model.KaldiRecognizer(16000);

        // Setup Audio Context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        return { recognizer, processor, audioContext, stream };
    } catch (e) {
        console.error("Vosk Init Failed:", e);
        throw e;
    }
};
