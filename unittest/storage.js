/**
 * Unit tests of storage
 * @author Jon Ege Ronnenberg
 * @version 0.2
 */
module("hdStore Storage Test", {
	setup: function(){
		this.myObject = { hep: "123", food: ["tofu", "tomatos"] };
		this.store = new hdStore('Storage');
	},
	teardown: function(){
		this.store.removeAll();
	}
});

test('save', 1, function(){
	this.store.add("myObject", this.myObject);
	ok(this.store.save(), "Try to save data from " + this.store.id + " instance of hdStore");
	this.store.removeAll();
});
test('load', 2, function(){
	ok(this.store.load(), "Try to load data from " + this.store.id + " instance of hdStore");
	same( this.store.getItem("myObject"), this.myObject);
});