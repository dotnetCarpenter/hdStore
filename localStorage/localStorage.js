/**
 * @author Jon Ege Ronnenberg
 * @version 0.1
 * @classDescription hdStore plug-in using localStore to persist data
 * http://github.com/dotnetCarpenter/hdStore/issues#issue/10
 */
hdStore.localStorage = function(){
	hdStore.prototype.addHandler({
		type: 'save',
		handler: function(){
			
		}
	});
	hdStore.prototype.addHandler({
		type: 'load',
		handler: function(){
			
		}
	});
	return {
		canBeUsed: localStorage ? true : false
	}
};