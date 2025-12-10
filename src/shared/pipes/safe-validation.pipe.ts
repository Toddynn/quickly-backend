import { type ArgumentMetadata, BadRequestException, Injectable, Logger, ValidationPipe } from '@nestjs/common';

@Injectable()
export class ReflectionGuardValidationPipe extends ValidationPipe {
	private readonly logger = new Logger(ReflectionGuardValidationPipe.name);

	async transform(value: any, metadata: ArgumentMetadata) {
		if (this.shouldInspectMetadata(metadata, value)) {
			this.handleMissingReflection(metadata, value);
		}

		return super.transform(value, metadata);
	}

	/**
	 * Verifica se devemos inspecionar este request em busca de erros de importação.
	 * Só nos importamos se for Body/Query, se houver dados, e se o metadado parecer quebrado.
	 */
	private shouldInspectMetadata(metadata: ArgumentMetadata, value: any): boolean {
		const isValidationScope = metadata.type === 'body' || metadata.type === 'query';

		if (!isValidationScope) return false;
		if (!this.hasPayload(value)) return false;

		return this.isMetatypeGenericOrMissing(metadata.metatype);
	}

	/**
	 * Verifica se o metadado da classe foi perdido (sintoma de 'import type').
	 * Retorna true se for undefined, 'Object' ou 'Function'.
	 */
	private isMetatypeGenericOrMissing(metatype: ArgumentMetadata['metatype']): boolean {
		if (!metatype) return true;

		const name = metatype.name;
		// DTOs reais têm nomes específicos. Se for genérico, a referência foi perdida.
		return name === 'Object' || name === 'Function';
	}

	/**
	 * Verifica se existe um payload real para ser validado.
	 */
	private hasPayload(value: any): boolean {
		return value && typeof value === 'object' && Object.keys(value).length > 0;
	}

	/**
	 * Loga o erro detalhado e interrompe a requisição.
	 */
	private handleMissingReflection(metadata: ArgumentMetadata, value: any): never {
		const metatypeName = metadata.metatype?.name || 'Undefined';

		const debugMessage = `
         🛑 [REFLECTION ERROR] DTO Metadata Lost 🛑
         ---------------------------------------------------
         Context: ${metadata.type.toUpperCase()}
         Detected Metatype: '${metatypeName}'
         Received Payload: ${JSON.stringify(value)}
         
         Diagnosis:
         The NestJS ValidationPipe received a generic constructor instead of your DTO class.
         This almost always happens when using "import type { Dto }" in the Controller.
         
         Fix:
         Change "import type" to standard "import" in your Controller file.
         ---------------------------------------------------
       `;

		this.logger.error(debugMessage.replace(/\n\s+/g, '\n')); // Limpa espaços extras no log

		throw new BadRequestException(`Backend Configuration Error: DTO metadata missing. Please check if you are using 'import type' in your Controller.`);
	}
}
