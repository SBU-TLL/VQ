class ViewTitle {
        constructor(dom, model, title) { this.dom = dom; this.model = model; this.title = title; }
        init() { $(this.dom).html(this.title.call(this.model)).attr({style:'text-align:center',class:'fs-90'}); }
        update() { $(this.dom).html(this.title.call(this.model)); }
}