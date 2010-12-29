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
 * 2. http://svn.mirekrusin.com/pub/javascript/to_xml/trunk/to_xml.js <- require password now
 * Alternative object to json serializations
 * 1. http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
 * 2. http://json.org/json2.js
 */
hdStore.userData = function(){
/*	_dir = function(a){
	    var tmp = "";
	    for (var k in a){
	        if(typeof (a[k])== 'object'){ tmp += _dir(a[k]) + " \n\r"; } 
	        tmp += k + " = " + a[k] + " \n\r";
	    }
	    return tmp;
	}
*/
/**
 * json2.js from https://github.com/douglascrockford/JSON-js/raw/master/json2.js
 */	
if(!this.JSON)this.JSON={};
(function(){function l(c){return c<10?"0"+c:c}function o(c){p.lastIndex=0;return p.test(c)?'"'+c.replace(p,function(f){var b=r[f];return typeof b==="string"?b:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+c+'"'}function m(c,f){var b,d,g,j,i=h,e,a=f[c];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(c);if(typeof k==="function")a=k.call(f,c,a);switch(typeof a){case "string":return o(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);
case "object":if(!a)return"null";h+=n;e=[];if(Object.prototype.toString.apply(a)==="[object Array]"){j=a.length;for(b=0;b<j;b+=1)e[b]=m(b,a)||"null";g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]";h=i;return g}if(k&&typeof k==="object"){j=k.length;for(b=0;b<j;b+=1){d=k[b];if(typeof d==="string")if(g=m(d,a))e.push(o(d)+(h?": ":":")+g)}}else for(d in a)if(Object.hasOwnProperty.call(a,d))if(g=m(d,a))e.push(o(d)+(h?": ":":")+g);g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+
"\n"+i+"}":"{"+e.join(",")+"}";h=i;return g}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;if(typeof JSON.stringify!=="function")JSON.stringify=function(c,f,b){var d;n=h="";if(typeof b==="number")for(d=0;d<b;d+=1)n+=" ";else if(typeof b==="string")n=b;if((k=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number"))throw Error("JSON.stringify");return m("",
{"":c})};if(typeof JSON.parse!=="function")JSON.parse=function(c,f){function b(g,j){var i,e,a=g[j];if(a&&typeof a==="object")for(i in a)if(Object.hasOwnProperty.call(a,i)){e=b(a,i);if(e!==undefined)a[i]=e;else delete a[i]}return f.call(g,j,a)}var d;q.lastIndex=0;if(q.test(c))c=c.replace(q,function(g){return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(c.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+c+")");return typeof f==="function"?b({"":d},""):d}throw new SyntaxError("JSON.parse");}})();

	hdStore.prototype.addHandler({
		type: 'save',
		handler: function(dict){
			// check if this implementation is used
			if(!hdStore.userData){ return; }
			try {
				var docStore = document.documentElement;
				docStore.addBehavior('#default#userdata');
				docStore.setAttribute('x-hdStore-data', JSON.stringify(dict));
				docStore.save(this.id);
				return true;
			}
			catch(e){
				if(window.console){ console.log(e.message.toString()); }
				return false;
			}
		},
		id: 'userData'
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(){
			// check if this implementation is used
			if(!hdStore.userData){ return; }
			try {
				var docStore = document.documentElement, dataArray = [];
				docStore.load(this.id);
				if (docStore.getAttribute('x-hdStore-data') == null) {
					throw new Error('Data store ' + this.id + ' not found.');
				}
				dataArray = JSON.parse(docStore.getAttribute('x-hdStore-data'));
				for (var key in dataArray) {
					this.add(key, dataArray[key]);
				}
				return true;
			}
			catch(e){
				if(window.console){ console.log(e.message.toString()); };
				return false;
			}
		},
		id: 'userData'
	});
	return !!document.documentElement.addBehavior;
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