# Contributing to FoxFind 🦊

Thank you for your interest in contributing to FoxFind! We welcome contributions from everyone. This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/LostAndFound_App.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** following our guidelines
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Firebase credentials to .env.local

# Start development
npm start
```

## Commit Message Format

We follow conventional commits for clear history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build or dependency updates

### Examples

```
feat(auth): add two-factor authentication

fix(items): resolve null pointer in search query

docs(readme): update installation instructions

refactor(components): simplify ItemCard component

test(auth): add login validation tests
```

## Code Style Guide

### JavaScript/TypeScript

#### Variable Names
```tsx
// ✅ Good
const userEmail = 'user@example.com';
const isLoading = true;
const itemList = [];

// ❌ Avoid
const ue = 'user@example.com';
const loading = true;
const list = [];
```

#### Function Naming
```tsx
// ✅ Good
function getUserById(id: string) { }
async function fetchItemsFromFirestore() { }
const handleItemSubmit = () => { };

// ❌ Avoid
function get(id: string) { }
async function fetch() { }
const handle = () => { };
```

#### Component Structure
```tsx
// ✅ Good - Type definitions first, then component
interface ItemCardProps {
  item: Item;
  onPress?: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  return (
    // Component JSX
  );
}

// ❌ Avoid - Component inline, no types
export function ItemCard(props) {
  return (
    // Component JSX
  );
}
```

### React/React Native

#### Hooks Usage
```tsx
// ✅ Good - Custom hook with clear dependency array
function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    loadItems();
  }, [user?.id]);

  return (
    // Component JSX
  );
}

// ❌ Avoid - Missing dependencies
useEffect(() => {
  loadItems();
}, []); // Missing user dependency!
```

#### Component Props
```tsx
// ✅ Good - Destructured, typed props
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({ title, onPress, disabled, variant = 'primary' }: ButtonProps) {
  // Component code
}

// ❌ Avoid - Untyped, not destructured
function Button(props) {
  // props.title, props.onPress, etc.
}
```

#### Error Handling
```tsx
// ✅ Good - Try/catch with user feedback
async function saveItem(item: Item) {
  try {
    await addItem(item);
    showSuccessMessage('Item saved!');
  } catch (error) {
    console.error('[SaveItem] Error:', error);
    showErrorMessage('Failed to save item. Please try again.');
  }
}

// ❌ Avoid - Silent failures
async function saveItem(item: Item) {
  await addItem(item);
}
```

## Testing Requirements

All new features should include tests:

```tsx
// ✅ Good - Test for new utility
describe('calculateDistance', () => {
  it('should calculate correct distance between two points', () => {
    const result = calculateDistance(
      { lat: 0, lng: 0 },
      { lat: 0, lng: 1 }
    );
    expect(result).toBeCloseTo(111.32, 1);
  });
});

// ✅ Good - Component test
describe('ItemCard', () => {
  it('should render item title', () => {
    const item = { id: '1', title: 'Lost Keys' };
    render(<ItemCard item={item} />);
    expect(screen.getByText('Lost Keys')).toBeTruthy();
  });
});
```

Run tests before submitting PR:
```bash
npm test
npm test:coverage  # Check coverage
```

## Pull Request Guidelines

### PR Title Format
```
[FEATURE] Add user notifications
[BUG FIX] Fix crash when uploading large images
[DOCS] Update Firebase setup guide
[REFACTOR] Simplify item search logic
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123 (if applicable)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Performed
- Test 1
- Test 2

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] No new warnings generated
- [ ] Documentation updated
- [ ] No breaking changes
```

## Component Structure Best Practices

```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

// 2. Type definitions
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// 3. Component
export function MyComponent({ title, onPress }: MyComponentProps) {
  // 3a. State
  const [isLoading, setIsLoading] = useState(false);

  // 3b. Hooks
  useEffect(() => {
    // Effect code
  }, []);

  // 3c. Handlers
  const handlePress = () => {
    // Handler logic
  };

  // 3d. Render
  return (
    <View style={styles.container}>
      <ThemedText>{title}</ThemedText>
    </View>
  );
}

// 4. Styles (at bottom)
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

## Firebase Security Rules

When modifying Firestore rules, follow these principles:

```
// ✅ Good - Specific, secure rules
match /items/{itemId} {
  allow read: if true;
  allow write: if request.auth.uid == resource.data.userId;
  allow delete: if request.auth.uid == resource.data.userId;
}

// ❌ Avoid - Overly permissive
match /items/{document=**} {
  allow read, write: if true;
}
```

## Documentation

When adding features, update relevant docs:

1. **In code**: JSDoc comments for functions
```tsx
/**
 * Fetch items by category
 *
 * @param category - Item category to filter by
 * @returns Array of items in category
 * @throws Error if category is invalid
 */
async function getItemsByCategory(category: string): Promise<Item[]> {
  // Implementation
}
```

2. **DEVELOPMENT.md**: Add architecture or setup info
3. **README.md**: Update features list if applicable
4. **Comments**: Add clarification for complex logic

## Bug Reporting

Found a bug? Please provide:

- **Description**: What's the issue?
- **Steps to reproduce**: How can we recreate it?
- **Expected behavior**: What should happen?
- **Actual behavior**: What actually happens?
- **Screenshots/Video**: Visual proof
- **Device info**: Android/iOS version, device model
- **Error logs**: Console or Firebase logs

## Feature Requests

Have an idea? Share it!

- **Description**: What feature would help?
- **Use case**: How would it be used?
- **Alternatives considered**: Other solutions?
- **Additional context**: Any other relevant info?

## Performance Checklist

Before submitting, ensure:

- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] No memory leaks (test dispose)
- [ ] Firestore queries are indexed
- [ ] Loading states provided
- [ ] Offline support considered

## Security Checklist

- [ ] No hardcoded secrets in code
- [ ] Environment variables used for sensitive data
- [ ] User input validated
- [ ] Firestore/Storage rules reviewed
- [ ] No console.log with sensitive data
- [ ] API calls use HTTPS

## Common Mistakes to Avoid

1. **Infinite loops**
```tsx
// ❌ Bad - Infinite loop
useEffect(() => {
  setItems([...items, newItem]); // Missing dependency!
}, []);

// ✅ Good
useEffect(() => {
  setItems([...items, newItem]);
}, [newItem]); // Include dependency
```

2. **Unhandled promises**
```tsx
// ❌ Bad
loadItems(); // What if it fails?

// ✅ Good
loadItems().catch(error => {
  console.error('Failed to load items:', error);
  showErrorMessage('Unable to load items');
});
```

3. **Type any**
```tsx
// ❌ Bad
function processData(data: any) { } // Too permissive

// ✅ Good
interface ItemData {
  id: string;
  title: string;
}
function processData(data: ItemData) { }
```

## Questions?

- Open an issue for questions
- Check existing issues first
- Ask in discussions
- Read DEVELOPMENT.md

---

**Thank you for contributing to FoxFind!** 🙏

Together, we're building a community app that helps people recover lost items. Your contributions, big or small, make a difference.

Happy coding! 🦊
