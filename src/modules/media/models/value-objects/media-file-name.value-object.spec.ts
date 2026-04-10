import { MediaFileName } from './media-file-name.value-object';

describe('MediaFileName', () => {
	it('deve gerar chave plana com organization_id, timestamp e sufixo, sem barras', () => {
		const now = new Date('2026-04-09T12:00:00.000Z');
		const organization_id = '018f2a3b-4c5d-7e8f-9a0b-1c2d3e4f5a6b';
		const mediaFileName = MediaFileName.build({
			organization_id,
			original_filename: 'Minha Foto FINAL.JPG',
			now,
		});

		const key = mediaFileName.getValue();
		expect(key).not.toContain('/');
		expect(key).toContain(organization_id);
		expect(key).toMatch(/-[a-z0-9]{4,}-[a-f0-9]{6}\.jpg$/);
	});

	it('deve usar extensão de fallback quando não houver extensão válida', () => {
		const mediaFileName = MediaFileName.build({
			organization_id: 'org-1',
			original_filename: 'arquivo_sem_extensao',
			extension: '***',
		});

		expect(mediaFileName.getValue().endsWith('.bin')).toBe(true);
		expect(mediaFileName.getValue()).not.toContain('/');
		expect(mediaFileName.getValue()).toContain('org-1');
	});
});
