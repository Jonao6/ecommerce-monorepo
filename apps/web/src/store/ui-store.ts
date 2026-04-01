import { create } from 'zustand';

interface UIState {
	isLoading: boolean;
	error: string | null;
	successMessage: string | null;
	modalOpen: string | null;
	
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setSuccess: (message: string | null) => void;
	openModal: (modal: string) => void;
	closeModal: () => void;
	clearMessages: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	isLoading: false,
	error: null,
	successMessage: null,
	modalOpen: null,

	setLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),
	setSuccess: (message) => set({ successMessage: message }),
	openModal: (modal) => set({ modalOpen: modal }),
	closeModal: () => set({ modalOpen: null }),
	clearMessages: () => set({ error: null, successMessage: null }),
}));

export const useIsLoading = () => useUIStore((state) => state.isLoading);
export const useUIError = () => useUIStore((state) => state.error);
export const useSuccessMessage = () => useUIStore((state) => state.successMessage);
export const useModalState = () => useUIStore((state) => state.modalOpen);
