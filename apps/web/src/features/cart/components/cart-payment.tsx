'use client';
import { useQuery } from '@apollo/client/react';
import { CircleCheck, CircleX } from 'lucide-react';
import { GET_ORDER_BY_ID } from '../api/order';

type CartPaymentProps = {
  orderId: string;
};

interface GET_ORDER_BY_ID_DATA {
	order: {
		payment: {
			paymentStatus: string
		}
	}
}

interface GET_ORDER_BY_ID_VARIABLES {
	orderId: string
}

export const CartPayment = ({ orderId }: CartPaymentProps) => {
	const { data } = useQuery<GET_ORDER_BY_ID_DATA, GET_ORDER_BY_ID_VARIABLES>(GET_ORDER_BY_ID, {
		variables: { orderId }
	})
	const isPaid = data?.order.payment.paymentStatus === "paid"

  const success = isPaid && orderId;

  const title = success
    ? 'OBRIGADO PELA COMPRA!'
    : 'FALHA AO VALIDAR A COMPRA!';
  const Icon = success ? CircleCheck : CircleX;
  const iconColor = success ? '#2ced52' : '#d01616';
  const message = success
    ? 'Enviamos um e-mail com os detalhes do seu pedido. Por favor, verifique sua caixa de entrada (e também a pasta de spam ou lixo eletrônico, se necessário) para acompanhar as instruções e atualizações.'
    : 'Enviamos um e-mail com os detalhes do seu pedido. Verifique sua caixa de entrada (inclusive o spam) e, se necessário, entre em contato com o suporte.';

  return (
    <div className="bg-white font-sans">
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <section className="border-b pb-6 mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
          <div className="flex justify-center my-4">
            <Icon color={iconColor} width={80} height={80} />
          </div>
          <p className="text-sm text-gray-600">
            Protocolo do pedido:{' '}
            <span className="font-semibold text-gray-700">{orderId}</span>
          </p>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">{message}</p>
        </section>
      </div>
    </div>
  );
};
