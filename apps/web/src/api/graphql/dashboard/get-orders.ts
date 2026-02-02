import { gql } from '@apollo/client';
export const USER_ORDERS = gql`
	query UserOrders {
		userOrders {
			id
			status
			totalAmount
			payment {
				paymentMethod
				paymentStatus
				paidAt
			}
			delivery {
				status
			}
		}
	}
`;
