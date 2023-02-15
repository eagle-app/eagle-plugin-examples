eagle.onPluginCreate((plugin) => {

	// get i18n string
	let copyText = i18next.t('contextMenu.copy');
	let pasteText = i18next.t('contextMenu.paste');

	document.querySelector('#message').innerHTML = `
	<ul>
		<li>Language: ${eagle.app.locale}</li>
		<li>Copy: ${copyText}</li>
		<li>Paste: ${pasteText}</li>
	</ul>
	`;
});