class ViewTable {
	constructor(dom, model, rows) { this.dom = dom; this.model = model; this.rows = rows}
	init() { $(this.dom).css('width','100%'); }
	update() {
		var rows = this.rows.call(this.model);
		var table = $('<table>',{border:'1'})
		for (var rowindex in rows) {
			var row = rows[rowindex]
			var tr = $('<tr>',{class:'fs-12'})
			for (var colindex in row) tr.append($('<td>',{class:'fs-12', text: row[colindex]}))
			table.append(tr);
		}
		$(this.dom).html(table);
	}
}