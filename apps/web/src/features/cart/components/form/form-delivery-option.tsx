import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormDeliveryOptionProps {
	deliveryOption: string;
	setDeliveryOption: (value: string) => void;
}

export const FormDeliveryOption = ({
	deliveryOption,
	setDeliveryOption,
}: FormDeliveryOptionProps) => {
	return (
		<section>
			<h2 className="text-xl font-semibold mb-3 font-barlow-semi-condensed">
				OPÇÕES DE ENTREGA
			</h2>
			<RadioGroup
				defaultValue={deliveryOption}
				onValueChange={setDeliveryOption}
				className="space-y-3"
				name="delivery_method"
			>
				<Label
					className={`flex justify-between items-center border p-4 rounded-lg cursor-pointer transition-all ${deliveryOption === 'scheduled' ? 'border-gray-800 ring-2 ring-gray-800' : 'border-gray-200'}`}
				>
					<div className="flex flex-col gap-3">
						<h3 className="font-semibold text-gray-800 ">
							PAT - ENTREGA AGENDADA
						</h3>
						<div>
							<p className="text-sm font-medium text-gray-700">R$30,00</p>
							<p className="text-sm text-gray-500">
								Agendamento disponível a partir do dia, 30 de agosto.
							</p>
						</div>
					</div>
					<RadioGroupItem value="scheduled" className="ml-4" hidden />
				</Label>
				<Label
					className={`flex justify-between items-center border p-4 rounded-lg cursor-pointer transition-all ${deliveryOption === 'standard' ? 'border-gray-800 ring-2 ring-gray-800' : 'border-gray-200'}`}
				>
					<div className="flex flex-col gap-3">
						<h3 className="font-semibold text-gray-800">
							Entrega até 16 Julho
						</h3>
						<div>
							<p className="text-sm font-medium text-green-600">Grátis</p>
							<p className="text-sm text-gray-500">
								Entrega entre as 08:00 - 19:00
							</p>
						</div>
					</div>
					<RadioGroupItem value="standard" className="ml-4" hidden />
				</Label>
			</RadioGroup>
		</section>
	);
};
