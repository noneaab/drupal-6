(function($) {
    $.Facebook = function(options){
    
        var SESSION_DATA;
        var CURRENT_USER;
        var USER_DATA;
        var USER_NAME;
        
        var settings;
        var $this = $(this);
    
        function _init (options) {
            settings = $.extend({
                fixErrors: true,
                // user data
                uid: null,
                session: null,
                // login info
                autoSession: false,
                login_url: null,
                logout_url: null,
                proxy: null,
                permissions: '',
                // events
                onerror: null
            }, options);
            
            // check session?
            if (settings.autoSession) _checkSession(true);
            
            // add listeners
            if (settings.onerror) $this.bind('facebook.error', settings.onerror);
        }
        
        function _has_fb_js () {
            return typeof(FB) != 'undefined';
        }
    
        function _error (e) {
            $this.trigger('facebook.error', e);
        }

        // return logged in status
        function _getUser () {
            return CURRENT_USER ? CURRENT_USER : null;
        }
    
        // the function to connect the user on FB
        function _connect (callback) {
            FB.login(function (response) {
                _setUser();
                if (callback) callback.call(this, response);
            }, {perms:settings.permissions});
        }
        
        // logout from facebook
        function _logout (onsuccess) {
            if (settings.logout_url) {
                window.location = settings.logout_url;
            } else if (_has_fb_js()) {
                FB.Connect.logout(onsuccess);
            }
        }
        
        // check if logged in
        function _checkSession (force) {
            if (settings.uid) {
                // connected
                _setUser();
                return true;
            } else if (_has_fb_js()) {
                if (FB.getSession() && !force) return true;
                FB.getLoginStatus(function (response) {
                    if (response.session) _setUser();
                });
            }
            return false;
        }
        
        // load and store the logged in user
        function _setUser () {
            // set user data from passed variables
            if (settings.uid) {
                SESSION_DATA = settings.session;
                CURRENT_USER = settings.uid;
            }
            // load via javascript
            else if (_has_fb_js()) {
                // pull out the current session data from Facebook
                var sess = FB.getSession();
                if (!sess || SESSION_DATA) return;
                SESSION_DATA = sess;
                CURRENT_USER = sess.uid;
                
                // load user info
                _fql_query('SELECT uid,name,pic_square FROM user WHERE uid='+CURRENT_USER, function (o) {
                    if (o['error_code']) return _error(o);
                    USER_NAME = o[0].name;
                    USER_DATA = o[0];
                    $this.trigger('facebook.setuser', o[0]);
                    return true;
                });
            }
            $this.trigger('facebook.connected', SESSION_DATA);
        }
        
        function _fql_query (query, callback) {
            if (settings.proxy) {
                $.post(settings.proxy, {'query':query}, function(d) {
                    if (d['success']) callback(d.data,null);
                    else callback(null,d);
                }, 'json');
            } else if (_has_fb_js()) {
                FB.api({
                    method: 'fql.query',
                    query: query
                }, callback);
            } else {
                _error('Missing FQL functionality');
            }
        }
    
        // function for listing images
        function _listImages (target, type, id, options) {
            $t = $(target);
            // init
            $t.empty();
            var opt = $.extend({
                limit: 20,
                size: 75,
                click: null,
                callback: null,
                fields: 'pid,src_small,src_small_height,src_small_width,src_big,caption',
                tag: 'div',
                center: true
            }, options);
            var q;
            
            // type of listing
            switch (type) {
                case 'album':
                    q = 'SELECT '+opt.fields+' FROM photo WHERE ';
                    if (id) q += 'aid="'+id+'"';
                    else q += 'aid IN ( SELECT aid FROM album WHERE owner='+CURRENT_USER+' )';
                    break;
                case 'friend':
                    q = 'SELECT '+opt.fields+' FROM photo WHERE pid IN( SELECT pid FROM photo_tag WHERE subject='+id+' )';
                    break;
            }
            if (!q) return;
            q += ' LIMIT '+opt.limit;
            
            // do query
            _fql_query(q, function (o) {
                if (o['error_code']) return _error(o);
                var r, i, w, h, s;
                for (i=0;i<o.length;i++) {
                    r = Math.min(opt.size/o[i].src_small_height, opt.size/o[i].src_small_width);
                    w = Math.round(o[i].src_small_width*r);
                    h = Math.round(o[i].src_small_height*r);
                    if (opt.center) s = 'margin:'+Math.floor((opt.size-h)/2)+'px '+Math.floor((opt.size-w)/2)+'px;';
                    $t.append('<'+opt.tag+' rel="'+o[i].src_big+'"><img style="'+s+'" src="'+o[i].src_small+'" width="'+w+'" height="'+h+'" /></'+opt.tag+'>');
                }
                
                // bind events
                if (opt.click) {
                    $t.find(opt.tag).click(opt.click);
                }
                // callback
                if (opt.callback) {
                    opt.callback.call($t, opt);
                }
                return null;
            });
        }
        
        function _listAlbums (callback) {
            // get facebook albums
            var q = 'SELECT aid,name FROM album WHERE owner = '+CURRENT_USER;
            _fql_query(q, callback);
        }
        
        // init
        _init(options);
        
        // return public functions
        return $.extend($this, {
            listImages: _listImages,
            listAlbums: _listAlbums,
            checkSession: _checkSession,
            loggedIn: _getUser,
            connect: _connect,
            logout: _logout
        });
    }
    
})(jQuery);