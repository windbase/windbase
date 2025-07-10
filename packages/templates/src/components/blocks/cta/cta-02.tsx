import { defineTemplate } from '@/definitions/define-template';
import type { Template } from '@/definitions/types';

const cta02HTML = `<div class="bg-indigo-600">
  <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ready to get started?
        <br />
        Start your free trial today.
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
        Join thousands of developers who are already using our platform to build amazing applications.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a href="#" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Get started
        </a>
        <a href="#" class="text-sm font-semibold leading-6 text-white">
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
</div>`;

export const CTA02: Template = defineTemplate({
	id: 'cta-02',
	name: 'Simple CTA Block',
	category: 'call-to-action',
	componentType: 'block',
	tags: ['cta', 'simple', 'centered', 'buttons', 'tailwind'],
	author: 'Windbase',
	html: cta02HTML
});
