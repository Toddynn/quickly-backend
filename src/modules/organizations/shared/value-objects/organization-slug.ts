import { InvalidOrganizationSlugException } from '../../errors/invalid-organization-slug.error';

/**
 * Value Object que representa um slug de organização.
 * O slug é usado como identificador público único na URL (tenant ID).
 *
 * Regras de validação:
 * - Apenas letras minúsculas, números e hífens
 * - Tamanho mínimo: 3 caracteres
 * - Tamanho máximo: 35 caracteres
 * - Não pode começar ou terminar com hífen
 * - Não pode ter hífens consecutivos
 * - Não pode ser uma string vazia
 */
export class OrganizationSlug {
	private static readonly MIN_LENGTH = 3;
	private static readonly MAX_LENGTH = 35;
	private static readonly SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

	private readonly value: string;

	constructor(slug: string) {
		this.validate(slug);
		this.value = slug.toLowerCase().trim();
	}

	/**
	 * Valida o formato do slug conforme as regras de negócio
	 */
	private validate(slug: string): void {
		if (!slug || typeof slug !== 'string') {
			throw new InvalidOrganizationSlugException('O slug não pode ser vazio.');
		}

		const trimmedSlug = slug.trim().toLowerCase();

		if (trimmedSlug.length < OrganizationSlug.MIN_LENGTH) {
			throw new InvalidOrganizationSlugException(`O slug deve ter no mínimo ${OrganizationSlug.MIN_LENGTH} caracteres.`);
		}

		if (trimmedSlug.length > OrganizationSlug.MAX_LENGTH) {
			throw new InvalidOrganizationSlugException(`O slug deve ter no máximo ${OrganizationSlug.MAX_LENGTH} caracteres.`);
		}

		if (trimmedSlug.startsWith('-') || trimmedSlug.endsWith('-')) {
			throw new InvalidOrganizationSlugException('O slug não pode começar ou terminar com hífen.');
		}

		if (trimmedSlug.includes('--')) {
			throw new InvalidOrganizationSlugException('O slug não pode conter hífens consecutivos.');
		}

		if (!OrganizationSlug.SLUG_PATTERN.test(trimmedSlug)) {
			throw new InvalidOrganizationSlugException('O slug deve conter apenas letras minúsculas, números e hífens.');
		}
	}

	/**
	 * Retorna o valor do slug como string
	 */
	toString(): string {
		return this.value;
	}

	/**
	 * Retorna o valor do slug (para compatibilidade)
	 */
	getValue(): string {
		return this.value;
	}

	/**
	 * Compara dois slugs
	 */
	equals(other: OrganizationSlug): boolean {
		return this.value === other.value;
	}

	/**
	 * Cria um slug a partir de uma string, validando automaticamente
	 */
	static fromString(slug: string): OrganizationSlug {
		return new OrganizationSlug(slug);
	}

	/**
	 * Gera um slug a partir de um nome (para uso em criação automática)
	 * Remove acentos, converte para minúsculas e substitui espaços por hífens
	 */
	static fromName(name: string): OrganizationSlug {
		const slug = name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '') // Remove acentos
			.replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
			.trim()
			.replace(/\s+/g, '-') // Substitui espaços por hífens
			.replace(/-+/g, '-') // Remove hífens consecutivos
			.replace(/^-+|-+$/g, ''); // Remove hífens do início e fim

		return new OrganizationSlug(slug);
	}
}
