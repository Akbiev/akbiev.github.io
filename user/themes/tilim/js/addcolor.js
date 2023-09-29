function addTriangleTo(target, colorScheme) {
	var dimensions = target.getClientRects()[0];

	var pattern = Trianglify({
		x_colors: colorScheme,
		stroke_width: 0.5,
		width: dimensions.width, 
		height: dimensions.height
	});
	//target.style['background-image'] = 'url(' + pattern.png() + ')';
	var m = new XMLSerializer().serializeToString(pattern.svg());
	var k = window.btoa(m);
	target.style['background-image'] = 'url("data:image/svg+xml;base64,' + k + '")';
}

function addColor (color) {
	var scriptTag = document.getElementsByTagName('script');
	scriptTag = scriptTag[scriptTag.length - 1];
	var parent = scriptTag.parentNode;
	if (!color) color = 'PuOr';
	addTriangleTo(parent, color);
}