export enum Permission {
  READ_OWN_PROFILE = 'READ_OWN_PROFILE',
  UPDATE_OWN_PROFILE = 'UPDATE_OWN_PROFILE',
  DELETE_OWN_ACCOUNT = 'DELETE_OWN_ACCOUNT',
  READ_ALL_USERS = 'READ_ALL_USERS',
  UPDATE_ANY_USER = 'UPDATE_ANY_USER',
  DELETE_ANY_USER = 'DELETE_ANY_USER',
  
  READ_OWN_ORDERS = 'READ_OWN_ORDERS',
  CREATE_OWN_ORDER = 'CREATE_OWN_ORDER',
  CANCEL_OWN_ORDER = 'CANCEL_OWN_ORDER',
  READ_ALL_ORDERS = 'READ_ALL_ORDERS',
  UPDATE_ANY_ORDER = 'UPDATE_ANY_ORDER',
  DELETE_ANY_ORDER = 'DELETE_ANY_ORDER',
  UPDATE_ORDER_ADDRESS = 'UPDATE_ORDER_ADDRESS',
  
  READ_PRODUCTS = 'READ_PRODUCTS',
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  
  READ_OWN_ADDRESSES = 'READ_OWN_ADDRESSES',
  CREATE_OWN_ADDRESS = 'CREATE_OWN_ADDRESS',
  UPDATE_OWN_ADDRESS = 'UPDATE_OWN_ADDRESS',
  DELETE_OWN_ADDRESS = 'DELETE_OWN_ADDRESS',
  READ_ALL_ADDRESSES = 'READ_ALL_ADDRESSES',
  
  READ_CATEGORIES = 'READ_CATEGORIES',
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
  
  CREATE_PAYMENT = 'CREATE_PAYMENT',
  READ_OWN_PAYMENTS = 'READ_OWN_PAYMENTS',
  PROCESS_REFUND = 'PROCESS_REFUND',
  READ_ALL_PAYMENTS = 'READ_ALL_PAYMENTS',
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export const ROLE_PERMISSIONS = {
  [Role.CUSTOMER]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.DELETE_OWN_ACCOUNT,
    Permission.READ_OWN_ORDERS,
    Permission.CREATE_OWN_ORDER,
    Permission.CANCEL_OWN_ORDER,
    Permission.UPDATE_ORDER_ADDRESS,
    Permission.READ_PRODUCTS,
    Permission.READ_OWN_ADDRESSES,
    Permission.CREATE_OWN_ADDRESS,
    Permission.UPDATE_OWN_ADDRESS,
    Permission.DELETE_OWN_ADDRESS,
    Permission.READ_CATEGORIES,
    Permission.CREATE_PAYMENT,
    Permission.READ_OWN_PAYMENTS,
  ],
  [Role.ADMIN]: Object.values(Permission),
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

export function getRequiredPermissions(operation: string): Permission[] {
  const permissionMap: Record<string, Permission[]> = {
    'users': [Permission.READ_ALL_USERS],
    'user': [Permission.READ_OWN_PROFILE],
    'createUser': [],
    'updateUser': [Permission.UPDATE_OWN_PROFILE],
    'deleteUser': [Permission.DELETE_OWN_ACCOUNT],
    
    'addresses': [Permission.READ_ALL_ADDRESSES],
    'address': [Permission.READ_OWN_ADDRESSES],
    'createAddress': [Permission.CREATE_OWN_ADDRESS],
    'updateAddress': [Permission.UPDATE_OWN_ADDRESS],
    'deleteAddress': [Permission.DELETE_OWN_ADDRESS],
    'userAddresses': [Permission.READ_OWN_ADDRESSES],
    
    'orders': [Permission.READ_ALL_ORDERS],
    'order': [Permission.READ_OWN_ORDERS],
    'createOrder': [Permission.CREATE_OWN_ORDER],
    'updateOrderAddress': [Permission.UPDATE_ORDER_ADDRESS],
    'updateOrderStatus': [Permission.UPDATE_ANY_ORDER],
    'deleteOrder': [Permission.DELETE_ANY_ORDER],
    'userOrders': [Permission.READ_OWN_ORDERS],
    
    'products': [Permission.READ_PRODUCTS],
    'product': [Permission.READ_PRODUCTS],
    'createProduct': [Permission.CREATE_PRODUCT],
    'updateProduct': [Permission.UPDATE_PRODUCT],
    'deleteProduct': [Permission.DELETE_PRODUCT],
    'productsByCategory': [Permission.READ_PRODUCTS],
    'productsBySearch': [Permission.READ_PRODUCTS],
    
    'categories': [Permission.READ_CATEGORIES],
    'category': [Permission.READ_CATEGORIES],
    'createCategory': [Permission.CREATE_CATEGORY],
    'updateCategory': [Permission.UPDATE_CATEGORY],
    'deleteCategory': [Permission.DELETE_CATEGORY],
    
    'createPaymentIntent': [Permission.CREATE_PAYMENT],
    'processPayment': [Permission.PROCESS_REFUND],
  };
  
  return permissionMap[operation] || [];
}
