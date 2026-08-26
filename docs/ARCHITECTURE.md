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
| Catálogo & Atendimento | `service-categories`, `organization-services`, `customer`, `working-hours`, `appointments` |
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

### `working-hours`

Configuração de "quando cada profissional atende", em 3 camadas de fallback (mais específico → mais genérico):
1. **`ProfessionalScheduleException`** — exceção pontual pra um intervalo de datas de um profissional: folga/férias (`is_available: false`) ou horário estendido nesse período (`is_available: true` com `start_time`/`end_time` próprios).
2. **`ProfessionalWorkingHours`** — horário semanal do profissional (linha só existe se ele tiver um horário diferente do padrão da organização naquele `day_of_week`).
3. **`OrganizationWorkingHours`** — horário semanal padrão da organização (fallback final).

`day_of_week` é inteiro 0–6, mesma convenção de `Date.prototype.getDay()` (0 = domingo). A peça central é `GetProfessionalAvailabilityWindowUseCase` — resolve a cadeia inteira e devolve `{available, start_time, end_time}` pra uma data; é consumida pelo módulo `appointments` (cálculo de vagas e validação de criação).

Operações: `set/get-organization-working-hours` (`OWNER`-only pra escrita), `set/get-professional-working-hours` e `create/list/delete-schedule-exception` (`OWNER` ou o próprio profissional pra escrita, via `AssertOwnerOrSelfUseCase`).

### `appointments`

O núcleo do produto. `Appointment` guarda `appointment_date` (timestamp com timezone), `duration_minutes` e `price` — **snapshot** copiado de `OrganizationService` no momento da criação (histórico não muda se o serviço mudar de preço depois), `status` (`PENDING → CONFIRMED → COMPLETED`, `PENDING|CONFIRMED → CANCELED`, `CONFIRMED → NO_SHOW`; `RESCHEDULED`/`TRANSFERRED` existem no enum mas nenhum endpoint os produz ainda), e vínculos com organização/profissional/cliente/serviço.

Operações:
- `GET /appointments/available-slots` — o endpoint BFF: recebe profissional + serviço + data, combina `working-hours` (via `GetProfessionalAvailabilityWindowUseCase`) com os agendamentos já existentes, e devolve a lista pronta de horários clicáveis do tamanho exato da duração do serviço. O frontend não calcula nada — nem vaga, nem overlap, nem fuso.
- `POST /appointments` — cria um agendamento com `status: PENDING`. Revalida servidor-side tudo que `available-slots` já tinha calculado (nunca confia num slot vindo do cliente).
- `GET /appointments`, `GET /appointments/:id` — listagem paginada (filtros: profissional, cliente, status, intervalo de datas) e busca por id.
- `PATCH /appointments/:id/confirm|complete|cancel|no-show` — transições de status, validadas contra uma tabela fixa de transições permitidas (`ALLOWED_STATUS_TRANSITIONS`).

**Não-sobreposição de horário.** O índice único (`organization_id + professional_id + appointment_date`) só impede o mesmo timestamp exato duas vezes — não impede sobreposição de intervalos (ex: 10:00–10:30 e 10:15–10:45 passam por ele sem problema). A proteção real acontece em código de aplicação na criação: dentro de uma transação, `pg_advisory_xact_lock(hashtext(professional_id))` serializa criações concorrentes pro mesmo profissional, seguido de uma query de overlap (`appointment_date < fim_novo AND appointment_date + duration_minutes > início_novo`) antes do insert.

### `media`

Upload e gestão de arquivos (fotos de perfil, logo de organização, imagens de serviço), com armazenamento em S3 e URLs pré-assinadas. Guarda `owner_type`/`owner_id` genérico + `storage_key`, `mime_type`, `size`, `checksum`. Regras: no máximo 1 foto de perfil por usuário por organização, no máximo 1 logo por organização (índices únicos parciais).

### `plans`

Catálogo de planos — **campos rígidos** (não é um sistema de feature flags dinâmico, é decisão consciente pela simplicidade). Três planos seedados no boot da aplicação (`SeedPlansService`, idempotente por `key`): `SOLO`, `TEAM`, `STUDIO`. Cada plano tem `price_cents`/`annual_price_cents` (anual cobrado à vista via Pix, sem subscription recorrente), `max_professionals` (`null` = ilimitado, caso do `STUDIO`), `max_services`, `storage_limit_mb`, `landing_page_templates_count`, `inventory_enabled`/`inventory_max_skus`, `support_tier`. Não existe endpoint de escrita — só `GET /plans` (público, para tela de pricing).

Cada plano tem **dois** Products na AbacatePay, criados manualmente antes do boot (nunca em runtime), com os ids obrigatórios em env:
- `abacate_product_id` (`ABACATE_PAY_PLAN_SOLO_PRODUCT_ID` / `_TEAM_` / `_STUDIO_`) — Product com `cycle: MONTHLY`, usado na subscription recorrente cobrada no cartão.
- `abacate_annual_product_id` (`ABACATE_PAY_PLAN_SOLO_ANNUAL_PRODUCT_ID` / `_TEAM_` / `_STUDIO_`) — Product **avulso** (sem `cycle`), usado só como item de um checkout único via Pix. Não usa `cycle: ANNUALLY`: esse valor cobraria no cartão (taxa ~3,5% + R$0,60) em vez de Pix (R$0,80 fixo), anulando a vantagem de margem do plano anual.

`SeedPlansService` (`src/modules/plans/services/seed-plans.service.ts`) só grava os ids que já vieram prontos do env.

### `subscriptions`

Liga uma `Organization` a um `Plan` e ao estado de cobrança na AbacatePay. Uma linha por organização (`organization_id` único). Estados: `TRIALING` → `ACTIVE` → (`PAST_DUE` | `CANCELED` | `EXPIRED`).

Principais peças:
- `CreateSubscriptionUseCase` — chamado durante a criação da organização; cria o customer e um *checkout de assinatura* na AbacatePay (`POST /subscriptions/create` devolve `bill_…`, **não** `subs_…`). Guarda `abacate_checkout_id` = `bill_…`, deixa `abacate_subscription_id` null, seta `trial_ends_at` (30 dias) e retorna a URL do checkout. O `subs_…` só chega no webhook `subscription.completed`.
- `EnforcePlanLimitUseCase` — use case reutilizável, injetado em `organization-members` e `organization-services`, que barra criação além do limite do plano ativo (`professionals`/`services`; sem gate de clientes). Limite `null` no plano (ex: `max_professionals` do `STUDIO`) sempre passa.
- `ChangeSubscriptionPlanUseCase` / `CancelSubscriptionUseCase` — endpoints `PATCH /organizations/subscription/plan` e `DELETE /organizations/subscription`, restritos a `OWNER`.
- `CreateAnnualCheckoutUseCase` — endpoint `POST /organizations/subscription/annual-checkout`, restrito a `OWNER`. Cancela a subscription recorrente de cartão (se houver) e cria um checkout avulso Pix (`frequency: ONE_TIME`, `methods: ['PIX']`) referenciando `Plan.abacate_annual_product_id`, com `externalId` = organizationId. Não marca a subscription como `ANNUAL`/`ACTIVE` sozinho — isso só acontece quando o webhook `checkout.completed` confirma o pagamento.
- `CreateSubscriptionCheckoutUseCase` — endpoint `POST /organizations/subscription/checkout`, restrito a `OWNER`. Reemite o checkout de cartão mensal: cancela só se `abacate_subscription_id` for `subs_…` (nunca chama cancel com `bill_…`), cria outro checkout via `AbacatePayService.createSubscription`, grava o novo `bill_…` em `abacate_checkout_id`. Cobre trial abandonado (`dayOfProcessing` = `trial_ends_at`) e reativação `PAST_DUE`/`EXPIRED` (cobra a partir de hoje). Não marca `ACTIVE` — depende do webhook `subscription.completed`.
- Webhook (`POST /webhooks/abacate-pay`) — payload real v2 usa `data.checkout` (não `data.billing` do tipo SDK). `checkout.completed` com `frequency: SUBSCRIPTION` só amarra o `bill_…` em `abacate_checkout_id`; ativação anual (Pix `ONE_TIME`) seta `ANNUAL`/`ACTIVE`. `subscription.completed`/`renewed`/`trial_started` resolvem a linha local por `subs_…` **ou** `checkout.externalId` (= organizationId) **ou** `bill_…` (inclui legado gravado em `abacate_subscription_id`), gravam o `subs_…` real e promovem pra `ACTIVE`. `subscription.cancelled` cancela. Autenticado via HMAC-SHA256 (`X-Webhook-Signature`). Idempotente via `AbacatePayWebhookEvent.event_id` único.
- `ExpireStaleSubscriptionsUseCase` — cron diário (`@nestjs/schedule`, `EVERY_DAY_AT_3AM`) que cobre cobrança recorrente falha: **AbacatePay não avisa falha de cobrança por webhook**, só sucesso (`subscription.renewed`) ou cancelamento terminal (`subscription.cancelled`), e o Pix avulso do anual não tem retry nenhum. A varredura marca `ACTIVE` com `current_period_end` vencido como `PAST_DUE` (qualquer ciclo), depois `PAST_DUE` como `EXPIRED` após uma janela por ciclo: 9 dias pro `MONTHLY` (janela do `retryPolicy: {maxRetry: 3, retryEvery: 3}` da AbacatePay), 5 dias pro `ANNUAL` (carência de negócio, sem retry externo).
- `SendRenewalReminderEmailsUseCase` — cron diário (`EVERY_DAY_AT_8AM`) que envia email ao dono nos 30/15/3 dias antes do `current_period_end` de assinaturas `ANNUAL` ativas. Idempotente via `Subscription.last_renewal_reminder_days_before` (reseta pra `null` a cada renovação).
- `SubscriptionStatusGuard` (`src/modules/auth/guards`) — `APP_GUARD` global que bloqueia (403) qualquer rota `@TenantScoped()` quando `subscription.status` não é `ACTIVE`. **`TRIALING` também bloqueia** — é só "assinatura criada, aguardando checkout de cartão"; o trial não libera acesso sozinho, só quando o webhook `subscription.completed` confirma o cartão e promove pra `ACTIVE` (a cobrança em si só acontece depois, no `dayOfProcessing`). Fail-open se a organização não tiver subscription (não deveria acontecer em produção). Os 5 endpoints do próprio módulo de billing (`GET/PATCH/DELETE /organizations/subscription`, `POST /organizations/subscription/annual-checkout`, `POST /organizations/subscription/checkout`) usam `@SkipSubscriptionGuard()` — senão uma organização travada em `TRIALING`/`PAST_DUE`/`EXPIRED` nunca conseguiria ver o problema nem pagar pra resolver.

### Ciclo de vida da assinatura anual (Pix avulso)
```
POST /organizations/subscription/annual-checkout (OWNER)
  → cancela subscription recorrente de cartão, se houver
  → cria checkout avulso Pix (Plan.abacate_annual_product_id, ONE_TIME, methods: [PIX])
  ← { checkoutUrl }
webhook checkout.completed (externalId = organizationId)
  → subscription.billing_cycle = ANNUAL, status = ACTIVE, current_period_end = agora + 365 dias
cron diário (3AM): current_period_end vencido → PAST_DUE → (5 dias depois) EXPIRED
cron diário (8AM): 30/15/3 dias antes do vencimento → email de renovação pro dono
```

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
  → cria Customer + checkout de assinatura na AbacatePay (bill_… em abacate_checkout_id; status local TRIALING; trial 30 dias)
  ← { organization, checkoutUrl }   // dono precisa acessar checkoutUrl pra cadastrar cartão
// sessão não é atualizada sozinha — o frontend precisa chamar POST /auth/switch-organization
// pra ativar a org recém-criada, e o acesso continua bloqueado (TRIALING) até subscription.completed.
```

### Ciclo de cobrança
```
TRIALING  --(guard bloqueia — aguardando checkout de cartão)
TRIALING  --(webhook subscription.completed/renewed)--> ACTIVE   // libera acesso
ACTIVE    --(DELETE /organizations/subscription, owner)--> CANCELED
ACTIVE    --(webhook subscription.cancelled)--> CANCELED
ACTIVE    --(cron ExpireStaleSubscriptionsUseCase, ciclo vencido)--> PAST_DUE --> EXPIRED
TRIALING|PAST_DUE|EXPIRED --(POST /organizations/subscription/checkout, owner)--> novo checkout de cartão
```

### Enforcement de limite de plano
Toda criação de profissional/serviço conta quantos já existem na organização e chama `EnforcePlanLimitUseCase.execute(organizationId, 'professionals'|'services', count)`. Se não houver assinatura vinculada, o enforcement não bloqueia (fail-open) — isso acontece de fato em produção durante o próprio signup: `CreateOrganizationUseCase` cria o `OrganizationMember` (dono, dispara o enforcement) antes de criar a `Subscription`, então a primeira checagem sempre roda sem assinatura ainda existir. Sem limite de nº de clientes em nenhum plano.

### Cálculo de disponibilidade (working-hours)
```
GetProfessionalAvailabilityWindowUseCase(professionalId, organizationId, date)
  → existe ProfessionalScheduleException cobrindo essa data?
      sim, is_available=false → { available: false }
      sim, is_available=true  → { available: true, start_time, end_time }  (da exceção)
  → existe ProfessionalWorkingHours pra esse day_of_week?
      sim, is_closed=true  → { available: false }
      sim, is_closed=false → { available: true, start_time, end_time }  (do profissional)
  → OrganizationWorkingHours pra esse day_of_week (fallback final)
      is_closed/ausente → { available: false }
      caso contrário     → { available: true, start_time, end_time }  (da organização)
```

### Criar agendamento
```
POST /appointments { appointment_date, professional_id, customer_id, organization_service_id }
  → valida serviço/cliente/profissional existem e pertencem à organização
  → resolve availability window (fluxo acima) pra data do agendamento
  → valida que [appointment_date, appointment_date + duration) cabe dentro da window
  → abre transação:
      pg_advisory_xact_lock(hashtext(professional_id))   // serializa concorrência pro mesmo profissional
      SELECT overlap na agenda do profissional            // 409 se encontrar
      INSERT Appointment status=PENDING
```

---

## Coisas a saber antes de mexer no código

- **Sem migrations.** Mudou uma entidade? O schema sincroniza sozinho no próximo boot (`DB_SYNC=true`). Não crie pasta `migrations/`.
- **`strictNullChecks: false`** no `tsconfig.json`. Retornos `T | null` (como `GetExisting<Entity>UseCase`) são tratados como `T` direto no restante do código — é o padrão do projeto, não um bug.
- **Sem testes automatizados nos use-cases.** Jest está configurado (`pnpm test`) mas nenhum módulo de negócio tem `.spec.ts` ainda. Verificação hoje é manual (subir a app, testar via Swagger/curl).
- **Erros de domínio ficam em `<module>/errors/`**, não em `<module>/shared/errors/`.
- **Controllers retornam a entidade direto**, tipada como o DTO de output por shape estrutural — não existe um `DtoMapper` implementado, apesar de `.claude/rules/nestjs-module-structure.md` sugerir esse padrão.
- **`docs.ts` usa `applyDecorators(...)` cru** — não existem helpers `ApiDocsCreate`/`NotFound`/`Conflict`.
- **Timezone fixo `America/Sao_Paulo` (`-03:00`), sem `date-fns-tz`.** `appointments`/`working-hours` montam datetime local com o offset fixo direto (`` `${date}T${time}-03:00` ``) — sistema é 100% BR e o país não observa horário de verão desde 2019. Se isso mudar, esse offset hardcoded quebra silenciosamente; não tem coluna de timezone em lugar nenhum.
- **AbacatePay não tem webhook de "cobrança falhou".** Conferido no enum real (`@abacatepay/types`, `WebhookEventType`) — só existe sucesso/cancelamento pra assinatura. `PAST_DUE`/`EXPIRED` dependem do cron `ExpireStaleSubscriptionsUseCase`, não de evento.
- **Sobreposição de agendamento é garantida em código, não em schema.** Sem sistema de migrations não dá pra usar `EXCLUDE USING gist` do Postgres. A exclusão mútua é `pg_advisory_xact_lock(hashtext(professional_id))` dentro da transação de criação, seguido de uma query de overlap — ver "Criar agendamento" acima. Se o projeto adotar migrations no futuro, trocar para `EXCLUDE CONSTRAINT` é o upgrade natural.
- **`normalizeGetExistingOptions` (`shared/helpers/`) default `throwIfNotFound: true` quando nenhum options object é passado.** Chamar `getExisting<Entity>UseCase.execute({ where: {...} })` sem segundo argumento lança em vez de devolver `null` — quebra qualquer call site que espera semântica fail-open implícita. Todo call site que precisa de "não achou, tudo bem" tem que passar `{ where: {...} }, { throwIfNotFound: false }` explicitamente (ver `EnforcePlanLimitUseCase` e `SubscriptionStatusGuard`, ambos corrigidos depois de cair nessa pegadinha durante o signup — a checagem de limite de plano roda antes da subscription existir, ver "Enforcement de limite de plano" acima).
- **`@abacatepay/types@3.0.3` tem gaps entre o tipo declarado e a API real (v2).** Dois já mapeados em `CreateSubscriptionUseCase`: (1) `RESTPostCreateSubscriptionBody` não declara `items`, mas a API v2 exige o campo (erro real: `"Property 'items' is missing"`) — mesmo shape do checkout avulso, `{ id: string; quantity: number }[]` com o `id` sendo o product id da AbacatePay (`Plan.abacate_product_id`); (2) `RESTPostCreateSubscriptionData`/`APISubscription` não declara `url` na resposta, apesar de a API devolver — o código já faz cast pra extrair o `checkoutUrl`. Qualquer novo campo "faltando" do SDK nessa área provavelmente é gap de tipo, não erro de uso — checar a doc real (docs.abacatepay.com) antes de assumir que o campo não existe.
