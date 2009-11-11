/**
 * @author Jon Ege Ronnenberg
 */
$(document).ready(function(){
/* Interferes with specific implementation tests
 * 
 	module("Unit test of hdStore event handling");
	test('hdStore.save method', function(){
		expect(2);
		
		var store = new hdStore();
		store.addHandler({
			type: 'save',
			handler: function(){
				this.saveHandlerValue = "Hello world from save";
			}
		});
		ok(store.save(), 'Handler is found');
		equals(store.saveHandlerValue, "Hello world from save");
	});
	test('hdStore.load method', function(){
		expect(2);
		
		var store = new hdStore();
		store.addHandler({
			type: 'load',
			handler: function(){
				this.loadHandlerValue = "Hello world from load";
			}
		});
		ok(store.load(), 'Handler is found');
		equals(store.loadHandlerValue, "Hello world from load");
	});
 */
	module("Unit test of IE implementation of hdStore");
	test('userData implementation', function(){
		expect(2);
		setup();
		
		ok(store.save(), 'Handler is found');
		store.removeAll();
		ok(store.load(), 'Handler is found');
		
		teardown();
	});
	test('different userData stores', function(){
		expect(3);
		setup();
		
		store.id = "baby";
		store.save();
		store.removeAll();
		
		var fastfood = new hdStore('fastfood');
		fastfood.add(1, 'fries');
		fastfood.add(2, 'shake');
		fastfood.add(3, 'burger');
		fastfood.save();
		fastfood.removeAll();
		
		fastfood.load();
		equals(fastfood.item(1), 'fries', 'Loaded fries');
		equals(fastfood.item(2), 'shake', 'Loaded shakeg');
		equals(fastfood.item(3), 'burger', 'Loaded burger');
		
		teardown();
	});
});