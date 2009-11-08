/**
 * @author Jon Ege Ronnenberg
 */
$(document).ready(function(){
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
		equals(hdStore.saveHandlerValue, "Hello world from save");
	});
	test('hdStore.load method', function(){
		expect(2);
		
		var store = new hdStore();
		store.addHandler({
			type: 'load',
			handler: function(){
				document.loadHandlerValue = "Hello world from load";
			}
		});
		ok(store.load(), 'Handler is found');
		equals(document.loadHandlerValue, "Hello world from load");
	});
//	module("Unit test of IE implementation of hdStore");
});