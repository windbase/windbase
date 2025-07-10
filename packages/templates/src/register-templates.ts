import { LandingPage01 } from '@/components/templates/landing-page-01';
import { templateRegistry } from './registry';

/**
 * Landing page templates
 */
templateRegistry.register(LandingPage01, { featured: true, popular: true });