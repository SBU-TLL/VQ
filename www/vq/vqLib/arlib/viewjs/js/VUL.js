/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class VUL {
	constructor(dom, viewmodel) { this.dom = dom; this.viewmodel = viewmodel; this.init(); }
	init() {
		//var list = this.choices.call(this.model);
		this.viewmodel.model.addListener(this);
		var list = this.viewmodel.choices();
		$(this.dom).css('display','flex');
		$(this.dom).append($('<ul>',{id:'VUL',style:'list-style-type:none;cursor:pointer;text-transform:capitalize'}));
		for (var index in list) {
			var li = $('<li>',{class:'fs-22',onclick:`this.vm.set('${index}')`,text:list[index]})
			li[0].vm = this.viewmodel;
			$(this.dom + '> ul').append(li);
		}
	}
	update() {
		$(`${this.dom} > ul > li`).removeClass('selected'); 
		//$(`${this.dom} > ul > li:contains('${this.choice.call(this.model)}')`).addClass('selected'); 
		$(`${this.dom} > ul > li:contains('${this.viewmodel.choice()}')`).addClass('selected'); 
	}
}