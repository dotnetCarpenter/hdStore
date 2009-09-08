/**
 * From http://www.w3schools.com/asp/asp_ref_dictionary.asp
 * Properties: count, item, key
 * Methods: add, exists, items, keys, remove, removeAll
 * 
 * @author Jon Ege Ronnenberg (Ronnenberg) & Halfdan
 * @version 2.1
 */
function hdStore(){
	//private vars/functions/objects goes here
	var _dict = {};
	
	return {
		count: function(){
			throw new Error('Not implemented.')
		},
		item: function(key, newitem){
			if(newitem){
				_dict[key] = newitem;
			}
			return _dict[key];
		},
		key: function(oldkey, newkey){
			_dict[newkey] = _dict[oldkey];
			this.remove(oldkey);
		},
		key2: function(key){
			return _dict[key];
		},		
		add: function(key, value){
			if (this.exists(key)) {
				throw new Error('Key ' + key + ' already exists in hdStore');
			} else {
				_dict[key] = value;
			}
		},
		getCount: function(){// changed to getCount so that we can have count as a get in all non-IE browsers
			return this.items().length;
		},				
		exists: function(key){
			// old: return _dict[key] ? true : false;
			return key in _dict;
		},		
		items: function(){
			var items = [];
			for (var key in _dict){
				items.push(_dict[key])
			}
			return items;
		},
		keys: function(){
			var keys = [];
			for (var key in _dict){
				keys.push(key);
			}
			return keys;
		},
		remove: function(key){
			with (hdStore) {
				delete _dict[key];
			}
//			eval ("delete _dict." + key + ";");
		},
		removeAll: function(){
			_dict = {};
		},
		/**
	     * Filter by a function. Returns a <i>new</i> collection that has been filtered.
	     * The passed function will be called with each object in the collection.
	     * If the function returns true, the value is included otherwise it is filtered.
	     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
	     * @param {Object} scope (optional) The scope of the function (defaults to this)
	     * @return {Dictionary} The new filtered collection
	     */
		filter: function(fn, scope){
			var filteredDict = new hdStore();
			var k = this.keys(), it = this.items();
			for(var i = 0; i < this.getCount(); i++){
				if(fn.call(scope||this, it[i], k[i])){
					filteredDict.add(k[i], it[i]);
				}
			}
			return filteredDict;
		},
		toArray: function(){
			var a = new Array(this.getCount()+1);
			var k = this.keys(), it = this.items();
			for (var i = 0; i < this.getCount(); i++){
				a[i] = [];
				a[i][0] = k[i];
				a[i][1] = it[i];
			}
			return a;
		},
		toArray2: function(){
			var a = new Array(this.getCount()+1);
			var it = this.items();
			for (var i = 0; i < this.getCount(); i++){
				a[i] = it[i];
			}
			return a;
		},
		toString: function(){
			return "hdStore";
		}
	}
};
/* ?
hdStore.prototype = hdStore.prototype;
hdStore.prototype.toString = function(){
	return 'hdStore';
}
*/