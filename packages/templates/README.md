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
   packages/templates/src/components/blocks/[category]/[block-name].tsx
   ```

2. **Define your block** using the `defineBlock` function:
   ```typescript
   import { defineBlock } from '@/definitions/define-template';
   import type { Block } from '@/definitions/types';

   const myBlockHTML = `<div class="...">
     <!-- Your HTML content here -->
   </div>`;

   export const MyBlock: Block = defineBlock({
     id: 'my-block-id',
     name: 'My Block Name',
     description: 'A brief description of what this block does',
     category: 'call-to-action', // or appropriate category
     componentType: 'block',
     tags: ['relevant', 'tags', 'here'],
     author: 'Your Name',
     html: myBlockHTML
   });
   ```

3. **Register the block** in `register-blocks.ts`:
   ```typescript
   // In packages/templates/src/register-blocks.ts
   import { MyBlock } from '@/components/blocks/[category]/[block-name]';
   
   templateRegistry.register(MyBlock, { featured: true });
   ```

### Creating a New Template

1. **Create the template file** in the templates folder:
   ```
   packages/templates/src/components/templates/[template-name].tsx
   ```

2. **Define your template** using the `defineTemplate` function:
   ```typescript
   import { defineTemplate } from '@/definitions/define-template';
   import type { Template } from '@/definitions/types';

   const completePageHTML = `<!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Your Template</title>
     <script src="https://cdn.tailwindcss.com"></script>
   </head>
   <body>
     <!-- Your complete page content here -->
   </body>
   </html>`;

   export const MyTemplate: Template = defineTemplate({
     id: 'my-template-id',
     name: 'My Template Name',
     description: 'A complete page template with multiple sections',
     category: 'landing-page', // or appropriate category
     componentType: 'template', // Important: mark as template
     tags: ['landing-page', 'complete', 'layout'],
     author: 'Your Name',
     html: completePageHTML
   });
   ```

3. **Register the template** in `register-templates.ts`:
   ```typescript
   // In packages/templates/src/register-templates.ts
   import { MyTemplate } from '@/components/templates/[template-name]';
   
   templateRegistry.register(MyTemplate, { featured: true });
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

**Block Categories:**
- `call-to-action` - Call-to-action sections
- `hero` - Hero sections
- `features` - Feature sections
- `testimonials` - Testimonial sections
- `pricing` - Pricing sections
- `footer` - Footer sections
- `header` - Header/navigation sections
- `content` - Content sections
- `forms` - Form sections
- `gallery` - Gallery/media sections

**Template Categories:**
- `landing-page` - Landing page templates
- `blog` - Blog/article templates
- `portfolio` - Portfolio templates
- `product` - Product page templates
- `service` - Service page templates
- `other` - Other/misc templates

### Questions?

If you have questions about contributing, please:
1. Check existing blocks/templates for examples
2. Open an issue on GitHub for discussion
3. Join our community discussions

Thank you for contributing to the Windbase templates library! 🚀