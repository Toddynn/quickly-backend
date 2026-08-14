# Quickly Backend — Documentação da Arquitetura

Guia de leitura humana do sistema, organizado por módulo. Objetivo: qualquer pessoa (ou IA) consegue entender o que o sistema faz e onde mexer sem precisar ler módulo por módulo do zero.

> Documentação técnica gerada automaticamente pelo graphify também existe em `graphify-out/` (grafo de código, comunidades, relações cross-file). Este documento aqui é o resumo de negócio/arquitetura — para navegação de código linha a linha, prefira `graphify query`.

## O que é o sistema

SaaS de gestão de agendamentos para micro e pequenos negócios (salões, clínicas, prestadores de serviço em geral). Um usuário cria uma **organização** (o tenant), que tem seus próprios **profissionais**, **serviços**, **categorias de serviço** e **clientes**. Clientes agendam horários com profissionais para um serviço específico. O acesso ao sistema é pago por assinatura mensal, com planos que limitam quantidade de profissionais/serviços/clientes.

## Conceitos centrais

**Tenancy.** `Organization` é o tenant. Um `User` pode pertencer a várias organizações através de `OrganizationMember`, que carrega o `role` (`OWNER` ou `PROFESSIONAL`) daquele usuário *dentro daquela organização específica*. Não existe um "role global" de usuário — permissão é sempre relativa à organização ativa na sessão.

**Sessão e organização ativa.** Login é baseado em sessão (`express-session`, não JWT). A sessão guarda `userId`, `activeOrganizationId` e `organizationRole`. Trocar de organização ativa é uma ação explícita (`POST /auth/switch-organization`), não algo passado por header em cada request.

**Guards globais** (registrados em `app.module.ts`, aplicados em toda rota por padrão):
- `SessionAuthGuard` — exige sessão autenticada, a menos que a rota tenha `@Public()`.
- `TenantGuard` — exige `activeOrganizationId` na sessão, só em rotas marcadas com `@TenantScoped()`.
- `RolesGuard` — exige que `session.organizationRole` esteja na lista de `@Roles(...)` da rota, se a rota declarar roles.

Uma rota típica de operação dentro de uma organização usa `@TenantScoped()` + `@ActiveOrganizationId()` (decorator que injeta o id da org ativa) e, se for restrita ao dono, `@Roles(OrganizationRole.OWNER)`.

**Padrão de módulo.** Todo módulo de negócio segue a mesma estrutura Clean Architecture — ver `.claude/rules/nestjs-module-structure.md` para o template exato. Resumo:
```
src/<module>/
├── models/entities/         # entidades TypeORM
├── models/interfaces/       # interface do repositório
├── models/dto/input|output/ # DTOs
├── repository/               # implementação do repositório (só conhece DataSource)
├── use-cases/<nome>/         # 1 pasta por operação: use-case + controller + docs.ts
├── errors/                   # exceções de domínio
└── <module>.module.ts
```
Toda entidade tem um `GetExisting<Entity>UseCase` — é o único jeito "oficial" de buscar por critério e tratar not-found/already-exists, em vez de chamar `.findOne()` direto no repositório em outros lugares.

**Banco.** PostgreSQL via TypeORM com `synchronize: true` (controlado por `DB_SYNC`) — **não existe sistema de migrations no projeto**. O schema é gerado a partir das entidades automaticamente a cada boot. IDs são UUID v7 (`TimestampedEntity extends UUIDV7BaseEntity`).

---

## Mapa dos módulos

| Grupo | Módulos |
|---|---|
| Autenticação & Usuários | `auth`, `users`, `password-reset`, `email-confirmation`, `email` |
| Organização & Tenancy | `organizations`, `organization-members`, `organization-invites`, `organization-addresses` |
| Catálogo & Atendimento | `service-categories`, `organization-services`, `customer`, `appointments` (stub) |
| Mídia | `media` |
| Planos & Cobrança | `plans`, `subscriptions`, `abacate-pay` |

### `auth`

Login, logout, refresh de sessão e troca de organização ativa. Não tem entidade própria — trabalha em cima da sessão e dos módulos `users`/`organization-members`. É de onde saem os 3 guards globais e os decorators usados pelo resto do sistema: `@Public()`, `@TenantScoped()`, `@Roles(...)`, `@CurrentUser()`, `@ActiveOrganizationId()`.

Operações: `login`, `logout`, `refresh-session`, `switch-organization`.

### `users`

Conta de usuário: nome, email (único), senha (hash, `select: false` por padrão), telefone, `email_verified`. Um `User` pode ter várias `Media` (fotos) e vários `OrganizationMember` (vínculos com organizações).

Operações: `create-user`, `update-user`, `update-user-password`, `update-profile-picture`, `delete-profile-picture`, `get-current-user`, `get-existing-user`, `get-existing-user-with-verified-email`.

### `password-reset`

Fluxo de "esqueci minha senha" via código OTP: solicitar → validar código → resetar senha. Tem limite de tentativas (`check-password-reset-attempts`) e expiração de código.

### `email-confirmation`

Verificação de email via OTP — usado tanto na verificação inicial de cadastro quanto em troca de email (`type: VERIFY_EMAIL | CHANGE_EMAIL`). Também tem limite de tentativas e expiração.

### `email`

Módulo de infraestrutura, sem entidade. Uma única operação (`send-email`) que embrulha o `MailerService`. Usado por `password-reset`, `email-confirmation` e `organization-invites` para disparar os emails transacionais.

### `organizations`

O tenant. Guarda `slug` (único, usado como identificador público em URL), `name`, `description`, `logo`, `owner_id`. Tem soft-delete (`deleted_at`). Ao criar uma organização (`POST /organizations`):
1. valida que o slug não existe;
2. cria a organização;
3. cria o `OrganizationMember` do dono com `role: OWNER`;
4. cria a assinatura trial na AbacatePay (ver módulo `subscriptions`) e retorna a URL de checkout.

Isso significa que **criar organização exige `plan_id` e `owner_tax_id`** no payload — é o ponto de entrada de todo o ciclo de cobrança.

### `organization-members`

Vínculo `User` ↔ `Organization` com `role` (`OWNER` ou `PROFESSIONAL`) e `active`. Um usuário só pode ter um vínculo por organização (índice único em `organization_id + user_id`). Criar um novo membro passa pelo `EnforcePlanLimitUseCase` (ver `subscriptions`) — se a org já está no limite de profissionais do plano, a criação é bloqueada.

Operações: `create-organization-member`, `activate-organization-member`, `inactivate-organization-member`, `list-organization-members`.

### `organization-invites`

Convite por email para alguém virar `OrganizationMember`. Só um convite `PENDING` por email por organização (índice único parcial). Só o `OWNER` pode convidar (`OnlyOwnerCanInviteException`). Fluxo: criar → aceitar/rejeitar/cancelar.

### `organization-addresses`

Endereço da organização, formato brasileiro (CEP, IBGE, DDD, etc.). CRUD simples, indexado por `organization_id`.

### `service-categories`

Categorias para organizar os serviços de uma organização (ex: "Cabelo", "Unhas"). Nome único por organização.

### `organization-services`

O catálogo de serviços que a organização oferece: nome, descrição, preço, duração em minutos, categoria (opcional), `active`. Nome único por organização. Criar um novo serviço também passa pelo `EnforcePlanLimitUseCase` — bloqueado se a org atingiu o limite de serviços do plano.

### `customer`

Os clientes da organização (quem agenda horários) — nome, email, telefone, opcionalmente vinculado a um `User` do sistema. Criar cliente também passa pelo `EnforcePlanLimitUseCase` (limite de clientes do plano).

### `appointments` — ⚠️ stub, não implementado

Só existe a entidade (`Appointment`: data/hora, duração, preço, status, vínculos com organização/profissional/cliente/serviço) e o enum de status. **Não tem módulo, controller, repositório nem use-cases — não está registrado em `app.module.ts`.** É o próximo módulo core a ser construído (é o "agendamento" que dá nome ao produto). Já tem um índice único (`organization_id + professional_id + appointment_date`) pensado para impedir choque de horário do mesmo profissional.

### `media`

Upload e gestão de arquivos (fotos de perfil, logo de organização, imagens de serviço), com armazenamento em S3 e URLs pré-assinadas. Guarda `owner_type`/`owner_id` genérico + `storage_key`, `mime_type`, `size`, `checksum`. Regras: no máximo 1 foto de perfil por usuário por organização, no máximo 1 logo por organização (índices únicos parciais).

### `plans`

Catálogo de planos — **campos rígidos** (não é um sistema de feature flags dinâmico, é decisão consciente pela simplicidade). Três planos seedados no boot da aplicação (`SeedPlansService`, idempotente por `key`): `STARTER`, `PROFESSIONAL`, `BUSINESS`. Cada plano tem `max_professionals`, `max_services`, `max_customers`, `integrations_limit`, `storage_limit_mb`, `landing_page_templates_count`, `inventory_enabled`/`inventory_max_skus`, `support_tier`. Não existe endpoint de escrita — só `GET /plans` (público, para tela de pricing).

### `subscriptions`

Liga uma `Organization` a um `Plan` e ao estado de cobrança na AbacatePay. Uma linha por organização (`organization_id` único). Estados: `TRIALING` → `ACTIVE` → (`PAST_DUE` | `CANCELED` | `EXPIRED`).

Principais peças:
- `CreateSubscriptionUseCase` — chamado durante a criação da organização; cria o customer e a subscription na AbacatePay, guarda `trial_ends_at` (30 dias) e retorna a URL de checkout onde o dono cadastra o cartão.
- `EnforcePlanLimitUseCase` — use case reutilizável, injetado em `organization-members`, `organization-services` e `customer`, que barra criação além do limite do plano ativo.
- `ChangeSubscriptionPlanUseCase` / `CancelSubscriptionUseCase` — endpoints `PATCH /organizations/subscription/plan` e `DELETE /organizations/subscription`, restritos a `OWNER`.
- Webhook (`POST /webhooks/abacate-pay`) — recebe eventos `subscription.renewed`/`completed`/`cancelled` da AbacatePay e atualiza o status local. Autenticado via HMAC-SHA256 no header `X-Webhook-Signature`.

### `abacate-pay`

Camada fina de integração com o SDK da AbacatePay (`@abacatepay/sdk`). Expõe `AbacatePayService` com métodos tipados (`createCustomer`, `createSubscription`, `cancelSubscription`, `changePlan`, `createProduct`) que desembrulham a resposta `{data, error, success}` da API e lançam exceção em caso de falha.

> **Detalhe técnico importante:** `@abacatepay/sdk` é um pacote ESM-only, mas o projeto compila para CommonJS. Um `import` estático normal quebra em runtime (`ERR_PACKAGE_PATH_NOT_EXPORTED`). A solução está em `abacate-pay.module.ts`, usando `new Function('return import(...)')` para forçar um `import()` nativo do Node em vez do `require()` que o TypeScript geraria. Não remover esse workaround sem entender o motivo.

---

## Fluxos importantes

### Criar organização (signup)
```
POST /organizations { slug, name, plan_id, owner_tax_id, ... }
  → valida slug livre
  → cria Organization
  → cria OrganizationMember (role: OWNER)
  → cria Customer + Subscription na AbacatePay (status: TRIALING, trial 30 dias)
  ← { organization, checkoutUrl }   // dono precisa acessar checkoutUrl pra cadastrar cartão
```

### Ciclo de cobrança
```
TRIALING  --(webhook subscription.renewed/completed)--> ACTIVE
ACTIVE    --(DELETE /organizations/subscription, owner)--> CANCELED
ACTIVE    --(webhook subscription.cancelled)--> CANCELED
```

### Enforcement de limite de plano
Toda criação de profissional/serviço/cliente conta quantos já existem na organização e chama `EnforcePlanLimitUseCase.execute(organizationId, 'professionals'|'services'|'customers', count)`. Se não houver assinatura vinculada, o enforcement não bloqueia (fail-open) — não deveria acontecer em produção, já que toda organização nasce com uma subscription.

---

## Coisas a saber antes de mexer no código

- **Sem migrations.** Mudou uma entidade? O schema sincroniza sozinho no próximo boot (`DB_SYNC=true`). Não crie pasta `migrations/`.
- **`strictNullChecks: false`** no `tsconfig.json`. Retornos `T | null` (como `GetExisting<Entity>UseCase`) são tratados como `T` direto no restante do código — é o padrão do projeto, não um bug.
- **Sem testes automatizados nos use-cases.** Jest está configurado (`pnpm test`) mas nenhum módulo de negócio tem `.spec.ts` ainda. Verificação hoje é manual (subir a app, testar via Swagger/curl).
- **Erros de domínio ficam em `<module>/errors/`**, não em `<module>/shared/errors/`.
- **Controllers retornam a entidade direto**, tipada como o DTO de output por shape estrutural — não existe um `DtoMapper` implementado, apesar de `.claude/rules/nestjs-module-structure.md` sugerir esse padrão.
- **`docs.ts` usa `applyDecorators(...)` cru** — não existem helpers `ApiDocsCreate`/`NotFound`/`Conflict`.
