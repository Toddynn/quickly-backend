export const APP_CACHE_TTL_SECONDS = {
	// Plans não tem endpoint de escrita (docs/ARCHITECTURE.md) — só muda via seed no boot,
	// então um TTL generoso não arrisca servir dado desatualizado por muito tempo.
	plansList: 600,
} as const;
