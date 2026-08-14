# Graph Report - quickly-backend  (2026-08-14)

## Corpus Check
- Corpus is ~43,443 words - fits in a single context window. You may not need a graph.

## Summary
- 2445 nodes · 5765 edges · 194 communities (135 shown, 59 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 202 edges (avg confidence: 0.8)
- Token cost: 37,299 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 167
- Community 168
- Community 169
- Community 170
- Community 171
- Community 172
- Community 173
- Community 174
- Community 175
- Community 176
- Community 177
- Community 178
- Community 179
- Community 180
- Community 181
- Community 182
- Community 183
- Community 184
- Community 185
- Community 186
- Community 187
- Community 188
- Community 189
- Community 191
- Community 192
- Community 193

## God Nodes (most connected - your core abstractions)
1. `PaginatedResponseDto` - 69 edges
2. `Organization` - 54 edges
3. `User` - 52 edges
4. `TenantScoped()` - 49 edges
5. `GetExistingUserUseCase` - 45 edges
6. `Media` - 44 edges
7. `ActiveOrganizationId` - 43 edges
8. `Customer` - 43 edges
9. `SessionUser` - 40 edges
10. `PaginationDto` - 36 edges

## Surprising Connections (you probably didn't know these)
- `GetExisting<Entity>UseCase Pattern (mandatory; rationale: avoids scattered direct findOne/findById repository calls across the codebase)` --calls--> `formatWhereClause()`  [EXTRACTED]
  .claude/rules/nestjs-module-structure.md → src/shared/helpers/format-where-clause.helper.ts
- `GetExisting<Entity>UseCase Pattern (mandatory; rationale: avoids scattered direct findOne/findById repository calls across the codebase)` --calls--> `normalizeGetExistingOptions()`  [EXTRACTED]
  .claude/rules/nestjs-module-structure.md → src/shared/helpers/normalize-get-existing-options.helper.ts
- `GetExisting<Entity>UseCase Pattern (mandatory; rationale: avoids scattered direct findOne/findById repository calls across the codebase)` --references--> `GetExistingOptions`  [EXTRACTED]
  .claude/rules/nestjs-module-structure.md → src/shared/interfaces/get-existing-options.ts
- `app service (quickly-backend NestJS container, pnpm run start:dev)` --conceptually_related_to--> `NestJS Module Structure Rules (Clean Architecture)`  [INFERRED]
  docker-compose.yaml → .claude/rules/nestjs-module-structure.md
- `pgsql service (Postgres 18 Alpine container)` --shares_data_with--> `TypeORM Entity Pattern (extends TimestampedBigIntEntity)`  [INFERRED]
  docker-compose.yaml → .claude/rules/nestjs-module-structure.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Developer Inspection/Admin Tooling Services (pgadmin, redis-commander, mailhog)** — docker_compose_pgadmin, docker_compose_redis_commander, docker_compose_mailhog [INFERRED 0.85]
- **Domain Error Handling Pattern (NotFound + AlreadyExists exceptions, thrown by GetExisting use case, documented via docs.ts)** — _claude_rules_nestjs_module_structure_notfound_exception, _claude_rules_nestjs_module_structure_alreadyexists_exception, _claude_rules_nestjs_module_structure_getexisting_usecase, _claude_rules_nestjs_module_structure_docs_pattern [INFERRED 0.85]
- **Standard Module Request Pipeline: Controller -> UseCase -> Repository -> Mapper** — _claude_rules_nestjs_module_structure_controller_pattern, _claude_rules_nestjs_module_structure_getexisting_usecase, _claude_rules_nestjs_module_structure_repository_interface, _claude_rules_nestjs_module_structure_mapper_pattern [INFERRED 0.85]

## Communities (194 total, 59 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): CustomerDto, ApiProperty, ApiPropertyOptional, ListCustomerResponseDto, MediaReferenceDto, ApiProperty, ApiPropertyOptional, OrganizationAddressDto (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (21): IsArray, FindAllOrganizationInvitesPaginationDto, ApiPropertyOptional, IsEnum, IsOptional, Transform, ListOrganizationInviteWithInviterResponseDto, OrganizationInviteDto (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (19): NotFoundUserException, UsersRepositoryInterface, USER_REPOSITORY_INTERFACE_KEY, Inject, GetExistingUserUseCase, Inject, Injectable, Inject (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (18): ReplaceUserProfilePictureMediaDto, DeleteMediaUseCase, Injectable, DeleteUserProfilePictureMediaUseCase, Inject, Injectable, ListMediaUseCase, Injectable (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (17): NotFoundOrganizationMemberException, OrganizationMemberAlreadyExistsException, OrganizationMembersRepositoryInterface, ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY, ActivateOrganizationMemberUseCase, Inject, Injectable, CreateOrganizationMemberUseCase (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (21): ListOrganizationMembersDto, ApiPropertyOptional, IsBoolean, IsOptional, IsUUID, Type, ListOrganizationMemberResponseDto, OrganizationMemberDto (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (28): MailerConfigService, Injectable, AuthModule, Module, CustomerModule, Module, EmailConfirmationModule, Module (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (6): GetExistingUserWithVerifiedEmailUseCase, Injectable, formatWhereClause(), NormalizedGetExistingOptions, normalizeGetExistingOptions(), GetExistingOptions

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (17): InvalidOrganizationInviteException, OrganizationInviteAlreadyExistsException, OrganizationInvitesRepositoryInterface, ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY, AcceptOrganizationInviteUseCase, Inject, Injectable, CancelOrganizationInviteUseCase (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (22): IsInt, ListOrganizationResponseDto, ApiProperty, ListOrganizationsDocs(), ListOrganizationsController, ApiCookieAuth, ApiTags, Controller (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (31): <Entity>AlreadyExistsException Domain Error Pattern, Controller Pattern (only talks to use cases, maps Entity->DTO via mapper, uses session auth guards), docs.ts Swagger Documentation Pattern (documents domain errors per endpoint), TypeORM Entity Pattern (extends TimestampedBigIntEntity), Module Folder Structure Convention (models/shared/use-cases), GetExisting<Entity>UseCase Pattern (mandatory; rationale: avoids scattered direct findOne/findById repository calls across the codebase), Input DTO Pattern (Create/Update/Pagination DTOs), DTO Mapper Pattern (Entity <-> DTO end-to-end typing) (+23 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): AlreadyLoggedInOrganizationException, NotMemberOfOrganizationException, SwitchOrganizationDto, ApiProperty, IsNotEmpty, IsUUID, SwitchOrganizationDocs(), SwitchOrganizationController (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (11): EmailAlreadyInUseException, EmailConfirmationAlreadyExistsException, EmailConfirmationAttemptsExceededException, NotFoundEmailConfirmationException, SameEmailError, EmailConfirmationRepositoryInterface, EmailConfirmationRepository, Injectable (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (11): DeleteMediaDto, DeleteUserProfilePictureMediaDto, UpdateMediaDto, Media, Column, Entity, Index, JoinColumn (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (23): IsNumber, IsPositive, CreateOrganizationServiceDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsOptional (+15 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (19): ApiProperty, IsNotEmpty, IsString, Length, ValidateEmailConfirmationOtpDto, ConfirmEmailController, ApiTags, Body (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (17): ListOrganizationAddressesDto, ApiPropertyOptional, IsOptional, IsUUID, ListOrganizationAddressResponseDto, OrganizationAddressesRepository, Injectable, ListOrganizationAddressesController (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (18): NotFoundOrganizationInviteException, OrganizationInvite, Column, Entity, Index, JoinColumn, ManyToOne, INVITE_STATUS (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (16): OrganizationService, Column, Entity, Index, JoinColumn, ManyToOne, GetOrganizationServiceDocs(), GetOrganizationServiceController (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (13): NotFoundMediaException, MediaRepositoryInterface, MEDIA_REPOSITORY_INTERFACE_KEY, STORAGE_PROVIDER_INTERFACE_KEY, GetExistingMediaUseCase, Inject, Injectable, Inject (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (17): EMAIL_CONFIRMATION_STATUS, ConfirmEmailUseCase, Inject, Injectable, GetExistingEmailConfirmationUseCase, Injectable, MarkEmailConfirmationAsValidatedUseCase, Inject (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (19): ListOrganizationServicesDto, ApiPropertyOptional, IsBoolean, IsOptional, IsUUID, ListOrganizationServiceResponseDto, OrganizationServicesRepository, Injectable (+11 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): UserAlreadyExistsException, CreateUserDto, ApiProperty, ApiPropertyOptional, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (20): CreateDateColumn, PrimaryColumn, Appointment, Column, Entity, Index, JoinColumn, ManyToOne (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (11): CustomerAlreadyExistsException, CustomerAlreadyLinkedException, CustomersRepositoryInterface, CUSTOMER_REPOSITORY_INTERFACE_KEY, Inject, Inject, GetExistingCustomerUseCase, Inject (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.19
Nodes (10): NotFoundOrganizationException, OrganizationAlreadyExistsException, OrganizationsRepositoryInterface, ORGANIZATION_REPOSITORY_INTERFACE_KEY, DeleteOrganizationUseCase, Inject, Injectable, GetExistingOrganizationUseCase (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (13): NotFoundOrganizationServiceException, OrganizationServicesRepositoryInterface, ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY, ActivateOrganizationServiceUseCase, Inject, Injectable, TODO: Implementar verificação de agendamentos futuros quando o módulo de…, GetExistingOrganizationServiceUseCase (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.36
Nodes (5): ActiveOrganizationId, Roles(), ROLES_KEY, TenantScoped(), OrganizationRole

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): OrganizationAddress, Column, Entity, Index, JoinColumn, ManyToOne, GetOrganizationAddressDocs(), GetOrganizationAddressController (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (13): NotFoundPasswordResetException, PasswordResetAlreadyExistsException, PasswordReset, Column, Entity, JoinColumn, ManyToOne, PasswordResetRepositoryInterface (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (17): LoginDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (19): CreateCustomerDto, ApiProperty, ApiPropertyOptional, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (16): ListCustomersDto, ApiPropertyOptional, IsOptional, IsString, IsUUID, ListCustomersDocs(), ListCustomersController, ApiCookieAuth (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.17
Nodes (11): NotFoundOrganizationAddressException, OrganizationAddressAlreadyExistsException, OrganizationAddressesRepositoryInterface, ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY, DeleteOrganizationAddressUseCase, Inject, Injectable, GetExistingOrganizationAddressUseCase (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.10
Nodes (18): CreateOrganizationAddressDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, Length, CreateOrganizationAddressController (+10 more)

### Community 36 - "Community 36"
Cohesion: 0.18
Nodes (13): ListServiceCategoriesDto, ServiceCategory, Column, Entity, Index, JoinColumn, ManyToOne, ServiceCategoriesRepositoryInterface (+5 more)

### Community 37 - "Community 37"
Cohesion: 0.09
Nodes (23): globals, jest, @nestjs/cli, devDependencies, globals, jest, @nestjs/cli, source-map-support (+15 more)

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (16): authenticatedSessionLifecycleMiddleware(), alignAuthenticatedSessionExpiry(), clearSessionCookie(), destroySession(), destroySessionAndClearCookie(), destroySessionById(), destroySessionByIdAndClearCookie(), saveSession() (+8 more)

### Community 39 - "Community 39"
Cohesion: 0.14
Nodes (12): S3StorageProvider, Injectable, DeleteStorageObjectParams, PresignedGetObjectParams, StorageProviderInterface, UploadStorageObjectParams, UploadStorageObjectResult, MockGetExistingMediaUseCase (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (13): CannotDeleteServiceWithFutureAppointmentsException, CheckFutureAppointmentsUseCase, Injectable, DeleteOrganizationServiceController, ApiTags, Controller, Delete, Inject (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.21
Nodes (9): SessionUser, CurrentUser, getSessionUser(), RequestEmailVerificationDocs(), Post, Delete, GetCurrentUserDocs(), Get (+1 more)

### Community 42 - "Community 42"
Cohesion: 0.14
Nodes (15): Public(), RequestPasswordResetDto, ApiProperty, IsEmail, IsNotEmpty, IsString, RequestPasswordResetDocs(), RequestPasswordResetController (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (17): DeleteDateColumn, Organization, Column, Entity, JoinColumn, ManyToOne, OneToMany, GetOrganizationDocs() (+9 more)

### Community 44 - "Community 44"
Cohesion: 0.20
Nodes (11): PasswordResetAttemptsExceededException, PASSWORD_RESET_REPOSITORY_INTERFACE_KEY, CheckPasswordResetAttemptsUseCase, Injectable, GetExistingPasswordResetUseCase, Injectable, Inject, SendPasswordResetEmailUseCase (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.16
Nodes (11): AppModule, Module, setupDocumentationConfig(), bootstrap(), BuildMediaFileNameParams, BACK_END_URL, env, envSchema (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.16
Nodes (12): CheckSlugAvailabilityResponseDto, ApiProperty, CheckSlugAvailabilityController, ApiTags, Controller, Get, Inject, Param (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (14): ApiProperty, IsEmail, IsNotEmpty, IsString, ValidatePasswordResetOtpDto, ValidatePasswordResetOtpDocs(), ApiTags, Body (+6 more)

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (12): LogoutDocs(), LogoutController, ApiCookieAuth, ApiTags, Controller, HttpCode, Inject, Post (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.16
Nodes (10): CustomersRepository, Injectable, GetCustomerController, ApiCookieAuth, ApiTags, Controller, Inject, GetCustomerUseCase (+2 more)

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (14): ResetPasswordDto, ApiProperty, IsNotEmpty, IsString, IsStrongPassword, ResetPasswordDocs(), ResetPasswordController, ApiTags (+6 more)

### Community 51 - "Community 51"
Cohesion: 0.14
Nodes (13): UpdateServiceCategoryDto, UpdateServiceCategoryDocs(), ApiCookieAuth, ApiTags, Body, Controller, Inject, Param (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.17
Nodes (12): UpdateCustomerDto, UpdateCustomerDocs(), ApiCookieAuth, ApiTags, Body, Controller, Inject, Param (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.14
Nodes (9): CheckEmailConfirmationAttemptsUseCase, Inject, Injectable, RequestEmailChangeUseCase, Inject, Injectable, RequestEmailVerificationUseCase, Inject (+1 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (15): CreateOrganizationMemberDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsOptional, IsUUID, CreateOrganizationMemberController (+7 more)

### Community 55 - "Community 55"
Cohesion: 0.16
Nodes (12): RequestEmailChangeDto, ApiProperty, IsEmail, IsNotEmpty, IsString, RequestEmailChangeDocs(), RequestEmailChangeController, ApiTags (+4 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (5): CreateMediaDto, MediaFileName, CreateMediaUseCase, Inject, Injectable

### Community 57 - "Community 57"
Cohesion: 0.15
Nodes (9): MediaImageProcessorService, ProcessMediaFileParams, ProcessMediaFileResult, Injectable, MockGetExistingMediaUseCase, MockMediaImageProcessorService, MockMediaRepository, MockPresignMediaUrlsUseCase (+1 more)

### Community 58 - "Community 58"
Cohesion: 0.18
Nodes (11): UpdateOrganizationAddressDto, UpdateOrganizationAddressDocs(), ApiTags, Body, Controller, Inject, Param, Patch (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (10): CreatePasswordResetDto, ApiProperty, IsDate, IsEnum, IsNotEmpty, IsString, PASSWORD_RESET_STATUS, MarkPasswordResetAsUsedUseCase (+2 more)

### Community 60 - "Community 60"
Cohesion: 0.14
Nodes (12): CreateOrganizationInviteDto, ApiProperty, IsEmail, IsNotEmpty, CreateOrganizationInviteController, ApiCookieAuth, ApiTags, Body (+4 more)

### Community 61 - "Community 61"
Cohesion: 0.16
Nodes (10): CreateOrganizationDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, UpdateOrganizationDto, IsOrganizationSlug() (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.15
Nodes (10): CreateServiceCategoryDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, Inject, CreateServiceCategoryUseCase (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.16
Nodes (10): DeleteServiceCategoryController, ApiTags, Controller, Delete, Inject, Param, DeleteServiceCategoryUseCase, Inject (+2 more)

### Community 64 - "Community 64"
Cohesion: 0.16
Nodes (10): GetServiceCategoryDocs(), GetServiceCategoryController, ApiTags, Controller, Get, Inject, Param, GetServiceCategoryUseCase (+2 more)

### Community 65 - "Community 65"
Cohesion: 0.16
Nodes (10): NotFoundCustomerException, Customer, Column, Entity, Index, JoinColumn, ManyToOne, GetCustomerDocs() (+2 more)

### Community 66 - "Community 66"
Cohesion: 0.15
Nodes (12): LinkCustomerToUserDto, ApiProperty, IsNotEmpty, IsUUID, LinkCustomerToUserDocs(), LinkCustomerToUserController, ApiCookieAuth, ApiTags (+4 more)

### Community 67 - "Community 67"
Cohesion: 0.16
Nodes (12): CreateEmailConfirmationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty (+4 more)

### Community 68 - "Community 68"
Cohesion: 0.19
Nodes (10): AcceptOrganizationInviteResponseDto, ApiProperty, AcceptOrganizationInviteController, ApiCookieAuth, ApiTags, Controller, Inject, Param (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.15
Nodes (11): CreateOrganizationController, ApiCookieAuth, ApiTags, Body, Controller, Inject, Post, CreateOrganizationUseCase (+3 more)

### Community 70 - "Community 70"
Cohesion: 0.14
Nodes (12): ApiPropertyOptional, IsBoolean, IsOptional, UpdateUserDto, UpdateUserDocs(), ApiCookieAuth, ApiTags, Body (+4 more)

### Community 71 - "Community 71"
Cohesion: 0.14
Nodes (14): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, moduleNameMapper, rootDir, testEnvironment, testRegex (+6 more)

### Community 72 - "Community 72"
Cohesion: 0.14
Nodes (14): scripts, biome:check, biome:format, biome:lint, build, start, start:debug, start:dev (+6 more)

### Community 73 - "Community 73"
Cohesion: 0.14
Nodes (11): RefreshSessionController, ApiCookieAuth, ApiTags, Controller, HttpCode, Inject, Post, Req (+3 more)

### Community 74 - "Community 74"
Cohesion: 0.15
Nodes (10): DeleteOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Delete, Inject, Param, DeleteOrganizationMemberUseCase (+2 more)

### Community 75 - "Community 75"
Cohesion: 0.19
Nodes (8): InvalidDurationException, SCHEDULE_GRANULARITY_MINUTES, Inject, CreateOrganizationServiceUseCase, Inject, Injectable, Injectable, ValidateDurationUseCase

### Community 76 - "Community 76"
Cohesion: 0.31
Nodes (5): NotFoundServiceCategoryException, SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY, GetExistingServiceCategoryUseCase, Inject, Injectable

### Community 77 - "Community 77"
Cohesion: 0.17
Nodes (10): SendOrganizationInviteEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsUUID, CreateOrganizationInviteUseCase, Inject, Injectable (+2 more)

### Community 78 - "Community 78"
Cohesion: 0.27
Nodes (7): Column, Entity, OneToMany, User, UserWithoutPassword, Injectable, UsersRepository

### Community 79 - "Community 79"
Cohesion: 0.23
Nodes (5): MissingOrganizationContextException, TenantGuard, Inject, Injectable, IS_TENANT_SCOPED_KEY

### Community 80 - "Community 80"
Cohesion: 0.20
Nodes (7): DeleteOrganizationAddressController, ApiTags, Controller, Delete, Inject, Param, DeleteOrganizationAddressDocs()

### Community 81 - "Community 81"
Cohesion: 0.20
Nodes (7): CancelOrganizationInviteController, ApiTags, Controller, Inject, Param, Patch, CancelOrganizationInviteDocs()

### Community 82 - "Community 82"
Cohesion: 0.17
Nodes (8): RejectOrganizationInviteDocs(), RejectOrganizationInviteController, ApiCookieAuth, ApiTags, Controller, Inject, Param, Patch

### Community 83 - "Community 83"
Cohesion: 0.17
Nodes (8): InactivateOrganizationMemberDocs(), InactivateOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Inject, Param, Patch

### Community 84 - "Community 84"
Cohesion: 0.20
Nodes (7): ActivateOrganizationServiceController, ApiTags, Controller, Inject, Param, Patch, ActivateOrganizationServiceDocs()

### Community 85 - "Community 85"
Cohesion: 0.20
Nodes (7): InactivateOrganizationServiceDocs(), InactivateOrganizationServiceController, ApiTags, Controller, Inject, Param, Patch

### Community 86 - "Community 86"
Cohesion: 0.21
Nodes (7): UnableToDeleteOrganizationException, DeleteOrganizationDocs(), AnyConstructorArgs, ExceptionClass, ExceptionConfig, ExceptionResponseOptions, getExceptionResponseSchema()

### Community 87 - "Community 87"
Cohesion: 0.17
Nodes (9): UpdateProfilePictureDocs(), ApiCookieAuth, ApiTags, Controller, Inject, Patch, UpdateProfilePictureController, UploadedFile (+1 more)

### Community 88 - "Community 88"
Cohesion: 0.18
Nodes (11): noForEach, noStaticOnlyClass, noUselessSwitchCase, useFlatMap, noUnusedVariables, linter, enabled, rules (+3 more)

### Community 89 - "Community 89"
Cohesion: 0.31
Nodes (5): EmailAlreadyVerifiedException, EmailConfirmationTemplateType, SendEmailConfirmationEmailDto, SendEmailConfirmationEmailUseCase, Injectable

### Community 90 - "Community 90"
Cohesion: 0.22
Nodes (5): EmailConfirmation, Column, Entity, JoinColumn, ManyToOne

### Community 91 - "Community 91"
Cohesion: 0.18
Nodes (8): ActivateOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Inject, Param, Patch, ActivateOrganizationMemberDocs()

### Community 93 - "Community 93"
Cohesion: 0.20
Nodes (9): files, ignoreUnknown, enabled, javascript, parser, formatter, overrides, unsafeParameterDecoratorsEnabled (+1 more)

### Community 94 - "Community 94"
Cohesion: 0.24
Nodes (4): SessionAuthGuard, Inject, Injectable, IS_PUBLIC_KEY

### Community 95 - "Community 95"
Cohesion: 0.20
Nodes (7): DeleteCustomerController, ApiCookieAuth, ApiTags, Controller, Delete, Param, DeleteCustomerDocs()

### Community 96 - "Community 96"
Cohesion: 0.20
Nodes (6): Inject, SendEmailUseCase, Inject, Injectable, Inject, Inject

### Community 97 - "Community 97"
Cohesion: 0.20
Nodes (8): ListReceivedOrganizationInvitesController, ApiCookieAuth, ApiTags, Controller, Inject, ListReceivedOrganizationInvitesUseCase, Inject, Injectable

### Community 98 - "Community 98"
Cohesion: 0.20
Nodes (5): UpdatePasswordResetDto, Inject, Injectable, ValidatePasswordResetExpirationUseCase, Inject

### Community 99 - "Community 99"
Cohesion: 0.22
Nodes (9): @abacatepay/sdk, @aws-sdk/client-s3, dependencies, @abacatepay/sdk, @aws-sdk/client-s3, redis, rxjs, redis (+1 more)

### Community 100 - "Community 100"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, expand, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth (+1 more)

### Community 101 - "Community 101"
Cohesion: 0.22
Nodes (9): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+1 more)

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noDocumentImportInPage, noDoubleEquals, noExplicitAny, noHeadImportInDocument, noThenProperty, useGoogleFontDisplay (+1 more)

### Community 103 - "Community 103"
Cohesion: 0.25
Nodes (4): SessionConfigModule, Module, SessionConfigService, Injectable

### Community 104 - "Community 104"
Cohesion: 0.22
Nodes (7): LoginController, ApiTags, Controller, Inject, LoginUseCase, Inject, Injectable

### Community 105 - "Community 105"
Cohesion: 0.25
Nodes (4): Inject, Inject, Injectable, UpdateOrganizationUseCase

### Community 106 - "Community 106"
Cohesion: 0.22
Nodes (7): CreateServiceCategoryController, ApiCookieAuth, ApiTags, Body, Controller, Post, CreateServiceCategoryDocs()

### Community 107 - "Community 107"
Cohesion: 0.22
Nodes (7): ListServiceCategoriesController, ApiCookieAuth, ApiTags, Controller, Get, Inject, Query

### Community 108 - "Community 108"
Cohesion: 0.22
Nodes (7): DeleteProfilePictureController, ApiCookieAuth, ApiTags, Controller, Delete, Inject, DeleteProfilePictureDocs()

### Community 109 - "Community 109"
Cohesion: 0.25
Nodes (8): source, assist, actions, enabled, identifierOrder, level, options, organizeImports

### Community 110 - "Community 110"
Cohesion: 0.25
Nodes (7): author, description, license, name, packageManager, private, version

### Community 111 - "Community 111"
Cohesion: 0.25
Nodes (7): **/*spec.ts, test, ./tsconfig.json, exclude, extends, dist, node_modules

### Community 112 - "Community 112"
Cohesion: 0.46
Nodes (4): ListOrganizationAddressesDocs(), ListOrganizationMembersDocs(), ListServiceCategoriesDocs(), getPaginatedResponseSchema()

### Community 113 - "Community 113"
Cohesion: 0.25
Nodes (7): CreateOrganizationServiceController, ApiCookieAuth, ApiTags, Body, Controller, Post, CreateOrganizationServiceDocs()

### Community 114 - "Community 114"
Cohesion: 0.25
Nodes (7): UpdateOrganizationDocs(), ApiCookieAuth, ApiTags, Body, Controller, Patch, UpdateOrganizationController

### Community 115 - "Community 115"
Cohesion: 0.32
Nodes (3): ReflectionGuardValidationPipe, Inject, Injectable

### Community 116 - "Community 116"
Cohesion: 0.33
Nodes (5): SendEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsString

### Community 117 - "Community 117"
Cohesion: 0.29
Nodes (4): MockMediaImageProcessorService, MockMediaRepository, MockPresignMediaUrlsUseCase, MockStorageProvider

### Community 118 - "Community 118"
Cohesion: 0.29
Nodes (5): SendPasswordResetEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsString

### Community 119 - "Community 119"
Cohesion: 0.29
Nodes (4): DeleteProfilePictureInput, DeleteProfilePictureUseCase, Inject, Injectable

### Community 121 - "Community 121"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 123 - "Community 123"
Cohesion: 0.33
Nodes (5): ListOrganizationInvitesByOrganizationController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 124 - "Community 124"
Cohesion: 0.47
Nodes (3): OrganizationDto, ApiProperty, ApiPropertyOptional

### Community 125 - "Community 125"
Cohesion: 0.33
Nodes (5): DeleteOrganizationController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 126 - "Community 126"
Cohesion: 0.33
Nodes (5): GetCurrentPasswordResetByEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsString

### Community 127 - "Community 127"
Cohesion: 0.33
Nodes (5): GetCurrentUserController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 128 - "Community 128"
Cohesion: 0.50
Nodes (5): Serena Project Configuration (quickly-backend), Ignore-all-files-in-gitignore setting, LSP Workspace Folders ("."), quickly-backend (Serena project_name), TypeScript Language Server (Serena LSP backend)

### Community 130 - "Community 130"
Cohesion: 0.40
Nodes (3): RolesGuard, Inject, Injectable

### Community 131 - "Community 131"
Cohesion: 0.40
Nodes (4): RequestEmailVerificationController, ApiTags, Controller, Inject

### Community 134 - "Community 134"
Cohesion: 0.40
Nodes (3): ResetPasswordUseCase, Inject, Injectable

### Community 135 - "Community 135"
Cohesion: 0.50
Nodes (4): indentScriptAndStyle, selfCloseVoidElements, html, formatter

### Community 136 - "Community 136"
Cohesion: 0.50
Nodes (4): vcs, clientKind, enabled, useIgnoreFile

### Community 138 - "Community 138"
Cohesion: 0.50
Nodes (3): Inject, DeleteCustomerUseCase, Injectable

### Community 139 - "Community 139"
Cohesion: 0.50
Nodes (3): Inject, LinkCustomerToUserUseCase, Injectable

### Community 140 - "Community 140"
Cohesion: 0.50
Nodes (3): generatePasswordResetToken(), PasswordResetTokenPayload, verifyPasswordResetToken()

## Knowledge Gaps
- **212 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+207 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **59 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Media` connect `Community 13` to `Community 3`, `Community 26`, `Community 39`, `Community 43`, `Community 78`, `Community 19`, `Community 20`, `Community 117`, `Community 24`, `Community 57`, `Community 56`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `GetExistingUserUseCase` connect `Community 2` to `Community 3`, `Community 4`, `Community 134`, `Community 7`, `Community 8`, `Community 137`, `Community 12`, `Community 18`, `Community 21`, `Community 25`, `Community 44`, `Community 47`, `Community 53`, `Community 59`, `Community 73`, `Community 77`, `Community 89`, `Community 98`, `Community 119`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `TenantScoped()` connect `Community 28` to `Community 1`, `Community 5`, `Community 17`, `Community 22`, `Community 32`, `Community 33`, `Community 35`, `Community 36`, `Community 41`, `Community 49`, `Community 51`, `Community 52`, `Community 54`, `Community 60`, `Community 66`, `Community 74`, `Community 83`, `Community 87`, `Community 91`, `Community 95`, `Community 106`, `Community 107`, `Community 108`, `Community 113`, `Community 114`, `Community 123`, `Community 125`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _212 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07092198581560284 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._