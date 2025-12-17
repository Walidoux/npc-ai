import styles from "./styles/dialogue.module.css";
import { cn } from "./utils/lib";

export const Dialogue = () => (
	<div
		className={cn(
			"w-[400px] border border-white p-3 text-white shadow-white",
			styles.container
		)}
	/>
);
