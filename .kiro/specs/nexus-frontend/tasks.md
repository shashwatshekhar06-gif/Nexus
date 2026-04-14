# Implementation Plan: Nexus Frontend

## Overview

This plan implements a production-grade Next.js 14 App Router application with TypeScript and Tailwind CSS. The frontend provides a modern "Precision Dark" UI for project and task management, communicating with the NestJS backend at http://localhost:5000. Key features include JWT authentication with refresh token rotation, form validation with react-hook-form and zod, SWR data fetching with caching, and a Kanban task board with drag-and-drop functionality.

## Tasks

- [x] 1. Initialize Next.js 14 project with TypeScript and Tailwind CSS
  - Run `npx create-next-app@latest nexus-frontend --typescript --tailwind --app --no-src-dir`
  - Configure TypeScript with strict mode in tsconfig.json
  - Set up ESLint and Prettier configurations
  - Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
  - Install core dependencies: swr, axios, react-hook-form, zod, @hookform/resolvers
  - _Requirements: 24.10_

- [x] 2. Configure Tailwind CSS with Precision Dark theme
  - [x] 2.1 Create custom Tailwind configuration
    - Extend tailwind.config.ts with dark theme colors (gray-950 background, gray-900 cards)
    - Add custom color palette: primary (blue-500), success (green-500), warning (yellow-500), danger (red-500)
    - Configure custom spacing, border radius, and shadows for modern UI
    - Add custom animations for smooth transitions
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [x] 2.2 Create global styles in app/globals.css
    - Set up base dark theme styles with gradient backgrounds
    - Define CSS custom properties for theme colors
    - Add smooth scrolling and focus-visible styles
    - Configure responsive typography scale
    - _Requirements: 21.1, 21.6_

- [x] 3. Set up project structure and TypeScript types
  - [x] 3.1 Create directory structure
    - Create folders: app/, components/, contexts/, hooks/, lib/, types/, public/
    - Create subfolders: components/auth/, components/projects/, components/tasks/, components/ui/, components/layout/
    - _Requirements: 24.1_
  
  - [x] 3.2 Define TypeScript types in types/ directory
    - Create types/models.ts with User, Project, Task interfaces
    - Create types/api.ts with ApiSuccessResponse, ApiErrorResponse, PaginationMeta interfaces
    - Add validation types for form inputs (LoginFormData, RegisterFormData, ProjectFormData, TaskFormData)
    - Export all types from types/index.ts
    - _Requirements: 1.1, 6.1, 11.1_

- [x] 4. Implement API client with axios interceptors
  - [x] 4.1 Create lib/api-client.ts with axios instance
    - Configure axios with baseURL from environment variable
    - Set timeout to 30000ms and withCredentials to true
    - _Requirements: 24.5, 24.6_
  
  - [x] 4.2 Add request interceptor for authentication
    - Implement getAccessToken() function to retrieve token from memory
    - Add Authorization header with Bearer token to all requests
    - _Requirements: 24.5_
  
  - [x] 4.3 Add response interceptor for token refresh
    - Detect 401 errors and attempt token refresh
    - Retry original request with new token after successful refresh
    - Redirect to login on refresh failure
    - Implement _retry flag to prevent infinite loops
    - _Requirements: 3.5, 3.6, 3.7, 17.2_
  
  - [ ]* 4.4 Write unit tests for API client
    - Test request interceptor adds Authorization header
    - Test response interceptor handles 401 and refreshes token
    - Test retry logic after successful refresh
    - _Requirements: 3.5, 3.6_

- [x] 5. Implement authentication utilities and token storage
  - [x] 5.1 Create lib/auth.ts with token management functions
    - Implement getAccessToken() to retrieve token from memory variable
    - Implement setAccessToken(token: string) to store token in memory
    - Implement clearAccessToken() to remove token from memory
    - Implement isTokenExpired(token: string) using jwt-decode
    - Install jwt-decode dependency
    - _Requirements: 24.1, 24.2_
  
  - [ ]* 5.2 Write property test for token expiry detection
    - **Property 5: Token Refresh Timing**
    - **Validates: Requirements 3.1, 3.2**
    - Generate tokens with various expiry times
    - Verify isTokenExpired correctly identifies expired tokens
    - _Requirements: 3.1_

- [x] 6. Create AuthContext and AuthProvider
  - [x] 6.1 Implement contexts/auth-context.tsx
    - Define AuthContextValue interface with user, isLoading, isAuthenticated, login, register, logout, refreshToken
    - Create AuthContext with React.createContext
    - Implement AuthProvider component managing user state with useState
    - Implement login function calling POST /auth/login and storing token
    - Implement register function calling POST /auth/register
    - Implement logout function calling POST /auth/logout and clearing state
    - Implement refreshToken function calling POST /auth/refresh
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 5.1, 5.2, 5.3, 5.4_
  
  - [x] 6.2 Add automatic token refresh scheduling
    - Implement setupTokenRefresh() function using setTimeout
    - Schedule refresh 1 minute before token expiry
    - Call setupTokenRefresh() after successful login and refresh
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 6.3 Add useAuth hook for consuming context
    - Create hooks/use-auth.ts exporting useAuth hook
    - Return useContext(AuthContext) with type safety
    - _Requirements: 1.1, 2.1, 5.1_
  
  - [ ]* 6.4 Write property test for authentication state consistency
    - **Property 1: Authentication State Consistency**
    - **Validates: Requirements 1.2, 1.3, 24.1**
    - Verify isAuthenticated implies token exists and is not expired
    - Test with various authentication states
    - _Requirements: 1.2, 1.3_

- [x] 7. Checkpoint - Verify authentication foundation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create Zod validation schemas
  - [x] 8.1 Create lib/validators.ts with form schemas
    - Define loginSchema with email and password validation
    - Define registerSchema with email, name, and password validation (8+ chars, uppercase, lowercase, number, special char)
    - Define projectSchema with name (3-100 chars), description (max 500 chars), status validation
    - Define taskSchema with title (3-200 chars), description (max 1000 chars), status, priority, dueDate validation
    - _Requirements: 1.6, 1.7, 2.5, 2.6, 2.7, 7.6, 7.7, 7.8, 12.5, 12.6, 12.7, 16.1, 16.2, 16.3_
  
  - [ ]* 8.2 Write property test for form validation completeness
    - **Property 3: Form Validation Completeness**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4**
    - Generate invalid form data and verify all errors are caught
    - Generate valid form data and verify no errors
    - _Requirements: 16.1, 16.2, 16.3_

- [x] 9. Create reusable UI components
  - [x] 9.1 Create components/ui/button.tsx
    - Implement Button component with variants (primary, secondary, danger, ghost)
    - Add size prop (sm, md, lg) with minimum 44x44px touch target
    - Add loading state with spinner
    - Add disabled state styling
    - _Requirements: 18.2, 21.6_
  
  - [x] 9.2 Create components/ui/input.tsx
    - Implement Input component with label and error message support
    - Add variants for different input types (text, email, password, textarea)
    - Style with dark theme colors and focus states
    - _Requirements: 16.1, 21.6_
  
  - [x] 9.3 Create components/ui/modal.tsx
    - Implement Modal component with overlay and close button
    - Add animation for open/close transitions
    - Implement focus trap and ESC key to close
    - Make responsive for mobile devices
    - _Requirements: 21.1, 21.4_
  
  - [x] 9.4 Create components/ui/loading-spinner.tsx
    - Implement LoadingSpinner component with size variants
    - Add smooth rotation animation
    - _Requirements: 18.1, 18.4_
  
  - [x] 9.5 Create components/ui/error-message.tsx
    - Implement ErrorMessage component displaying error text
    - Add retry button prop for recoverable errors
    - Style with danger colors
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [x] 10. Implement authentication forms
  - [x] 10.1 Create components/auth/login-form.tsx
    - Use react-hook-form with zodResolver(loginSchema)
    - Render email and password Input components
    - Display validation errors inline below fields
    - Show loading state on submit button during API call
    - Display API error messages using ErrorMessage component
    - Call useAuth().login() on valid submission
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 18.2_
  
  - [x] 10.2 Create components/auth/register-form.tsx
    - Use react-hook-form with zodResolver(registerSchema)
    - Render email, name, and password Input components
    - Display validation errors inline
    - Show loading state on submit button
    - Display API error messages
    - Call useAuth().register() on valid submission
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 18.2_
  
  - [ ]* 10.3 Write unit tests for authentication forms
    - Test form validation displays errors for invalid inputs
    - Test form submission calls auth functions with correct data
    - Test loading states during submission
    - _Requirements: 1.6, 1.7, 2.5, 2.6, 2.7_

- [x] 11. Create authentication pages
  - [x] 11.1 Create app/(auth)/login/page.tsx
    - Render LoginForm component
    - Redirect to /dashboard on successful login
    - Use dark theme styling with centered layout
    - _Requirements: 1.1, 1.4_
  
  - [x] 11.2 Create app/(auth)/register/page.tsx
    - Render RegisterForm component
    - Redirect to /dashboard on successful registration
    - Use dark theme styling with centered layout
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 11.3 Create app/(auth)/layout.tsx
    - Implement minimal layout for auth pages (no header/sidebar)
    - Center content vertically and horizontally
    - _Requirements: 21.1_

- [x] 12. Implement ProtectedRoute component
  - [x] 12.1 Create components/auth/protected-route.tsx
    - Check useAuth().isAuthenticated status
    - Show loading spinner while checking authentication
    - Redirect to /login with redirect query param if not authenticated
    - Check requiredRole prop and verify user.role matches
    - Display "Access Denied" error if role doesn't match
    - Render children if authenticated and authorized
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 12.2 Write property test for protected route access control
    - **Property 2: Protected Route Access Control**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Test unauthenticated users are redirected to login
    - Test redirect URL is preserved
    - Test role-based access control
    - _Requirements: 4.1, 4.2, 4.5_

- [x] 13. Create layout components
  - [x] 13.1 Create components/layout/header.tsx
    - Display app name and user info
    - Add logout button calling useAuth().logout()
    - Add navigation links to dashboard, projects, admin (if admin role)
    - Make responsive with hamburger menu on mobile
    - _Requirements: 5.1, 21.1, 21.4_
  
  - [x] 13.2 Create app/(dashboard)/layout.tsx
    - Wrap with ProtectedRoute component
    - Render Header component
    - Apply consistent padding and max-width container
    - _Requirements: 4.1, 4.4_
  
  - [x] 13.3 Create app/layout.tsx (root layout)
    - Wrap with AuthProvider
    - Import globals.css
    - Set up HTML lang and metadata
    - _Requirements: 1.1_

- [x] 14. Checkpoint - Verify authentication UI is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement projects data fetching hooks
  - [ ] 15.1 Create hooks/use-projects.ts
    - Implement useProjects(filters?) hook using useSWR
    - Build query string from filters (status, search, page, limit)
    - Configure SWR with revalidateOnFocus, revalidateOnReconnect, dedupingInterval: 2000
    - Return projects array, meta, isLoading, error, mutate
    - Only fetch if user is authenticated
    - _Requirements: 6.1, 6.2, 6.3, 10.1, 10.2, 10.3, 10.6, 22.1, 22.2, 22.3, 22.7_
  
  - [ ] 15.2 Add project mutation functions to useProjects
    - Implement createProject(data) calling POST /projects
    - Implement updateProject(id, data) calling PATCH /projects/:id
    - Implement deleteProject(id) calling DELETE /projects/:id
    - Call mutate() after each mutation to revalidate cache
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 8.2, 8.3, 8.4, 9.2, 9.3, 9.4, 22.4_
  
  - [ ]* 15.3 Write property test for SWR cache consistency
    - **Property 6: SWR Cache Consistency**
    - **Validates: Requirements 22.4, 22.5, 22.6**
    - Verify cache is revalidated after mutations
    - Test cache returns stale data while revalidating
    - _Requirements: 22.4, 22.5, 22.6_

- [ ] 16. Create project components
  - [ ] 16.1 Create components/projects/project-card.tsx
    - Display project name, description, status badge, and creation date
    - Add edit and delete buttons
    - Show loading state during mutations
    - Format dates with date-fns
    - Install date-fns dependency
    - Apply card styling with hover effects
    - _Requirements: 6.3, 6.6, 21.2, 21.3_
  
  - [ ] 16.2 Create components/projects/project-form.tsx
    - Use react-hook-form with zodResolver(projectSchema)
    - Render name, description, and status Input components
    - Pre-populate fields when editing (defaultValues prop)
    - Display validation errors inline
    - Show loading state on submit button
    - Call onSubmit prop with form data
    - _Requirements: 7.2, 7.6, 7.7, 7.8, 8.1, 8.2, 8.7, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_
  
  - [ ] 16.3 Create components/projects/project-filters.tsx
    - Render search input with debounce (300ms)
    - Render status filter dropdown (All, Active, Archived)
    - Call onChange prop when filters change
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ] 16.4 Create components/projects/project-list.tsx
    - Render grid of ProjectCard components
    - Apply responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
    - Show "No projects found" message when empty
    - Show loading skeletons while loading
    - Show error message with retry button on error
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 21.1, 21.2, 21.3_

- [ ] 17. Create projects page
  - [ ] 17.1 Create app/(dashboard)/projects/page.tsx
    - Use useProjects hook with filters state
    - Render ProjectFilters component
    - Render ProjectList component
    - Add "Create Project" button opening Modal with ProjectForm
    - Handle project creation, editing, and deletion
    - Show confirmation dialog before deletion
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.5, 9.1, 9.2, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 17.2 Add pagination to projects page
    - Render pagination controls below project list
    - Display current page, total pages, and page navigation buttons
    - Disable Previous on first page, Next on last page
    - Scroll to top when page changes
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8_
  
  - [ ]* 17.3 Write integration tests for projects page
    - Test complete project CRUD workflow
    - Test filtering and search functionality
    - Test pagination navigation
    - _Requirements: 6.1, 7.1, 8.1, 9.1, 10.1, 20.1_

- [ ] 18. Checkpoint - Verify projects feature is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement tasks data fetching hooks
  - [ ] 19.1 Create hooks/use-tasks.ts
    - Implement useTasks(projectId) hook using useSWR
    - Fetch tasks from GET /projects/:projectId/tasks
    - Configure SWR with same options as useProjects
    - Return tasks array, isLoading, error, mutate
    - _Requirements: 11.1, 11.2, 22.1, 22.2, 22.3, 22.7_
  
  - [ ] 19.2 Add task mutation functions to useTasks
    - Implement createTask(data) calling POST /projects/:projectId/tasks
    - Implement updateTask(taskId, data) calling PATCH /tasks/:taskId
    - Implement updateTaskStatus(taskId, status) calling PATCH /tasks/:taskId with status only
    - Implement deleteTask(taskId) calling DELETE /tasks/:taskId
    - Call mutate() after each mutation to revalidate cache
    - Implement optimistic updates for updateTaskStatus
    - _Requirements: 12.2, 12.3, 12.4, 13.2, 13.3, 13.4, 13.5, 14.2, 14.3, 14.4, 15.2, 15.3, 15.4, 19.1, 19.2, 19.3, 22.4_
  
  - [ ]* 19.3 Write property test for optimistic update rollback
    - **Property 4: Optimistic Update Rollback**
    - **Validates: Requirements 19.4, 19.5**
    - Test UI reverts to previous state on API failure
    - Test error message is displayed on failure
    - _Requirements: 13.5, 19.4, 19.5_

- [ ] 20. Create task components
  - [ ] 20.1 Create components/tasks/task-card.tsx
    - Display task title, priority indicator (color-coded), and assignee
    - Add click handler to open task detail modal
    - Apply card styling with hover and drag states
    - Show isDragging visual feedback
    - _Requirements: 11.6, 13.1_
  
  - [ ] 20.2 Create components/tasks/task-form.tsx
    - Use react-hook-form with zodResolver(taskSchema)
    - Render title, description, status, priority, dueDate, assigneeId Input components
    - Pre-populate fields when editing
    - Display validation errors inline
    - Show loading state on submit button
    - Call onSubmit prop with form data
    - _Requirements: 12.1, 12.2, 12.5, 12.6, 12.7, 12.9, 14.1, 14.2, 14.6, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_
  
  - [ ] 20.3 Create components/tasks/task-column.tsx
    - Render column header with status title and task count
    - Render Droppable area from @hello-pangea/dnd
    - Render list of Draggable TaskCard components
    - Show "No tasks yet" when column is empty
    - Apply isDraggingOver styling
    - Add "Add Task" button at top of column
    - _Requirements: 11.2, 11.3, 11.5, 12.1, 13.1_
  
  - [ ] 20.4 Create components/tasks/task-board.tsx
    - Install @hello-pangea/dnd dependency
    - Render DragDropContext with onDragEnd handler
    - Render four TaskColumn components (TODO, IN_PROGRESS, IN_REVIEW, DONE)
    - Implement handleDragEnd to update task status on drop
    - Apply responsive grid (1 col mobile horizontal scroll, 4 cols desktop)
    - Show loading skeletons while loading
    - Show error message with retry button on error
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 21.4, 21.5_

- [ ] 21. Create task board page
  - [ ] 21.1 Create app/(dashboard)/projects/[id]/tasks/page.tsx
    - Extract projectId from route params
    - Use useTasks(projectId) hook
    - Render TaskBoard component
    - Add Modal for task creation and editing
    - Handle task creation with status from column
    - Handle task editing from card click
    - Handle task deletion with confirmation dialog
    - _Requirements: 11.1, 11.2, 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 14.1, 14.2, 14.7, 15.1, 15.2, 15.5_
  
  - [ ]* 21.2 Write integration tests for task board
    - Test drag-and-drop task status updates
    - Test task creation from column
    - Test task editing and deletion
    - _Requirements: 11.1, 12.1, 13.1, 14.1, 15.1_

- [ ] 22. Checkpoint - Verify task board feature is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Implement admin features
  - [ ] 23.1 Create hooks/use-users.ts
    - Implement useUsers() hook using useSWR
    - Fetch users from GET /admin/users
    - Implement updateUserRole(userId, role) calling PATCH /admin/users/:userId/role
    - Call mutate() after role update
    - _Requirements: 23.1, 23.2, 23.4, 23.5_
  
  - [ ] 23.2 Create app/(dashboard)/admin/page.tsx
    - Wrap with ProtectedRoute requiring ADMIN role
    - Use useUsers hook
    - Display table of users with email, name, role, registration date
    - Add role change dropdown for each user
    - Display system statistics (total users, projects, tasks)
    - Show loading state while fetching
    - Show error message on fetch failure
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 4.5_
  
  - [ ]* 23.3 Write unit tests for admin features
    - Test admin page requires ADMIN role
    - Test user role updates
    - _Requirements: 23.1, 23.4, 23.6_

- [ ] 24. Create dashboard home page
  - [ ] 24.1 Create app/(dashboard)/dashboard/page.tsx
    - Display welcome message with user name
    - Show quick stats (project count, task count)
    - Display recent projects list with links
    - Add "Create Project" and "View All Projects" buttons
    - _Requirements: 1.4, 2.3, 6.1_

- [ ] 25. Implement error handling and loading states
  - [ ] 25.1 Add error handling to all API calls
    - Parse error responses and display appropriate messages
    - Map status codes to user-friendly messages (400, 401, 403, 404, 429, 500)
    - Log errors to console for debugging
    - Provide retry buttons for recoverable errors
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8_
  
  - [ ] 25.2 Add loading states to all async operations
    - Show loading spinners during data fetching
    - Show skeleton screens for initial page loads
    - Disable and show "Saving..." on submit buttons during mutations
    - Show subtle loading indicators for background refreshes
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 26. Implement optimistic updates for better UX
  - [ ] 26.1 Add optimistic updates to project mutations
    - Immediately add new project to list before API response
    - Immediately update project in list before API response
    - Immediately remove project from list before API response
    - Revert changes and show error if API call fails
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ] 26.2 Add optimistic updates to task status changes
    - Immediately move task to new column on drag-and-drop
    - Revert task position if API call fails
    - Show error message on failure
    - _Requirements: 13.3, 13.4, 13.5, 13.6, 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 27. Add responsive design polish
  - [ ] 27.1 Verify mobile responsiveness
    - Test all pages on mobile viewport (375px width)
    - Ensure touch targets are minimum 44x44px
    - Verify horizontal scroll for task board on mobile
    - Test hamburger menu navigation on mobile
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7_
  
  - [ ] 27.2 Add loading and error states polish
    - Implement skeleton screens for better perceived performance
    - Add smooth transitions for loading states
    - Ensure error messages are accessible and actionable
    - _Requirements: 18.1, 18.4, 17.7_

- [ ] 28. Final integration and polish
  - [ ] 28.1 Create app/page.tsx (home page)
    - Redirect authenticated users to /dashboard
    - Show landing page with login/register links for unauthenticated users
    - _Requirements: 1.4, 2.3_
  
  - [ ] 28.2 Add navigation and routing polish
    - Implement breadcrumbs for nested pages
    - Add back navigation for task board
    - Ensure all links work correctly
    - _Requirements: 4.3_
  
  - [ ] 28.3 Verify all error scenarios are handled
    - Test network failure scenarios
    - Test authentication expiry during session
    - Test permission denied scenarios
    - Test validation errors
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [ ] 29. Final checkpoint - Complete end-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout as specified in the design document
- All components follow the Precision Dark design language with Tailwind CSS
- SWR provides automatic caching, revalidation, and optimistic updates
- Authentication uses JWT tokens with automatic refresh before expiry
