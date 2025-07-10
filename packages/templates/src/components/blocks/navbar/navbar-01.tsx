import { defineTemplate } from '@/definitions/define-template';

const navbar01HTML = `
  <nav class="bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
          </div>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">
              Product
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  `;

export const Navbar01 = defineTemplate({
	id: 'navbar-01',
	name: 'Navbar 01',
	category: 'header',
	componentType: 'block',
	tags: ['navbar', 'header'],
	html: navbar01HTML
});
