
/*
	Date:		Fall 2017
	Authors:	Anthony John Ripa
				Rahul Sondhi
				Paul St. Denis
*/

class Model {
	constructor(authors) { this.authors = authors; this.listeners = [];}
	getAuthors() { return this.authors; }
	setIndex(index) { if (this.getAuthors()[index]) this.index = index; this.update(); }
	getAuthor() { return this.getAuthors()[this.index] }
	getUsage() {
		if (!this.index) return undefined;
		var author = this.getAuthors()[this.index];
		var watch;
		$.ajax({
			dataType: 'json',
			url: 'DAL?author=' + this.getAuthors()[this.index] + '&consumer=me',
			success: data => {
				function fixtime(t) { t = Math.round(t / 60); var m = t % 60; t = t - m; return (t/60) + ':' + (m>9?m:'0'+m); }
				//function fixtime(t) { var date = new Date(null); date.setSeconds(t); return date.toISOString().substr(11,8); }
				watch = data.data.map(seconds=>[fixtime(seconds)]);
			},
			async: false
		});
		return watch;
	}
	getIds() {
		if (!this.index) return undefined;
		var author = this.getAuthors()[this.index];
		var watch;
		$.ajax({
			dataType: 'json',
			url: 'DAL?author=' + this.getAuthors()[this.index] + '&consumer=me',
			success: data => { watch = data.id; },
			async: false
		});
		return watch;
	}
	setAuthor(author) { this.setIndex(this.getAuthors().indexOf(author)); this.update(); }
	set(x) { if (isNaN(x)) this.setAuthor(x); else this.setIndex(x); }
	addListener(listener) { this.listeners.push(listener); }
	update() { this.listeners.map(x=>x.update()); }
}
class ViewModelTitle {
	constructor(model) { this.model = model; }
	title() { return this.model.getAuthor() ? "Progress " + this.model.getAuthor() : "Choose Author:"; }
}
class ViewModelUL {
	constructor(model) { this.model = model; }
	choices() { return this.model.getAuthors(); }
	choice() { return this.model.getAuthor(); }
	set(i) { this.model.set(i); }
}
class ViewModelTable {
	constructor(model) { this.model = model; }
	grid() { return this.model.getUsage(); }
	row0() { return ['VideoId','H:MM']; }
	col0() { return this.model.getIds(); }
}
$.ajax({
	dataType: 'json',
	url: 'DAL?authors=',
	success: function init(data) {
		var model = new Model(data);
		var viewtitle = new VTitle('#head', new ViewModelTitle(model));
		var vTable = new VTable('#main', new ViewModelTable(model));
		var vm_authors = new ViewModelUL(model); var viewauthors = new VUL('#menu', vm_authors);
		vm_authors.set(window.location.hash.slice(1))
		resizeWindow();
	},
	error: function e(resp){alert(JSON.stringify(resp))}
});
