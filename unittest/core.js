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
test('id and toString', 1, function(){
	ok(this.store.toString() === this.store.id + " instance of hdStore", 'This is a test of hdStore (and hdStore.toString method).');
});
/* Test#2 */
test('getItem and setItem methods', 3, function(){
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
/* Test#3 */
	test('setKey and getKey methods', 1, function(){		
		var testKey = this.store.getItem(75);
		this.store.setKey(75, 'testKey'); //change key 75 to testKey
		same(this.store.getItem('testKey'), testKey);
	});
/* Test#4 */
test('getCount method', 7, function(){
	var store = new hdStore();
	
	store.add('key1', 'item1');
	equals(store.getCount(), 1, 'There should only be 1 item in hdStore');
	store.setKey('key1', 'key2');
	equals(store.getCount(), 1, 'There should still only be 1 item in hdStore');
	store.remove('key2');
	equals(store.getCount(), 0, 'There should be 0 items in hdStore');
	store.add('blah1', 321);
	store.add('blah2', 'dsfds');
	equals(store.getCount(), 2, 'Added 2 items')
	store.add(321, 999);
	equals(store.getCount(), 3, 'Added 1 item with key: 321')
	store.removeAll();
	equals(store.getCount(), 0, 'hdStore.removeAll');
	equals(this.store.getCount(), 100, 'There should be 100 items in hdStore');
});
/* Test#5 */
test('hdStore.add method', 3, function(){
	// first assertion
	equals(this.store.getCount(), 100, 'Counted with hdStore.getCount()');
	// second assertion
	equals(this.store.items().length, 100, 'Counted with hdStore.items()');
	
	//TODO: the following closure creates an error in Opera 10.x - fixed in 10.10
	n = 100;
	try {
		while (n > 0) {
			n--;
			this.store.add(n, {
				name: 'item' + n,
				value: Math.random()
			});
		};
	} catch(e) {
		ok(e.message == "Key 99 already exists in instance x-hdStore of hdStore", "Key 99 already exists in instance x-hdStore of hdStore");
	}
});
/* Test#6 */
test('hdStore.exist method', 4, function(){
	// testing edge cases and aproc. middle case
	ok(this.store.exists(0), 'exists 0');
	ok(this.store.exists(99), 'exists 99');
	ok(this.store.exists(54), 'exists 54');
	// should be false
	ok(!(this.store.exists(532)), "key 532 shouldn't be in hdStore");
});