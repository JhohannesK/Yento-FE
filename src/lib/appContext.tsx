import React, { createContext, useContext } from 'react';
import { ICart } from './types';

interface AppContextTypes {
	cart: ICart[];
	// addToCart: () => void;
	setAddToCart: React.Dispatch<React.SetStateAction<ICart[]>>;
	removeFromCart: (itemId: number) => void;
}

const AppContext = createContext<AppContextTypes | undefined>(undefined);

interface AppProviderProps {
	children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const [cart, setAddToCart] = React.useState<ICart[]>([]);

	const removeFromCart = (itemId: number) => {
		setAddToCart((prev) => prev.filter((item) => item.id !== itemId));
	};
	return (
		<AppContext.Provider value={{ cart, setAddToCart, removeFromCart }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
