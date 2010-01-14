/**
 * Port of the old unit tests
 * @author Jon Ege Ronnenberg
 * @version 0.1
 */
module("hdStore Core Test", {
	setup: function(){
		this.store = new hdStore();
		var n = 100; // number of elements in hdStore
		while(n > 0)
		{
			n--;
			this.store.add(n, { name: 'item' + n, value: Math.random() });
		};
		n = 100;
	},
	teardown: function(){
		this.store.removeAll();
	}
});
/* Test#1 */
test('Check that we are unit testing hdStore', 1, function(){
	ok(this.store.toString() === this.store.id + " instance of hdStore", 'This is a test of hdStore (and hdStore.toString method).');
});
/* Test#2 */
test('getItem/setItem method', 3, function(){
	// testing edge cases
	var item0 = { name: 'item0', value: 0 };
	var item100 = { name: 'item100', value: 100 };
	this.store.setItem(0, item0);
	equals(this.store.getItem(0), item0);
	this.store.setItem(100, item100);
	equals(this.store.getItem(100), item100);
	// simple retrieve test
	equals(this.store.getItem('52').name, 'item52', 'Retrieve item with name item52');
});

/* Test#4 */
test('getCount method', 5, function(){
	var store = new hdStore();
	
	store.add('key1', 'item1');
	equals(store.getCount(), 1, 'There should only be 1 item in hdStore');
	store.setKey('key1', 'key2');
	equals(store.getCount(), 1, 'There should still only 1 item in hdStore');
	store.remove('key2');
	equals(store.getCount(), 0, 'There should be 0 items in hdStore');
	store.add('blah1', 321);
	store.add('blah2', 'dsfds');
	equals(store.getCount(), 2, 'Added 2 items')
	store.removeAll();
	equals(store.getCount(), 0, 'hdStore.removeAll');
});