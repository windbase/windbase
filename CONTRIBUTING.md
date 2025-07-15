# Contributing to Windbase

Thank you for your interest in contributing to Windbase! This document provides comprehensive guidelines for contributing to the project.

## Table of Contents

- [About Windbase](#about-windbase)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## About Windbase

Windbase is an open-source visual builder for TailwindCSS that allows users to design, preview, and export TailwindCSS components. It's built as a modern React application with TypeScript and features a modular architecture with multiple packages.

**Key Features:**
- Visual builder interface for TailwindCSS
- Support for DaisyUI and Flowbite
- Import from HTML/JSX
- Export to HTML/JSX
- Custom TailwindCSS configuration
- Dark mode support

## Development Setup

### Prerequisites

- **Node.js**: Version 22 or higher
- **pnpm**: Version 9 or higher
- **Git**: Latest version

### Getting Started

1. **Fork and Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/windbase.git
   cd windbase
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

   This will start the web application at `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build all packages
- `pnpm nx build web` - Build the web application
- `pnpm nx build <package-name>` - Build a specific package
- `pnpm nx test <package-name>` - Run tests for a specific package
- `pnpm nx typecheck` - Run TypeScript type checking
- `pnpm nx run-many --target=build --all` - Build all packages

## Project Architecture

Windbase is organized as a monorepo using [pnpm workspaces](https://pnpm.io/workspaces) and [Nx](https://nx.dev/) for build orchestration.

### Package Structure

```
windbase/
├── apps/
│   └── web/                 # Main React application
├── packages/
│   ├── core/               # Core element definitions and types
│   ├── engine/             # State management and business logic
│   ├── exporters/          # HTML/JSX export functionality
│   ├── templates/          # Pre-built component templates
│   ├── ui/                 # Shared UI components
│   └── utils/              # Utility functions
```

### Key Technologies

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Build System**: Vite, Nx
- **State Management**: Zustand
- **UI Components**: Radix UI, shadcn/ui
- **Code Editor**: Monaco Editor
- **Styling**: TailwindCSS 4.1
- **Package Manager**: pnpm

### Architecture Overview

1. **@windbase/core**: Contains element definitions, types, and transformers
2. **@windbase/engine**: Handles state management, history, and manipulation logic
3. **@windbase/exporters**: Provides export functionality for different formats
5. **@windbase/ui**: Shared UI components and design system
6. **@windbase/utils**: Utility functions used across packages

## Coding Standards

### Code Formatting

We use [Biome](https://biomejs.dev/) for code formatting and linting.

**Key formatting rules:**
- **Indentation**: Tabs (size 2)
- **Quotes**: Single quotes for JavaScript/TypeScript
- **Line length**: 120 characters max
- **Trailing commas**: None
- **Import organization**: Automatic via Biome

### TypeScript Guidelines

- Use strict TypeScript configuration
- Avoid `any` type, especially in Zustand state definitions
- Use proper type definitions for all functions and interfaces
- Leverage TypeScript's built-in utility types when appropriate

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use React 19 features appropriately
- Follow component composition patterns

### Naming Conventions

- **Files**: kebab-case (e.g., `component-name.tsx`)
- **Components**: PascalCase (e.g., `ComponentName`)
- **Functions**: camelCase (e.g., `functionName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CONSTANT_VALUE`)
- **Interfaces/Types**: PascalCase (e.g., `InterfaceName`)

### Import Organization

- External libraries first
- Internal packages second
- Relative imports last
- Use absolute imports with `@/` prefix for app-level imports

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/improvements

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add new element type for forms
fix(engine): resolve state update issue in history
docs(readme): update installation instructions
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add/update tests as needed
   - Update documentation if required

3. **Test your changes**
   ```bash
   pnpm nx test <affected-package>
   ```

4. **Format your code**
   ```bash
   pnpm format
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

## Testing

### Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test package interactions
- **E2E Tests**: Test complete user workflows (planned)

### Running Tests

```bash
# Run tests for a specific package
pnpm nx test core

# Run tests for all packages
pnpm nx run-many --target=test --all

# Run tests in watch mode
pnpm nx test core --watch
```

### Writing Tests

- Use Vitest for unit and integration tests
- Place test files adjacent to source files with `.test.ts` or `.spec.ts` extension
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies appropriately

## Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push your changes**
   ```bash
   git push origin your-feature-branch
   ```

3. **Create a Pull Request**
   - Use conventional commit format for the PR title (e.g. `feat(core): add new element type for forms`)
   - Fill out the PR template completely
   - Link any related issues
   - Add screenshots for UI changes

### PR Requirements

- [ ] Code follows the style guidelines
- [ ] All tests pass
- [ ] Documentation is updated if needed
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages follow conventional format

### Code Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Automated Preview**: Preview is automatically deployed to Netlify
3. **Peer Review**: At least one maintainer review required
4. **Testing**: Manual testing of new features
5. **Approval**: Maintainer approval required for merge

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Workflow

1. **Automated Releases**: Triggered by GitHub releases
2. **Package Publishing**: Automated via GitHub Actions
3. **Changelog**: Generated automatically
4. **Asset Creation**: Build artifacts attached to releases

> **Note**: This project is in early development, expect breaking changes with each commit until v1.0.0.

## Getting Help

### Resources

- **Documentation**: [docs.windbase.dev](https://docs.windbase.dev)
- **Discord**: [Join our community](https://discord.gg/wHMpedAzhT)
- **DeepWiki**: [windbase documentation](https://deepwiki.com/windbase/windbase)

### Reporting Issues

1. **Check existing issues** before creating new ones
2. **Use issue templates** provided in GitHub
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details

### Asking Questions

- Use GitHub Discussions for general questions
- Join our Discord for real-time community support
- Check the documentation first

### Contributing Areas

We welcome contributions in these areas:

- **Bug fixes**: Help us improve stability
- **New features**: Add functionality to the visual builder
- **Documentation**: Improve guides and API docs
- **Testing**: Increase test coverage
- **Performance**: Optimize build and runtime performance
- **Accessibility**: Improve a11y compliance
- **Templates**: Add new component templates
- **Export formats**: Support new export targets

## Code of Conduct

Please note that this project adheres to a Code of Conduct. By participating in this project, you agree to abide by its terms.

## License

By contributing to Windbase, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Windbase! Your efforts help make this project better for everyone. 🚀 