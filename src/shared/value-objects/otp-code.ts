import { BadRequestException } from '@nestjs/common';
import { randomInt } from 'crypto';

/**
 * Value Object que representa um código OTP (One-Time Password).
 * O código OTP é usado para autenticação temporária em processos como
 * recuperação de senha e confirmação de email.
 *
 * Regras de validação:
 * - Deve conter exatamente 6 dígitos numéricos
 * - Não pode ser uma string vazia
 * - Não pode conter letras ou caracteres especiais
 */
export class OtpCode {
	private static readonly LENGTH = 6;
	private static readonly OTP_PATTERN = /^\d{6}$/;

	private readonly value: string;

	constructor(otpCode: string) {
		this.validate(otpCode);
		this.value = otpCode.trim();
	}

	/**
	 * Valida o formato do código OTP conforme as regras de negócio
	 */
	private validate(otpCode: string): void {
		if (!otpCode || typeof otpCode !== 'string') {
			throw new BadRequestException('O código OTP não pode ser vazio.');
		}

		const trimmedOtp = otpCode.trim();

		if (trimmedOtp.length !== OtpCode.LENGTH) {
			throw new BadRequestException(`O código OTP deve conter exatamente ${OtpCode.LENGTH} dígitos.`);
		}

		if (!OtpCode.OTP_PATTERN.test(trimmedOtp)) {
			throw new BadRequestException('O código OTP deve conter apenas dígitos numéricos.');
		}
	}

	/**
	 * Retorna o valor do código OTP como string
	 */
	toString(): string {
		return this.value;
	}

	/**
	 * Retorna o valor do código OTP (para compatibilidade)
	 */
	getValue(): string {
		return this.value;
	}

	/**
	 * Compara dois códigos OTP
	 */
	equals(other: OtpCode): boolean {
		return this.value === other.value;
	}

	/**
	 * Cria um código OTP a partir de uma string, validando automaticamente
	 */
	static fromString(otpCode: string): OtpCode {
		return new OtpCode(otpCode);
	}

	/**
	 * Gera um código OTP aleatório de 6 dígitos
	 */
	static generate(): OtpCode {
		const digits = '0123456789';
		let otp = '';
		for (let i = 0; i < OtpCode.LENGTH; i++) {
			otp += digits[randomInt(0, 10)];
		}
		return new OtpCode(otp);
	}
}
