/**
 * @file "PortletDislpayPanel.js" Part of group-office-portlet-display-panel
 * 
 * @license MIT
 * @author Richard Dodd <richard.dodd@theitpartnership.co>
 * @version 0.0.1
 * 
 * TODO need to add tbar like original display panel
 */

/**
 * @class GO.panel.PortletDisplayPanel
 * @extends Ext.Panel
 * @requires Ext.ux.Portal
 * 
 * This class can be subclassed to provide an Ext.Panel that will display
 * actionDisplay data from group-office in a series of portlets. These
 * portlets
 */
GO.panel.PortletDisplayPanel = Ext.extend(Ext.Panel, {

	/**
	 * The id to use when saving state (must be globally unique)
	 * 
	 * @cfg {String} state_id
	 */
	state_id: '',
	
	/**
	 * This is an object containing all the portlets to display, in the
	 * format `name`:`Portlet` where `name` is a string/variable, and
	 * `Portlet` is a subclass of Ext.ux.Portlet (note class NOT object)
	 * 
	 * @cfg {Object} portlets
	 */
	portlets: {},

	/**
	 * Any extra options to apply to the portlets' config
	 * 
	 * @cfg {Object} portletOpts (Optional)
	 */
	portletOpts: {},
	
	/**
	 * @private
	 */
	model_id: 0,

	/**
	 * @private
	 */
	modelData: {},

	/**
	 * Set up state management and generate portal list
	 * 
	 * @param {object} config Any extra config options to apply on
	 * initialization
	 * @returns {undefined}
	 */
	constructor: function(config) {
		// load state
		var state = this.loadState(),
				portletObjects = [];
		for(var i=0, l=state.length; i<l; i++) {
			var state_id = state[i].id;
			var portlet = this.portlets[state_id];
			var portletOpts = Ext.apply({
				state_id: state_id,
				modelData: this.modelData,
				collapsed: state[i].collapsed
			}, this.portletOpts);
			portletObjects.push(new portlet(portletOpts));
		}
		this.portlets = portletObjects;

		// build panel contents
		config = Ext.apply({
			items: [
				this.portal = new Ext.ux.Portal({
					cls: 'go-display-portal',
					items: [
						this.portalColumn = new Ext.ux.PortalColumn({
							columnWidth: 1,
							items: this.portlets || []
						})
					]
				})
			]
		}, config);
		// superclass constructor
		GO.panel.PortletDisplayPanel.superclass.constructor.call(this, config);
		// setup state change event listeners
		var onChange = function(evt) {
			this.saveState();
		};
		this.portal.on('drop', onChange, this);
		this.portlets.forEach(function(el, idx, arr) { // ECMA 5+ only
			el.on({
				collapse: onChange,
				expand: onChange,
				scope: this
			});
		}, this);
	},

	/**
	 * Loads the state from the state manager or creates a default
	 * state
	 * 
	 * @returns {Array} The component state for the constructor
	 * @private
	 */
	loadState: function() {
		var state = Ext.state.Manager.get(this.state_id);
		if(state) {
			state = Ext.decode(state);
		} else {
			state = [];
			var portlets = Object.keys(this.portlets); // ECMA 5+ only
			for(var i=0, l=portlets.length; i<l; i++) {
				state.push({
					collapsed: false,
					id: portlets[i]
				});
			}
		}
		return state;
	},
	
	/**
	 * Saves the state to the state manager
	 * 
	 * @returns {undefined}
	 * @private
	 */
	saveState: function() {
		var state = [];
		this.portalColumn.items.items.forEach(function(portlet, idx, arr) { // ECMA 5+ only
			state.push({
				id: portlet.state_id,
				collapsed: portlet.collapsed
			});
			Ext.state.Manager.set(this.state_id, Ext.encode(state));
		}, this);
	}
});
