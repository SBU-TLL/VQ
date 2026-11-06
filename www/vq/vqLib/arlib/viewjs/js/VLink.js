/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class VLink {
	constructor(dom, viewmodel) { this.dom = dom; this.viewmodel = viewmodel; this.init(); }
	init() { this.viewmodel.model.addListener(this); this.update(); }
	update() {
		var text = this.viewmodel.text();
		var href = this.viewmodel.href();
		var download = this.viewmodel.download ? this.viewmodel.download() : '';
		var props =  download ? {text,href,download} : {text,href};
		var link = $('<a>', props);
		//alert('head: ' + JSON.stringify(head) + ' , rows: ' + JSON.stringify(rows))
		$(this.dom).html(link);
	}
}
