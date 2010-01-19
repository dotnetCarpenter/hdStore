/**
 * @author Jon Ege Ronnenberg
 * @version 0.2
 * @classDescription hdStore plug-in using localStore to persist data
 * http://github.com/dotnetCarpenter/hdStore/issues#issue/10
 */
hdStore.localStorage = function(){
	function _handler(store, type, dict){
		if(!hdStore.localStorage){ return; }
		try {
			if (type == 'save') {
				localStorage[store.id] = JSON.stringify(dict);
				console.log(dict);
			}
			else {
				dict = JSON.parse(localStorage[store.id]);
				for (var key in dict){
					store.add(key, dict[key]);
				}
			/*	old code (delete if this passes unit tests)
			 var dataArray = JSON.parse(localStorage[store.id]);
				if(dataArray[0] == null){ console.log('localStorage',null); }// if the array is null exit or null will be added to hdStore
				for (var key in dataArray) {
					store.add(key, dataArray[key]);
				}
			*/
			}
			return true;
		} catch(e){
			if(console && console.log){ console.log(e); }
			return false;
		}
	};
	hdStore.prototype.addHandler({
		type: 'save',
		handler: function(dict){
			return _handler(this, 'save', dict);
		},
		id: 'localStorage'
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(dict){
			return _handler(this, 'load');
		},
		id: 'localStorage'
	});
	return typeof(localStorage) != 'undefined';
}();