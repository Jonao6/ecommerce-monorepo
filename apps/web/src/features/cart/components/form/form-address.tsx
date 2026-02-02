'use client';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { IbgeState } from '../../action/get-states';
import { AddressState } from './checkout-form';
import { ChangeEvent } from 'react';
interface FormAddressProps {
	states: IbgeState[];
	address: AddressState;
	setAddress: (value: AddressState) => void;
}

export const FormAddress = ({
	states,
	address,
	setAddress,
}: FormAddressProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddress({ ...address, [name]: value });
	};
	return (
		<section>
			<h2 className="text-xl font-semibold mb-3 font-barlow-semi-condensed">
				ENDEREÇO
			</h2>
			<div className="space-y-4">
				<p className="text-sm font-medium text-gray-700">Endereço de entrega</p>
				<Input
					placeholder="Rua"
					aria-label="Rua"
					name="street"
					value={address.street}
					onChange={handleChange}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						placeholder="CEP"
						aria-label="CEP"
						name="zap_code"
						value={address.zap_code}
						onChange={handleChange}
					/>
					<Input
						placeholder="Número"
						aria-label="Número"
						name="street_number"
						value={address.street_number}
						onChange={handleChange}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						placeholder="Informações adicionais"
						aria-label="Informações adicionais"
						name="complements"
						value={address.complements}
						onChange={handleChange}
					/>
					<Input
						placeholder="Bairro"
						aria-label="Bairro"
						name="neighbor"
						value={address.neighbor}
						onChange={handleChange}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						placeholder="Cidade"
						aria-label="Cidade"
						name="city"
						value={address.city}
						onChange={handleChange}
					/>
					<Select
						name="state"
						onValueChange={(value) => setAddress({ ...address, state: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							{states.map((state) => (
								<SelectItem key={state.id} value={state.sigla}>
									{state.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</section>
	);
};
