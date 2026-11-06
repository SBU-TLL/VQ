class VFigures {
	constructor(dom, viewmodel)
		{ this.dom = dom; this.viewmodel = viewmodel; }
	init() { $(this.dom).css('width','100%'); }
	update() {
		var imgs = this.viewmodel.imgs();
		var hrefs = this.viewmodel.hrefs ? this.viewmodel.hrefs() : [] ;
		var captions = this.viewmodel.captions ? this.viewmodel.captions() : [];
		$(this.dom).html('');
		for (var index in imgs) {
			var fig = $('<figure>');
			var figcap = $('<figurecaption>',{text:captions[index]});
			var anc = $('<a>', {href: hrefs[index]});
			var img = $('<img>',{src:imgs[index]});
			anc.append(img);
			fig.append(anc);
			fig.append(figcap);
			$(this.dom).append(fig);
		}
	}
}
