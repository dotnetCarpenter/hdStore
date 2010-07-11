/**
 * Unit tests of localStorage
 * @author Jon Ege Ronnenberg
 * @version 0.1
 */
module("hdStore localStorage Test", {
	setup: function(){
		this.myObject = { hep: "123", food: ["tofu", "tomatos"] };
		this.store = new hdStore('localStorage');
	},
	teardown: function(){
		this.store.removeAll();
	}
});

test('save', 1, function(){
	this.store.add("myObject", this.myObject);
	ok(this.store.save(), "The data in " + this.store.id + " is saved");
	this.store.removeAll();
});
test('load', 2, function(){
	ok(this.store.load(), "The data in " + this.store.id + " is loaded");
	same(this.myObject, this.store.getItem("myObject"));
});