import { FormEvent, useState, useTransition } from 'react';

interface IFormStateProps {
	success: boolean;
	message: string | null;
	errors: Record<string, string[]> | null;
}

export function useFormState(
	action: (data: FormData) => Promise<IFormStateProps>,
	onSuccess?: () => Promise<void> | void,
	initialState?: IFormStateProps
): [
	formState: IFormStateProps,
	handleSubmitForm: (event: FormEvent<HTMLFormElement>) => Promise<void>,
	isPending: boolean,
] {
	const [isPending, startTransition] = useTransition();

	const [formState, setFormState] = useState(
		initialState ?? {
			success: false,
			message: null,
			errors: null,
		}
	);

	async function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const data = new FormData(form);

		startTransition(async () => {
			const state = await action(data);

			if (state.success === true && onSuccess) await onSuccess();

			setFormState(state);
		});
	}

	return [formState, handleSubmitForm, isPending] as const;
}
