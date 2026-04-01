import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/interfaces/store.interface';

interface AuthDataState {
	user: User | null;
	isAuthenticated: boolean;
}

interface AuthActionsState {
	setUser: (user: User | null) => void;
	login: (user: User) => void;
	logout: () => void;
}

type AuthState = AuthDataState & AuthActionsState;

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			setUser: (user) => set({ user, isAuthenticated: !!user }),
			login: (user) => set({ user, isAuthenticated: true }),
			logout: () => {
				if (typeof window !== 'undefined') {
					localStorage.removeItem('auth-storage');
				}
				set({ user: null, isAuthenticated: false });
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => {
				if (state.isAuthenticated && state.user) {
					return { user: state.user };
				}
				return {};
			},
		},
	),
);

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
	useAuthStore((state) => state.isAuthenticated);
export const useLoginAction = () => useAuthStore((state) => state.login);
export const useLogoutAction = () => useAuthStore((state) => state.logout);
