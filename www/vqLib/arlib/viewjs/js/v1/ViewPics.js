class ViewPics {
	constructor(dom, model, imgs, hrefs, titles)
		{ this.dom = dom; this.model = model; this.imgs = imgs; this.hrefs = hrefs; this.titles = titles }
	init() { $(this.dom).css('width','100%'); }
	update() {
		var imgs = this.imgs.call(this.model);
		var hrefs = this.hrefs ? this.hrefs.call(this.model) : [] ;
		var titles = this.titles ? this.titles.call(this.model) : [];
		$(this.dom).html('');
		console.log(this.model)
		for (var index in imgs) {
			var a = $('<a>', {href: hrefs[index]})
			var img = $('<img>',{title:titles[index],src:imgs[index]})
			$(this.dom).append(a.append(img))
		}
	}
}
