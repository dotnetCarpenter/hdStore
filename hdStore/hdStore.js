/**
 * HdStore
 * Base API modeled after http://www.w3schools.com/asp/asp_ref_dictionary.asp
 * Properties: id (count, item, key is not implemented as properties but as fields)
 * Fields: getCount, getItem, setItem, getKey, setKey
 * Methods: add, exists, items, keys, remove, removeAll, toArray, filter, save, load, addHandler, toString
 * 
 * @author Jon Ege Ronnenberg (Ronnenberg) & Halfdan
 * @version 0.7
 */
function hdStore(id){
	
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
		that = this,
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
							return _events[n].handler.call(that, _dict);
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
	//TODO: getKey is the same as getItem?
	this.getKey = function(key){
		return _dict[key];
	};
	//TODO: getItem is the same as getKey?
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
			throw new Error('Key ' + key + ' already exists in hdStore');
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
			items.push(_dict[key]);
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
     * Filter by a function. Returns a <i>new</i> collection that has been filtered.
     * The passed function will be called with each object in the collection.
     * If the function returns true, the value is included otherwise it is filtered.
     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
     * @param {Object} scope (optional) The scope of the function (defaults to this)
     * @return {Dictionary} The new filtered collection
     */
	this.filter = function(fn, scope){
		var filteredDict = new hdStore(this.id);
		var k = this.keys(), it = this.items();
		for(var i = 0; i < this.getCount(); i++){
			if(fn.call(scope||this, it[i], k[i])){
				filteredDict.add(k[i], it[i]);
			}
		}
		return filteredDict;
	};
	this.toArray = function(){
		var a = new Array(this.getCount());
		for (var key in _dict){
			a[key] = _dict[key];
		}
		return a;
	};
	this.toString = function(){
		return this.id + " instance of hdStore";
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
/* TODO: refactor to seperate js file (which can be excluded from IE)*/
/*if (!hdStore.__defineGetter) {
	alert('hep');
	hdStore.prototype = {
		 get count(){
			return this.items().length;
		}
	}
}*/
/* static properties/methods */
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