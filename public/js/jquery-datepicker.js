(function($) {
    "use strict";
    var strtotime = function( str ){
        return Date.parse( str.replace(/-/g, '/') )/1000;
    };
    var date = function(format, timestamp){
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
        var pad = function(n, c){
            if((n = n + "").length < c){
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            d: function(){return pad(f.j(), 2);},
            D: function(){return f.l().substr(0,3);},
            j: function(){return jsdate.getDate();},
            l: function(){return txt_weekdays[f.w()];},
            N: function(){return f.w() + 1;},
            S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';},
            w: function(){return jsdate.getDay();},
            z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;},
            W: function(){
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                    return 1;
                } else{
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime()/1000));
                    } else{
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },
            F: function(){return txt_months[f.n()];},
            m: function(){return pad(f.n(), 2);},
            M: function(){return f.F().substr(0,3);},
            n: function(){return jsdate.getMonth() + 1;},
            t: function(){
                var n;
                if( (n = jsdate.getMonth() + 1) == 2 ){
                    return 28 + f.L();
                } else{
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                        return 31;
                    } else{
                        return 30;
                    }
                }
            },
            L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;},
            Y: function(){return jsdate.getFullYear();},
            y: function(){return (jsdate.getFullYear() + "").slice(2);},
            a: function(){return jsdate.getHours() > 11 ? "pm" : "am";},
            A: function(){return f.a().toUpperCase();},
            B: function(){
                var off = (jsdate.getTimezoneOffset() + 60)*60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds/86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00"+beat;
                if ((String(beat)).length == 2) beat = "0"+beat;
                return beat;
            },
            g: function(){return jsdate.getHours() % 12 || 12;},
            G: function(){return jsdate.getHours();},
            h: function(){return pad(f.g(), 2);},
            H: function(){return pad(jsdate.getHours(), 2);},
            i: function(){return pad(jsdate.getMinutes(), 2);},
            s: function(){return pad(jsdate.getSeconds(), 2);},
            O: function(){
                var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2));},
            c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();},
            U: function(){return Math.round(jsdate.getTime()/1000);}
        };
        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
            var ret = '';
            if( t!=s ){
                ret = s;
            } else if( f[s] ){
                ret = f[s]();
            } else{
                ret = s;
            }
            return ret;
        });
    };
    var date_helper = function($t){
        return new date_helper.prototype.init($t);
    };
    date_helper.prototype = {
        date         : '',
        current_date : '',

        datetime         : '',
        current_datetime : '',

        timestamp         : 0,
        current_timestamp : 0,

        init:function($t){
            if(!$t) $t = null;
            this.set_date($t);
            return this;
        },
        get_timestamp:function($t){
            return ! isNaN($t) ? $t : strtotime($t);
        },
        get_interval:function($etime, $stime){
            if(!$etime) $etime = null;
            if(!$stime) $stime = null;
            $etime = ($etime===null) ? this.current_timestamp : this.get_timestamp($etime);
            $stime = ($stime===null) ? this.timestamp         : this.get_timestamp($stime);
            return $etime - $stime;
        },
        get_offset:function($edate, $sdate){
            if(!$edate) $edate = null;
            if(!$sdate) $sdate = null;
            return this.get_interval($edate, $sdate) / 86400;
        },
        set_date:function($t){
            if(!$t) $t = null;
            if($t===null) $t = Math.round(new Date().getTime()/1000);
            var $timestamp = this.get_timestamp($t);

            this.timestamp = $timestamp;
            this.date      = date('Y-m-d', $timestamp);
            this.datetime  = date('Y-m-d H:i:s', $timestamp);
            return this.reset_current_date();
        },
        reset_current_date:function(){
            return this.set_current_date(this.timestamp);
        },
        set_current_date:function($t){
            var $timestamp = this.get_timestamp($t);

            this.current_timestamp = $timestamp;
            this.current_date      = this.php_date();
            this.current_datetime  = this.php_date('Y-m-d H:i:s');
            return this;
        },
        get_offset_date: function($offset, $type){
            if(!$type) $type = 'd';
            var $year, $timestamp;
            $offset = parseInt($offset);
            switch($type){
            case 'Y':
                $year = parseInt(this.php_date('Y')) + $offset;
                return this.set_current_date( this.php_date($year+"-m-d H:i:s") );
                break;
            case 'm':
                var $tmonth = parseInt(this.php_date('Y'), 10)*12 + parseInt(this.php_date('n'), 10) + parseInt($offset, 10);
                $year = Math.floor($tmonth / 12);
                var $month = Math.floor($tmonth % 12);
				if($month===0){
					$year -= 1;
					$month = 12;
				}
                if($month<10) $month = '0' + String($month);
                var $other  = this.php_date('d H:i:s');
                this.set_current_date($year+'-'+$month+'-'+$other);
                return this;
                break;
            case 'w':
                $timestamp = $offset * 7 * 86400;
                break;
            case 'H':
                $timestamp = $offset * 3600;
                break;
            case 'i':
                $timestamp = $offset * 60;
                break;
            case 's':
                $timestamp = $offset;
                break;
            default://d
                $timestamp = $offset * 86400;
                break;
            }
            return this.set_current_date(this.current_timestamp + $timestamp);
        },
        php_date:function($formatter){
            if(!$formatter) $formatter = 'Y-m-d';
            return date($formatter, this.current_timestamp);
        },
        get_first_date_of_month:function(){
            var $offset = -(this.php_date('j') -1);
            return this.get_offset_date($offset);
        },
        get_last_date_of_month:function(){
            var $offset = this.php_date('t') - this.php_date('j');
            return this.get_offset_date($offset);
        },

        get_first_date_of_season:function(){
            var $ts = this.current_timestamp;
            var $m  = 3 * (Math.ceil(date('m', $ts)/3)-1)+1;
            if($m!=10) $m = '0' + $m;
            var $ret    = date("Y-"+$m+"-01", $ts);
            var $offset = (strtotime($ret) - this.current_timestamp) / 86400;
            return this.get_offset_date($offset);
        },
        get_last_date_of_season:function(){
            return this.get_first_date_of_season()
                        .get_offset_date(+120)
                        .get_first_date_of_season()
                        .get_offset_date(-1);
        }

    };
    date_helper.prototype.init.prototype = date_helper.prototype;
    $.fn.datePicker = function(o){
        var op = $.extend(true, {
            monthNum:1,
            proxy:$('body')
        }, o);
        var tpl =
        '<div class="ui-datetimepicker">' +
            '<div class="l-head">' +
                '<a href="javascript:;" class="l-switcher l-prev"><</a>' +
                '<a href="javascript:;" class="l-switcher l-next">></a>' +
                '<ul class="cf">' +
                    '<li></li>' +
                '</ul>' +
            '</div>' +
            '<div class="l-list cf">' +
                '<div class="l-item">' +
                    '<ul class="wh cf">' +
                        '<li class="item day weekend">日</li>' +
                        '<li class="item day">一</li>' +
                        '<li class="item day">二</li>' +
                        '<li class="item day">三</li>' +
                        '<li class="item day">四</li>' +
                        '<li class="item day">五</li>' +
                        '<li class="item day weekend">六</li>' +
                    '</ul>' +
                    '<ul class="wd cf">' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</div>';
        var draw_ui = function(val, selected, render){
            selected = selected!==undefined ? selected : true;
            var ret = $(tpl);
            if(op.monthNum>1){
                var ul = ret.find('.l-head ul');
                var list = ret.find('.l-list');
                for(var n=0; n<op.monthNum-1; n++){
                    ul.append(ul.find('li').eq(0).clone());
                    list.append(list.find('.l-item').eq(0).clone());
                }
            }
            var dh = date_helper();
            dh.set_date(val);
            for(var n=0; n<op.monthNum; n++){
                var dd = dh.current_date;
                var abd;
                if(op.minDate){
                    switch(typeof op.minDate){
                        case 'string':
                            abd = op.minDate;
                            break;
                        case 'function':
                            abd = op.minDate();
                            break;
                    }
                }
                var sdate = dh.get_first_date_of_month();
                var sday = sdate.php_date('w');
                var total = sdate.php_date('t');
                var ii = 1;
                var dl = '';
                for(var i =0; i<42; i++){
                    var sc = '';
                    var fd = sdate.php_date('Y-m-'+(ii<10 ? ('0'+ii) : String(ii)));
                    if(fd<abd) sc = ' class="disabled"';
                    else if(i<sday||ii>total) sc = ' class="disabled"';
                    else if(fd==dd && selected || render&&fd==render.value) sc = ' class="selected"';
                    dl += '<li' + sc + '>' + (i<sday||ii>total ? '' : ii++) + '</li>';
                }
                ret.find('.l-head li').eq(n).html(sdate.php_date('Y年n月'));
                ret.find('.wd').eq(n).append(dl);
                ret.find('.l-item').eq(0).css({borderColor:'white'});
                if(render && render.ui && render.ui.renderTo) render.ui.renderTo.innerHTML = ret.html();
                else ret.appendTo('body');
                dh.get_offset_date(1, 'm');
            }
            return ret.get(0);
        };
        return this.each(function(){
            var that = this;
            var $this = $(this);
            var val = this.value;
            this.ui = {
                hovered: false,
                skipdate: val,
                renderTo: draw_ui(val)
            };
            $(this.ui.renderTo).css({
                position:'absolute',
                left: $(that).position().left,
                top: $(that).position().top + that.offsetHeight
            });
            $(this.ui.renderTo).on({
                click: function(){
                    that.ui.skipdate = date_helper(that.ui.skipdate).get_offset_date(-2, 'm').current_date;
                    draw_ui(that.ui.skipdate, false, that);
                }
            }, '.l-prev').on({
                click: function(){
                    that.ui.skipdate = date_helper(that.ui.skipdate).get_offset_date(2, 'm').current_date;
                    draw_ui(that.ui.skipdate, false, that);
                }
            }, '.l-next').on({
                click: function(){
                    that.value = date_helper(that.ui.skipdate).get_first_date_of_month().get_offset_date($(this).closest('.l-item').index(), 'm').get_offset_date(Number(this.innerHTML - 1)).current_date;
                    $(that.ui.renderTo).hide();
					op.onComplete && op.onComplete.call(that, that.value);
                }
            }, '.wd li:not(".disabled")').on({
                mouseenter: function(){
                    that.ui.hovered = true;
                },
                mouseleave: function(){
                    that.ui.hovered = false;
                },
                click: function(){
                    that.ui.hovered = true;
                }
            });
            $(this).on({
                'click focus': function(){
                    op.proxy.trigger('click');
                    draw_ui(that.value, false, that);
                    this.ui.hovered = true;
                    this.ui.skipdate = this.value;
                    $(this.ui.renderTo).show();
                },
                'blur': function(){
                    this.ui.hovered = false;
                }
            });
            $(this).next().on({
                click: function(){
                    $(that.ui.renderTo).show();
                    that.ui.hovered = true;
                    return false;
                }
            });
            op.proxy.on({
                click: function(e){
                    if(!that.ui.hovered){
                        $(that.ui.renderTo).hide();
                    }
                }
            });
        });
    };
})(jQuery);
