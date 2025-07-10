import { CTA01 } from '@/components/blocks/cta/cta-01';
import { CTA02 } from '@/components/blocks/cta/cta-02';
import { Navbar01 } from '@/components/blocks/navbar/navbar-01';
import { templateRegistry } from './registry';

/**
 * CTA blocks
 */
templateRegistry.register(CTA01, { featured: true, popular: true });
templateRegistry.register(CTA02, { featured: true });

/**
 * Navbar blocks
 */
templateRegistry.register(Navbar01, { featured: true, popular: true });
