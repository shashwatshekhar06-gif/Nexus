# Requirements Document: Nexus API

## Introduction

Nexus is a production-grade project and task management REST API designed for internship project tracking. The system provides role-based access control with two user roles (USER and ADMIN), JWT-based authentication with refresh tokens, and comprehensive CRUD operations for projects and tasks. The API is built with NestJS, uses Prisma ORM with PostgreSQL, and includes rate limiting, validation, and auto-generated OpenAPI documentation.

## Glossary

- **System**: The Nexus API application
- **User**: An authenticated account with either USER or ADMIN role
- **Project**: A container for tasks with ownership and status tracking
- **Task**: A work item within a project with status, priority, and assignment
- **JWT**: JSON Web Token used for authentication
- **Access_Token**: Short-lived JWT (15 minutes) for API authentication
- **Refresh_Token**: Long-lived JWT (7 days) for obtaining new access tokens
- **Owner**: The user who created a project
- **Assignee**: The user assigned to a task
- **DTO**: Data Transfer Object for request validation
- **RBAC**: Role-Based Access Control
- **Guard**: NestJS middleware for authentication and authorization
- **Prisma**: Type-safe ORM for database operations

## Requirements

### Requirement 1: User Registration

**User Story:** As a new user, I want to register an account with email and password, so that I can access the project management system.

#### Acceptance Criteria

1. WHEN a user submits valid registration data, THE System SHALL create a new user account with hashed password
2. WHEN a user registers, THE System SHALL generate an access token and refresh token pair
3. WHEN a user registers, THE System SHALL return the access token in the response body and set the refresh token as an httpOnly cookie
4. WHEN a user registers, THE System SHALL assign the USER role by default
5. WHEN a user attempts to register with an existing email, THE System SHALL return a 409 Conflict error
6. WHEN a user submits a password, THE System SHALL hash it using bcrypt with 12 salt rounds before storage
7. THE System SHALL validate that email is in valid email format
8. THE System SHALL validate that password is at least 8 characters and contains uppercase, lowercase, number, and special character

### Requirement 2: User Authentication

**User Story:** As a registered user, I want to login with my credentials, so that I can access my projects and tasks.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials, THE System SHALL verify the password against the stored hash
2. WHEN password verification succeeds, THE System SHALL generate new access and refresh tokens
3. WHEN login succeeds, THE System SHALL store the refresh token hash in the database
4. WHEN login succeeds, THE System SHALL return the access token in the response body and set the refresh token as an httpOnly cookie
5. WHEN a user submits invalid credentials, THE System SHALL return a 401 Unauthorized error with message "Invalid credentials"
6. THE System SHALL exclude the password field from all response payloads

### Requirement 3: Token Refresh

**User Story:** As an authenticated user, I want to refresh my access token when it expires, so that I can continue using the API without re-authenticating.

#### Acceptance Criteria

1. WHEN a user submits a valid refresh token, THE System SHALL verify the JWT signature
2. WHEN the refresh token signature is valid, THE System SHALL compare the token against the stored hash in the database
3. WHEN the refresh token matches the stored hash, THE System SHALL generate a new access token
4. WHEN the refresh token is invalid or expired, THE System SHALL return a 401 Unauthorized error
5. THE System SHALL set access token expiry to 15 minutes
6. THE System SHALL set refresh token expiry to 7 days

### Requirement 4: User Logout

**User Story:** As an authenticated user, I want to logout, so that my session is terminated and tokens are invalidated.

#### Acceptance Criteria

1. WHEN a user logs out, THE System SHALL set the user's refresh token to null in the database
2. WHEN a user logs out, THE System SHALL clear the refresh token cookie
3. WHEN a user logs out, THE System SHALL return a success response

### Requirement 5: JWT Authentication Guard

**User Story:** As a system, I want to protect endpoints with JWT authentication, so that only authenticated users can access protected resources.

#### Acceptance Criteria

1. WHEN a request includes a valid JWT access token, THE System SHALL extract the user from the token payload
2. WHEN a request includes a valid JWT access token, THE System SHALL populate the request.user object
3. WHEN a request includes an invalid or expired JWT, THE System SHALL return a 401 Unauthorized error
4. WHEN a request to a protected endpoint has no authorization header, THE System SHALL return a 401 Unauthorized error

### Requirement 6: Role-Based Access Control

**User Story:** As a system administrator, I want to restrict certain operations to ADMIN users, so that sensitive operations are protected.

#### Acceptance Criteria

1. WHEN an ADMIN user accesses an admin-only endpoint, THE System SHALL allow the request
2. WHEN a USER role attempts to access an admin-only endpoint, THE System SHALL return a 403 Forbidden error
3. WHEN checking roles, THE System SHALL use the role from the authenticated user object
4. THE System SHALL enforce role checks after JWT authentication

### Requirement 7: Project Creation

**User Story:** As an authenticated user, I want to create a new project, so that I can organize my tasks.

#### Acceptance Criteria

1. WHEN a user creates a project, THE System SHALL set the ownerId to the authenticated user's ID
2. WHEN a user creates a project, THE System SHALL set the status to ACTIVE by default
3. WHEN a user creates a project, THE System SHALL validate that name is 3-200 characters
4. WHEN a user creates a project, THE System SHALL validate that description is max 1000 characters if provided
5. THE System SHALL return the created project with owner information

### Requirement 8: Project Listing with Access Control

**User Story:** As a user, I want to view my projects, so that I can see what I'm working on.

#### Acceptance Criteria

1. WHEN a USER role requests projects, THE System SHALL return only projects where ownerId matches the user's ID
2. WHEN an ADMIN role requests projects, THE System SHALL return all projects regardless of ownership
3. WHEN a user requests projects with status filter, THE System SHALL return only projects matching that status
4. WHEN a user requests projects with search query, THE System SHALL return projects where name contains the search term (case-insensitive)
5. THE System SHALL return paginated results with page, limit, total, and totalPages metadata
6. THE System SHALL default to page 1 and limit 20 if not specified

### Requirement 9: Project Retrieval

**User Story:** As a user, I want to view a specific project's details, so that I can see its information and tasks.

#### Acceptance Criteria

1. WHEN a USER role requests a project they own, THE System SHALL return the project details
2. WHEN a USER role requests a project they don't own, THE System SHALL return a 403 Forbidden error
3. WHEN an ADMIN role requests any project, THE System SHALL return the project details
4. WHEN a user requests a non-existent project, THE System SHALL return a 404 Not Found error
5. THE System SHALL include owner information in the response

### Requirement 10: Project Update

**User Story:** As a project owner, I want to update my project's details, so that I can keep information current.

#### Acceptance Criteria

1. WHEN a project owner updates their project, THE System SHALL apply the changes
2. WHEN an ADMIN updates any project, THE System SHALL apply the changes
3. WHEN a USER role attempts to update a project they don't own, THE System SHALL return a 403 Forbidden error
4. WHEN updating a project, THE System SHALL validate name and description constraints
5. WHEN updating a project, THE System SHALL allow changing the status to ARCHIVED
6. THE System SHALL return the updated project

### Requirement 11: Project Deletion

**User Story:** As a project owner, I want to delete a project, so that I can remove projects I no longer need.

#### Acceptance Criteria

1. WHEN a project owner deletes their project, THE System SHALL remove the project from the database
2. WHEN an ADMIN deletes any project, THE System SHALL remove the project from the database
3. WHEN a project is deleted, THE System SHALL cascade delete all associated tasks
4. WHEN a USER role attempts to delete a project they don't own, THE System SHALL return a 403 Forbidden error
5. WHEN a user deletes a non-existent project, THE System SHALL return a 404 Not Found error


### Requirement 12: Task Creation

**User Story:** As a project owner, I want to create tasks within my project, so that I can track work items.

#### Acceptance Criteria

1. WHEN a project owner creates a task, THE System SHALL add the task to the specified project
2. WHEN an ADMIN creates a task in any project, THE System SHALL add the task to the specified project
3. WHEN a USER role attempts to create a task in a project they don't own, THE System SHALL return a 403 Forbidden error
4. WHEN creating a task in an ARCHIVED project, THE System SHALL return a 403 Forbidden error with message "Cannot create tasks in archived projects"
5. WHEN creating a task, THE System SHALL validate that title is 3-200 characters
6. WHEN creating a task, THE System SHALL validate that description is max 2000 characters if provided
7. WHEN creating a task with an assigneeId, THE System SHALL validate that the assignee user exists
8. WHEN creating a task without status, THE System SHALL default to TODO
9. WHEN creating a task without priority, THE System SHALL default to MEDIUM
10. THE System SHALL validate that projectId references an existing project

### Requirement 13: Task Retrieval

**User Story:** As a user, I want to view task details, so that I can see task information and assignments.

#### Acceptance Criteria

1. WHEN a project owner requests a task from their project, THE System SHALL return the task details
2. WHEN an ADMIN requests any task, THE System SHALL return the task details
3. WHEN a USER role requests a task from a project they don't own, THE System SHALL return a 403 Forbidden error
4. WHEN a user requests a non-existent task, THE System SHALL return a 404 Not Found error
5. THE System SHALL include project and assignee information in the response

### Requirement 14: Task Update

**User Story:** As a project owner, I want to update task details, so that I can track progress and changes.

#### Acceptance Criteria

1. WHEN a project owner updates a task in their project, THE System SHALL apply the changes
2. WHEN an ADMIN updates any task, THE System SHALL apply the changes
3. WHEN a USER role attempts to update a task in a project they don't own, THE System SHALL return a 403 Forbidden error
4. WHEN updating a task in an ARCHIVED project, THE System SHALL return a 403 Forbidden error
5. WHEN updating a task, THE System SHALL validate title, description, status, and priority constraints
6. WHEN updating a task with an assigneeId, THE System SHALL validate that the assignee user exists
7. WHEN a task is updated, THE System SHALL update the updatedAt timestamp
8. THE System SHALL return the updated task

### Requirement 15: Task Deletion

**User Story:** As a project owner, I want to delete tasks, so that I can remove tasks that are no longer needed.

#### Acceptance Criteria

1. WHEN a project owner deletes a task from their project, THE System SHALL remove the task from the database
2. WHEN an ADMIN deletes any task, THE System SHALL remove the task from the database
3. WHEN a USER role attempts to delete a task from a project they don't own, THE System SHALL return a 403 Forbidden error
4. WHEN a user deletes a non-existent task, THE System SHALL return a 404 Not Found error

### Requirement 16: Project Task Listing

**User Story:** As a project owner, I want to view all tasks in my project, so that I can see the work breakdown.

#### Acceptance Criteria

1. WHEN a project owner requests tasks for their project, THE System SHALL return all tasks in that project
2. WHEN an ADMIN requests tasks for any project, THE System SHALL return all tasks in that project
3. WHEN a USER role requests tasks for a project they don't own, THE System SHALL return a 403 Forbidden error
4. THE System SHALL return paginated results with metadata
5. THE System SHALL include assignee information for each task

### Requirement 17: Admin User Listing

**User Story:** As an administrator, I want to view all users in the system, so that I can manage accounts.

#### Acceptance Criteria

1. WHEN an ADMIN requests all users, THE System SHALL return all user accounts
2. WHEN a USER role attempts to access the user list, THE System SHALL return a 403 Forbidden error
3. THE System SHALL exclude password and refreshToken fields from user responses
4. THE System SHALL return paginated results with metadata

### Requirement 18: Admin Statistics

**User Story:** As an administrator, I want to view system statistics, so that I can monitor usage and activity.

#### Acceptance Criteria

1. WHEN an ADMIN requests statistics, THE System SHALL return total user count
2. WHEN an ADMIN requests statistics, THE System SHALL return total project count
3. WHEN an ADMIN requests statistics, THE System SHALL return total task count
4. WHEN an ADMIN requests statistics, THE System SHALL return task counts grouped by status
5. WHEN an ADMIN requests statistics, THE System SHALL return task counts grouped by priority
6. WHEN a USER role attempts to access statistics, THE System SHALL return a 403 Forbidden error
7. THE System SHALL execute all statistics queries in a single transaction for consistency

### Requirement 19: Admin Role Management

**User Story:** As an administrator, I want to change user roles, so that I can grant or revoke administrative privileges.

#### Acceptance Criteria

1. WHEN an ADMIN updates a user's role, THE System SHALL apply the role change
2. WHEN an ADMIN attempts to demote the last remaining ADMIN user, THE System SHALL return a 403 Forbidden error with message "Cannot demote last admin user"
3. WHEN a USER role attempts to update roles, THE System SHALL return a 403 Forbidden error
4. THE System SHALL validate that the role is either USER or ADMIN
5. THE System SHALL return the updated user without password field

### Requirement 20: Admin Project Listing

**User Story:** As an administrator, I want to view all projects with owner information, so that I can monitor project activity.

#### Acceptance Criteria

1. WHEN an ADMIN requests all projects, THE System SHALL return all projects with owner details
2. WHEN a USER role attempts to access the admin project list, THE System SHALL return a 403 Forbidden error
3. THE System SHALL return paginated results with metadata
4. THE System SHALL include owner name and email for each project

### Requirement 21: Request Validation

**User Story:** As a system, I want to validate all incoming requests, so that invalid data is rejected before processing.

#### Acceptance Criteria

1. WHEN a request contains invalid data, THE System SHALL return a 422 Unprocessable Entity error
2. WHEN validation fails, THE System SHALL return field-level error messages
3. WHEN a request contains unknown properties, THE System SHALL reject the request with a 400 Bad Request error
4. WHEN a URL parameter should be a UUID, THE System SHALL validate the format and return 400 if invalid
5. THE System SHALL transform plain request objects to DTO class instances

### Requirement 22: Response Formatting

**User Story:** As a client application, I want consistent response formats, so that I can reliably parse API responses.

#### Acceptance Criteria

1. WHEN a request succeeds, THE System SHALL return a response with success=true and data field
2. WHEN a request fails, THE System SHALL return a response with success=false, statusCode, and message fields
3. WHEN a request returns paginated data, THE System SHALL include meta field with page, limit, total, and totalPages
4. WHEN an error occurs, THE System SHALL include a timestamp in the response
5. THE System SHALL calculate totalPages as ceiling of total divided by limit

### Requirement 23: Rate Limiting

**User Story:** As a system, I want to limit request rates, so that I can prevent abuse and ensure fair usage.

#### Acceptance Criteria

1. WHEN a client exceeds 100 requests per minute, THE System SHALL return a 429 Too Many Requests error
2. WHEN a client exceeds 10 requests per minute to auth endpoints, THE System SHALL return a 429 Too Many Requests error
3. WHEN rate limit is exceeded, THE System SHALL include a Retry-After header in the response
4. THE System SHALL track rate limits per client IP address

### Requirement 24: Security Headers

**User Story:** As a system, I want to set security headers on all responses, so that common web vulnerabilities are mitigated.

#### Acceptance Criteria

1. THE System SHALL set X-Frame-Options header to DENY
2. THE System SHALL set X-Content-Type-Options header to nosniff
3. THE System SHALL set Strict-Transport-Security header in production
4. THE System SHALL set Content-Security-Policy header

### Requirement 25: CORS Configuration

**User Story:** As a system, I want to configure CORS properly, so that only authorized origins can access the API.

#### Acceptance Criteria

1. THE System SHALL allow requests only from the configured CLIENT_URL origin
2. THE System SHALL enable credentials for cross-origin requests
3. THE System SHALL handle preflight requests automatically

### Requirement 26: Cookie Security

**User Story:** As a system, I want to store refresh tokens securely in cookies, so that they cannot be accessed by JavaScript.

#### Acceptance Criteria

1. WHEN setting a refresh token cookie, THE System SHALL set the httpOnly flag to true
2. WHEN setting a refresh token cookie in production, THE System SHALL set the secure flag to true
3. WHEN setting a refresh token cookie, THE System SHALL set sameSite to 'strict'
4. THE System SHALL set cookie expiry to match refresh token expiry (7 days)

### Requirement 27: Password Security

**User Story:** As a system, I want to enforce strong password requirements, so that user accounts are protected.

#### Acceptance Criteria

1. THE System SHALL require passwords to be at least 8 characters long
2. THE System SHALL require passwords to contain at least one uppercase letter
3. THE System SHALL require passwords to contain at least one lowercase letter
4. THE System SHALL require passwords to contain at least one number
5. THE System SHALL require passwords to contain at least one special character
6. THE System SHALL never log passwords
7. THE System SHALL never return passwords in API responses

### Requirement 28: Database Referential Integrity

**User Story:** As a system, I want to maintain referential integrity, so that data relationships remain consistent.

#### Acceptance Criteria

1. WHEN a project is deleted, THE System SHALL cascade delete all associated tasks
2. WHEN creating a task, THE System SHALL validate that projectId references an existing project
3. WHEN creating a task with an assigneeId, THE System SHALL validate that assigneeId references an existing user
4. THE System SHALL use foreign key constraints in the database schema

### Requirement 29: Pagination Calculation

**User Story:** As a system, I want to calculate pagination correctly, so that clients can navigate through large datasets.

#### Acceptance Criteria

1. WHEN calculating skip value, THE System SHALL use formula: skip = (page - 1) × limit
2. WHEN calculating totalPages, THE System SHALL use formula: totalPages = ceiling(total / limit)
3. WHEN total is 0, THE System SHALL return totalPages as 0
4. WHEN page or limit is not provided, THE System SHALL default page to 1 and limit to 20
5. THE System SHALL validate that page and limit are positive integers

### Requirement 30: OpenAPI Documentation

**User Story:** As a developer, I want auto-generated API documentation, so that I can understand available endpoints and schemas.

#### Acceptance Criteria

1. THE System SHALL generate OpenAPI 3.0 specification from decorators
2. THE System SHALL serve Swagger UI at /api/docs endpoint
3. THE System SHALL document all endpoints with request and response schemas
4. THE System SHALL document authentication requirements for protected endpoints
5. THE System SHALL include example values in the documentation
