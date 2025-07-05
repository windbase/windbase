type Template = {
	id: string;
	name: string;
	description: string;
	image: string;
	html: string;
};

export function defineTemplate(template: Template) {
	return template;
}
