import { BadRequestException } from '@nestjs/common';
import { APPOINTMENT_STATUS } from '../shared/interfaces/appointment-status';

const STATUS_LABELS: Record<APPOINTMENT_STATUS, string> = {
	[APPOINTMENT_STATUS.PENDING]: 'pendente',
	[APPOINTMENT_STATUS.CONFIRMED]: 'confirmado',
	[APPOINTMENT_STATUS.COMPLETED]: 'concluído',
	[APPOINTMENT_STATUS.CANCELED]: 'cancelado',
	[APPOINTMENT_STATUS.NO_SHOW]: 'não compareceu',
	[APPOINTMENT_STATUS.RESCHEDULED]: 'reagendado',
	[APPOINTMENT_STATUS.TRANSFERRED]: 'transferido',
};

export class InvalidAppointmentStatusTransitionException extends BadRequestException {
	constructor(from: APPOINTMENT_STATUS, to: APPOINTMENT_STATUS) {
		const fromLabel = STATUS_LABELS[from] ?? from;
		const toLabel = STATUS_LABELS[to] ?? to;
		super({ message: `Não é possível mudar o agendamento de "${fromLabel}" para "${toLabel}"` });
	}
}
