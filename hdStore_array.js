/**
 * hdStore (array implementation)
 * Base API modeled after http://www.w3schools.com/asp/asp_ref_dictionary.asp
 * Properties: id (count, item, key is not implemented as properties but as fields)
 * Fields: getCount, getItem, setItem, getKey, setKey
 * Methods: add, exists, items, keys, remove, removeAll, filter, save, load, addHandler, toString
 * 
 * @author Jon Ege Ronnenberg (Ronnenberg) & Halfdan
 * @version 0.8
 */
var hdStore = function(id){
	//private vars/functions/objects goes here
	var _dict = {},
		_events = hdStore.prototype.events,
		self = this,
		_newItem = function(key, value){ return new {
				key: key,
				value: value
			}
		},
		/**
		 * Private method to fire events when the load or save methods are used.
		 * *this* is scoped to your instance of hdStore.
		 * @private
		 * @param {String} eventtype Should be either load for loading persistent data or save for saving to persisten storage
		 */
		_fireEvent = function(eventtype){
			for (var n = 0; n < _events.length; n++){
				if(_events[n].type == eventtype){
					for(var storageMethod in hdStore.Priorities){
						if(hdStore.Priorities[storageMethod].canBeUsed && _events[n].id == storageMethod){
							return _events[n].handler.call(self, _dict);
						}
					}
				}
			}
			return false;
		};
	return {
	/* properties */
	id: id || 'x-hdStore',
	/* fields */
	/**
	 * Returns the number of key/item pairs in a hdStore object
	 * @method hdStore.getCount
	 */
	getCount: function(){
		return _dict.length;
	},
	/**
	 * Sets a new key value for an existing key value in a hdStore object
	 * @method hdStore.setKey
	 * @param {String|Number} oldkey
	 * @param {String|Number} newkey
	 */
	setKey: function(oldkey, newkey){
		if(!this.exists(oldkey)){ throw new Error(oldkey + ' does not exists'); }
		_dict[newkey] = _dict[oldkey];
		this.remove(oldkey);
	},
	/**
	 * Returns the value of an item in a hdStore object
	 * @method hdStore.getItem
	 * @param {String|Number} key
	 */
	getItem: function(key){
		return _dict[key];
	},
	/**
	 * Sets the value of an item in a hdStore object
	 * @method hdStore.setItem
	 * @param {String|Number} key
	 * @param {Object} item
	 */
	setItem: function(key, item){
		if(item){
			return _dict[key] = item;
		}
		throw new Error('No item provided');
	},
	/**
	 * Adds a new key/item pair to a hdStore object
	 * @method hdStore.add
	 * @param {String|Number} key
	 * @param {Object} value
	 */
	add: function(key, value){
		if (this.exists(key)) {
			throw new Error('Key ' + key + ' already exists in instance ' + this.id + ' of hdStore');
		} else {
			_dict[key] = value;
		}
	},
	/**
	 * Returns a Boolean value that indicates whether a specified key exists in the hdStore object
	 * @method hdStore.exists
	 * @param {String|Number} key
	 * @return {Boolean}
	 */
	exists: function(key){
		return _dict[key] ? true : false;
	}
	/*
	return {
		item: function(key, newitem){
			if (newitem) {
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
			_dict[key] = value;
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
			for (var key in _dict) {
				items.push(_dict[key])
			}
			return items;
		},
		keys: function(){
			var keys = [];
			for (var key in _dict) {
				keys.push(key);
			}
			return keys;
		},
		remove: function(key){
			eval("delete _dict." + key + ";");
		},
		removeAll: function(){
			_dict = {};
		},
		filter: function(fn, scope){
			var filteredDict = new hdStore();
			var k = this.keys(), it = this.items();
			for (var i = 0; i < this.getCount(); i++) {
				if (fn.call(scope || this, it[i], k[i])) {
					filteredDict.add(k[i], it[i]);
				}
			}
			return filteredDict;
		},
		toArray: function(){
			var a = new Array(this.getCount() + 1);
			var k = this.keys(), it = this.items();
			for (var i = 0; i < this.getCount(); i++) {
				a[i] = [];
				a[i][0] = k[i];
				a[i][1] = it[i];
			}
			return a;
		},
		toArray2: function(){
			var a = new Array(this.getCount() + 1);
			var it = this.items();
			for (var i = 0; i < this.getCount(); i++) {
				a[i] = it[i];
			}
			return a;
		}*/
	}
};
// ?
//hdStore.prototype = hdStore;