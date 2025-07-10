# @windbase/templates

A comprehensive package for managing both reusable blocks and full page templates in Windbase.

## Features

- **Blocks**: Small, reusable UI components (CTA, Header, Footer, etc.)
- **Templates**: Full page layouts combining multiple blocks
- **Registry System**: Centralized management with search, filtering, and categorization
- **TypeScript Support**: Fully typed with excellent IDE support

## Contributing New Blocks & Templates

We welcome contributions of new blocks and templates! Here's how to add them:

### Creating a New Block

1. **Create the component file** in the appropriate category folder:
   ```
   packages/templates/src/components/[category]/[block-name].tsx
   ```

2. **Define your block** using the `defineLegacyTemplate` function:
   ```typescript
   import { defineLegacyTemplate } from '../../definitions/define-template';
   import type { LegacyTemplate } from '../../definitions/types';

   const myBlockHTML = `<div class="...">
     <!-- Your HTML content here -->
   </div>`;

   export const MyBlock: LegacyTemplate = defineLegacyTemplate({
     id: 'my-block-id',
     name: 'My Block Name',
     description: 'A brief description of what this block does',
     category: 'cta', // or appropriate category
     componentType: 'block',
     tags: ['relevant', 'tags', 'here'],
     author: 'Your Name',
     html: myBlockHTML
   });
   ```

3. **Register the block** in the category file:
   ```typescript
   // In packages/templates/src/categories/[category].ts
   import { MyBlock } from '../components/[category]/[block-name]';
   
   templateRegistry.register(MyBlock, { featured: true });
   ```

4. **Export the block** in the main index file:
   ```typescript
   // In packages/templates/src/index.ts
   export * from './components/[category]/[block-name]';
   ```

### Creating a New Template

1. **Create the template file** in the templates folder:
   ```
   packages/templates/src/components/templates/[template-name].tsx
   ```

2. **Define your template** (similar to blocks but with `componentType: 'template'`):
   ```typescript
   export const MyTemplate: LegacyTemplate = defineLegacyTemplate({
     id: 'my-template-id',
     name: 'My Template Name',
     description: 'A complete page template with multiple sections',
     category: 'other',
     componentType: 'template', // Important: mark as template
     tags: ['landing-page', 'complete', 'layout'],
     author: 'Your Name',
     html: completePageHTML
   });
   ```

### Guidelines

**For Blocks:**
- Keep them focused on a single purpose (CTA, header, footer, etc.)
- Should be reusable across different templates
- Use semantic HTML and accessible markup
- Include responsive design with Tailwind CSS
- Add meaningful tags for discoverability

**For Templates:**
- Should be complete, functional page layouts
- Can combine multiple blocks/sections
- Include full HTML structure (doctype, head, body)
- Consider different use cases (landing pages, dashboards, etc.)
- Provide comprehensive examples

### Pull Request Process

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/add-[block/template-name]
   ```

3. **Add your block/template** following the structure above
4. **Test your contribution**:
   ```bash
   pnpm dev # Test in the visual builder
   pnpm test # Run tests
   ```

5. **Submit a pull request** with:
   - Clear title: `feat: Add [Block/Template Name]`
   - Description of what the block/template does
   - Screenshots or demo if applicable
   - Mention any specific use cases or design inspiration

### Review Requirements

Your pull request should include:
- ✅ Properly typed TypeScript code
- ✅ Responsive design (mobile-first)
- ✅ Accessible HTML markup
- ✅ Meaningful component metadata (name, description, tags)
- ✅ Appropriate category classification
- ✅ Clean, semantic HTML structure
- ✅ No external dependencies (use Tailwind CSS for styling)

### Categories

Choose the most appropriate category:
- `cta` - Call-to-action sections
- `hero` - Hero sections
- `features` - Feature sections
- `testimonials` - Testimonial sections
- `pricing` - Pricing sections
- `footer` - Footer sections
- `header` - Header/navigation sections
- `content` - Content sections
- `forms` - Form sections
- `gallery` - Gallery/media sections
- `team` - Team sections
- `blog` - Blog/article sections
- `other` - Other/misc sections

### Questions?

If you have questions about contributing, please:
1. Check existing blocks/templates for examples
2. Open an issue on GitHub for discussion
3. Join our community discussions

Thank you for contributing to the Windbase templates library! 🚀