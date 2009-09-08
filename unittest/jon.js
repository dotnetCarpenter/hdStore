/**
 * @author Jon
 */
$(document).ready(function(){
	module("Jons first test suite");
	test('Check that we are unit testing hdStore', function(){
		var store = new hdStore();
		ok(store.toString() === "hdStore", 'This is a test of hdStore (and hdStore.toString method).');
	});
	
	/* Test#2 */
	test('hdStore.item method', function(){
		expect(3); // number assertions in this test case that should be run
		setup();
		
		// testing edge cases
		var item0 = { name: 'item0', value: 0 };
		var item100 = { name: 'item100', value: 100 };
		store.item(0, item0);
		equals(store.item(0), item0);
		store.item(100, item100);
		equals(store.item(100), item100);
		// simple retrieve test
		equals(store.item('52').name, 'item52', 'Retrieve item with name item52');
	});
	/* Test#3 */
	test('hdStore.item side-effect test', function(){
		setup();
		var item0 = { name: 'item0', value: 0 };
		var item100 = { name: 'item100', value: 100 };
		equals(store.item('item0', item0), store.item('item0'));
		equals(store.item('item0'), item0);
		equals(store.item('item100', item100), store.item('item100'));
		equals(store.item('item100'), item100);
		equals(store.getCount(), 102, 'hdStore now contains item0 and item100');
	});
	/* Test#4 */
	test('hdStore.key and hdStore.key2', function(){
		expect(2);
		setup();
		
		store.item(69, 'item1');
		equals(store.key2(69), 'item1', 'The key 69 in hdStore should be "item1"');
		
		var testKey = store.key2(75);
		store.key(75, 'testKey');
		equals(store.key2('testKey'), testKey, 'will fail because hdStore.key calls hdStore.remove with oldkey = 75. See TODO:');
	});
	/* Test#5 */
	test('hdStore.add method', function(){
		expect(3); // number assertions in this test case that should be run
		setup();
		
		// first assertion
		equals(store.getCount(), 100, 'Counted with hdStore.getCount()');
		// second assertion
		equals(store.items().length, 100, 'Counted with hdStore.items()');
		
		
		n = 100;
		try {
			while (n > 0) {
				n--;
				store.add(n, {
					name: 'item' + n,
					value: Math.random()
				});
			};
		} catch(e) {
			ok(e.message == "Key 99 already exists in hdStore", "Key 99 already exists in hdStore");
		}
		n = 100;
	});
	/* Test#6 */
	test('hdStore.getCount method', function(){
		expect(5); // number assertions in this test case that should be run
		store = new hdStore();
		
		store.add('key1', 'item1');
		equals(store.getCount(), 1, 'There should only be 1 item in hdStore');
		store.key('key1', 'key2');
		equals(store.getCount(), 1, 'There should still only 1 item in hdStore');
		store.remove('key2');
		equals(store.getCount(), 0, 'There should be 0 items in hdStore');
		store.add('blah1', 321);
		store.add('blah2', 'dsfds');
		equals(store.getCount(), 2, 'Added 2 items')
		store.removeAll();
		equals(store.getCount(), 0, 'hdStore.removeAll');
	});
	/* Test#7 */
	test('hdStore.exist method', function(){
		expect(4);
		setup();
		
		// testing edge cases and aproc. middle case
		ok(store.exists(0), 'exists 0');
		ok(store.exists(99), 'exists 99');
		ok(store.exists(54), 'exists 54');
		// should be false
		ok(!(store.exists(532)), "key 532 shouldn't be in hdStore");
		
		teardown();
	});
	
	/* Test#8 */
	test('hdStore.items method', function(){
		setup();
		
		expect(2);
		equals(store.getCount(), 100, 'store.getCount() should be 100');
		equals(typeof store.items(), 'object', 'store.items() typeof should be object. See table @ http://javascript.crockford.com/remedial.html');
		teardown();
	});
	
	/* Test#9 */
	test('hdStore.keys method', function(){
		setup();
		
		expect(2);
		equals(store.keys().length, 100, 'store.keys().length should be 100');
		equals(typeof store.keys(), 'object', 'store.keys() typeof should be object. See table @ http://javascript.crockford.com/remedial.html');
		teardown();
	});
	
	/* Test#10 */
	test('hdStore.remove method', function(){
		setup();
		
		expect(2);
		ok(store.exists(69), 'item with key 69 should exist');
		store.remove(69); // remove item with key 69
		ok(!store.exists(69), 'item with key 69 should NOT exist');
		teardown();
	});
	
	/* Test#11 */
	test('hdStore.removeAll method', function(){
		setup();
		
		expect(1);
		store.removeAll();
		equals(store.getCount(), 0, 'hdStore should contain 0 items')
	});
	
	/* Test#12 */
	test('hdStore.filter method', function(){
		setup();
		
		expect(4);
		// miniStore will contain items between 40 and 90
		var miniStore = store.filter(function(o, k){
			return k > 40 && k <= 90;
		});
		equals(store.getCount(), 100, 'hdStore should be uneffected be miniStore');
		equals(miniStore.getCount(), 50, 'miniStore should contain 50 items')
		equals(
			miniStore.filter(function(o, k){
				return o.name === 'item41';
			}).getCount(),
			1
		);
		// scope test
		var scopeObject = function(){
			return {
				value: 20
			}
		}();		
		
		var scopeFilter = store.filter(function(o, k){
			return k < this.value;
		}, scopeObject);
		equals(scopeFilter.getCount(), scopeObject.value);
		
		teardown();
	});
	
	/* Test#13 */
	test('hdStore.toArray method', function(){
		setup();
		
		expect(5);
		equals(typeof store.toArray(), 'object', 'store.toArray() typeof should be object. See table @ http://javascript.crockford.com/remedial.html');
		equals(store.toArray()[5][0], 94, 'store.toArray()[5][0] should have key = 94');
		equals(store.toArray()[5][1].name, 'item94', 'store.toArray()[5][1].name should have value.name = item94');
		equals(
			store.toArray()
			.sort(
				function(a, b){
					return a[0]-b[0];
				}
			)[5][0],
			5,
			'store.toArray().sort(function(a, b){return a[0]-b[0];})[5][0] should have key = 5'
		);
		equals(
			store.toArray()
			.sort(
				function(a, b){
					return a[0]-b[0];
				}
			)[5][1]
			.name,
			'item5',
			'store.toArray().sort(function(a, b){return a[0]-b[0];})[5][0].name should have value.name = item5'
		);
		
		teardown();
	});
	
	/* Test#14 */
	test('hdStore.toArray2 method - sort is not possible with toArray2 with this data', function(){
		setup();
		
		expect(2);
		equals(typeof store.toArray2(), 'object', 'store.toArray2() typeof should be object. See table @ http://javascript.crockford.com/remedial.html');
		equals(
			store.toArray2()[5].name,
			'item94',
			'store.toArray()[5].name should have value.name = item94'
		);
		teardown();
	});
});