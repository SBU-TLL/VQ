class VPics {
	constructor(dom, viewmodel)
		{ this.dom = dom; this.viewmodel = viewmodel; this.init(); }
	init() { this.viewmodel.model.addListener(this); $(this.dom).css('width','100%'); }
	update() {
		//var imgs = this.imgs.call(this.model);
		//var hrefs = this.hrefs ? this.hrefs.call(this.model) : [] ;
		//var titles = this.titles ? this.titles.call(this.model) : [];
		var imgs = this.viewmodel.imgs();
		var hrefs = this.viewmodel.hrefs ? this.viewmodel.hrefs() : [] ;
		var titles = this.viewmodel.titles ? this.viewmodel.titles() : [];
		$(this.dom).html('');
		for (var index in imgs) {
			var a = $('<a>', {href: hrefs[index]})
			var img = $('<img>',{title:titles[index],src:imgs[index]})
			$(this.dom).append(a.append(img))
		}
	}
}
