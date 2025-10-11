if (window.location.hostname === 'editor.windbase.dev') {
	const script = document.createElement('script');
	script.defer = true;
	script.src = 'https://analytics.monawwar.io/script.js';
	script.setAttribute(
		'data-website-id',
		'dafc64f2-7720-4989-b502-b765a14e1652'
	);
	document.body.appendChild(script);
} else {
	console.log('Not in editor.windbase.dev');
}
