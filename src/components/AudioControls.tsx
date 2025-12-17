import { useAudioSamples } from "../utils/hooks";

type AudioControlsProps = {
	stopTyping: () => void;
};

export const AudioControls = ({ stopTyping }: AudioControlsProps) => {
	const { startListening, stopListening, isListening } = useAudioSamples();

	const handleInterrupt = () => {
		stopListening();
		stopTyping();
	};

	return (
		<div className="mt-2 flex gap-2">
			<button
				className="rounded border border-white bg-black px-2 py-1 text-white hover:bg-gray-800"
				disabled={isListening}
				onClick={startListening}
				type="button"
			>
				Ask
			</button>
			<button
				className="rounded border border-white bg-black px-2 py-1 text-white hover:bg-gray-800"
				disabled={!isListening}
				onClick={handleInterrupt}
				type="button"
			>
				Interrupt
			</button>
		</div>
	);
};
