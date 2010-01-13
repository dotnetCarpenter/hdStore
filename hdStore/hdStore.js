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
var DEBUG = DEBUG || false;

function hdStore(id){
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
							return _events[n].handler.call(that);
						}
					}
				}
			}
			return false;
		};
	this.id = id || 'x-hdStore';
	this.item = function(key, newitem){
		if(newitem){
			_dict[key] = newitem;
		}
		return _dict[key];
	};
	this.key = function(oldkey, newkey){
		_dict[newkey] = _dict[oldkey];
		this.remove(oldkey);
	};
	
	this.key2 = function(key){
		return _dict[key];
	};
	this.add = function(key, value){
		if (this.exists(key)) {
			throw new Error('Key ' + key + ' already exists in hdStore');
		} else {
			_dict[key] = value;
		}
	};
	this.getCount = function(){// changed to getCount so that we can have count as a get in all non-IE browsers
		return this.items().length;
	};
	this.exists = function(key){
		// old: return _dict[key] ? true : false;
		return key in _dict;
	};
	this.items = function(){
		var items = [];
		for (var key in _dict){
			items.push(_dict[key]);
		}
if (DEBUG)	console.log(items);
		return items;
	};
	this.keys = function(){
		var keys = [];
		for (var key in _dict){
			keys.push(key);
		}
if (DEBUG)	console.log(keys);
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
		var a = new Array(this.getCount()+1);
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
		throw new Error('Not implemented.');
	}
};