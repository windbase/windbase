import { CTA01 } from '@/components/blocks/cta/cta-01';
import { CTA02 } from '@/components/blocks/cta/cta-02';
import { templateRegistry } from '../registry/template-registry';

// Register all CTA blocks
templateRegistry.register(CTA01, { featured: true, popular: true });
templateRegistry.register(CTA02, { featured: true });

// Export helper for getting all CTA blocks
export const getCTATemplates = () => templateRegistry.getByCategory('call-to-action');
