# Graph Report - quickly-backend  (2026-08-14)

## Corpus Check
- Corpus is ~43,417 words - fits in a single context window. You may not need a graph.

## Summary
- 2435 nodes · 5755 edges · 185 communities (126 shown, 59 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 201 edges (avg confidence: 0.8)
- Token cost: 70,205 input · 0 output

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
- Community 182
- Community 183
- Community 184

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

## Communities (185 total, 59 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (27): InvalidRefreshTokenException, NotMemberOfOrganizationException, SessionUser, CurrentUser, alignAuthenticatedSessionExpiry(), getSessionUser(), saveSession(), SessionStoreRecord (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (31): CustomerDto, ApiProperty, ApiPropertyOptional, ListCustomerResponseDto, ListCustomersDocs(), MediaReferenceDto, ApiProperty, ApiPropertyOptional (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (32): AlreadyLoggedInOrganizationException, SwitchOrganizationDto, ApiProperty, IsNotEmpty, IsUUID, SessionUserDto, ApiProperty, ApiPropertyOptional (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (30): IsNumber, IsPositive, CreateOrganizationServiceDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsOptional (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (16): ActiveOrganizationId, Roles(), ROLES_KEY, TenantScoped(), DeleteCustomerController, ApiCookieAuth, ApiTags, Controller (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (25): IsInt, ListOrganizationResponseDto, ApiProperty, OrganizationDto, ApiProperty, ApiPropertyOptional, ListOrganizationsDocs(), ListOrganizationsController (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (17): NotFoundPasswordResetException, PasswordReset, Column, Entity, JoinColumn, ManyToOne, PasswordResetRepositoryInterface, PasswordResetRepository (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (17): DeleteUserProfilePictureMediaDto, DeleteMediaUseCase, Injectable, DeleteUserProfilePictureMediaUseCase, Inject, Injectable, ListMediaUseCase, Injectable (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (27): PgTypeOrmConfigService, Injectable, AuthModule, Module, CustomerModule, Module, EmailConfirmationModule, Module (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): ResetPasswordDto, ApiProperty, IsNotEmpty, IsString, IsStrongPassword, MarkPasswordResetAsUsedUseCase, Inject, Injectable (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (21): InvalidCredentialsException, LoginDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsEmail, IsNotEmpty, IsOptional (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (31): <Entity>AlreadyExistsException Domain Error Pattern, Controller Pattern (only talks to use cases, maps Entity->DTO via mapper, uses session auth guards), docs.ts Swagger Documentation Pattern (documents domain errors per endpoint), TypeORM Entity Pattern (extends TimestampedBigIntEntity), Module Folder Structure Convention (models/shared/use-cases), GetExisting<Entity>UseCase Pattern (mandatory; rationale: avoids scattered direct findOne/findById repository calls across the codebase), Input DTO Pattern (Create/Update/Pagination DTOs), DTO Mapper Pattern (Entity <-> DTO end-to-end typing) (+23 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (19): DeleteDateColumn, Organization, Column, Entity, JoinColumn, ManyToOne, OneToMany, OrganizationsRepository (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (20): Inject, EmailModule, Module, SendEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsString (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (14): NotFoundMediaException, DeleteMediaDto, MediaRepositoryInterface, MEDIA_REPOSITORY_INTERFACE_KEY, STORAGE_PROVIDER_INTERFACE_KEY, GetExistingMediaUseCase, Inject, Injectable (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (18): ListOrganizationServicesDto, ApiPropertyOptional, IsBoolean, IsOptional, IsUUID, ListOrganizationServiceResponseDto, OrganizationServicesRepository, Injectable (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+22 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (19): Public(), RequestPasswordResetDto, ApiProperty, IsEmail, IsNotEmpty, IsString, CheckPasswordResetAttemptsUseCase, Inject (+11 more)

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (16): InvalidOrganizationInviteException, OrganizationInviteAlreadyExistsException, OrganizationInvitesRepositoryInterface, ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY, AcceptOrganizationInviteUseCase, Inject, Injectable, CancelOrganizationInviteUseCase (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (13): Inject, Inject, Inject, NotFoundOrganizationMemberException, OrganizationMemberAlreadyExistsException, OrganizationMembersRepositoryInterface, ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY, ActivateOrganizationMemberUseCase (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (19): CreateOrganizationDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, CreateOrganizationController, ApiCookieAuth (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (10): EmailAlreadyInUseException, EmailAlreadyVerifiedException, EmailConfirmationAttemptsExceededException, SameEmailError, EmailConfirmationTemplateType, SendEmailConfirmationEmailDto, EMAIL_CONFIRMATION_REPOSITORY_INTERFACE_KEY, EMAIL_CONFIRMATION_TYPE (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (13): NotFoundOrganizationException, OrganizationAlreadyExistsException, OrganizationsRepositoryInterface, ORGANIZATION_REPOSITORY_INTERFACE_KEY, Inject, Inject, DeleteOrganizationUseCase, Inject (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (20): CreateDateColumn, PrimaryColumn, Appointment, Column, Entity, Index, JoinColumn, ManyToOne (+12 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (11): destroySessionById(), destroySessionByIdAndClearCookie(), UserWithoutPassword, UsersRepositoryInterface, Injectable, UsersRepository, USER_REPOSITORY_INTERFACE_KEY, Inject (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (20): CreateCustomerDto, ApiProperty, ApiPropertyOptional, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString (+12 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (14): ListOrganizationMembersDto, ApiPropertyOptional, IsBoolean, IsOptional, IsUUID, Type, ListOrganizationMemberResponseDto, OrganizationMembersRepository (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (13): NotFoundOrganizationServiceException, OrganizationServicesRepositoryInterface, ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY, ActivateOrganizationServiceUseCase, Inject, Injectable, TODO: Implementar verificação de agendamentos futuros quando o módulo de…, GetExistingOrganizationServiceUseCase (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (19): CreateUserDto, ApiProperty, ApiPropertyOptional, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (15): IsArray, FindAllOrganizationInvitesPaginationDto, ApiPropertyOptional, IsEnum, IsOptional, Transform, OrganizationInvite, Column (+7 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (13): ListOrganizationAddressesDto, ApiPropertyOptional, IsOptional, IsUUID, ListOrganizationAddressResponseDto, OrganizationAddressesRepositoryInterface, OrganizationAddressesRepository, Injectable (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.28
Nodes (8): CustomersRepositoryInterface, CUSTOMER_REPOSITORY_INTERFACE_KEY, GetExistingCustomerUseCase, Inject, Injectable, ListCustomersUseCase, Inject, Injectable

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (18): CreateOrganizationAddressDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, Length, CreateOrganizationAddressController (+10 more)

### Community 33 - "Community 33"
Cohesion: 0.13
Nodes (16): OrganizationAddress, Column, Entity, Index, JoinColumn, ManyToOne, GetOrganizationAddressDocs(), GetOrganizationAddressController (+8 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (16): LinkCustomerToUserDto, ApiProperty, IsNotEmpty, IsUUID, LinkCustomerToUserDocs(), LinkCustomerToUserController, ApiCookieAuth, ApiTags (+8 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (12): EMAIL_CONFIRMATION_STATUS, MarkEmailConfirmationAsValidatedUseCase, Inject, Injectable, Injectable, UpdateEmailConfirmationUseCase, Inject, Injectable (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.21
Nodes (3): formatWhereClause(), normalizeGetExistingOptions(), GetExistingOptions

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (8): CreateMediaDto, UpdateMediaDto, StorageProviderInterface, CreateMediaUseCase, Inject, Injectable, Inject, Inject

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (14): OrganizationInviteDto, ApiProperty, ListReceivedOrganizationInvitesDocs(), ListReceivedOrganizationInvitesController, ApiCookieAuth, ApiTags, Controller, Get (+6 more)

### Community 39 - "Community 39"
Cohesion: 0.11
Nodes (13): CannotDeleteServiceWithFutureAppointmentsException, CheckFutureAppointmentsUseCase, Injectable, DeleteOrganizationServiceController, ApiTags, Controller, Delete, Inject (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (12): EmailConfirmationAlreadyExistsException, NotFoundEmailConfirmationException, EmailConfirmation, Column, Entity, JoinColumn, ManyToOne, EmailConfirmationRepositoryInterface (+4 more)

### Community 41 - "Community 41"
Cohesion: 0.15
Nodes (14): ListOrganizationInviteWithInviterResponseDto, ListOrganizationInvitesByOrganizationController, ApiCookieAuth, ApiTags, Controller, Get, Inject, Query (+6 more)

### Community 42 - "Community 42"
Cohesion: 0.13
Nodes (15): ApiProperty, IsEmail, IsNotEmpty, IsString, ValidatePasswordResetOtpDto, ValidatePasswordResetOtpDocs(), ApiTags, Body (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.13
Nodes (15): ApiPropertyOptional, IsBoolean, IsOptional, UpdateUserDto, UpdateUserDocs(), ApiCookieAuth, ApiTags, Body (+7 more)

### Community 44 - "Community 44"
Cohesion: 0.10
Nodes (21): globals, jest, @nestjs/cli, devDependencies, globals, jest, @nestjs/cli, source-map-support (+13 more)

### Community 45 - "Community 45"
Cohesion: 0.13
Nodes (6): NotFoundOrganizationAddressException, OrganizationAddressAlreadyExistsException, EmailNotVerifiedException, NotFoundUserException, UserAlreadyExistsException, NormalizedGetExistingOptions

### Community 46 - "Community 46"
Cohesion: 0.11
Nodes (14): ListCustomersDto, ApiPropertyOptional, IsOptional, IsString, IsUUID, CustomersRepository, Injectable, ListCustomersController (+6 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (13): UpdateCustomerDto, UpdateCustomerDocs(), ApiCookieAuth, ApiTags, Body, Controller, Inject, Param (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (11): NotFoundOrganizationInviteException, GetOrganizationInviteByIdDocs(), GetOrganizationInviteByIdController, ApiTags, Controller, Get, Inject, Param (+3 more)

### Community 49 - "Community 49"
Cohesion: 0.16
Nodes (12): CheckSlugAvailabilityResponseDto, ApiProperty, CheckSlugAvailabilityController, ApiTags, Controller, Get, Inject, Param (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.11
Nodes (14): RequestEmailChangeController, ApiTags, Controller, Inject, RequestEmailChangeUseCase, Inject, Injectable, Inject (+6 more)

### Community 51 - "Community 51"
Cohesion: 0.16
Nodes (12): UpdateOrganizationAddressDto, UpdateOrganizationAddressDocs(), ApiTags, Body, Controller, Inject, Param, Patch (+4 more)

### Community 52 - "Community 52"
Cohesion: 0.30
Nodes (6): NotFoundServiceCategoryException, ServiceCategoriesRepositoryInterface, SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY, GetExistingServiceCategoryUseCase, Inject, Injectable

### Community 53 - "Community 53"
Cohesion: 0.16
Nodes (11): ListServiceCategoriesDto, ServiceCategory, Column, Entity, Index, JoinColumn, ManyToOne, ServiceCategoriesRepository (+3 more)

### Community 54 - "Community 54"
Cohesion: 0.18
Nodes (9): S3StorageProvider, Injectable, DeleteStorageObjectParams, PresignedGetObjectParams, UploadStorageObjectParams, UploadStorageObjectResult, MockGetExistingMediaUseCase, MockMediaRepository (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.16
Nodes (11): UpdateOrganizationServiceDto, UpdateOrganizationServiceDocs(), ApiTags, Body, Controller, Inject, Param, Patch (+3 more)

### Community 56 - "Community 56"
Cohesion: 0.18
Nodes (11): UpdateOrganizationDto, UpdateOrganizationDocs(), ApiCookieAuth, ApiTags, Body, Controller, Inject, Patch (+3 more)

### Community 57 - "Community 57"
Cohesion: 0.15
Nodes (12): LogoutDocs(), LogoutController, ApiCookieAuth, ApiTags, Controller, HttpCode, Inject, Post (+4 more)

### Community 58 - "Community 58"
Cohesion: 0.12
Nodes (11): UnableToDeleteOrganizationException, DeleteOrganizationController, ApiCookieAuth, ApiTags, Controller, Delete, DeleteOrganizationDocs(), AnyConstructorArgs (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.15
Nodes (10): NotFoundCustomerException, GetCustomerDocs(), GetCustomerController, ApiCookieAuth, ApiTags, Controller, Inject, GetCustomerUseCase (+2 more)

### Community 60 - "Community 60"
Cohesion: 0.14
Nodes (8): Media, Column, Entity, Index, JoinColumn, ManyToOne, MediaRepository, Injectable

### Community 61 - "Community 61"
Cohesion: 0.16
Nodes (8): MediaImageProcessorService, ProcessMediaFileParams, ProcessMediaFileResult, Injectable, MockMediaImageProcessorService, MockMediaRepository, MockPresignMediaUrlsUseCase, MockStorageProvider

### Community 62 - "Community 62"
Cohesion: 0.16
Nodes (10): DeleteOrganizationAddressController, ApiTags, Controller, Delete, Inject, Param, DeleteOrganizationAddressUseCase, Inject (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.13
Nodes (14): CreateOrganizationMemberDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsOptional, IsUUID, CreateOrganizationMemberController (+6 more)

### Community 64 - "Community 64"
Cohesion: 0.16
Nodes (10): DeleteServiceCategoryController, ApiTags, Controller, Delete, Inject, Param, DeleteServiceCategoryUseCase, Inject (+2 more)

### Community 65 - "Community 65"
Cohesion: 0.16
Nodes (10): GetServiceCategoryDocs(), GetServiceCategoryController, ApiTags, Controller, Get, Inject, Param, GetServiceCategoryUseCase (+2 more)

### Community 66 - "Community 66"
Cohesion: 0.19
Nodes (11): CreateOrganizationInviteDto, ApiProperty, IsEmail, IsNotEmpty, CreateOrganizationInviteController, ApiCookieAuth, ApiTags, Body (+3 more)

### Community 67 - "Community 67"
Cohesion: 0.14
Nodes (11): SendOrganizationInviteEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsUUID, Inject, CreateOrganizationInviteUseCase, Inject (+3 more)

### Community 68 - "Community 68"
Cohesion: 0.19
Nodes (10): AcceptOrganizationInviteResponseDto, ApiProperty, AcceptOrganizationInviteController, ApiCookieAuth, ApiTags, Controller, Inject, Param (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.14
Nodes (11): ApiCookieAuth, ApiTags, Body, Controller, Inject, Param, Patch, UpdateServiceCategoryController (+3 more)

### Community 70 - "Community 70"
Cohesion: 0.14
Nodes (14): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, moduleNameMapper, rootDir, testEnvironment, testRegex (+6 more)

### Community 71 - "Community 71"
Cohesion: 0.14
Nodes (14): scripts, biome:check, biome:format, biome:lint, build, start, start:debug, start:dev (+6 more)

### Community 72 - "Community 72"
Cohesion: 0.21
Nodes (9): AppModule, Module, setupDocumentationConfig(), bootstrap(), BACK_END_URL, envSchema, FRONT_END_URL, IS_PRODUCTION (+1 more)

### Community 73 - "Community 73"
Cohesion: 0.26
Nodes (11): authenticatedSessionLifecycleMiddleware(), clearSessionCookie(), destroySession(), destroySessionAndClearCookie(), absoluteWindowMs(), computeEffectiveMaxAgeMs(), cookieRemainingSeconds(), idleDurationMs() (+3 more)

### Community 74 - "Community 74"
Cohesion: 0.16
Nodes (9): RequestEmailVerificationController, ApiTags, Controller, Inject, RequestEmailVerificationUseCase, Inject, Injectable, SendEmailConfirmationEmailUseCase (+1 more)

### Community 75 - "Community 75"
Cohesion: 0.16
Nodes (8): ReplaceUserProfilePictureMediaDto, ReplaceUserProfilePictureMediaUseCase, Injectable, Inject, Inject, Injectable, UpdateProfilePictureInput, UpdateProfilePictureUseCase

### Community 76 - "Community 76"
Cohesion: 0.15
Nodes (10): InactivateOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Inject, Param, Patch, InactivateOrganizationMemberUseCase (+2 more)

### Community 77 - "Community 77"
Cohesion: 0.15
Nodes (10): CreateServiceCategoryController, ApiCookieAuth, ApiTags, Body, Controller, Inject, Post, CreateServiceCategoryUseCase (+2 more)

### Community 78 - "Community 78"
Cohesion: 0.15
Nodes (10): ConfirmEmailController, ApiTags, Controller, Inject, ConfirmEmailUseCase, Inject, Injectable, GetExistingEmailConfirmationUseCase (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.23
Nodes (5): MissingOrganizationContextException, TenantGuard, Inject, Injectable, IS_TENANT_SCOPED_KEY

### Community 80 - "Community 80"
Cohesion: 0.21
Nodes (8): Customer, Column, Entity, Index, JoinColumn, ManyToOne, Get, Param

### Community 81 - "Community 81"
Cohesion: 0.17
Nodes (11): CreateEmailConfirmationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty (+3 more)

### Community 82 - "Community 82"
Cohesion: 0.24
Nodes (8): RequestEmailChangeDto, ApiProperty, IsEmail, IsNotEmpty, IsString, RequestEmailChangeDocs(), Body, Post

### Community 84 - "Community 84"
Cohesion: 0.32
Nodes (6): ListOrganizationAddressesDocs(), ListOrganizationInvitesByOrganizationDocs(), ListOrganizationMembersDocs(), ListOrganizationServicesDocs(), ListServiceCategoriesDocs(), getPaginatedResponseSchema()

### Community 85 - "Community 85"
Cohesion: 0.20
Nodes (7): CancelOrganizationInviteController, ApiTags, Controller, Inject, Param, Patch, CancelOrganizationInviteDocs()

### Community 86 - "Community 86"
Cohesion: 0.23
Nodes (6): InvalidDurationException, SCHEDULE_GRANULARITY_MINUTES, Inject, Inject, Injectable, ValidateDurationUseCase

### Community 87 - "Community 87"
Cohesion: 0.20
Nodes (7): ActivateOrganizationServiceController, ApiTags, Controller, Inject, Param, Patch, ActivateOrganizationServiceDocs()

### Community 88 - "Community 88"
Cohesion: 0.20
Nodes (7): InactivateOrganizationServiceDocs(), InactivateOrganizationServiceController, ApiTags, Controller, Inject, Param, Patch

### Community 89 - "Community 89"
Cohesion: 0.18
Nodes (9): PasswordResetDto, ApiProperty, Column, Entity, OneToMany, User, Inject, DeleteProfilePictureUseCase (+1 more)

### Community 90 - "Community 90"
Cohesion: 0.18
Nodes (11): noForEach, noStaticOnlyClass, noUselessSwitchCase, useFlatMap, noUnusedVariables, linter, enabled, rules (+3 more)

### Community 93 - "Community 93"
Cohesion: 0.20
Nodes (9): files, ignoreUnknown, enabled, javascript, parser, formatter, overrides, unsafeParameterDecoratorsEnabled (+1 more)

### Community 94 - "Community 94"
Cohesion: 0.24
Nodes (4): SessionAuthGuard, Inject, Injectable, IS_PUBLIC_KEY

### Community 95 - "Community 95"
Cohesion: 0.40
Nodes (4): ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY, GetExistingOrganizationAddressUseCase, Inject, Injectable

### Community 96 - "Community 96"
Cohesion: 0.20
Nodes (8): ListServiceCategoriesController, ApiCookieAuth, ApiTags, Controller, Inject, ListServiceCategoriesUseCase, Inject, Injectable

### Community 97 - "Community 97"
Cohesion: 0.22
Nodes (9): @aws-sdk/client-s3, @biomejs/biome, class-validator, dependencies, @aws-sdk/client-s3, @biomejs/biome, class-validator, rxjs (+1 more)

### Community 98 - "Community 98"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, expand, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth (+1 more)

### Community 99 - "Community 99"
Cohesion: 0.22
Nodes (9): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+1 more)

### Community 100 - "Community 100"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noDocumentImportInPage, noDoubleEquals, noExplicitAny, noHeadImportInDocument, noThenProperty, useGoogleFontDisplay (+1 more)

### Community 101 - "Community 101"
Cohesion: 0.25
Nodes (4): SessionConfigModule, Module, SessionConfigService, Injectable

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (7): ActivateOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Param, Patch, ActivateOrganizationMemberDocs()

### Community 103 - "Community 103"
Cohesion: 0.22
Nodes (7): DeleteOrganizationMemberController, ApiCookieAuth, ApiTags, Controller, Delete, Param, DeleteOrganizationMemberDocs()

### Community 104 - "Community 104"
Cohesion: 0.22
Nodes (7): GetOrganizationServiceController, ApiTags, Controller, Inject, GetOrganizationServiceUseCase, Inject, Injectable

### Community 105 - "Community 105"
Cohesion: 0.22
Nodes (7): CreatePasswordResetDto, ApiProperty, IsDate, IsEnum, IsNotEmpty, IsString, UpdatePasswordResetDto

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (7): CreateServiceCategoryDto, ApiProperty, ApiPropertyOptional, IsNotEmpty, IsOptional, IsString, UpdateServiceCategoryDto

### Community 107 - "Community 107"
Cohesion: 0.22
Nodes (8): UpdateProfilePictureDocs(), ApiCookieAuth, ApiTags, Controller, Patch, UpdateProfilePictureController, UploadedFile, UseInterceptors

### Community 108 - "Community 108"
Cohesion: 0.25
Nodes (8): source, assist, actions, enabled, identifierOrder, level, options, organizeImports

### Community 109 - "Community 109"
Cohesion: 0.25
Nodes (7): **/*spec.ts, test, ./tsconfig.json, exclude, extends, dist, node_modules

### Community 110 - "Community 110"
Cohesion: 0.25
Nodes (5): MockGetExistingMediaUseCase, MockMediaImageProcessorService, MockMediaRepository, MockPresignMediaUrlsUseCase, MockStorageProvider

### Community 111 - "Community 111"
Cohesion: 0.32
Nodes (3): ReflectionGuardValidationPipe, Inject, Injectable

### Community 112 - "Community 112"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 113 - "Community 113"
Cohesion: 0.29
Nodes (4): Inject, DeleteCustomerUseCase, Inject, Injectable

### Community 114 - "Community 114"
Cohesion: 0.29
Nodes (4): Inject, DeleteOrganizationMemberUseCase, Inject, Injectable

### Community 115 - "Community 115"
Cohesion: 0.29
Nodes (6): DeleteProfilePictureController, ApiCookieAuth, ApiTags, Controller, Delete, DeleteProfilePictureDocs()

### Community 116 - "Community 116"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 117 - "Community 117"
Cohesion: 0.33
Nodes (5): ListOrganizationAddressesController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 118 - "Community 118"
Cohesion: 0.33
Nodes (5): RejectOrganizationInviteController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 119 - "Community 119"
Cohesion: 0.33
Nodes (4): Inject, CreateOrganizationMemberUseCase, Inject, Injectable

### Community 120 - "Community 120"
Cohesion: 0.33
Nodes (5): ListOrganizationMembersController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 121 - "Community 121"
Cohesion: 0.33
Nodes (5): GetCurrentPasswordResetByEmailDto, ApiProperty, IsEmail, IsNotEmpty, IsString

### Community 122 - "Community 122"
Cohesion: 0.33
Nodes (4): GetExistingPasswordResetUseCase, Inject, Injectable, Inject

### Community 123 - "Community 123"
Cohesion: 0.33
Nodes (5): GetCurrentUserController, ApiCookieAuth, ApiTags, Controller, Inject

### Community 125 - "Community 125"
Cohesion: 0.40
Nodes (3): RolesGuard, Inject, Injectable

### Community 126 - "Community 126"
Cohesion: 0.40
Nodes (4): ApiTags, Controller, Inject, ValidateEmailConfirmationOtpController

### Community 127 - "Community 127"
Cohesion: 0.50
Nodes (4): indentScriptAndStyle, selfCloseVoidElements, html, formatter

### Community 128 - "Community 128"
Cohesion: 0.50
Nodes (4): vcs, clientKind, enabled, useIgnoreFile

## Knowledge Gaps
- **207 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **59 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GetExistingUserUseCase` connect `Community 50` to `Community 0`, `Community 6`, `Community 7`, `Community 9`, `Community 17`, `Community 18`, `Community 19`, `Community 21`, `Community 24`, `Community 25`, `Community 28`, `Community 29`, `Community 31`, `Community 34`, `Community 35`, `Community 36`, `Community 43`, `Community 47`, `Community 67`, `Community 74`, `Community 75`, `Community 78`, `Community 119`, `Community 122`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Media` connect `Community 60` to `Community 3`, `Community 37`, `Community 7`, `Community 75`, `Community 12`, `Community 14`, `Community 110`, `Community 54`, `Community 23`, `Community 89`, `Community 61`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Organization` connect `Community 12` to `Community 1`, `Community 33`, `Community 3`, `Community 4`, `Community 5`, `Community 38`, `Community 7`, `Community 36`, `Community 80`, `Community 20`, `Community 53`, `Community 22`, `Community 23`, `Community 52`, `Community 89`, `Community 60`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07811447811447811 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0700354609929078 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06659619450317125 - nodes in this community are weakly interconnected._