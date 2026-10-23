
/*
	Date:		Fall 2017
	Authors:	Anthony John Ripa
				Rahul Sondhi
				Paul St. Denis
*/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var author= getParameterByName("author") || "me";
class Model {
	constructor() { this.listeners = []; }
	setjson(d) {alert(d)
		this.ids = d.id;
		this.usage = d.data.map(x=>{
			function fixtime(t) { t = Math.round(t / 60); var m = t % 60; t = t - m; return (t/60) + ':' + (m>9?m:'0'+m); }
			//function fixtime(t) { var date = new Date(null); date.setSeconds(t); return date.toISOString().substr(11,8); }
			return [fixtime(x.data.reduce((sum,y)=>sum+y))]
		});
		//this.usage = d.data.map(s=>[new Date(s*1000).toISOString().substr(11,8)]);
	}
	setcsv(str) {
		var d = str == '' ? [] : str.split('\n').map(x=>x.split(','));
		this.ids = d.map(x=>x[0]);
		this.usage = d.map(x=>x[1]).map(x=>{
			function fixtime(t) { t = Math.round(t / 60); var m = t % 60; t = t - m; return (t/60) + ':' + (m>9?m:'0'+m); }
			//function fixtime(t) { var date = new Date(null); date.setSeconds(t); return date.toISOString().substr(11,8); }
			return [fixtime(x)]
		});
		//this.usage = d.data.map(s=>[new Date(s*1000).toISOString().substr(11,8)]);
	}
	refresh() {
		$.ajax({
			dataType: "text",
			url: 'DAL?new&author='+author,
			success: (data) => {
				this.setcsv(data);
				this.update();
				resizeWindow();
			},
			error: function e(resp){alert(JSON.stringify(resp))}
		});
	}
	getIds() { return this.ids; }
	getUsage() { return this.usage; }
	addListener(listener) { this.listeners.push(listener); }
	update() { this.listeners.map(x=>x.update()); }
}
class ViewModelTable {
	constructor(model) { this.model = model; }
	grid() { return this.model.getUsage(); }
	col0() { return this.model.getIds(); }
	row0() { return ['VideoId','H:MM']; }
}
class ViewModelButton {
	constructor(model) { this.model = model; }
	text() { return 'Refresh'; }
	click() { model.refresh(); }
}
class ViewModelLink {
	constructor(model) { this.model = model; }
	text() { return 'Download'; }
	download() { return 'Progress.csv'; }
	href() {
		var col0 = this.model.getIds();
		var grid = this.model.getUsage();
		var csv = grid.length==0 ? '' : math.transpose([col0,grid.map(x=>x[0])]).map(x=>x.join(',')).join('\n');
		return window.URL.createObjectURL(new Blob([csv],{type:'text/csv'})) 
	}
}
$.ajax({
	//dataType: "json",
	dataType: "text",
	//url: 'DAL?json&author='+author,
	url: 'DAL?author='+author,
	success: function init(data) {
		model = new Model();
		//model.setjson(data);
		model.setcsv(data);
		new VButton('#refresh', new ViewModelButton(model));
		new VLink('#link', new ViewModelLink(model));
		new VTable('#gallery', new ViewModelTable(model));
		resizeWindow();
	},
	error: function e(resp){alert(JSON.stringify(resp))}
});
