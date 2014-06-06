/**
 * @file "BaseFieldlistPortlet" Part of group-office-portlet-display-panel
 *
 * @license MIT
 * @author Richard Dodd <richard.dodd@theitpartnership.co>
 * @version 0.0.1
 */


/**
 * @class GO.panel.BaseFieldslistPortlet
 * @extends GO.panel.BasePortlet
 */
GO.panel.BaseFieldlistPortlet = Ext.extend(GO.panel.BasePortlet, {
	/**
	 * This config contains a structured list of fields, which this class
	 * then turns into a html template. The structure is as follows:
	 * <code>
fieldData: [{
	title: "Section title goes here" // (Optional)
	fields: [{
		label: "Field label goes here" // e.g. GO.lang.strName
		value: "Field value name as string" // e.g. "first_name"
		em: true // (Optional, defaults to false)
	}, 
	// ...
	'-'
	// ...
	]
}, {
	// ...
}
// ...
]
	 * </code>
	 * Where each fieldData array element contains a block, a block contains a
	 * title and a list of fields. Each field is either a '-' (small gap), or
	 * is an object containing label (the field label), value (the name of
	 * the response data key from actionDisplay), and (optional) em (for
	 * emphasis = italics).
	 * 
	 * @cfg {Array} fieldData
	 */
	fieldData: [],

	/**
	 * Dynamically generate the Ext.XTemplate to use in the portlet from
	 * the config provided in fieldData
	 * 
	 * @return {undefined}
	 */
	initComponent: function() {
		var tpl = '',
				field;

		tpl += '<div class="go-display-portlet-body">';
		if (this.fieldData) {
			for (var i = 0, l = this.fieldData.length; i < l; i++) {
				var block = this.fieldData[i];
				tpl += '<div class="go-display-column go-flexbox-flex">';
				if (block.title) {
					tpl += '<div class="go-display-fieldset-title">' + block.title + '</div>';
				}
				tpl += '<div class="go-display-fieldset">';
				tpl += '<div class="go-display-labels">';
				for (var j = 0, l2 = block.fields.length; j < l2; j++) {
					field = block.fields[j];
					this.emptyValuesObject[field.value] = "";
					//console.log(field);
					if (field === '-') {
						tpl += '<div class="go-gap-bottom"></div>';
					} else {
						if (field.label) {
							tpl += '<div>' + field.label;
						} else {
							tpl += '<div>&nbsp';
						}
						tpl += '<tpl if="' + field.value + '">'
								+ '<tpl for="this.count_br(' + field.value + ')">'
								+ '<br />&nbsp;'
								+ '</tpl>'
								+ '</tpl>'
								+ '</div>'; // field.label
					}
				}
				tpl += '</div>'; // labels
				tpl += '<div class="go-display-values">';
				for (j = 0; j < l2; j++) {
					field = block.fields[j];
					if (field === '-') {
						tpl += '<div class="go-gap-bottom"></div>';
					} else {
						tpl += '<div>' + (field.em ? '<em>' : '') +
								(field.value ? ('{' + field.value + '}') : '&nbsp;') +
								(field.em ? '</em>' : '') + '</div>';
					}
				}
				tpl += '</div>'; // values
				tpl += '</div>'; // fieldset
				tpl += '</div>'; // column
			}
		}
		tpl += '</div>'; // portlet body
//			console.log(tpl);

		this.tpl = new Ext.XTemplate(tpl, {
			/** 
			 * counts the &lt;br /&gt;s in a string and returns a range of that length
			 * 
			 * This function is used to align headers where field values have
			 * linebreaks in them (e.g. address). Currently only supports single-line
			 * headers
			 * 
			 * @param {String} str
			 * @return {Array} The count as a range array (to be used in a for=""
			 * loop in XTemplate)
			 */
			count_br: function(str) {
				if (!str) {
					return [];
				}
				var count = str.split('<br />').length - 1;
				return Array.apply(null, Array(count)).map(function(_, i) {
					return i;
				});
			}
		});
		GO.hr.BaseFieldlistPortlet.superclass.initComponent.call(this);
	}
});
