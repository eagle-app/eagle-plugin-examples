const is = require('is_js');

eagle.onPluginCreate(() => {
	var x = 1;

	if (is.number(x)) {
		document.write('x is a number.');
	}
	else {
		document.write('x is not a number.');
	}
});