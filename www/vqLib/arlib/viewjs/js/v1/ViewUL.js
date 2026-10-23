/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class ViewUL {
	constructor(dom, model, choices, choice) { this.dom = dom; this.model = model; this.choices = choices; this.choice = choice; }
	init() {
		var list = this.choices.call(this.model);
		$(this.dom).css('display','flex');
		$(this.dom).append($('<ul>',{style:'list-style-type:none;cursor:pointer;text-transform:capitalize'}));
		//$(this.dom).append($('<ul>',{style:'cursor:pointer;padding:5%;text-transform:capitalize'}));
		for (var index in list)
			$(this.dom + '> ul').append($('<li>',{class:'fs-22',onclick:`controller.event('${index}')`,text:list[index]}));
		//resizeWindow();
	}
	update() {
		$(`${this.dom} > ul > li`).removeClass('selected'); 
		$(`${this.dom} > ul > li:contains('${this.choice.call(this.model)}')`).addClass('selected'); 
		//$(`${this.dom} > ul > li`).css('color','dimgray'); 
		//$(`${this.dom} > ul > li.selected`).css('color','red'); 
	}
}