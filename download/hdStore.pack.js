function hdStore(g){var a={},d=[],j=hdStore.prototype.events,p=this,e=function(b){for(var f=0;f<j.length;f++)if(j[f].type==b)for(var l in hdStore.Priorities)if(hdStore.Priorities[l].canBeUsed&&j[f].id==l)return j[f].handler.call(p,a);return false};this.id=g||"x-hdStore";this.getCount=function(){return a.__count__||d.length};this.setKey=function(b,f){if(!this.exists(b))throw Error(b+" does not exists");a[f]=a[b];for(var l=0;l<d.length;l++)if(d[l]===b){d[l]=f;break}this.remove(b)};this.getItem=function(b){return a[b]};
this.setItem=function(b,f){if(f)return a[b]=f;throw Error("No item provided");};this.add=function(b,f){if(this.exists(b))throw Error("Key "+b+" already exists in instance "+this.id+" of hdStore");else{a[b]=f;d.push(b)}};this.exists=function(b){return b in a};this.items=function(){for(var b=[],f=0;f<d.length;f++)b.push(a[d[f]]);return b};this.keys=function(){return d};this.remove=function(b){with(hdStore)delete a[b];for(var f=0;f<d.length;f++)if(d[f]===b){d.splice(f,1);break}};this.removeAll=function(){a=
{};d=[]};this.save=function(){return e("save")};this.load=function(){return e("load")}}hdStore.prototype.toString=function(){return this.id+" instance of hdStore"};hdStore.prototype.filter=function(g,a){for(var d=new hdStore(this.id),j=this.keys(),p=this.items(),e=0;e<this.getCount();e++)if(g.call(a||this,p[e],j[e]))d.add(j[e],p[e]);return d};hdStore.prototype.events=[];
hdStore.prototype.addHandler=function(g){if(g.type=="save"||g.type=="load")hdStore.prototype.events.push(g);else throw Error(g.type+" type not implemented.");};
hdStore.localStorage=function(){function g(a,d,j){if(hdStore.localStorage)try{if(d=="save")localStorage[a.id]=JSON.stringify(j);else{j=JSON.parse(localStorage[a.id]);for(var p in j)a.add(p,j[p])}return true}catch(e){window.console&&console.log&&console.log(e);return false}}hdStore.prototype.addHandler({type:"save",handler:function(a){return g(this,"save",a)},id:"localStorage"});hdStore.prototype.addHandler({type:"load",handler:function(){return g(this,"load")},id:"localStorage"});return!!window.localStorage}();
hdStore.userData=function(){if(!this.JSON)this.JSON={};(function(){function g(i){return i<10?"0"+i:i}function a(i){p.lastIndex=0;return p.test(i)?'"'+i.replace(p,function(n){var h=f[n];return typeof h==="string"?h:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+i+'"'}function d(i,n){var h,k,o,r,q=e,m,c=n[i];if(c&&typeof c==="object"&&typeof c.toJSON==="function")c=c.toJSON(i);if(typeof l==="function")c=l.call(n,i,c);switch(typeof c){case "string":return a(c);case "number":return isFinite(c)?
String(c):"null";case "boolean":case "null":return String(c);case "object":if(!c)return"null";e+=b;m=[];if(Object.prototype.toString.apply(c)==="[object Array]"){r=c.length;for(h=0;h<r;h+=1)m[h]=d(h,c)||"null";o=m.length===0?"[]":e?"[\n"+e+m.join(",\n"+e)+"\n"+q+"]":"["+m.join(",")+"]";e=q;return o}if(l&&typeof l==="object"){r=l.length;for(h=0;h<r;h+=1){k=l[h];if(typeof k==="string")if(o=d(k,c))m.push(a(k)+(e?": ":":")+o)}}else for(k in c)if(Object.hasOwnProperty.call(c,k))if(o=d(k,c))m.push(a(k)+
(e?": ":":")+o);o=m.length===0?"{}":e?"{\n"+e+m.join(",\n"+e)+"\n"+q+"}":"{"+m.join(",")+"}";e=q;return o}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+g(this.getUTCMonth()+1)+"-"+g(this.getUTCDate())+"T"+g(this.getUTCHours())+":"+g(this.getUTCMinutes())+":"+g(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var j=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,b,f={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},l;if(typeof JSON.stringify!=="function")JSON.stringify=function(i,n,h){var k;b=e="";if(typeof h==="number")for(k=0;k<h;k+=1)b+=" ";else if(typeof h==="string")b=h;if((l=n)&&typeof n!=="function"&&(typeof n!=="object"||typeof n.length!=="number"))throw Error("JSON.stringify");return d("",
{"":i})};if(typeof JSON.parse!=="function")JSON.parse=function(i,n){function h(o,r){var q,m,c=o[r];if(c&&typeof c==="object")for(q in c)if(Object.hasOwnProperty.call(c,q)){m=h(c,q);if(m!==undefined)c[q]=m;else delete c[q]}return n.call(o,r,c)}var k;j.lastIndex=0;if(j.test(i))i=i.replace(j,function(o){return"\\u"+("0000"+o.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(i.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){k=eval("("+i+")");return typeof n==="function"?h({"":k},""):k}throw new SyntaxError("JSON.parse");}})();hdStore.prototype.addHandler({type:"save",handler:function(g){if(hdStore.userData)try{var a=document.documentElement;a.addBehavior("#default#userdata");a.setAttribute("x-hdStore-data",JSON.stringify(g));a.save(this.id);return true}catch(d){window.console&&console.log(d.message.toString());return false}},id:"userData"});hdStore.prototype.addHandler({type:"load",
handler:function(){if(hdStore.userData)try{var g=document.documentElement,a=[];g.load(this.id);if(g.getAttribute("x-hdStore-data")==null)throw Error("Data store "+this.id+" not found.");a=JSON.parse(g.getAttribute("x-hdStore-data"));for(var d in a)this.add(d,a[d]);return true}catch(j){window.console&&console.log(j.message.toString());return false}},id:"userData"});return!!document.documentElement.addBehavior}();hdStore.Priorities={localStorage:{canBeUsed:hdStore.localStorage},userData:{canBeUsed:hdStore.userData}};