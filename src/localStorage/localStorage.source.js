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
			}
			else {
				dict = JSON.parse(localStorage[store.id]);
				for (var key in dict){
					store.add(key, dict[key]);
				}
			}
			return true;
		} catch(e){
			if(window.console && console.log){ console.log(e); }
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
	return !!window.localStorage;
}();