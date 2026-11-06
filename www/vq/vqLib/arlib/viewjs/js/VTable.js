/*
	Author:	Anthony John Ripa
	Date:	Fall 2017
*/
class VTable {
	constructor(dom, viewmodel) { this.dom = dom; this.viewmodel = viewmodel; this.init(); }
	init() { this.viewmodel.model.addListener(this); this.update(); }
	update() {
		var grid = this.viewmodel.grid();
		var col0 = this.viewmodel.col0();
		if (this.viewmodel.row0) var row0 = this.viewmodel.row0();
		var table = $('<table>',{border:'1'})
		//alert('head: ' + JSON.stringify(head) + ' , rows: ' + JSON.stringify(rows))
		if (row0) table.append(makehead(row0))
		for (var rowindex in grid) {
			var row = grid[rowindex]
			var tr = $('<tr>',{class:'fs-12'})
			tr.append($('<th>',{class:'fs-12', text: col0[rowindex]}))
			for (var colindex in row) tr.append($('<td>',{class:'fs-12', text: row[colindex]}))
			table.append(tr);
		}
		$(this.dom).html(table);
		function makehead(array) {
			var tr = $('<tr>',{class:'fs-12'})
			for (var colindex in array)
				tr.append($('<th>',{class:'fs-12', text: array[colindex]}))
			return tr;
		}
	}
}