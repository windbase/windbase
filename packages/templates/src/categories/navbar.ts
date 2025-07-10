import { Navbar01 } from '@/components/blocks/navbar/navbar-01';
import { templateRegistry } from '@/registry/template-registry';

templateRegistry.register(Navbar01, { featured: true, popular: true });

export const getNavbarTemplates = () =>
	templateRegistry.getByCategory('header');
