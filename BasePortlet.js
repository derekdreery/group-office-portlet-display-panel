/**
 * @file "BasePortlet.js" Part of group-office-portlet-display-panel
 *
 * @license MIT
 * @author Richard Dodd <richard.dodd@theitpartnership.co>
 * @version 0.0.1
 */

/**
 * @class GO.panel.BasePortlet
 * @extends Ext.ux.Portlet
 *
 * This is the base portlet class for using within a PortletDisplayPanel.
 * It handles template rendering on render and refresh
 */
GO.panel.BasePortlet = Ext.extend(Ext.ux.Portlet, {
	/**
	 * The template for the portal content, either a string,
	 * an array of strings or an XTemplate
	 * 
	 * @cfg {mixed} tpl
	 */
	tpl: "",
	
	/**
	 * Ext.XTemplate breaks when a value isn't there ('with' usage fail), so
	 * this object provides an empty data set
	 * 
	 * @cfg {Object} emptyValuesObject
	 * @private
	 */
	emptyValuesObject: {},
	
	/**
	 * @cfg {Object} modelDate
	 * @private
	 */
	modelData: {},
	
	/**
	 * Just setup some standard Ext.Panel options
	 * 
	 * @param {Object} config
	 * @return {undefined}
	 */
	constructor: function(config) {
		config = Ext.apply({
			margin: 0,
			frame: false,
			border: false
		}, config);
		GO.hr.BasePortlet.superclass.constructor.call(this, config);
	},

	/**
	 * Compile the template if necessary, then render the template after the
	 * panel has finished rendering
	 * 
	 * @param {type} ct
	 * @param {type} position
	 * @return {undefined}
	 */
	onRender: function(ct, position) {
		if(!this.tpl.compile) {
			this.tpl = new Ext.XTemplate(this.tpl);
		}
		GO.hr.BasePortlet.superclass.onRender.call(this, ct, position);
		this.tpl.overwrite(this.body, this.emptyValuesObject || {});
	},

	/**
	 * Call after modelDate has changed to refresh the panels. Optionally
	 * set the title if subclass overwrites dataTitle method
	 * 
	 * @return {undefined}
	 */
	refresh: function() {
		this.tpl.overwrite(this.body, this.modelData);
		if(this.dataTitle) {
			this.setTitle(this.dataTitle(this.modelData));
		}
	}
});
