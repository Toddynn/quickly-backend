# Sincronizar Documentação com o Código

Este projeto tem documentação humana em `docs/ARCHITECTURE.md`, dividida por módulo (grupos: Autenticação & Usuários, Organização & Tenancy, Catálogo & Atendimento, Mídia, Planos & Cobrança).

## Regra

Antes de considerar uma feature, correção ou refatoração concluída:

1. **Identifique o(s) módulo(s) afetado(s)** pela mudança (ex: mexeu em `src/modules/subscriptions/` → módulo `subscriptions`).
2. **Verifique se existe uma seção relacionada em `docs/ARCHITECTURE.md`** para esse módulo.
   - Se existir e a mudança alterar algo que a seção descreve (entidade, operações disponíveis, regra de negócio, fluxo, endpoint) — **atualize a seção**.
   - Se a mudança criar um módulo novo — **adicione uma seção nova** no grupo correto da tabela "Mapa dos módulos" e no corpo do documento, seguindo o mesmo formato das seções existentes (propósito em 1-2 frases, campos-chave, relações, lista de operações, regras notáveis).
   - Se a mudança for puramente interna (refactor sem mudança de comportamento observável, rename de variável, etc.) — não precisa atualizar a doc.
3. **Fluxos multi-módulo** (seção "Fluxos importantes" do documento): se a mudança alterar um passo de um fluxo documentado (ex: mexeu no fluxo de criação de organização, no ciclo de cobrança, no enforcement de limite de plano), atualize o diagrama/passos correspondentes.
4. **Gotchas** (seção "Coisas a saber antes de mexer no código"): se a mudança introduzir uma armadilha, workaround não-óbvio, ou constraint técnica que alguém precisaria saber antes de mexer ali de novo (ex: um pacote ESM-only exigindo workaround, uma dependência externa com comportamento surpreendente) — adicione uma linha nessa seção.

## Como aplicar

- Não pare o trabalho para perguntar se deve atualizar a doc — apenas verifique e, se aplicável, atualize como parte natural da tarefa (mesmo espírito de `graphify update .` após mexer em código, já documentado em `CLAUDE.md`).
- Mudanças na documentação não precisam de commit separado — fazem parte do mesmo commit/PR da feature.
- Se não tiver certeza se algo é relevante o suficiente para documentar, prefira uma linha curta a nada — a doc existe para ser lida rápido, não para ser exaustiva.
