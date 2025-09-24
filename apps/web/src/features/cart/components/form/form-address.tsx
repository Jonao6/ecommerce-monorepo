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

interface FormAddressProps {
	states: IbgeState[];
}

export const FormAddress = ({ states }: FormAddressProps) => {
	return (
		<section>
			<h2 className="text-xl font-semibold mb-3 font-barlow-semi-condensed">
				ENDEREÇO
			</h2>
			<div className="space-y-4">
				<p className="text-sm font-medium text-gray-700">Endereço de entrega</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input placeholder="Nome" aria-label="Nome" name="name" />
					<Input
						placeholder="Sobrenome"
						aria-label="Sobrenome"
						name="second_name"
					/>
				</div>
				<Input placeholder="Endereço" aria-label="Endereço" name="address" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input placeholder="CEP" aria-label="CEP" name="zap_code" />
					<Input
						placeholder="Número"
						aria-label="Número"
						name="street_number"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						placeholder="Informações adicionais"
						aria-label="Informações adicionais"
						name="complements"
					/>
					<Input placeholder="Bairro" aria-label="Bairro" name="neighbor" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input placeholder="Cidade" aria-label="Cidade" name="city" />
					<Select name="state">
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
				<Input placeholder="Telefone" aria-label="Telefone" name="phone" />
				<Input placeholder="CPF" aria-label="CPF" name="CPF" />
			</div>
		</section>
	);
};
