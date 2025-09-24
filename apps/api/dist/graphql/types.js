export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (OrderStatus = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (PaymentStatus = {}));
export var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PREPARING"] = "PREPARING";
    DeliveryStatus["SHIPPED"] = "SHIPPED";
    DeliveryStatus["IN_TRANSIT"] = "IN_TRANSIT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["RETURNED"] = "RETURNED";
})(DeliveryStatus || (DeliveryStatus = {}));
//# sourceMappingURL=types.js.map