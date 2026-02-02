'use client';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format-date';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useDeleteAddress } from '@/features/dashboard/hooks/use-delete-address';
import { formatFullAddress, formatLocation } from '@/features/dashboard/lib/format-utils';

export interface Address {
	id: string;
	createdAt: string;
	country: string;
	city: string;
	neighbor: string;
	postalCode: string;
	state: string;
	street: string;
	streetNumber: string;
	complements: string;
}

interface AddressTableProps {
	addresses: Address[];
}

export const AddressTable = ({ addresses }: AddressTableProps) => {
	const [addressList, setAddressList] = useState(addresses);
	const { deleteAddress: deleteAddressService, isDeleting } =
		useDeleteAddress();
	useEffect(() => {
		setAddressList(addresses);
	}, [addresses]);

	const handleDelete = (addressId: string) => async () => {
		if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

		const addressToRestore = addressList.find((a) => a.id === addressId);

		setAddressList((prev) =>
			prev.filter((address) => address.id !== addressId),
		);

		const result = await deleteAddressService(addressId);

		if (!result.success) {
			toast.error(result.error);

			if (addressToRestore) {
				setAddressList((prev) => [...prev, addressToRestore]);
			}
		} else {
			toast.success('Endereço excluído com sucesso!');
		}
	};

	if (addressList.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Nenhum endereço cadastrado</p>
			</div>
		);
	}

	return (
		<section>
			<Table>
				<TableCaption>Lista de Endereços do Usuário Autenticado</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Endereço</TableHead>
						<TableHead>Localização</TableHead>
						<TableHead>Bairro</TableHead>
						<TableHead>Cadastrado em</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{addressList.map((address) => (
						<TableRow key={address.id}>
							<TableCell className="font-medium">
								{formatFullAddress(address)}
							</TableCell>
							<TableCell>{formatLocation(address)}</TableCell>
							<TableCell>{address.neighbor}</TableCell>
							<TableCell>{formatDate(address.createdAt)}</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleDelete(address.id)}
										disabled={isDeleting}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Toaster />
		</section>
	);
};
