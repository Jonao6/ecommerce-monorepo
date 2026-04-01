import { BaseValidator, ValidationResult, ValidationStrategy } from './base.validator.js';

export interface OrderItemInput {
  productId?: string;
  quantity?: number;
  color?: string;
  size?: number;
}

export interface OrderInput {
  addressId?: string;
  items: OrderItemInput[];
  totalAmount?: number;
}

export class OrderItemValidator extends BaseValidator<OrderItemInput> implements ValidationStrategy<OrderItemInput> {
  validate(data: OrderItemInput): ValidationResult {
    this.clearErrors();

    if (!data.productId || data.productId.trim() === '') {
      this.addError('productId', 'Product ID is required', 'MISSING_PRODUCT_ID');
    }

    if (data.quantity === undefined || data.quantity <= 0) {
      this.addError('quantity', 'Quantity must be greater than 0', 'INVALID_QUANTITY');
    }

    if (data.quantity && data.quantity > 1000) {
      this.addError('quantity', 'Quantity cannot exceed 1000', 'QUANTITY_TOO_LARGE');
    }

    return this.getResult();
  }
}

export class OrderValidator extends BaseValidator<OrderInput> implements ValidationStrategy<OrderInput> {
  private itemValidator: OrderItemValidator;

  constructor() {
    super();
    this.itemValidator = new OrderItemValidator();
  }

  validate(data: OrderInput): ValidationResult {
    this.clearErrors();

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      this.addError('items', 'Order must contain at least one item', 'EMPTY_ORDER');
      return this.getResult();
    }

    if (data.items.length > 50) {
      this.addError('items', 'Order cannot contain more than 50 items', 'ORDER_TOO_LARGE');
    }

    if (data.totalAmount !== undefined && data.totalAmount < 0) {
      this.addError('totalAmount', 'Total amount must be positive', 'INVALID_TOTAL');
    }

    for (let i = 0; i < data.items.length; i++) {
      const itemResult = this.itemValidator.validate(data.items[i]);
      if (!itemResult.isValid) {
        itemResult.errors.forEach((error) => {
          this.addError(`items[${i}].${error.field}`, error.message, error.code);
        });
      }
    }

    return this.getResult();
  }
}
