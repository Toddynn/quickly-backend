import { BadRequestException } from '@nestjs/common';

export class CannotDeleteServiceWithFutureAppointmentsException extends BadRequestException {
	constructor() {
		super('Não é possível excluir o serviço pois existem agendamentos futuros vinculados a ele. Considere inativar o serviço em vez de excluí-lo.');
		this.name = 'CannotDeleteServiceWithFutureAppointmentsException';
	}
}
