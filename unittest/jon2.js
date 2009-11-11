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
});