import { type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { OrganizationSlug } from '@/modules/organizations/shared/value-objects/organization-slug';

@ValidatorConstraint({ name: 'isOrganizationSlug', async: false })
export class IsOrganizationSlugConstraint implements ValidatorConstraintInterface {
	// Propriedade para armazenar a mensagem de erro específica capturada
	private errorMessage: string = 'O slug da organização é inválido.';

	validate(slug: unknown, _args: ValidationArguments): boolean {
		if (typeof slug !== 'string') {
			this.errorMessage = 'O slug deve ser uma string.';
			return false;
		}

		try {
			// Tenta criar o Value Object. Se falhar, ele lança a exceção com a msg exata.
			new OrganizationSlug(slug);
			return true;
		} catch (error: unknown) {
			// Captura a mensagem específica do seu Domain Exception (InvalidOrganizationSlugException)
			// Se o erro tiver uma mensagem, usamos ela. Caso contrário, fallback.
			if (error instanceof Error) {
				this.errorMessage = error.message;
			}
			return false;
		}
	}

	defaultMessage(_args: ValidationArguments): string {
		// Retorna a mensagem capturada dinamicamente
		return this.errorMessage;
	}
}

export function IsOrganizationSlug(validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsOrganizationSlugConstraint,
		});
	};
}
