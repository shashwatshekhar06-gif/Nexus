# Implementation Plan: Nexus API

## Overview

This plan implements a production-grade NestJS REST API for project and task management with JWT authentication, role-based access control, and comprehensive validation. The implementation follows NestJS best practices with Prisma ORM, includes property-based testing for correctness properties, and provides Docker deployment configuration.

## Tasks

- [ ] 1. Project scaffolding and core configuration
  - [ ] 1.1 Initialize NestJS project and install dependencies
    - Create new NestJS project with CLI
    - Install all required dependencies: @nestjs/jwt, @nestjs/passport, @prisma/client, bcrypt, class-validator, class-transformer, helmet, @nestjs/throttler, @nestjs/swagger, cookie-parser
    - Install dev dependencies: jest, supertest, fast-check, ts-jest, @nestjs/testing
    - Configure TypeScript with strict mode
    - _Requirements: Dependencies section_

  - [ ] 1.2 Configure environment variables and ConfigModule
    - Create .env.example with all required variables (DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CLIENT_URL, PORT)
    - Set up @nestjs/config module with validation schema
    - Configure environment-specific settings (development, production)
    - _Requirements: 25.1, 25.2_

  - [ ] 1.3 Set up global middleware and security
    - Configure Helmet for security headers
    - Set up CORS with CLIENT_URL origin restriction
    - Configure cookie-parser middleware
    - Set up global ValidationPipe with whitelist and forbidNonWhitelisted
    - Configure global exception filters
    - _Requirements: 24.1, 24.2, 24.4, 25.1, 25.2, 21.3_

  - [ ] 1.4 Configure rate limiting with ThrottlerModule
    - Set up global rate limit (100 requests/minute)
    - Configure auth endpoint rate limit (10 requests/minute)
    - _Requirements: 23.1, 23.2, 23.3_

- [ ] 2. Database setup with Prisma
  - [ ] 2.1 Initialize Prisma and create schema
    - Initialize Prisma with PostgreSQL provider
    - Define User model with id, email, password, name, role, refreshToken, timestamps
    - Define Project model with id, name, description, status, ownerId, timestamps
    - Define Task model with id, title, description, status, priority, dueDate, projectId, assigneeId, timestamps
    - Define enums: Role (USER, ADMIN), ProjectStatus (ACTIVE, ARCHIVED), TaskStatus (TODO, IN_PROGRESS, IN_REVIEW, DONE), TaskPriority (LOW, MEDIUM, HIGH, URGENT)
    - Set up relations: User.projects, User.assignedTasks, Project.owner, Project.tasks, Task.project, Task.assignee
    - Configure cascade delete for Project → Tasks
    - _Requirements: 28.1, 28.2, 28.3_

  - [ ] 2.2 Create Prisma migrations and seed script
    - Generate initial migration
    - Create seed script with test users (USER and ADMIN roles)
    - Configure Prisma client generation
    - _Requirements: 1.4, 19.4_

  - [ ] 2.3 Create PrismaService and PrismaModule
    - Implement PrismaService extending PrismaClient with connection lifecycle
    - Configure connection pooling
    - Export PrismaService as global module
    - _Requirements: Database section_

- [ ] 3. Authentication module implementation
  - [ ] 3.1 Create DTOs for authentication
    - Create RegisterDto with email, password, name validation
    - Create LoginDto with email, password validation
    - Create AuthResponseDto with accessToken, refreshToken, user
    - Add class-validator decorators for email format, password strength (min 8 chars, uppercase, lowercase, number, special char)
    - _Requirements: 1.7, 1.8, 27.1, 27.2, 27.3, 27.4, 27.5_

  - [ ]* 3.2 Write property test for password validation
    - **Property 25: Password Validation Requirements**
    - **Validates: Requirements 27.1, 27.2, 27.3, 27.4, 27.5**

  - [ ] 3.3 Implement AuthService with core authentication logic
    - Implement register() method with bcrypt hashing (12 rounds)
    - Implement login() method with credential validation
    - Implement generateTokens() with JWT signing (access: 15min, refresh: 7d)
    - Implement hashRefreshToken() with bcrypt
    - Implement refresh() with token verification and hash comparison
    - Implement logout() with token invalidation
    - Exclude password from all user responses
    - _Requirements: 1.1, 1.6, 2.1, 2.2, 2.3, 2.4, 2.6, 3.1, 3.2, 3.3, 3.5, 3.6, 4.1_

  - [ ]* 3.4 Write property tests for authentication
    - **Property 1: Password Hashing Security**
    - **Validates: Requirements 1.6, 2.1**
    - **Property 3: Access Token Expiry**
    - **Validates: Requirements 3.5**
    - **Property 4: Refresh Token Expiry and Storage**
    - **Validates: Requirements 2.3, 3.6**

  - [ ] 3.5 Implement JWT strategies
    - Create JwtAccessStrategy for access token validation
    - Create JwtRefreshStrategy for refresh token validation
    - Configure passport with both strategies
    - _Requirements: 5.1, 5.2_

  - [ ] 3.6 Create JwtAuthGuard and apply to protected routes
    - Implement JwtAuthGuard extending AuthGuard('jwt')
    - Add user extraction and request population logic
    - Handle authentication errors (401 Unauthorized)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 3.7 Write property test for JWT authentication
    - **Property 5: JWT Authentication Populates User**
    - **Validates: Requirements 5.1, 5.2**

  - [ ] 3.8 Implement AuthController with endpoints
    - POST /auth/register - user registration
    - POST /auth/login - user login
    - POST /auth/refresh - token refresh
    - POST /auth/logout - user logout
    - GET /auth/me - get current user
    - Set refresh token as httpOnly cookie with secure and sameSite flags
    - _Requirements: 1.3, 2.4, 3.4, 4.2, 4.3, 26.1, 26.3, 26.4_

  - [ ]* 3.9 Write property tests for token security
    - **Property 24: Refresh Token Cookie Security**
    - **Validates: Requirements 26.1, 26.3, 26.4**
    - **Property 29: Token Refresh Validation**
    - **Validates: Requirements 3.1, 3.2**
    - **Property 30: Logout Token Invalidation**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 4. Checkpoint - Ensure authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Role-based access control implementation
  - [ ] 5.1 Create RolesGuard for RBAC enforcement
    - Implement RolesGuard with @Roles decorator support
    - Check user.role against required roles
    - Return 403 Forbidden for unauthorized roles
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 5.2 Write property tests for RBAC
    - **Property 7: ADMIN Role Bypass**
    - **Validates: Requirements 8.2, 9.3, 10.2, 11.2, 13.2, 14.2, 15.2, 16.2**
    - **Property 8: Admin Endpoint Protection**
    - **Validates: Requirements 6.2, 17.2, 18.6, 19.3, 20.2**

  - [ ] 5.3 Create Roles decorator for metadata
    - Implement @Roles() decorator using SetMetadata
    - Support multiple roles per endpoint
    - _Requirements: 6.3_

- [ ] 6. Projects module implementation
  - [ ] 6.1 Create DTOs for projects
    - Create CreateProjectDto with name, description, status validation
    - Create UpdateProjectDto with partial fields
    - Create ProjectQueryDto with status, search, page, limit
    - Add validation decorators (name: 3-200 chars, description: max 1000 chars)
    - _Requirements: 7.3, 7.4, 10.4_

  - [ ]* 6.2 Write property test for project validation
    - **Property 35: Project Name Validation**
    - **Validates: Requirements 7.3, 10.4**

  - [ ] 6.3 Implement ProjectsService with CRUD operations
    - Implement create() with ownerId assignment and ACTIVE default status
    - Implement findAll() with role-based filtering (USER sees own, ADMIN sees all)
    - Implement findAll() with status and search filters (case-insensitive)
    - Implement findOne() with ownership validation
    - Implement update() with ownership validation
    - Implement remove() with cascade delete and ownership validation
    - Implement findProjectTasks() with pagination
    - _Requirements: 7.1, 7.2, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 6.4 Write property tests for project access control
    - **Property 6: USER Role Ownership Access Control**
    - **Validates: Requirements 8.1, 9.2, 10.3, 11.4**
    - **Property 26: Project Ownership Assignment**
    - **Validates: Requirement 7.1**
    - **Property 27: Project Default Status**
    - **Validates: Requirement 7.2**
    - **Property 38: Search Filter Case Insensitivity**
    - **Validates: Requirement 8.4**
    - **Property 39: Status Filter Correctness**
    - **Validates: Requirement 8.3**

  - [ ] 6.5 Implement ProjectsController with endpoints
    - POST /projects - create project (authenticated)
    - GET /projects - list projects with filters and pagination (authenticated)
    - GET /projects/:id - get project details (authenticated, ownership check)
    - PATCH /projects/:id - update project (authenticated, ownership check)
    - DELETE /projects/:id - delete project (authenticated, ownership check)
    - GET /projects/:id/tasks - list project tasks (authenticated, ownership check)
    - Apply JwtAuthGuard to all endpoints
    - Use ParseUUIDPipe for :id parameters
    - _Requirements: 7.5, 8.5, 8.6, 9.4, 9.5, 21.4_

  - [ ]* 6.6 Write property test for project deletion cascade
    - **Property 12: Project Deletion Cascade**
    - **Validates: Requirements 11.3, 28.1**

- [ ] 7. Tasks module implementation
  - [ ] 7.1 Create DTOs for tasks
    - Create CreateTaskDto with title, description, status, priority, dueDate, assigneeId validation
    - Create UpdateTaskDto with partial fields
    - Create TaskQueryDto with pagination parameters
    - Add validation decorators (title: 3-200 chars, description: max 2000 chars)
    - _Requirements: 12.5, 12.6, 14.5_

  - [ ]* 7.2 Write property test for task validation
    - **Property 36: Task Title Validation**
    - **Validates: Requirements 12.5, 14.5**

  - [ ] 7.3 Implement TasksService with CRUD operations
    - Implement validateProjectAccess() helper for ownership checks
    - Implement create() with project validation, ARCHIVED check, assignee validation, defaults (TODO, MEDIUM)
    - Implement findOne() with project access validation
    - Implement update() with project access validation, ARCHIVED check, assignee validation, timestamp update
    - Implement remove() with project access validation
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.7, 12.8, 12.9, 12.10, 13.1, 13.2, 14.1, 14.2, 14.3, 14.4, 14.6, 14.7, 15.1, 15.2, 15.3_

  - [ ]* 7.4 Write property tests for task operations
    - **Property 9: Archived Project Task Rejection**
    - **Validates: Requirements 12.4, 14.4**
    - **Property 10: Task Project Reference Integrity**
    - **Validates: Requirements 12.10, 28.2**
    - **Property 11: Task Assignee Reference Integrity**
    - **Validates: Requirements 12.7, 14.6, 28.3**
    - **Property 28: Task Default Values**
    - **Validates: Requirements 12.8, 12.9**
    - **Property 34: Task Update Timestamp**
    - **Validates: Requirement 14.7**

  - [ ] 7.5 Implement TasksController with endpoints
    - POST /projects/:projectId/tasks - create task (authenticated, project access check)
    - GET /projects/:projectId/tasks/:id - get task details (authenticated, project access check)
    - PATCH /projects/:projectId/tasks/:id - update task (authenticated, project access check)
    - DELETE /projects/:projectId/tasks/:id - delete task (authenticated, project access check)
    - Apply JwtAuthGuard to all endpoints
    - Use ParseUUIDPipe for UUID parameters
    - _Requirements: 13.4, 13.5, 14.8, 15.4, 21.4_

- [ ] 8. Checkpoint - Ensure core functionality tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Admin module implementation
  - [ ] 9.1 Create DTOs for admin operations
    - Create PaginationDto with page, limit validation
    - Create UpdateRoleDto with role validation (USER or ADMIN)
    - Create AdminStatsDto for response structure
    - _Requirements: 19.4, 29.4, 29.5_

  - [ ] 9.2 Implement AdminService with administrative operations
    - Implement getAllUsers() with pagination, exclude passwords
    - Implement getStats() with transaction for consistency (totalUsers, totalProjects, totalTasks, tasksByStatus, tasksByPriority)
    - Implement updateUserRole() with last admin protection
    - Implement getAllProjects() with owner information and pagination
    - _Requirements: 17.1, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4, 18.5, 18.7, 19.1, 19.2, 19.5, 20.1, 20.3, 20.4_

  - [ ]* 9.3 Write property tests for admin operations
    - **Property 32: Admin Statistics Accuracy**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**
    - **Property 33: Role Update Validation**
    - **Validates: Requirement 19.4**

  - [ ] 9.4 Implement AdminController with endpoints
    - GET /admin/users - list all users (ADMIN only)
    - GET /admin/stats - get system statistics (ADMIN only)
    - PATCH /admin/users/:id/role - update user role (ADMIN only)
    - GET /admin/projects - list all projects (ADMIN only)
    - Apply JwtAuthGuard and RolesGuard(['ADMIN']) to all endpoints
    - _Requirements: 17.2, 18.6, 19.3, 20.2_

- [ ] 10. Response formatting and validation
  - [ ] 10.1 Create TransformInterceptor for response envelope
    - Implement NestInterceptor to wrap success responses with { success: true, data, meta }
    - Handle pagination metadata (page, limit, total, totalPages)
    - Apply globally to all endpoints
    - _Requirements: 22.1, 22.3, 22.5_

  - [ ]* 10.2 Write property tests for response formatting
    - **Property 13: Pagination Calculation Correctness**
    - **Validates: Requirements 22.5, 29.1, 29.2**
    - **Property 14: Pagination Metadata Completeness**
    - **Validates: Requirements 8.5, 16.4, 17.4, 20.3, 22.3**
    - **Property 18: Success Response Envelope**
    - **Validates: Requirement 22.1**

  - [ ] 10.2 Create HttpExceptionFilter for error responses
    - Implement ExceptionFilter to format errors with { success: false, statusCode, message, errors, timestamp }
    - Handle validation errors (422) with field-level details
    - Handle all HTTP exceptions consistently
    - Apply globally
    - _Requirements: 21.1, 21.2, 22.2, 22.4_

  - [ ]* 10.3 Write property tests for error handling
    - **Property 15: Validation Error Response Format**
    - **Validates: Requirements 21.1, 21.2**
    - **Property 16: Unknown Property Rejection**
    - **Validates: Requirement 21.3**
    - **Property 17: UUID Parameter Validation**
    - **Validates: Requirement 21.4**
    - **Property 19: Error Response Envelope**
    - **Validates: Requirements 22.2, 22.4**

- [ ] 11. Swagger/OpenAPI documentation
  - [ ] 11.1 Configure Swagger module
    - Set up SwaggerModule with API metadata (title, description, version)
    - Configure document at /api/docs endpoint
    - Add bearer auth security scheme
    - _Requirements: 30.1, 30.2_

  - [ ] 11.2 Add Swagger decorators to DTOs and controllers
    - Add @ApiProperty() to all DTO fields with examples
    - Add @ApiTags() to controllers for grouping
    - Add @ApiOperation() to endpoints with descriptions
    - Add @ApiResponse() for success and error responses
    - Add @ApiBearerAuth() to protected endpoints
    - _Requirements: 30.3, 30.4, 30.5_

- [ ] 12. Integration tests
  - [ ]* 12.1 Write auth integration tests
    - Test POST /auth/register creates user and returns tokens
    - Test POST /auth/login validates credentials
    - Test POST /auth/refresh with valid cookie
    - Test POST /auth/logout clears tokens
    - Test error cases: invalid credentials, expired tokens, duplicate email
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.5, 3.1, 3.4, 4.1, 4.3_

  - [ ]* 12.2 Write projects integration tests
    - Test GET /projects with USER and ADMIN roles
    - Test GET /projects with status and search filters
    - Test POST /projects creates project for current user
    - Test GET /projects/:id with ownership validation
    - Test PATCH /projects/:id with ownership validation
    - Test DELETE /projects/:id cascades to tasks
    - Test error cases: unauthorized access, non-existent project
    - _Requirements: 7.1, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.4, 10.1, 10.3, 11.1, 11.3, 11.5_

  - [ ]* 12.3 Write tasks integration tests
    - Test POST /projects/:projectId/tasks creates task
    - Test POST to ARCHIVED project returns 403
    - Test GET /projects/:projectId/tasks/:id retrieves task
    - Test PATCH /projects/:projectId/tasks/:id updates task
    - Test DELETE /projects/:projectId/tasks/:id removes task
    - Test invalid assigneeId returns 404
    - Test error cases: invalid projectId, unauthorized access
    - _Requirements: 12.1, 12.4, 12.7, 13.1, 13.4, 14.1, 14.4, 15.1, 15.4_

  - [ ]* 12.4 Write admin integration tests
    - Test GET /admin/users returns all users (ADMIN only)
    - Test GET /admin/stats returns accurate counts
    - Test PATCH /admin/users/:id/role updates role
    - Test last admin demotion prevention
    - Test GET /admin/projects returns all projects
    - Test USER role gets 403 on all admin endpoints
    - _Requirements: 17.1, 17.2, 18.1, 18.6, 19.1, 19.2, 20.1, 20.2_

- [ ] 13. Docker setup and deployment configuration
  - [ ] 13.1 Create Dockerfile for production build
    - Use node:20-alpine base image
    - Multi-stage build (dependencies, build, production)
    - Copy Prisma schema and generate client
    - Set NODE_ENV=production
    - Expose port 3000
    - _Requirements: Dependencies section_

  - [ ] 13.2 Create docker-compose.yml for local development
    - Define PostgreSQL service with persistent volume
    - Define API service with environment variables
    - Configure network and port mappings
    - Add health checks
    - _Requirements: Database section_

  - [ ] 13.3 Create .dockerignore file
    - Exclude node_modules, .git, .env, dist
    - Include only necessary files for build
    - _Requirements: Best practices_

- [ ] 14. Final checkpoint - Ensure all tests pass and documentation is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Integration tests validate end-to-end flows and error handling
- Checkpoints ensure incremental validation at logical breaks
- All authentication and authorization logic is thoroughly tested
- Docker setup enables consistent deployment across environments
