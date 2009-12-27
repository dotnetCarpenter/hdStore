/**
 * @author Jon Ege Ronnenberg
 * @version 0.1
 * @classDescription hdStore plug-in using localStore to persist data
 * http://github.com/dotnetCarpenter/hdStore/issues#issue/10
 */
hdStore.localStorage = function(){
	function _handler(store, type){
		if(!hdStore.localStorage.canBeUsed){ return; }
		try {
			if (type == 'save') {
				localStorage[store.id] = JSON.stringify(store.toArray3());
			}
			else {
				var dataArray = JSON.parse(localStorage[store.id]);
				for (var key in dataArray) {
					store.add(key, dataArray[key]);
				}
			}
			return true;
		} catch(e){
			if(console){ console.log(e); }
			return false;
		}
	};
	hdStore.prototype.addHandler({
		type: 'save',
		handler: function(){
			return _handler(this, 'save');
		},
		id: 'localStorage'
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(){
			return _handler(this, 'load');
		},
		id: 'localStorage'
	});
	return {
		canBeUsed: typeof(localStorage) != 'undefined'
	}
}();