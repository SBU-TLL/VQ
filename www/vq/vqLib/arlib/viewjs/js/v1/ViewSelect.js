class ViewSelect {
	constructor(dom, model, choices, choice) { this.dom = dom; this.model = model; this.choices = choices; this.choice = choice; }
	init() {
		var list = this.choices.call(this.model);
		$(this.dom).css('display','flex');
		$(this.dom).append($('<select>',{onchange:'controller.event($(this).val())',attr:{size:list.length}}));
		for (var index in list)
			$(this.dom + '> select').append($('<option>',{class:'fs-12',text:list[index]}));
	}
	update() { $(this.dom + '> select').val(this.choice.call(this.model)); }
}