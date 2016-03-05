// https://github.com/sfger
// vim: fdm=marker

(function(root, factory){
	'use strict';
	if(typeof define === 'function' && define.amd){
		define(factory);
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.date_helper = factory();
	}
}(this, function(){
var strtotime = function(str){//{{{
	// console.log(str);
	//if(!str || (typeof str.replace != 'function')) return false;
	return Date.parse( str.replace(/-/g, '/') )/1000;
};//}}}

var pad = function(n, c){//{{{
	if((n = n + "").length < c){
		return new Array(++c - n.length).join("0") + n;
	} else {
		return n;
	}
};//}}}

var date = function(format, timestamp){//{{{
	//doc http://php.net/manual/zh/function.date.php
	var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
	var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
	var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var f = {
		// Day
		d: function(){return pad(f.j(), 2);},
		D: function(){return f.l().substr(0,3);},
		j: function(){return jsdate.getDate();},
		l: function(){return txt_weekdays[f.w()];},
		N: function(){return f.w() + 1;},
		S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';},
		w: function(){return jsdate.getDay();},
		z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;},
	   
		// Week
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
	   
		// Month
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
	   
		// Year
		L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;},
		//o not supported yet
		Y: function(){return jsdate.getFullYear();},
		y: function(){return (jsdate.getFullYear() + "").slice(2);},
	   
		// Time
		a: function(){return jsdate.getHours() > 11 ? "pm" : "am";},
		A: function(){return f.a().toUpperCase();},
		B: function(){
			// peter paul koch:
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
		//u not supported yet
	   
		// Timezone
		//e not supported yet
		//I not supported yet
		O: function(){
			var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
			if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
			return t;
		},
		P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2));},
		//T not supported yet
		//Z not supported yet
	   
		// Full Date/Time
		c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();},
		//r not supported yet
		U: function(){return Math.round(jsdate.getTime()/1000);}
	};
	   
	return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
		var ret = '';
		if( t!=s ){
			// escaped
			ret = s;
		} else if( f[s] ){
			// a date function exists
			ret = f[s]();
		} else{
			// nothing special
			ret = s;
		}
		return ret;
	});
};//}}}

// date_helper{{{
var date_helper = function($t){
    return new date_helper.prototype.init($t);
};
date_helper.date = date;
date_helper.pad = pad;
date_helper.strtotime = strtotime;
date_helper.prototype = {
	constructor  : date_helper,

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
            var $tmonth = parseInt(this.php_date('Y')*12) + parseInt(this.php_date('m')) + parseInt($offset);
            $year   = Math.floor($tmonth / 12);
            var $month = Math.floor($tmonth % 12);
			$month = $month===0 ? 12 : $month;
            if($month<10) $month = '0' + $month;
            var $other  = this.php_date('d H:i:s');
            return this.set_current_date([$year, $month, $other].join('-'));
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
        var $m  = 3 * (Math.ceil(this.php_date('m', $ts)/3)-1)+1;
        if($m!=10) $m = '0' + $m;
        var $ret    = this.php_date("Y-"+$m+"-01", $ts);
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
// }}}
return date_helper;
}));

// var a = module.exports();
// console.log(a);
// console.log(module.exports.date.toString());
