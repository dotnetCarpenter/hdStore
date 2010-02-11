/**
 * Priorities which plug-in to use to save and load data.
 * @author Jon Ege Ronnenberg
 * @version 0.2
 */
hdStore.Priorities = {
	localStorage: {
		canBeUsed: hdStore.localStorage ? true : false
	},
	userData: {
		canBeUsed: hdStore.userData ? true : false
	}	
};