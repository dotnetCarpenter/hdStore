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
var hdStore = function(){
	//private vars/functions/objects goes here
	var _dict = {},
		_events = hdStore.prototype.events,
		self = this,
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
		/* properties */
	this.id = id || 'x-hdStore';
	/* fields */
	/**
	 * Returns the number of key/item pairs in a hdStore object
	 * @method hdStore.getCount
	 */
	this.getCount = function(){
		return _dict.length;
	};
	/**
	 * Sets a new key value for an existing key value in a hdStore object
	 * @method hdStore.setKey
	 * @param {String|Number} oldkey
	 * @param {String|Number} newkey
	 */
	this.setKey = function(oldkey, newkey){
		_dict[newkey] = _dict[oldkey];
		this.remove(oldkey);
	};
	/**
	 * Returns the value of an item in a hdStore object
	 * @method hdStore.getItem
	 * @param {String|Number} key
	 */
	this.getItem = function(key){
		return _dict[key];
	};
	/**
	 * Sets the value of an item in a hdStore object
	 * @method hdStore.setItem
	 * @param {String|Number} key
	 * @param {Object} item
	 */
	this.setItem = function(key, item){
		if(item){
			return _dict[key] = item;
		}
		throw new Error('No item provided');
	};
	/**
	 * Adds a new key/item pair to a hdStore object
	 * @method hdStore.add
	 * @param {String|Number} key
	 * @param {Object} value
	 */
	this.add = function(key, value){
		if (this.exists(key)) {
			throw new Error('Key ' + key + ' already exists in instance ' + this.id + ' of hdStore');
		} else {
			_dict[key] = value;
		}
	};
	/**
	 * Returns a Boolean value that indicates whether a specified key exists in the hdStore object
	 * @method hdStore.exists
	 * @param {String|Number} key
	 * @return {Boolean}
	 */
	this.exists = function(key){
		// old: return _dict[key] ? true : false;
		return key in _dict;
	};
	/**
	 * Returns an array of all the items in a hdStore object
	 * @method hdStore.items
	 * @return {Array}
	 */
	this.items = function(){
		// should we implement hasOwnProperty check?
		var items = [];
		for (var key in _dict){
			if (_dict[key] != "undefined") {
				items.push(_dict[key]);
			} else {
				//TODO: create output function with console feature detection
				console.warn(key + ": is " + _dict[key]);
			}
		}
		return items;
	};
	/**
	 * Returns an array of all the keys in a hdStore object
	 * @method hdStore.keys
	 * @return {Array}
	 */
	this.keys = function(){
		var keys = [];
		for (var key in _dict){
			keys.push(key);
		}
		return keys;
	};
	/**
	 * Removes one specified key/item pair from the hdStore object
	 * @method hdStore.remove
	 * @param {Object} key
	 */
	this.remove = function(key){
		with (hdStore) {
			delete _dict[key];
		}
	};
	/**
	 * Removes all the key/item pairs in the hdStore object
	 * @method hdStore.removeAll
	 */
	this.removeAll = function(){
		_dict = {};
	};
	/**
	 * @method hdStore.save
	 * @return {Boolean} true if save is successful
	 */
	this.save = function(){		
		return _fireEvent('save');
	};
	/**
	 * @method hdStore.load
	 * @return {Boolean} true if load is successful
	 */
	this.load = function(){		
		return _fireEvent('load');
	};
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
			eval ("delete _dict." + key + ";");
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
		}
};
// ?
//hdStore.prototype = hdStore;