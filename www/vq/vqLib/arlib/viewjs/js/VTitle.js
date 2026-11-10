/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class VTitle {
        constructor(dom, viewmodel) { this.dom = dom; this.viewmodel = viewmodel; this.init(); }
        init() {
			this.viewmodel.model.addListener(this);
			$(this.dom).html(this.viewmodel.title()).attr({style:'text-align:center',class:'fs-90'});
		}
        update() { $(this.dom).html(this.viewmodel.title()); }
}