/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class VButton {
        constructor(dom, viewmodel) { this.dom = dom; this.viewmodel = viewmodel; this.init(); }
        init() {
			this.viewmodel.model.addListener(this);
			this.update()
		}
        update() {
			var text = this.viewmodel.text();
			var click = () => { $(this.dom + ' button').html('Loading...'); this.viewmodel.click() };
			var btn = $('<button>',{text,click})
			$(this.dom).html(btn);
		}
}