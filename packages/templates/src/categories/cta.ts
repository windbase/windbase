import { CTA01 } from '../components/cta/cta-01';
import { templateRegistry } from '../registry/template-registry';

// Register all CTA templates
templateRegistry.register(CTA01, { featured: true, popular: true });

// Export CTA templates for direct import
export const CTATemplates = {
	CTA01,
};

// Export helper for getting all CTA templates
export const getCTATemplates = () => templateRegistry.getByCategory('cta');
