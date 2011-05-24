/*
 *  @author:    Hein Haraldson Berg
 *  @email:     hein@keyteq.no
 */

var Fader = function(args)
{
	this.init(args);
}

Fader.prototype = {
    autoRotateId: 0,
    currentItem: 0,
    userNavigated: false,
	init: function(args)
	{
		var self = this;
		
		// Rearrange items and absolutize
		this.items = [];
		$(args.selector.wrap).find(args.selector.item)
            .live('hover', function(e)
            {
                if(e.type == 'mouseover')
                    $(this).addClass('hover');
                else if(e.type == 'mouseout')
                    $(this).removeClass('hover');
            })
			.each(function(i)
			{
				$(this)
					.toggleClass('rel abs')
					.css(
					{
						opacity: (i == 0) ? 1 : 0,
						top: 0,
						left: 0
					});
				self.items.push(this);
			})
        .end().find(args.selector.items)
            .html(this.items.reverse());
		
		if(args.sequenceIndicator && this.items.length > 1)
		{
			this.addNaviButtons(args);
		}
		
		// Auto rotate
		this.autoRotate(args);
		$(args.selector.wrap)
			.mouseenter(function()
			{
				window.clearInterval(self.autoRotateId);
			})
			.mouseleave(function()
			{
                if(!self.userNavigated)
				    self.autoRotate(args);
			});
	},
	
	/*
	 *		FADE TO NEXT ITEM
	 */
	
	fadeNext: function(args)
	{
		var self = this;
		
		if(!$(args.selector.wrap).find(args.selector.item).is(':animated'))
		{
			if(this.currentItem == this.items.length - 1)
				this.currentItem = 0;
			else
				this.currentItem++;
			
			var item = $(args.selector.wrap).find(args.selector.item).eq(this.items.length - 1);
			var itemClone = $(item).clone();
			$(itemClone).prependTo(args.selector.items, args.selector.wrap);
			$(item).remove();
			
			self.updatePosition(args);
			
			$(args.selector.wrap).find(args.selector.item).eq(this.items.length - 1)
				.animate(
				{
					opacity: 1
				},
				{
					queue: true,
					duration: args.speed,
					complete: function()
					{
						$(this).siblings().eq(0)
							.css('opacity', 0);
					}
				});
		}
	},
	
	/*
	 *		FADE TO PREVIOUS ITEM
	 */
	
	fadePrev: function(args)
	{
		var self = this;
		
		if(!$(args.selector.wrap).find(args.selector.item).is(':animated'))
		{
			if(this.currentItem == 0)
				this.currentItem = this.items.length - 1;
			else
				this.currentItem--;
			
			var item = $(args.selector.wrap).find(args.selector.item).eq(0);
			var itemClone = $(item).clone();
			$(itemClone).appendTo(args.selector.items, args.selector.wrap);
			$(item).remove();
			
			self.updatePosition(args);
			
			$(itemClone)
				.animate(
				{
					opacity: 1
				},
				{
					queue: true,
					duration: args.speed,
					complete: function()
					{
						$(this).prev(args.selector.item)
							.css('opacity', 0);
					}
				});
		}
	},
	
	/*
	 *		FADE TO ITEM AT GIVEN INDEX
	 */
	
	fadeToIndex: function(i, args)
	{
		var self = this;
		
		if(!$(args.selector.wrap).find(args.selector.item).is(':animated'))
		{
			switch(i)
			{
                case 0:
                    if(this.currentItem == 2)
                        this.fadeNext(args);
                    else if(this.currentItem == 1)
                        this.fadePrev(args);
                    break;
                
                case 1:
                    if(this.currentItem == 0)
                        this.fadeNext(args);
                    else if(this.currentItem == 2)
                        this.fadePrev(args);
                    break;
                    
                case 2:
                    if(this.currentItem == 1)
                        this.fadeNext(args);
                    else if(this.currentItem == 0)
                        this.fadePrev(args);
                    break;
			}
		}
	},
	
	/*
	 *		AUTO ROTATE
	 */
	
	autoRotate: function(args)
	{
		var self = this;
		
		this.autoRotateId = window.setInterval(function()
		{
			self.fadeNext(args);
		}, args.interval);
	},
	
	/*
	 *		ADD NAVIGATION
	 */
	
	addNaviButtons: function(args)
	{
		var self = this;
		var items = $(args.selector.wrap).find(args.selector.item);
		
		var naviWrap = $('<span>',
		{
			'class': 'navi-wrap rel hid'
		}).appendTo(args.selector.naviControls, args.selector.wrap);
		
		this.dot = $('<a>',
		{
			'class': 'dot rel hid',
			'href': '#',
			'html': '&#149;'
		});
		
		items
    		.each(function(i)
    		{
                $(args.selector.wrap).find('.navi-wrap')
                    .append(self.dot.clone());
    		});
        
        $(args.selector.wrap).find('.dot').eq(0)
            .addClass('active')
        .end()
            .each(function(i)
            {
                $(this)
                    .click(function(e)
        			{
        				(e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        				self.userNavigated = true;
        				self.fadeToIndex(i, args);
        			});
            });
        
        $(args.selector.naviArticleLinks).find('li').eq(0)
            .addClass('active')
        .end()
            .each(function(i)
            {
                $(this).find('a')
                    .click(function(e)
        			{
        				(e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        				self.userNavigated = true;
        				self.fadeToIndex(i, args);
        			});
            });
	},
	
	/*
	 *		UPDATE RIGHT ITEM LIST AND DOTS
	 */
    
    updatePosition: function(args)
    {
        $(args.selector.wrap).find('.dot').eq(this.currentItem)
            .animate(
            {
                color: '#A5C826'
            },
            {
                complete: function()
                {
                    $(this)
                        .removeAttr('style')
                        .addClass('active');
                },
                duration: 500
            });
        
        $(args.selector.wrap).find('.dot').eq(this.currentItem).siblings()
            .animate(
            {
                color: '#C8C9C9'
            },
            {
                complete: function()
                {
                    $(this)
                        .removeAttr('style')
                        .removeClass('active');
                },
                duration: 250
            });
        
        $(args.selector.naviArticleLinks).find('li').eq(this.currentItem).find('a strong')
            .animate(
            {
                color: '#FFF'
            },
            {
                complete: function()
                {
                    $(this).closest('li')
                        .addClass('active')
                    .find('a strong')
                        .removeAttr('style');
                },
                duration: 500
            });
        
        $(args.selector.naviArticleLinks).find('li').eq(this.currentItem).siblings().find('a strong')
            .animate(
            {
                color: '#617486'
            },
            {
                complete: function()
                {
                    $(this).closest('li')
                        .removeClass('active')
                    .find('a strong')
                        .removeAttr('style');
                },
                duration: 250
            });
    }
};

$(function()
{
	var LYDROMMETFader = new Fader(
	{
		selector: {
			wrap: '.art-fader',
			items: '.items',
			item: '.item',
			naviArticleLinks: '.item-links',
			naviControls: '.controls'
		},		
		sequenceIndicator: true,
		speed: 500,
		interval: 7500
	});
});