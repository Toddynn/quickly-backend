export function formatWhereClause(where: unknown): string {
	const keys = collectWhereKeys(where);
	return keys.length > 0 ? keys.join(', ') : 'critérios';
}

function collectWhereKeys(where: unknown, acc: Set<string> = new Set()): string[] {
	if (where == null) {
		return [...acc];
	}

	if (Array.isArray(where)) {
		for (const item of where) {
			collectWhereKeys(item, acc);
		}
		return [...acc];
	}

	if (typeof where === 'object') {
		for (const key of Object.keys(where)) {
			acc.add(key);
		}
	}

	return [...acc];
}
