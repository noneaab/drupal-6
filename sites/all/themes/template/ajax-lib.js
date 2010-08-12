/**
* A more compact, but less performant, RFC4122v4 compliant solution:
* Copyright (c) 2009 Robert Kieffer
* Dual licensed under the MIT and GPL licenses.
*/
Math.uuid2 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
};

/**
* Cookie plugin
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Modified by Nonea 2010
* Dual licensed under the MIT and GPL licenses.
*/
jQuery.cookie = function(name, value, options) {
    enc = function (value) {
        if ($['toJSON']) return $.toJSON(value);
        return value;
    }
    dec = function (value) {
        if ($['toJSON']) return $.evalJSON(value);
        return value;
    }
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(enc(value)), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = dec(decodeURIComponent(cookie.substring(name.length + 1)));
                    break;
                }
            }
        }
        return cookieValue;
    }
    return null;
};
