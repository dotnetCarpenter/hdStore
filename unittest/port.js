/**
 * Port of the old unit tests
 * @author Jon Ege Ronnenberg
 * @version 0.1
 */
module("hdStore Core Test", {
	setup: function(){
		this.store = new hdStore();
	},
	teardown: function(){
		this.store.removeAll();
	}
});
test('Check that we are unit testing hdStore', 1, function(){
	ok(this.store.toString() === this.store.id + " instance of hdStore", 'This is a test of hdStore (and hdStore.toString method).');
});