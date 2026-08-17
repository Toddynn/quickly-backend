# Prompt para design das telas — Quickly

> Copie tudo abaixo da linha e cole no Claude (Claude Design / artifact de UI). O bloco é autocontido: não depende de acesso ao repositório.

---

## Papel

Você é designer de produto + engenheiro de front-end sênior. Sua entrega é o **design de interface completo** de um SaaS de agendamentos B2B chamado **Quickly**, usando **shadcn/ui + Tailwind CSS v4** como design system. Você projeta telas reais, navegáveis e com estados — não wireframes vagos, não mocks decorativos.

Referência normativa do design system: https://ui.shadcn.com/llms.txt — use **apenas** componentes que existem lá (`Button`, `Card`, `Table`, `DataTable`, `Dialog`, `Sheet`, `Drawer`, `Form`, `Input`, `Select`, `Combobox`, `Command`, `Calendar`, `Popover`, `Tabs`, `Badge`, `Avatar`, `Alert`, `AlertDialog`, `Sidebar`, `Breadcrumb`, `Skeleton`, `Separator`, `Switch`, `Tooltip`, `DropdownMenu`, `Sonner`, `Chart`, `Pagination`, `Progress`, `Empty`, `Field`, `InputOTP`, `ScrollArea`, `Toggle Group`). Se precisar de algo que não existe no shadcn, componha a partir dos primitivos e diga explicitamente que é um componente composto.

## Design tokens (obrigatório — não invente cores)

Toda cor deve vir de variável CSS. Nunca hardcode hex/oklch em componente. Primary é um verde-esmeralda dessaturado; charts usam uma escala âmbar→terracota **deliberadamente diferente** da primary (não force o verde em gráficos).

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.508 0.118 165.612);
  --primary-foreground: oklch(0.979 0.021 166.113);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.508 0.118 165.612);
  --accent-foreground: oklch(0.979 0.021 166.113);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.837 0.128 66.29);
  --chart-2: oklch(0.705 0.213 47.604);
  --chart-3: oklch(0.646 0.222 41.116);
  --chart-4: oklch(0.553 0.195 38.402);
  --chart-5: oklch(0.47 0.157 37.304);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.596 0.145 163.225);
  --sidebar-primary-foreground: oklch(0.979 0.021 166.113);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.432 0.095 166.913);
  --primary-foreground: oklch(0.979 0.021 166.113);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.432 0.095 166.913);
  --accent-foreground: oklch(0.979 0.021 166.113);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.837 0.128 66.29);
  --chart-2: oklch(0.705 0.213 47.604);
  --chart-3: oklch(0.646 0.222 41.116);
  --chart-4: oklch(0.553 0.195 38.402);
  --chart-5: oklch(0.47 0.157 37.304);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.696 0.17 162.48);
  --sidebar-primary-foreground: oklch(0.262 0.051 172.552);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

Regras de token:
- `--accent` == `--primary` neste tema. Não use `accent` esperando contraste com `primary` — para hover sutil de item de lista use `secondary`/`muted`.
- `--radius: 0.625rem` (10px). Todo card/input/botão herda dele.
- Status de agendamento e de assinatura precisam de cores semânticas que o tema **não** define. Derive com `Badge` variants e opacidade sobre `--muted-foreground` / `--primary` / `--destructive` / `--chart-1`, e documente o mapeamento uma única vez num bloco "Status color map". Não crie 6 cores novas soltas.
- Suporte a dark mode é requisito, não bônus: toda tela deve ser mostrada/verificada nos dois temas.

---

## O produto (contexto de domínio)

SaaS de **gestão de agendamentos** para micro e pequenos negócios brasileiros (salões, barbearias, clínicas, prestadores de serviço). Modelo multi-tenant pago por assinatura mensal.

Vocabulário do domínio (use exatamente esses termos na UI, em pt-BR):

| Conceito | Termo na UI | Significado |
|---|---|---|
| `Organization` | Organização / Negócio | O tenant. Tem `slug` público, nome, descrição, logo |
| `OrganizationMember` | Profissional / Equipe | Vínculo Usuário↔Organização com `role` (`OWNER` \| `PROFESSIONAL`) e `active` |
| `Customer` | Cliente | Quem agenda. Nome, email, telefone; opcionalmente ligado a um `User` |
| `OrganizationService` | Serviço | Item do catálogo: nome, descrição, preço, duração em minutos, categoria, `active` |
| `ServiceCategory` | Categoria | Agrupador de serviços ("Cabelo", "Unhas"). Nome único por organização |
| `Appointment` | Agendamento | Data/hora, duração, preço (snapshot), status, profissional, cliente, serviço |
| `WorkingHours` | Horário de atendimento | Grade semanal da organização e por profissional |
| `ScheduleException` | Exceção de agenda | Folga/férias ou horário estendido num intervalo de datas |
| `Plan` / `Subscription` | Plano / Assinatura | `STARTER`, `PROFESSIONAL`, `BUSINESS`; assinatura cobrada via AbacatePay |

### Regras de negócio que a UI **precisa** refletir

1. **Organização ativa é estado de sessão, não parâmetro de URL.** O usuário pode pertencer a várias organizações; trocar é uma ação explícita (`POST /auth/switch-organization`) que recarrega todo o contexto. Precisa existir um **organization switcher** no topo da sidebar (padrão `Sidebar` + `DropdownMenu` do shadcn) e a troca deve deixar óbvio que os dados abaixo mudaram.
2. **Permissão é relativa à organização ativa**, não global. O mesmo usuário pode ser `OWNER` na org A e `PROFESSIONAL` na org B. A UI muda conforme o role ativo:
   - `OWNER`: tudo. Único que cria/convida profissionais, cria serviços e categorias, edita horário da organização, deleta clientes, muda/cancela plano, edita e deleta a organização.
   - `PROFESSIONAL`: vê a agenda, cria agendamentos, faz transições de status, gerencia clientes, edita **o próprio** horário e as **próprias** exceções de agenda. Não vê nem acessa configurações de plano/cobrança/equipe.
   - Ações sem permissão devem estar **ausentes** da UI (não desabilitadas com tooltip), exceto quando a ausência confunde — nesses casos, `Tooltip` explicando.
3. **Autenticação por sessão (cookie), não JWT.** Não existe tela de "colar token". Sessão expirada = redirect para login com aviso via `Sonner`. Existe `POST /auth/refresh`.
4. **Signup é um fluxo de 3 partes, não um formulário.** Criar conta → criar organização (escolhendo plano + CPF/CNPJ do dono) → o backend devolve `{ organization, checkoutUrl }` e o dono precisa acessar `checkoutUrl` (AbacatePay, externo) para cadastrar o cartão. Trial de 30 dias começa já. A UI tem que:
   - validar o `slug` em tempo real (`GET /organizations/check-slug-availability/:slug`), mostrando disponível/indisponível inline;
   - deixar o `checkoutUrl` impossível de perder — tela dedicada de "Ativar assinatura" com o link, não um toast;
   - mostrar banner persistente de trial ("Trial termina em X dias — cadastre um cartão") enquanto a assinatura estiver `TRIALING`.
5. **Limites de plano bloqueiam criação.** Criar profissional, serviço ou cliente falha com erro quando a organização atingiu `max_professionals` / `max_services` / `max_customers`. A UI deve mostrar consumo **antes** do erro (ex: "8 de 10 profissionais") e, no bloqueio, oferecer upgrade em vez de só mostrar erro.
6. **Estados de assinatura:** `TRIALING` → `ACTIVE` → (`PAST_DUE` | `CANCELED` | `EXPIRED`). `PAST_DUE` significa cobrança recorrente falhada, com janela de retry de ~9 dias antes de `EXPIRED`. Cada estado tem tratamento visual próprio (banner global em `PAST_DUE`, bloqueio suave em `EXPIRED`).
7. **O backend calcula disponibilidade; o front nunca calcula horário.** `GET /appointments/available-slots?date&professional_id&organization_service_id` devolve a lista pronta de slots `{start, end}` em ISO, já do tamanho exato da duração do serviço, já sem overlap com agendamentos existentes. O front **renderiza** slots, não gera grade nem faz aritmética de fuso. Se voltar `[]`, é indisponibilidade — trate como empty state informativo ("Profissional não atende nesta data" vs "Todos os horários ocupados", quando distinguível).
8. **Timezone fixo `America/Sao_Paulo` (-03:00).** Sistema 100% BR. Formate datas em pt-BR (`dd/MM/yyyy`, `HH:mm`), moeda em BRL, telefone e CPF/CNPJ com máscara brasileira, CEP com autopreenchimento de endereço.
9. **Preço e duração do agendamento são snapshot** copiados do serviço na criação. Editar o serviço não muda o histórico. Na tela de detalhe do agendamento, deixe claro que aquele valor é o congelado (ex: "R$ 80,00 — valor no momento do agendamento").
10. **Transições de status são uma máquina de estados fixa:**
    - `PENDING` → `CONFIRMED` | `CANCELED`
    - `CONFIRMED` → `COMPLETED` | `CANCELED` | `NO_SHOW`
    - `COMPLETED`, `CANCELED`, `NO_SHOW` são terminais
    - `RESCHEDULED`/`TRANSFERRED` existem no enum mas **nenhum endpoint os produz** — não desenhe UI para eles.
    A UI só oferece a ação válida para o status atual. Cancelar e marcar falta usam `AlertDialog` de confirmação.
11. **Horário de atendimento tem 3 camadas de fallback** (mais específico ganha): exceção pontual do profissional → grade semanal do profissional → grade semanal da organização. A tela de horário do profissional precisa mostrar visualmente **de onde cada dia vem** ("herdado da organização" vs "personalizado"), senão o usuário não entende por que mudar a organização não mudou o profissional.
12. `day_of_week` é `0..6` com `0 = domingo` (convenção `Date.getDay()`).
13. **Convites:** só `OWNER` convida, por email, e só existe **um convite `PENDING` por email por organização**. Quem recebe vê os convites numa área própria (`GET /organization-invites/received`) e aceita/rejeita. Quem convidou pode cancelar.
14. **Mídia:** upload de foto de perfil, logo da organização e imagem de serviço via S3 com URL pré-assinada. Máximo 1 foto de perfil por usuário por organização e 1 logo por organização — a UI é sempre "substituir", nunca "adicionar mais uma".

---

## Superfície de API real (fonte da verdade para os dados de cada tela)

Todas as rotas marcadas *tenant* exigem organização ativa na sessão. *owner* = restrita a `OWNER`.

**Auth & conta**
- `POST /auth/login` (público), `POST /auth/logout`, `POST /auth/refresh`, `POST /auth/switch-organization`
- `POST /users` (público — cadastro), `GET /users/me`, `PATCH /users`
- `PATCH /users/profile-picture` *tenant*, `DELETE /users/profile-picture` *tenant*
- `POST /password-reset/request` → `POST /password-reset/verify-otp` → `POST /password-reset/reset` (todos públicos, OTP com limite de tentativas e expiração)
- `POST /email-confirmation/request-email-verification`, `/validate-otp`, `/confirm`, `/request-email-change`

**Organização & equipe**
- `GET /organizations`, `GET /organizations/:id`, `GET /organizations/check-slug-availability/:slug`
- `POST /organizations` → `{ organization, checkoutUrl }`
- `PATCH /organizations` *tenant, owner*, `DELETE /organizations` *tenant, owner* (soft delete)
- `GET /organization-members` *tenant*, `POST /organization-members` *tenant, owner*, `PATCH /organization-members/:id/activate|inactivate` *tenant, owner*, `DELETE /organization-members/:id` *tenant, owner*
- `GET|POST /organization-invites` *tenant* (POST *owner*), `GET /organization-invites/received`, `GET /organization-invites/:id`, `PATCH /organization-invites/:id/accept|reject|cancel`
- `GET|POST /organization-addresses` *tenant* (POST *owner*), `GET|PATCH|DELETE /organization-addresses/:id`

**Catálogo & clientes**
- `GET /service-categories` *tenant*, `POST` *tenant, owner*, `GET|PATCH|DELETE /service-categories/:id`
- `GET /organization-services` *tenant*, `POST` *tenant, owner*, `GET|PATCH|DELETE /organization-services/:id`, `PATCH /organization-services/:id/activate|inactivate`
- `GET|POST /customers` *tenant*, `GET|PATCH /customers/:id`, `DELETE /customers/:id` *owner*, `PATCH /customers/:id/link-user` *owner*

**Horários**
- `GET /organizations/working-hours` *tenant*, `PUT /organizations/working-hours` *tenant, owner*
- `GET|PUT /organization-members/:professionalId/working-hours` *tenant*
- `GET|POST /organization-members/:professionalId/schedule-exceptions` *tenant*, `DELETE /schedule-exceptions/:id` *tenant*

**Agendamentos** (todos *tenant*)
- `GET /appointments/available-slots?date=YYYY-MM-DD&professional_id&organization_service_id` → `[{ start, end }]` ISO
- `POST /appointments` `{ appointment_date (ISO com -03:00), professional_id, customer_id, organization_service_id }` → status `PENDING`
- `GET /appointments?page&limit&professional_id&customer_id&status&from_date&to_date` (paginado)
- `GET /appointments/:id`
- `PATCH /appointments/:id/confirm|complete|cancel|no-show`

**Planos & assinatura**
- `GET /plans` (público) — campos: `key`, `name`, `price_cents`, `max_professionals`, `max_services`, `max_customers`, `integrations_limit`, `storage_limit_mb`, `landing_page_templates_count`, `inventory_enabled`, `inventory_max_skus`, `support_tier`
- `GET /organizations/subscription` *tenant* — `status`, `plan`, `trial_ends_at`, `current_period_end`, `canceled_at`
- `PATCH /organizations/subscription/plan` *tenant, owner*, `DELETE /organizations/subscription` *tenant, owner*

Erros da API vêm como `{ message, fields? }` — `message` é texto humano em pt-BR pronto para exibir; `fields` aponta o campo do formulário. Trate 409 (conflito: slug/nome/email duplicado, horário ocupado) e 403 (permissão) de forma distinta de 500.

---

## Telas a projetar

Projete **todas** as telas abaixo. Cada uma precisa de: layout, hierarquia visual, componentes shadcn nomeados, dados que consome (endpoint), variações por role, e os quatro estados — **loading (Skeleton), vazio (Empty), erro, sucesso**.

**A. Público / autenticação** (layout centrado, sem sidebar)
1. Login
2. Cadastro de conta
3. Esqueci minha senha (3 passos: email → `InputOTP` → nova senha)
4. Verificação de email (OTP)
5. Pricing público (`GET /plans`, comparativo de 3 planos)

**B. Onboarding**
6. Criar organização — formulário com validação de slug em tempo real, upload de logo, seleção de plano, CPF/CNPJ do dono
7. Ativar assinatura — tela pós-criação com o `checkoutUrl`, explicando o trial de 30 dias
8. Sem organização — usuário logado que não pertence a nenhuma org: criar uma ou ver convites recebidos
9. Convites recebidos — aceitar/rejeitar

**C. App autenticado** (shell com `Sidebar` colapsável + organization switcher + `Breadcrumb` + menu do usuário + toggle de tema)
10. **Dashboard** — agendamentos de hoje, próximos, KPIs do dia/semana, consumo de plano (`Progress`), gráfico de agendamentos por período usando `Chart` + `--chart-1..5`
11. **Agenda (calendário)** — visão principal do produto. Views dia/semana; blocos de agendamento posicionados por hora com cor por status; filtro por profissional; navegação de datas. Densidade alta mas legível.
12. **Novo agendamento** — o fluxo mais crítico: escolher cliente (`Combobox` com busca + criar novo inline) → serviço (mostrando preço e duração) → profissional → data (`Calendar`) → **slot** (grid de horários vindos de `available-slots`, com estado de carregamento próprio ao trocar data/profissional/serviço) → confirmar com resumo. Desenhe como `Sheet`/`Drawer` a partir da agenda **e** como página cheia.
13. **Lista de agendamentos** — `DataTable` paginada com filtros (profissional, cliente, status, intervalo de datas), badge de status, ações contextuais por status
14. **Detalhe do agendamento** — dados completos, valor congelado, timeline de status, ações válidas para o status atual
15. **Clientes** — lista paginada com busca, criar/editar em `Dialog`, detalhe com histórico de agendamentos, vincular a usuário (*owner*), deletar (*owner*, `AlertDialog`)
16. **Serviços** — lista agrupável por categoria, criar/editar (nome, descrição, preço BRL, duração em minutos, categoria, imagem), ativar/inativar, indicador de consumo do limite do plano
17. **Categorias de serviço** — CRUD simples, provavelmente em `Dialog` a partir da tela de serviços
18. **Equipe / Profissionais** *(owner)* — lista de membros com role e status ativo, ativar/inativar, remover, atalho para o horário de cada um, indicador de limite do plano
19. **Convites enviados** *(owner)* — lista com status, convidar por email, cancelar pendente
20. **Horário da organização** *(owner para editar)* — grade semanal de 7 dias com aberto/fechado e faixa de horário; salva tudo de uma vez (`PUT`)
21. **Horário do profissional** — mesma grade, mas mostrando por dia se é herdado da organização ou personalizado, com ação de "voltar a herdar"
22. **Exceções de agenda** — lista das exceções de um profissional + criar (intervalo de datas, indisponível *ou* horário especial) + deletar
23. **Configurações da organização** *(owner)* — dados, logo, slug (com aviso de impacto na URL pública), endereço brasileiro (CEP/IBGE/DDD), zona de perigo com exclusão
24. **Assinatura & plano** *(owner)* — plano atual, status, datas de trial/período, comparativo para upgrade/downgrade (`PATCH .../plan`), cancelar (`AlertDialog` com consequências), tratamento visual de `PAST_DUE`/`EXPIRED`
25. **Perfil do usuário** — dados pessoais, foto (substituir/remover), trocar senha, trocar email (fluxo OTP), lista das organizações a que pertence
26. **Estados globais** — 404, 403 (sem permissão no role atual), erro de servidor, sessão expirada, offline

---

## Diretrizes de qualidade

- **Mobile-first de verdade.** O dono de salão usa isso no celular entre atendimentos. Agenda, novo agendamento e transições de status precisam funcionar com uma mão. Tabelas viram cards no mobile; `Sidebar` vira `Sheet`.
- **Acessibilidade:** contraste AA nos dois temas, foco visível via `--ring`, labels reais em todo campo, `AlertDialog` para tudo destrutivo, alvos de toque ≥ 44px.
- **Feedback:** `Sonner` para resultado de ação; botão em loading com estado próprio; nunca uma ação destrutiva sem confirmação; nunca um formulário longo sem indicar erro por campo (use `fields` da API).
- **Empty states com ação**, não com frase triste: "Nenhum serviço cadastrado" + botão "Criar primeiro serviço" + uma linha explicando por que serviços são necessários para agendar.
- **Densidade adequada ao uso:** agenda e listas são densas (uso diário, muitos itens); configurações e onboarding são espaçados.
- **Nada de pirotecnia.** Animação só onde comunica: entrada de `Sheet`/`Dialog`, transição de estado de slot, skeleton→conteúdo. Sem parallax, sem gradiente decorativo, sem glassmorphism.
- **Consistência antes de criatividade.** Um padrão de página de lista, um padrão de formulário, um padrão de detalhe — repetidos. Se duas telas resolvem o mesmo problema de formas diferentes, uma está errada.
- Copy inteiramente em **pt-BR**, tom direto e sem jargão técnico. O usuário final não sabe o que é "tenant" nem "slug" — chame de "endereço do seu negócio (quickly.com/seu-negocio)".

## Formato da entrega

1. **Fundações** — bloco de tokens, escala tipográfica, escala de espaçamento, mapa de cor de status (agendamento e assinatura), inventário de componentes shadcn usados e para quê.
2. **Shell da aplicação** — sidebar/navegação por role, organization switcher, header, comportamento responsivo. Desenhe isso primeiro e reuse em tudo.
3. **As 26 telas**, agrupadas A→C, cada uma com: objetivo em uma frase, layout, componentes, dados/endpoint, variações por role, e os 4 estados.
4. **Fluxos ponta a ponta** anotados: signup→checkout→primeiro agendamento; novo agendamento; bloqueio por limite de plano→upgrade; `PAST_DUE`→regularização.
5. **HTML/React autocontido e navegável** para pelo menos: shell, dashboard, agenda, novo agendamento, lista de agendamentos, serviços, assinatura. Tokens inline, dark mode funcionando, dados mockados realistas em pt-BR (nomes brasileiros, serviços de salão/clínica, preços em BRL, horários comerciais).

Comece pelas Fundações e pelo Shell. Depois entregue as telas em ordem de criticidade de negócio: **agenda → novo agendamento → serviços → clientes → equipe/horários → assinatura → resto**.
