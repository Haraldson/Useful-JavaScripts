/*
 *  Written by: Hein Haraldson Berg
 */

var InputTextReplacer = function(args)
{
    if($(args.inputs).length > 0)
        this.init(args);
}

InputTextReplacer.prototype = {
    placeholderSupport: false,
    init: function(args)
    {
        var self = this;
        this.placeholderSupport = 'placeholder' in document.createElement('input');
        
        $(args.inputs).filter(':text, textarea')
            .each(function()
            {
                var label = $('label[for="' + $(this).attr('id') + '"]');
                
                if(args.hideLabels)
                    label.hide();
                                
                var placeholderValue = $(this).attr('placeholder'),
                    labelValue = label.text();
                
                if(self.placeholderSupport && (typeof placeholderValue === 'undefined' || placeholderValue === ''))
                {
                    $(this).attr('placeholder', labelValue);
                }
                else if(!self.placeholderSupport)// || typeof placeholderValue === 'undefined' || placeholderValue === '')
                {
                    var placeholderText = labelValue;
                    
                    $(this)
                        .val(placeholderText)
                        .focus(function()
                        {
                            if($(this).val() === placeholderText)
                                $(this).val('');
                        })
                        .blur(function()
                        {
                            if(($(this).val() !== placeholderText) && ($(this).val() === ''))
                                $(this).val(placeholderText);
                        });
                }
            });
    }
};

$(function()
{
    var SITEInputTextReplacer = new InputTextReplacer(
    {
        inputs: 'input.ireplace, textarea.ireplace',
        hideLabels: false
    });
});
