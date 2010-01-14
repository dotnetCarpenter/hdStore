/**
 * Security Alert  For security reasons, a UserData store is available only in the same directory and with the same protocol used to persist the store.
 * Security Alert  Using this behavior incorrectly can compromise the security of your application. Data in a UserData store is not encrypted and therefore not secure. Any application that has access to the drive where UserData is saved has access to the data. Therefore, it is recommended that you not persist sensitive data like credit card numbers. For more information, see Security Considerations: DHTML and Default Behaviors http://msdn.microsoft.com/en-us/library/ms531080(VS.85,lightweight).aspx 
 * 
 * Security Zone    Document Limit (KB)	Domain Limit (KB)
 * Local Machine                128                1024
 * Intranet                     512               10240
 * Trusted Sites                128                1024
 * Internet                     128                1024
 * Restricted                    64                 640
 *  
 * @author Jon Ege Ronnenberg
 * @version 0.4
 * IE DOM ready http://peter.michaux.ca/articles/the-window-onload-problem-still
 * 
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
			// check if this implementation is used
			if(!hdStore.userData.canBeUsed){ return; }
			try {
				var docStore = document.documentElement;
				docStore.addBehavior('#default#userdata');
				docStore.setAttribute('x-hdStore-data', JSON.stringify(this.toArray()));
				docStore.save(this.id);
				return true;
			}
			catch(e){
				if(console){ console.log(e.message); }
				return false;
			}
		},
		id: 'userData'
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(){
			// check if this implementation is used
			if(!hdStore.userData.canBeUsed){ return; }
			try {
				var docStore = document.documentElement;
				docStore.load(this.id);
				if (docStore.getAttribute('x-hdStore-data') == null) {
					throw new Error('Data store ' + this.id + ' not found.');
				}
				var dataArray = JSON.parse(docStore.getAttribute('x-hdStore-data'));
				for (var key in dataArray) {
					this.add(key, dataArray[key]);
				}
				return true;
			}
			catch(e){
				if(console){ console.log(e.message); }
				return false;
			}
		},
		id: 'userData'
	});
	return document.documentElement.addBehavior ? true : false;
}();
// invocate hdStore.userData when the DOM is ready - testing every 10th mili-second
/*hdStore.userData.invokationId = setInterval(function(){
	if (window.document.readyState == 'complete') {
		hdStore.userData();
		clearInterval(hdStore.userData.invokationId);
	}
}, 10);
*/
/*
 script tag defer
	document.write("<script id=__ie_onload defer src=\"//:\"><\/script>");
	var script = document.getElementById("__ie_onload");
	script.onreadystatechange = function() {
		if (this.readyState == "complete") {
			domReadyEvent.run(); // call the onload handler
		}
	};
*/
/*
 var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try { document.documentElement.doScroll('left'); }
    catch(e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top)
      timer = pollDoScroll.defer();
  }
*/