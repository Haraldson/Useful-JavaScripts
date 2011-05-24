/*
 *  Written by: Hein Haraldson Berg
 */

var InputTextReplacer = function(args)
{
	if($(args.inputs).length > 0)
		this.init(args);
}

InputTextReplacer.prototype = {
	init: function(args)
	{
		var self = this;
		this.inputs = $(args.inputs).filter(':text, textarea');
		
		this.inputs.each(function(i, elem)
		{
			var label = $('label[for="' + $(this).attr('id') + '"]');
			if(args.hideLabels)
				$(label).hide();

			var labelText = $(label).text();
		
			$(this)
    			.val(labelText)
    			.focus(function()
    			{
    				if($(this).val() == labelText)
    					$(this).val('');
    			})
    			.blur(function()
    			{
    				if(($(this).val() != labelText) && ($(this).val() == ''))
    					$(this).val(labelText);
    			});
		});
	}
};

$(function()
{
	var SITEInputTextReplacer = new InputTextReplacer(
	{
		inputs: 'input.ireplace, textarea.ireplace',
		hideLabels: true
	});
});
