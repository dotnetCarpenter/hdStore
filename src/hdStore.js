/**
 * HdStore
 * Base API modeled after http://www.w3schools.com/asp/asp_ref_dictionary.asp
 * Properties: id (count, item, key is not implemented as properties but as fields)
 * Fields: getCount, getItem, setItem, getKey, setKey
 * Methods: add, exists, items, keys, remove, removeAll, filter, save, load, addHandler, toString
 * 
 * @author Jon Ege Ronnenberg (Ronnenberg) & Halfdan
 * @version 0.8
 */
function hdStore(id){
	/* don't know if we should have this. I would prefer if we had a build script when you download hdStore */
	try {
		JSON.parse('{ }');
	} catch (err) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'dependencies/json2.js';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
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
	this.getCount = function(){
		// using __count__ to speed up getCount in FF
		return _dict.__count__ || this.items().length;
	};
	this.setKey = function(oldkey, newkey){
		_dict[newkey] = _dict[oldkey];
		this.remove(oldkey);
	};

	this.getItem = function(key){
		return _dict[key];
	};
	this.setItem = function(key, item){
		if(item){
			return _dict[key] = item;
		}
		throw new Error('No item provided');
	};
	
	/* methods */
	this.add = function(key, value){
		if (this.exists(key)) {
			throw new Error('Key ' + key + ' already exists in instance ' + this.id + ' of hdStore');
		} else {
			_dict[key] = value;
		}
	};
	this.exists = function(key){
		// old: return _dict[key] ? true : false;
		return key in _dict;
	};
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
	this.keys = function(){
		var keys = [];
		for (var key in _dict){
			keys.push(key);
		}
		return keys;
	};
	this.remove = function(key){
		with (hdStore) {
			delete _dict[key];
		}
//			eval ("delete _dict." + key + ";");
	};
	this.removeAll = function(){
		_dict = {};
	};
	/**
	 * @return true if save is successful
	 */
	this.save = function(){		
		return _fireEvent('save');
	};
	/**
	 * @return true if load is successful
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