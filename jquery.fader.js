/*
 *  Written by: Hein Haraldson Berg @ www.keyteq.no
 */

var GenericFader = function(args)
{
    if($(args.selector.wrap).length)
    {
        this.initialize(args);
    }
};

GenericFader.prototype = {
    initialize: function(args)
    {
        var self = this;
        this.args = args;
        
        $(this.args.selector.wrap)
            .each(function(i)
            {
                $(this).find(self.args.selector.item)
                    .toggleClass('abs rel')
                    .css(
                    {
                        top: 0,
                        left: 0
                    });
                
                self.setupUserNavigation(i);
                
                if(self.args.rotate.auto && !$(this).hasClass('no-auto'))
                {
                    self.autoRotate(i);
                }
            });
    },
    
    fade: function(direction, i, directToItemIndex)
    {
        var self = this;
        var $items = $(this.args.selector.wrap).eq(i).find(this.args.selector.item);
        
        var fromItem = $items.filter('.active');
        var fromItemIndex = fromItem.index();
        
        if(direction !== 'direct')
        {
            var modifier = 1;
            if(direction == 'prev')
            {
                modifier = -1;
            }
            
            var toItemIndex = fromItem.index() + modifier;
            
            if(toItemIndex > (this.getNumberOfItems(i) - 1))
            {
                toItemIndex = 0;
            }
            else if(toItemIndex < 0)
            {
                toItemIndex = (this.getNumberOfItems(i) - 1);
            }
            
            var toItem = $items.eq(toItemIndex);
        }
        else if(typeof directToItemIndex !== 'undefined')
        {
            var toItem = $items.eq(directToItemIndex);
            var toItemIndex = directToItemIndex;
        }
        
        if(!$items.is(':animated'))
        {
            this.setActiveMenuItem(fromItemIndex, toItemIndex, i);
            
            fromItem
                .removeClass('active');
            
            toItem
                .css(
                {
                    display: 'block',
                    opacity: 0
                })
                .animate(
                {
                    opacity: 1
                },
                {
                    duration: self.args.speed,
                    complete: function()
                    {
                        $(this)
                            .addClass('active')
                            .removeAttr('style')
                            .css(
                            {
                                top: 0,
                                left: 0
                            });
                    }
                });
        }
    },
    
    setupUserNavigation: function(index)
    {
        var self = this;
        
        $(this.args.selector.wrap).eq(index).find('.sequence').find('a')
            .each(function(i)
            {
                $(this)
                    .click(function(e)
                    {
                        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
                        
                        self.stopAutoRotation(index);
                        
                        if(!$(this).closest('li').hasClass('active'))
                        {
                            self.fade('direct', index, i);
                        }
                    });
            });
        
        $(this.args.selector.wrap).eq(index).find('.sequence-prev')
            .click(function(e)
            {
                (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
                
                self.stopAutoRotation(index);
                self.fade('prev', index);
            });
        
        $(this.args.selector.wrap).eq(index).find('.sequence-next')
            .click(function(e)
            {
                (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
                
                self.stopAutoRotation(index);
                self.fade('next', index);
            });            
    },
    
    setActiveMenuItem: function(fromItemIndex, toItemIndex, i)
    {
        var self = this;
        var $menuItems = $(this.args.selector.wrap).eq(i).find('.sequence').find('li').filter('.sequence-item');
        
        $menuItems.eq(fromItemIndex)
            .removeClass('active');
        
        $menuItems.eq(toItemIndex)
            .addClass('active');
    },
    
    autoRotate: function(i)
    {
        var self = this;
        var $wrap = $(this.args.selector.wrap).eq(i);
        
        this.timers.start('autoRotation' + i, this.args.rotate.interval, function()
        {
            self.fade('next', i);
        });
        
        if(this.args.interaction.pauseOnMouseOver)
        {
            $wrap
                .bind('mouseleave.rotate', function()
                {
                    self.restartAutoRotation(i);
                })
                .bind('mouseenter.rotate', function()
                {
                    self.timers.stop('autoRotation' + i);
                });
        }
    },
    
    stopAutoRotation: function(i)
    {
        if(this.args.rotate.auto && this.args.interaction.stopAutoOnClick)
        {
            var $wrap = $(this.args.selector.wrap).eq(i);
            
            this.timers.stop('autoRotation' + i);
            $wrap.unbind('mouseleave.rotate');
        }
    },
    
    restartAutoRotation: function(i)
    {
        var self = this;
        this.timers.stop('autoRotation' + i);
        this.timers.start('autoRotation' + i, this.args.rotate.interval, function()
        {
            self.fade('next', i);
        });  
    },
    
    getNumberOfItems: function(i)
    {
        return $(this.args.selector.wrap).eq(i).find(this.args.selector.item).length;
    },
        
    timers: {
        map: {},
        
        start: function(name, time, callback)
        {
            var id = setInterval(callback, time);
            this.map[name] = id;
        },
        
        stop: function(name)
        {
            if(this.map[name])
            {
                clearInterval(this.map[name]);
            }
        }
    }
};

$(function()
{
    var SAFEGenericFader = new GenericFader(
    {
        selector:
        {
            wrap: '.generic-items',
            items: '.item-wrap',
            item: '.item'
        },
        rotate:
        {
            auto: true,
            interval: 7500
        },
        interaction:
        {
            pauseOnMouseOver: true,
            stopAutoOnClick: true
        },
        speed: 750
    });
});