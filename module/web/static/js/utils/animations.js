define(['jquery', 'underscore', 'transit'], function(jQuery, _) {

    // Adds an element and computes its height, which is saved as data attribute
    // Important function to have slide animations
    jQuery.fn.appendWithHeight = function(element, hide) {
        var o = jQuery(this[0]);

        // TODO: additionally it could be placed out of viewport first
        // The real height can only be retrieved when element is on DOM and display:true
        element.css('visibility', 'hidden');
        o.append(element);

        var height = element.height();

        // Hide the element
        if (hide === true) {
            element.hide();
            element.height(0);
        }

        element.css('visibility', '');
        element.data('height', height);

        return this;
    };

    // TODO: sloppy chaining
    //
    // in functions not possible without previous out

    jQuery.fn.zapIn = function(speed, easing, callback) {
        var height = this.data('height') || '100%';
        this.transition({
            height: height,
            scale: [1, 1],
            opacity: 'show'
        }, speed, easing, callback);

    };

    jQuery.fn.zapOut = function(speed, easing, callback) {
        if (!this.data('height')) {
            var height = this.height();
            this.css({height: height});
            this.data('height', height)
        }
        this.transition({
            height: '0px',
            scale: [1, 0],
            opacity: 'hide'
        }, speed, easing, callback);

    };

    jQuery.fn.slideIn = function(speed, easing, callback) {
        var height = this.data('height') || '100%';
        this.transition({
            height: height,
            opacity: 'show'
        }, speed, easing, callback);

    };

    jQuery.fn.slideOut = function(speed, easing, callback) {
        if (!this.data('height')) {
            var height = this.height();
            this.css({height: height, overflow: 'hidden'});
            this.data('height', height)
        }
        this.transition({
            height: '0px',
            opacity: 'hide'
        }, speed, easing, callback);

    };

    jQuery.fn._transit = jQuery.fn.transit;

    // Overriding transit plugin to support hide and show
    jQuery.fn.transit = jQuery.fn.transition = function(props, duration, easing, callback) {
        var self = this;
        var cb = callback;
        var newprops = _.extend({}, props);

        if (newprops && (newprops.opacity === 'hide')) {
            newprops.opacity = 0;

            callback = function() {
                self.css({display: 'none'});
                if (typeof cb === 'function') {
                    cb.apply(self);
                }
            };
        } else if (newprops && (newprops.opacity === 'show')) {
            newprops.opacity = 1;
            this.css({display: 'block'});
        }

        return this._transit(newprops, duration, easing, callback);
    };
});