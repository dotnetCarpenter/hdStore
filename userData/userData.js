/**
 * Security Alert  For security reasons, a UserData store is available only in the same directory and with the same protocol used to persist the store.
 * Security Alert  Using this behavior incorrectly can compromise the security of your application. Data in a UserData store is not encrypted and therefore not secure. Any application that has access to the drive where UserData is saved has access to the data. Therefore, it is recommended that you not persist sensitive data like credit card numbers. For more information, see Security Considerations: DHTML and Default Behaviors http://msdn.microsoft.com/en-us/library/ms531080(VS.85,lightweight).aspx 
 * 
 * Security Zone	Document Limit (KB)	Domain Limit (KB)
 *	Local Machine			128				1024
 *	Intranet				512			   10240
 *	Trusted Sites			128				1024
 *	Internet				128				1024
 *	Restricted				 64			     640
 *  
 * @author Jon Ege Ronnenberg
 * @version 0.1
 * Alternative object to xml serializations
 * 1. http://tawani.blogspot.com/2006/12/serialize-javascript-objects-to-xml-for.html
 * 2. http://svn.mirekrusin.com/pub/javascript/to_xml/trunk/to_xml.js
 * Alternative object to json serializations
 * 1. http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
 * 2. http://json.org/json2.js
 */
hdStore.userData = function(){
	hdStore.prototype.addHandler({
		type: 'save',
		handler: function(){
			// check if this implementation is used (< IE8)
			if(!hdStore.userData.isUsed){ return; }
			var docStore;
			if(!document.getElementById('x-hdStore')){
				docStore = document.createElement('div');
				docStore.style.display = 'none';
        		docStore.addBehavior('#default#userdata');
				docStore.id = 'x-hdStore-id';
				document.body.appendChild(docStore);
			} else {
				docStore = document.getElementById('x-hdStore');
			}
			
			docStore.setAttribute('x-hdStore-data', JSON.stringify(this.toArray3()));
			docStore.save(this.id || 'x-hdStore');
		}
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(){
			// check if this implementation is used (< IE8)
			if(!hdStore.userData.isUsed){ return; }
			var docStore = document.getElementById('x-hdStore-id');
			docStore.load(this.id || 'x-hdStore');
			var dataArray = JSON.parse(docStore.getAttribute('x-hdStore-data'));
			for(var key in dataArray)
			{
				this.add(key, dataArray[key]);
			}
		}
	});
	return {
		isUsed: typeof(document.body.style.behavior) == 'string'
	}
}();