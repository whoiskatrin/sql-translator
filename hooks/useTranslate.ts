import { useState } from "react";

interface RequestBody {
	inputText: string;
	tableSchema?: string;
}

export function useTranslate() {
	const [translating, setTranslating] = useState(false);
	const [outputText, setOutputText] = useState("");
	const [translationError, setTranslationError] = useState("");

	const translate = async ({
		inputText,
		tableSchema,
		isHumanToSql,
	}: { inputText: string; tableSchema: string; isHumanToSql: boolean }) => {
		setTranslating(true);
		try {
			const requestBody: RequestBody = { inputText };
			if (tableSchema !== "") {
				requestBody.tableSchema = tableSchema;
			}
			const response = await fetch(
				`/api/${isHumanToSql ? "translate" : "sql-to-human"}`,
				{
					method: "POST",
					body: JSON.stringify(requestBody),
					headers: { "Content-Type": "application/json" },
				},
			);
			if (response.ok) {
				const data = await response.json();
				setOutputText(data.outputText);
			} else {
				setTranslationError(
					`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`,
				);
			}
		} catch (error) {
			console.error(error);
			setTranslationError(
				`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`,
			);
		} finally {
			setTranslating(false);
		}
	};

	return {
		outputText,
		setOutputText,
		translate,
		translating,
		translationError,
	};
}
