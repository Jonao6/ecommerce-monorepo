export interface CartItem {
  id: string;
  name: string;
  price: number;
  url?: string;
  quantity: number;
  image: string;
  size: number;
  color: string;
}

export interface ICartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  getTotal: () => number;
  getCount: () => number;
  updateQuantity: (id: string, quantity: number) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IAuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface IOrderStore {
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  clear: () => void;
}
