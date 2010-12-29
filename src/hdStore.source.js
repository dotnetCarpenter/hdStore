/**
 * Properties: id (count, item, key is not implemented as properties but as fields)<br />
 * Fields: getCount, getItem, setItem, setKey<br />
 * Methods: add, exists, items, keys, remove, removeAll, filter, save, load, addHandler, toString
 * @author Jon Ege Ronnenberg (Ronnenberg) & Halfdan
 * @version 0.8
 * @constructor
 */
function hdStore(id){
	//private vars/functions/objects goes here
	var _dict = {},
	    _order = [],
		_events = hdStore.prototype.events,
		_self = this,
		/**
		 * Private method to fire events when the load or save methods are used.<br />
		 * *this* is scoped to your instance of hdStore.
		 * @private
		 * @param {String} eventtype Should be either load for loading persistent data or save for saving to persisten storage
		 */
		_fireEvent = function(eventtype){
			for (var n = 0; n < _events.length; n++){
				if(_events[n].type == eventtype){
					for(var storageMethod in hdStore.Priorities){
						if(hdStore.Priorities[storageMethod].canBeUsed && _events[n].id == storageMethod){
							return _events[n].handler.call(_self, _dict);
						}
					}
				}
			}
			return false;
		};
	/* properties */
	/**
	 * The current instance id
	 */
	this.id = id || 'x-hdStore';
	/* fields */
	/**
	 * Returns the number of key/item pairs in a hdStore object
	 * @method hdStore.getCount
	 */
	this.getCount = function(){
		// using __count__ to speed up getCount in FF
		return _dict.__count__ || _order.length;
	};
	/**
	 * Sets a new key value for an existing key value in a hdStore object
	 * @method hdStore.setKey
	 * @param {String|Number} oldkey
	 * @param {String|Number} newkey
	 */
	this.setKey = function(oldkey, newkey){
		if(!this.exists(oldkey)){ throw new Error(oldkey + ' does not exists'); }
		_dict[newkey] = _dict[oldkey];
		for(var i = 0; i < _order.length; i++){
			if(_order[i] === oldkey){
				_order[i] = newkey;
				break;
			}
		}
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
			_order.push(key);
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
		for (var i = 0; i <_order.length; i++){
			items.push(_dict[_order[i]]);			
		}
		/* old implementation
		for (var key in _dict){
			if (_dict[key] != "undefined") {
				items.push(_dict[key]);
			} else {
				//TODO: create output function with console feature detection
				console.warn(key + ": is " + _dict[key]);
			}
		}*/
		return items;
	};
	/**
	 * Returns an array of all the keys in a hdStore object
	 * @method hdStore.keys
	 * @return {Array}
	 */
	this.keys = function(){
		return _order;
	};
	/**
	 * Removes one specified key/item pair from the hdStore object
	 * @method hdStore.remove
	 * @param {String|Number} key
	 */
	this.remove = function(key){
		// bugfix: corner case slice doesn't work if there is only 1 element in the array
		//if(_order.length === 1){ this.removeAll(); }
		with (hdStore) {
			delete _dict[key];
		}
		for(var i = 0; i < _order.length; i++){
			// remove the index order of the argument key
			if(_order[i] === key){
				_order.splice(i,1);
				break;
			}
		}
	};
	/**
	 * Removes all the key/item pairs in the hdStore object
	 * @method hdStore.removeAll
	 */
	this.removeAll = function(){
		_dict = {};
		_order = [];
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
}

/* getter/setter */
/* TODO: refactor to seperate js file (which can be excluded from IE)
 * http://msdn.microsoft.com/en-us/library/dd229916%28VS.85%29.aspx
 */
/*if (!hdStore.__defineGetter) {
	alert('hep');
	hdStore.prototype = {
		 get count(){
			return this.items().length;
		}
	}
}*/
/* static properties/methods */
hdStore.prototype.toString = function(){
	return this.id + " instance of hdStore";
};
/**
 * Filter by a function. Returns a <i>new</i> collection that has been filtered.
 * The passed function will be called with each object in the collection.
 * If the function returns true, the value is included otherwise it is filtered.
 * @method hdStore.filter
 * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
 * @param {Object} scope (optional) The scope of the function (defaults to this)
 * @return {hdStore} The new filtered collection
 */
hdStore.prototype.filter = function(fn, scope){
	var filteredDict = new hdStore(this.id);
	var k = this.keys(), it = this.items();
	for(var i = 0; i < this.getCount(); i++){
		if(fn.call(scope||this, it[i], k[i])){
			filteredDict.add(k[i], it[i]);
		}
	}
	return filteredDict;
};
hdStore.prototype.events = [];
/**
 * Add handler to the load/save method
 * @method hdStore.addHandler
 * @param {Object} event { handler: func, type: 'save'|'load', scope:[scope] }
 * scope defines what this refers to. If omitted the scope is window
 */
hdStore.prototype.addHandler = function(event){
	if (event.type == "save" || event.type == "load") {
		hdStore.prototype.events.push(event);
	} else {
		throw new Error(event.type + ' type not implemented.');
	}
};