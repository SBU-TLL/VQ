
/*
	Date:		Fall 2017
	Authors:	Anthony John Ripa
				Rahul Sondhi
				Paul St. Denis
*/

class Model {
	constructor(courses) { this.courses = courses; console.log(courses);this.listeners = []; }
	getAuthors() { return Object.keys(this.courses); }
	setIndex(index) { if (this.getAuthors()[index]) this.index = index; }
	getAuthor() { return this.getAuthors()[this.index]; }
	setAuthor(author) { this.setIndex(this.getAuthors().indexOf(author)); }
	set(x) { if (isNaN(x)) this.setAuthor(x); else this.setIndex(x); this.update(); }
	getPlayList() { return this.getAuthor() ? this.courses[this.getAuthor()] : [] ; }
	addListener(listener) { this.listeners.push(listener); }
	update() { this.listeners.map(x=>x.update()); resizeWindow(); }
}
//class Controller {
//	constructor(model, views) { this.model = model; this.views = views; this.views.map( view => view.init() ); }
//	event(action) {
//		this.model.set(action);
//		this.views.map(view => view.update());
//		resizeWindow();
//	}
//}
class ViewModelTitle {
	constructor(model) { this.model = model; }
	title() { return this.model.getAuthor() ? "Videos By " + this.model.getAuthor() : "Choose Author:"; }
}
class ViewModelPics {
	constructor(model) { this.model = model; }
	imgs() { return this.model.getPlayList().map(x=>'../thumbnailer/'+this.model.getAuthor()+'/'+x.quizid+'/'); }
	hrefs() { return this.model.getPlayList().map(x=>this.model.getAuthor()+'/'+x.quizid); }
	titles() { return this.model.getPlayList().map(x=>x.title); }
}
class ViewModelUL {
	constructor(model) { this.model = model; }
	choices() { return this.model.getAuthors() }
	choice() { return this.model.getAuthor(); }
	//event(i) { document.controller.event(i); }
	set(i) { this.model.set(i); }
}
$.getJSON('vqLib/DAL',
	function init(data) {
		var model = new Model(data);
		//var viewhead = new ViewTitle('#Author',model,()=>model.getAuthor()?"Videos By "+ model.getAuthor() :"Choose Author:");
		var viewhead = new VTitle('#Author',new ViewModelTitle(model));
		//var viewauthors = new ViewUL('#menu', new ViewModelUL(model));
		var viewauthors = new VUL('#menu', new ViewModelUL(model));
		var viewpics = new VPics('#gallery', new ViewModelPics(model));
		//document.controller = new Controller(model, [viewhead, viewauthors, viewpics]);
		//document.controller.event(window.location.hash.slice(1));
		//readUrl();
		readUrl(model);
		//function readUrl(){	
		function readUrl(model) {	
			console.log('Rahul: ' + getParameterByName('netID'));
			//document.controller.event(getParameterByName('netID'));
			model.set(getParameterByName('netID'));
			function getParameterByName(name, url) {
				if (!url) url = window.location.href;
				name = name.replace(/[\[\]]/g, "\\$&");
				var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decodeURIComponent(results[2].replace(/\+/g, " "));
			}
		}
	}
)
