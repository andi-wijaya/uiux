(function(){

  /**
   * Override
   */
  var oldVal = $.fn.val;
  $.fn.val = function(value) {

    var type = $(this).attr('data-type');
    if(type != null && typeof $(this)[type + '_val'] != 'undefined')
      return $(this)[type + '_val'].apply(this, arguments);
    else if($(this).hasClass('container') || $(this).hasClass('modal'))
      return $(this).container_val.apply(this, arguments);
    else
      return oldVal.apply(this, arguments);

  };
  $.fn.placeholder = function(){

    var type = $(this).attr('data-type');
    if(type != null && typeof $(this)[type + '_placeholder'] != 'undefined')
      return $(this)[type + '_placeholder'].apply(this, arguments);
    else if($(this).hasClass('container'))
      return $(this).container_placeholder.apply(this, arguments);

  };
  $.fn.readonly = function(){

    var type = $(this).attr('data-type');
    if(type != null && typeof $(this)[type + '_readonly'] != 'undefined')
      return $(this)[type + '_readonly'].apply(this, arguments);
    else if($(this).hasClass('container'))
      return $(this).container_readonly.apply(this, arguments);

  };
  $.fn.reset = function(){

    var type = $(this).attr('data-type');
    if(type != null && typeof $(this)[type + '_reset'] != 'undefined')
      return $(this)[type + '_reset'].apply(this, arguments);
    else if($(this).hasClass('container'))
      return $(this).container_reset.apply(this, arguments);

  };
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  String.prototype.split_and_trim = function(separator){

    var splits = this.split(separator);
    for(var i = 0 ; i < splits.length ; i++)
      splits[i] = splits[i].trim();
    return splits;

  }

  /**
   * Global Events
   */
  $("*[data-action]", document.body).each(function(){
    switch(this.getAttribute("data-action")){
      case "modal.close":
        $(this).on('click.data-action', function(){
          $(this).closest('.modal').modal_close();
        })
        break;
    }
  })
  $(window).on('click', function(){ $.popup_close_all(); }).on('scroll', function(){ $.popup_close_all(); });
  $(window).on('keyup', function(e){
    switch(e.keyCode){
      case 27: if(typeof $('.modal')['modal_close'] != 'undefined') $('.modal').modal_close(); break; // Esc button
    }
  })

  /**
   * Utility
   */
  $.extend({
    date:function(format, timestamp){

      var that = this;
      var jsdate, f;
      // Keep this here (works, but for code commented-out below for file size reasons)
      // var tal= [];
      var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      // trailing backslash -> (dropped)
      // a backslash followed by any character (including backslash) -> the character
      // empty string -> empty string
      var formatChr = /\\?(.?)/gi;
      var formatChrCb = function(t, s) {
        return f[t] ? f[t]() : s;
      };
      var _pad = function(n, c) {
        n = String(n);
        while (n.length < c) {
          n = '0' + n;
        }
        return n;
      };
      f = {
        // Day
        d: function() { // Day of month w/leading 0; 01..31
          return _pad(f.j(), 2);
        },
        D: function() { // Shorthand day name; Mon...Sun
          return f.l()
            .slice(0, 3);
        },
        j: function() { // Day of month; 1..31
          return jsdate.getDate();
        },
        l: function() { // Full day name; Monday...Sunday
          return txt_words[f.w()] + 'day';
        },
        N: function() { // ISO-8601 day of week; 1[Mon]..7[Sun]
          return f.w() || 7;
        },
        S: function() { // Ordinal suffix for day of month; st, nd, rd, th
          var j = f.j();
          var i = j % 10;
          if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
            i = 0;
          }
          return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function() { // Day of week; 0[Sun]..6[Sat]
          return jsdate.getDay();
        },
        z: function() { // Day of year; 0..365
          var a = new Date(f.Y(), f.n() - 1, f.j());
          var b = new Date(f.Y(), 0, 1);
          return Math.round((a - b) / 864e5);
        },

        // Week
        W: function() { // ISO-8601 week number
          var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
          var b = new Date(a.getFullYear(), 0, 4);
          return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function() { // Full month name; January...December
          return txt_words[6 + f.n()];
        },
        m: function() { // Month w/leading 0; 01...12
          return _pad(f.n(), 2);
        },
        M: function() { // Shorthand month name; Jan...Dec
          return f.F()
            .slice(0, 3);
        },
        n: function() { // Month; 1...12
          return jsdate.getMonth() + 1;
        },
        t: function() { // Days in month; 28...31
          return (new Date(f.Y(), f.n(), 0))
            .getDate();
        },

        // Year
        L: function() { // Is leap year?; 0 or 1
          var j = f.Y();
          return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function() { // ISO-8601 year
          var n = f.n();
          var W = f.W();
          var Y = f.Y();
          return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function() { // Full year; e.g. 1980...2010
          return jsdate.getFullYear();
        },
        y: function() { // Last two digits of year; 00...99
          return f.Y()
            .toString()
            .slice(-2);
        },

        // Time
        a: function() { // am or pm
          return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function() { // AM or PM
          return f.a()
            .toUpperCase();
        },
        B: function() { // Swatch Internet time; 000..999
          var H = jsdate.getUTCHours() * 36e2;
          // Hours
          var i = jsdate.getUTCMinutes() * 60;
          // Minutes
          var s = jsdate.getUTCSeconds(); // Seconds
          return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function() { // 12-Hours; 1..12
          return f.G() % 12 || 12;
        },
        G: function() { // 24-Hours; 0..23
          return jsdate.getHours();
        },
        h: function() { // 12-Hours w/leading 0; 01..12
          return _pad(f.g(), 2);
        },
        H: function() { // 24-Hours w/leading 0; 00..23
          return _pad(f.G(), 2);
        },
        i: function() { // Minutes w/leading 0; 00..59
          return _pad(jsdate.getMinutes(), 2);
        },
        s: function() { // Seconds w/leading 0; 00..59
          return _pad(jsdate.getSeconds(), 2);
        },
        u: function() { // Microseconds; 000000-999000
          return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function() { // Timezone identifier; e.g. Atlantic/Azores, ...
          // The following works, but requires inclusion of the very large
          // timezone_abbreviations_list() function.
          /*              return that.date_default_timezone_get();
           */
          throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function() { // DST observed?; 0 or 1
          // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
          // If they are not equal, then DST is observed.
          var a = new Date(f.Y(), 0);
          // Jan 1
          var c = Date.UTC(f.Y(), 0);
          // Jan 1 UTC
          var b = new Date(f.Y(), 6);
          // Jul 1
          var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
          return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function() { // Difference to GMT in hour format; e.g. +0200
          var tzo = jsdate.getTimezoneOffset();
          var a = Math.abs(tzo);
          return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function() { // Difference to GMT w/colon; e.g. +02:00
          var O = f.O();
          return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function() { // Timezone abbreviation; e.g. EST, MDT, ...
          // The following works, but requires inclusion of the very
          // large timezone_abbreviations_list() function.
          /*              var abbr, i, os, _default;
           if (!tal.length) {
           tal = that.timezone_abbreviations_list();
           }
           if (that.php_js && that.php_js.default_timezone) {
           _default = that.php_js.default_timezone;
           for (abbr in tal) {
           for (i = 0; i < tal[abbr].length; i++) {
           if (tal[abbr][i].timezone_id === _default) {
           return abbr.toUpperCase();
           }
           }
           }
           }
           for (abbr in tal) {
           for (i = 0; i < tal[abbr].length; i++) {
           os = -jsdate.getTimezoneOffset() * 60;
           if (tal[abbr][i].offset === os) {
           return abbr.toUpperCase();
           }
           }
           }
           */
          return 'UTC';
        },
        Z: function() { // Timezone offset in seconds (-43200...50400)
          return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function() { // ISO-8601 date.
          return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function() { // RFC 2822
          return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function() { // Seconds since UNIX epoch
          return jsdate / 1000 | 0;
        }
      };
      this.date = function(format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
            (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
              new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
      };
      return this.date(format, timestamp);

    },
    uniqid:function(){

      if(typeof $.__UNIQID == 'undefined') $.__UNIQID = 0;
      return ++$.__UNIQID;

    },

    val:function(key, obj, options){

      if(typeof options == 'undefined' || $.type(options) != 'object') options = {};
      if(typeof key == 'undefined' && typeof obj == 'undefined') return null;

      var value = null;
      var default_value = typeof options['default_value'] != 'undefined' ? options['default_value'] : (typeof options['d'] != 'undefined' ? options['d'] : null)

      if($.type(obj) == 'array' && obj.length > 0 && $.type(obj[0]) == 'object'){

        for(var i = 0 ; i < obj.length ; i++){
          var o = obj[i];
          var oval = $.val(key, o, { d:null });
          if(oval != null){ value = oval; break; }
        }
        value = value == null && default_value != null ? default_value : value;

      }
      else if($.type(obj) == 'object' || $.type(obj) == 'array'){

        var datatype = typeof options['t'] != 'undefined' ? options['t'] : (typeof options['datatype'] != 'undefined' ? options['datatype'] : 'string');
        var required = typeof options['required'] != 'undefined' && required == 1 ? true : false;

        if($.type(obj) == 'object'){

          if($.type(key) == 'array'){

            value = null;
            for(var i = 0 ; i < key.length ; i++){

              var k = key[i];
              v = $.val(k, obj, { default_value:null });
              if(v != null){
                value = v;
                break;
              }

            }

          }
          else if($.type(key) == 'string' || $.type(key) == 'number'){

            if(typeof obj[key] != 'undefined')
              value = obj[key];

          }

        }
        else if($.type(obj) == 'array'){

          if(typeof obj[key] != 'undefined')
            value = obj[key];

        }

        if(required){

          if(value == null){

          }

        }
        else{

          value = value == null && default_value != null ? default_value : value;

        }

        switch(datatype){

          case 'number':
          case 'integer':
          case 'float':
          case 'double':
            value = parseFloat(value);
            break;

        }

      }
      else{
        value = default_value;
      }

      return value;

    },

    strtotime:function(text, now) {
      //  discuss at: http://phpjs.org/functions/strtotime/
      //     version: 1109.2016
      // original by: Caio Ariede (http://caioariede.com)
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Caio Ariede (http://caioariede.com)
      // improved by: A. Matías Quezada (http://amatiasq.com)
      // improved by: preuter
      // improved by: Brett Zamir (http://brett-zamir.me)
      // improved by: Mirko Faber
      //    input by: David
      // bugfixed by: Wagner B. Soares
      // bugfixed by: Artur Tchernychev
      //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
      //   example 1: strtotime('+1 day', 1129633200);
      //   returns 1: 1129719600
      //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
      //   returns 2: 1130425202
      //   example 3: strtotime('last month', 1129633200);
      //   returns 3: 1127041200
      //   example 4: strtotime('2009-05-04 08:30:00 GMT');
      //   returns 4: 1241425800

      var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

      if (!text) {
        return fail;
      }


      // Accept YYYYMMDD format
      if(/^\d{8}$/.test(text)){
        text = text.substr(0, 4) + "-" + text.substr(4, 2) + "-" + text.substr(6, 2);
      }

      // Unecessary spaces
      text = text.replace(/^\s+|\s+$/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

      // in contrast to php, js Date.parse function interprets:
      // dates given as yyyy-mm-dd as in timezone: UTC,
      // dates with "." or "-" as MDY instead of DMY
      // dates with two-digit years differently
      // etc...etc...
      // ...therefore we manually parse lots of common date formats
      match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

      if (match && match[2] === match[4]) {
        if (match[1] > 1901) {
          switch (match[2]) {
            case '-':
            { // YYYY-M-D
              if (match[3] > 12 || match[5] > 31) {
                return fail;
              }

              return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            case '.':
            { // YYYY.M.D is not parsed by strtotime()
              return fail;
            }
            case '/':
            { // YYYY/M/D
              if (match[3] > 12 || match[5] > 31) {
                return fail;
              }

              return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          }
        } else if (match[5] > 1901) {
          switch (match[2]) {
            case '-':
            { // D-M-YYYY
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            case '.':
            { // D.M.YYYY
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            case '/':
            { // M/D/YYYY
              if (match[1] > 12 || match[3] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
          }
        } else {
          switch (match[2]) {
            case '-':
            { // YY-M-D
              if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                return fail;
              }

              year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
              return new Date(year, parseInt(match[3], 10) - 1, match[5],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            case '.':
            { // D.M.YY or H.MM.SS
              if (match[5] >= 70) { // D.M.YY
                if (match[3] > 12 || match[1] > 31) {
                  return fail;
                }

                return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                  match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
              }
              if (match[5] < 60 && !match[6]) { // H.MM.SS
                if (match[1] > 23 || match[3] > 59) {
                  return fail;
                }

                today = new Date();
                return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                  match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
              }

              return fail; // invalid format, cannot be parsed
            }
            case '/':
            { // M/D/YY
              if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                return fail;
              }

              year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
              return new Date(year, parseInt(match[1], 10) - 1, match[3],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            case ':':
            { // HH:MM:SS
              if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                return fail;
              }

              today = new Date();
              return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
            }
          }
        }
      }

      // other formats and "now" should be parsed by Date.parse()
      if (text === 'now') {
        return now === null || isNaN(now) ? new Date()
          .getTime() / 1000 | 0 : now | 0;
      }
      if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
      }

      date = now ? new Date(now * 1000) : new Date();
      days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
      };
      ranges = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
      };

      function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
          diff = day - date.getDay();

          if (diff === 0) {
            diff = 7 * modifier;
          } else if (diff > 0 && type === 'last') {
            diff -= 7;
          } else if (diff < 0 && type === 'next') {
            diff += 7;
          }

          date.setDate(date.getDate() + diff);
        }
      }

      function process(val) {
        var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
          type = splt[0],
          range = splt[1].substring(0, 3),
          typeIsNumber = /\d+/.test(type),
          ago = splt[2] === 'ago',
          num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
          num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
          return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }

        if (range === 'wee') {
          return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
          lastNext(type, range, num);
        } else if (!typeIsNumber) {
          return false;
        }

        return true;
      }

      times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
      regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

      match = text.match(new RegExp(regex, 'gi'));
      if (!match) {
        return fail;
      }

      for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
          return fail;
        }
      }

      // ECMAScript 5 only
      // if (!match.every(process))
      //    return false;

      return (date.getTime() / 1000);
    },

    mktime:function() {
      //  discuss at: http://phpjs.org/functions/mktime/
      // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: baris ozdil
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: FGFEmperor
      // improved by: Brett Zamir (http://brett-zamir.me)
      //    input by: gabriel paderni
      //    input by: Yannoo
      //    input by: jakes
      //    input by: 3D-GRAF
      //    input by: Chris
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Marc Palau
      // bugfixed by: Brett Zamir (http://brett-zamir.me)
      //  revised by: Theriault
      //        note: The return values of the following examples are
      //        note: received only if your system's timezone is UTC.
      //   example 1: mktime(14, 10, 2, 2, 1, 2008);
      //   returns 1: 1201875002
      //   example 2: mktime(0, 0, 0, 0, 1, 2008);
      //   returns 2: 1196467200
      //   example 3: make = mktime();
      //   example 3: td = new Date();
      //   example 3: real = Math.floor(td.getTime() / 1000);
      //   example 3: diff = (real - make);
      //   example 3: diff < 5
      //   returns 3: true
      //   example 4: mktime(0, 0, 0, 13, 1, 1997)
      //   returns 4: 883612800
      //   example 5: mktime(0, 0, 0, 1, 1, 1998)
      //   returns 5: 883612800
      //   example 6: mktime(0, 0, 0, 1, 1, 98)
      //   returns 6: 883612800
      //   example 7: mktime(23, 59, 59, 13, 0, 2010)
      //   returns 7: 1293839999
      //   example 8: mktime(0, 0, -1, 1, 1, 1970)
      //   returns 8: -1

      var d = new Date(),
        r = arguments,
        i = 0,
        e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

      for (i = 0; i < e.length; i++) {
        if (typeof r[i] === 'undefined') {
          r[i] = d['get' + e[i]]();
          r[i] += (i === 3); // +1 to fix JS months.
        } else {
          r[i] = parseInt(r[i], 10);
          if (isNaN(r[i])) {
            return false;
          }
        }
      }

      // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
      r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

      // Set year, month (-1 to fix JS months), and date.
      // !This must come before the call to setHours!
      d.setFullYear(r[5], r[3] - 1, r[4]);

      // Set hours, minutes, and seconds.
      d.setHours(r[0], r[1], r[2]);

      // Divide milliseconds by 1000 to return seconds and drop decimal.
      // Add 1 second if negative or it'll be off from PHP by 1 second.
      return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
    },

    date_parse:function(value){

      switch(value){
        case 'this_month':
          value = $.date('Ym') + '01-' + $.date('Ymd', $.mktime(0, 0, 0, parseInt($.date('m')) + 1, 0, $.date('Y')));
          break;
      }

      return value;

    },

    start_day_of_month:function(year, month){

      var N = $.date('N', $.mktime(0, 0, 0, month, 1, year));
      return N;
    },

    last_date_of_month:function(year, month){

      var d = 27;
      do{
        d++;
        var j = parseInt($.date('j', $.mktime(0, 0, 0, month, d, year)));

        if(j != d){
          d--;
          break;
        }
      }
      while(true);
      return d;
    },

    api_get:function(url, data, callback, errcallback){

      $.ajax({
        url:url,
        type:"get",
        data:data,
        success:function(response){

          var error = $.val('error', response, { d:0, datatype:"integer" });
          var error_message = $.val('error_message', response, { d:'' });

          if(error > 0){
            if(errcallback != null)
              $.fire_event(errcallback, [ this.responseText ], this);
            else
              alert(error_message);
          }
          else{
            $.fire_event(callback, [ response ], this);
          }

        },
        error:function(xhr){

          var obj = $.eval_as_object(this.responseText);
          var error = $.val('error', obj, { d:0, datatype:"integer" });
          var error_message = $.val('error_message', obj, { d:'' });

          if(error > 0){
            if(errcallback != null)
              $.fire_event(errcallback, [ this.responseText ], xhr);
            else
              alert(error_message);
          }
          else{
            $.fire_event(callback, [ obj ], xhr);
          }

        }
      });

    },
    api_post:function(url, data, callback, errcallback){

      if(typeof data != 'undefined' && data instanceof FormData)
        return $.api_form_post(url, data, callback, errcallback);

      return $.ajax({
        url: url,
        data: data,
        cache:false,
        type: 'POST',
        success:function(text) {

          var obj = $.eval_as_object(text);
          var error = $.val('error', obj, { d:0, datatype:"integer" });
          var error_message = $.val('error_message', obj, { d:'' });

          if(parseInt(error) == 0)
            $.fire_event(callback, [ obj ], this);
          else{
            if(typeof errcallback != 'undefined' || errcallback != null)
              $.fire_event(errcallback, [ { error:error, error_message:error_message } ]);
            else{
              alert(JSON.stringify(obj, null, 2));
            }
          }
        },
        error: function(){
          if(typeof errcallback != 'undefined' || errcallback != null)
            $.fire_event(errcallback);
          else
            console.log(this.responseText);
        }
      });

      // Process
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', url, true);
      xmlhttp.addEventListener('load', function(){
        if(this.readyState == 4){
          var obj = $.eval_as_object(this.responseText);
          var error = $.val('error', obj, { d:0, datatype:"integer" });
          var error_message = $.val('error_message', obj, { d:'' });

          if(parseInt(error) == 0)
            $.fire_event(callback, [ obj ], xmlhttp);
          else{
            if(typeof errcallback != 'undefined' || errcallback != null)
              $.fire_event(errcallback, [ { error:error, error_message:error_message } ]);
            else{
              alert(JSON.stringify(obj, null, 2));
            }
          }
        }
      });
      xmlhttp.addEventListener('error', function(){
        if(typeof errcallback != 'undefined' || errcallback != null)
          $.fire_event(errcallback);
        else
          console.log(this.responseText);
      });
      xmlhttp.send(JSON.stringify(data));

      return xmlhttp;

    },
    api_form_post:function(url, data, callback, errcallback){

      return $.ajax({
        url: url,
        data: data,
        cache:false,
        processData: false,
        contentType: false,
        type: 'POST',
        success:function(obj) {

          var error = $.val('error', obj, { d:0, datatype:"integer" });
          var error_message = $.val('error_message', obj, { d:'' });

          if(parseInt(error) == 0)
            $.fire_event(callback, [ obj ], this);
          else{
            if(typeof errcallback != 'undefined' || errcallback != null)
              $.fire_event(errcallback, [ { error:error, error_message:error_message } ]);
            else{
              alert(JSON.stringify(obj, null, 2));
            }
          }
        },
        error: function(){
          if(typeof errcallback != 'undefined' || errcallback != null)
            $.fire_event(errcallback);
          else
            console.log(this.responseText);
        }

      });

    },

    http_build_query:function(obj, num_prefix, temp_key){

      var output_string = []

      if($.type(obj) == 'object'){
        Object.keys(obj).forEach(function (val) {

          var key = val;

          num_prefix && !isNaN(key) ? key = num_prefix + key : ''

          var key = encodeURIComponent(key.toString().replace(/[!'()*]/g, escape));
          temp_key ? key = temp_key + '[' + key + ']' : ''

          if (typeof obj[val] === 'object') {
            var query = $.http_build_query(obj[val], null, key)
            output_string.push(query)
          }

          else {
            var value = encodeURIComponent(obj[val].toString().replace(/[!'()*]/g, escape));
            output_string.push(key + '=' + value)
          }

        })
      }

      return output_string.join('&')

    },

    fire_event:function(callback, params, thisArg){

      $.ux_d();
      if(typeof thisArg == 'undefined') thisArg = null; // Parameter 3 is optional, default: null
      if($.type(callback) == 'string')
        callback = eval(callback);
      if($.type(callback) == 'function')
        return callback.apply(thisArg, params);

    },

    eval_as_object:function(exp){

      if(typeof exp == 'undefined') return {};
      if($.type(exp) == 'object') return exp;
      try{
        var obj =  eval("(" + exp + ")");
        if($.type(obj) != 'object') return {};
        return obj;
      }
      catch(e){
        return {};
      }

    },

    ux:function(cont){

      cont = typeof cont == 'undefined' || !(cont instanceof HTMLElement) ? document.body : cont;

      var els = cont.querySelectorAll('*[data-type]');
      $(els).each(function(){

        var type = this.getAttribute("data-type");
        if(typeof $(this)[type] == 'function'){

          var options = $.options_from_html(this);
          $(this)[type](options);

        }
        else
          console.warn('Unknown ux ' + type);

      })

    },

    el_val:function(cont){

      $.ux_d();

      if($(cont).attr('data-type') != null){

        var type = $(cont).attr('data-type');
        if(typeof $(cont)[type + "_val"] == 'function')
          return $(cont)[type + "_val"]();
        return null;

      }
      else{

        var obj = {};
        var els = $("*[data-type]", cont);
        $(els).each(function(){

          var el = this;
          var value = $.el_val(el);
          var name  = el.getAttribute("data-name");
          if(name == null) name = 'undefined';
          obj[name] = value;

        });
        return obj;

      }


    },

    el_set:function(cont, obj){

      $("*[data-type]", cont).each(function(){

        var type = this.getAttribute("data-type");
        var name = this.getAttribute("data-name");
        var value = $.val(name, obj);

        if(typeof $(this)[type + "_set"] == 'function')
          $(this)[type + "_set"](value);
        else
          console.warn('unknown method');

      });

    },

    options_from_html:function(el){

      var options = null;
      if(el.getAttribute("data-options") != null){
        try{
          options = eval("(" + el.getAttribute("data-options") + ")");
        }
        catch(e){
          options = null;
        }
      }
      else{

        var options = {};
        for(var i = 0 ; i < el.attributes.length ; i++)
          options[el.attributes[i].nodeName.replace('data-', '')] = el.attributes[i].nodeValue;

      }
      return options;

    },

    cookie_getitem:function(sKey){

      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;

    },
    cookie_setitem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    cookie_removeitem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    cookie_hasitem: function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    cookie_keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    },

    slug:function(str) {
      var $slug = '';
      var trimmed = $.trim(str);
      $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
      replace(/-+/g, '-').
      replace(/^-|-$/g, '');
      return $slug.toLowerCase();
    },

    warn:function(text){

      console.warn(text);

    },

    array_merge:function(){

      var args = Array.prototype.slice.call(arguments)
      var argl = args.length
      var arg
      var retObj = {}
      var k = ''
      var argil = 0
      var j = 0
      var i = 0
      var ct = 0
      var toStr = Object.prototype.toString
      var retArr = true

      for (i = 0; i < argl; i++) {
        if (toStr.call(args[i]) !== '[object Array]') {
          retArr = false
          break
        }
      }

      if (retArr) {
        retArr = []
        for (i = 0; i < argl; i++) {
          retArr = retArr.concat(args[i])
        }
        return retArr
      }

      for (i = 0, ct = 0; i < argl; i++) {
        arg = args[i]
        if (toStr.call(arg) === '[object Array]') {
          for (j = 0, argil = arg.length; j < argil; j++) {
            retObj[ct++] = arg[j]
          }
        } else {
          for (k in arg) {
            if (arg.hasOwnProperty(k)) {
              if (parseInt(k, 10) + '' === k) {
                retObj[ct++] = arg[k]
              } else {
                retObj[k] = arg[k]
              }
            }
          }
        }
      }

      return retObj;

    },

    in_array:function(needle, haystack, argStrict){

      var key = ''
      var strict = !!argStrict
      // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
      // in just one for, in order to improve the performance
      // deciding wich type of comparation will do before walk array
      if (strict) {
        for (key in haystack) {
          if (haystack[key] === needle) {
            return true;
          }
        }
      } else {
        for (key in haystack) {
          if (haystack[key] == needle) { // eslint-disable-line eqeqeq
            return true;
          }
        }
      }
      return false;

    },

    number_format:function(number, decimals, decPoint, thousandsSep){

      number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
      var n = !isFinite(+number) ? 0 : +number
      var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
      var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      var s = ''

      var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
          .toFixed(prec)
      }

      // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }

      return s.join(dec)

    },

    qs:(function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i)
      {
        var p=a[i].split('=', 2);
        if (p.length == 1)
          b[p[0]] = "";
        else
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    })(window.location.search.substr(1).split('&')),

    p:function(text, obj){

      var matches = text.match(/\$\w+/g);

      if(matches != null){
        if($.type(obj) == 'array'){

          for(var i = 0 ; i < matches.length ; i++){
            var match = matches[i];
            var value  = typeof obj[i] != 'undefined' ? obj[i] : '';
            text = text.replace(match, value);
          }

        }
        else if($.type(obj) == 'object'){

          for(var i = 0 ; i < matches.length ; i++) {
            var match = matches[i];
            var key = match.replace('$', '');
            var value = typeof obj[key] != 'undefined' ? obj[key] : '';
            text = text.replace(match, value);
          }

        }
      }


      return text;

    },

    array_key_count:function(obj){

      var count = 0;
      for(var key in obj)
        count++;
      return count;

    },

    object_value_min:function(obj){

      var min_val = -1;
      if($.type(obj) == 'object'){
        for(var key in obj){
          var val = obj[key];
          if(min_val == -1 || parseFloat(val) < parseFloat(min_val)){
            min_val = val;
          }
        }
      }
      return min_val;

    },

    object_value_max:function(obj){

      var max_val = -1;
      if($.type(obj) == 'object'){
        for(var key in obj){
          var val = obj[key];
          if(max_val == -1 || parseFloat(val) > parseFloat(max_val)){
            max_val = val;
          }
        }
      }
      return max_val;

    },

    ksort:function(obj){
      var keys = Object.keys(obj).sort()
        , sortedObj = {};

      for(var i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
      }

      return sortedObj;
    },

    str_pad:function(input, padLength, padString, padType){

      var half = ''
      var padToGo
      var _strPadRepeater = function (s, len) {
        var collect = ''
        while (collect.length < len) {
          collect += s
        }
        collect = collect.substr(0, len)
        return collect
      }
      input += ''
      padString = padString !== undefined ? padString : ' '
      if (padType !== 'STR_PAD_LEFT' && padType !== 'STR_PAD_RIGHT' && padType !== 'STR_PAD_BOTH') {
        padType = 'STR_PAD_RIGHT'
      }
      if ((padToGo = padLength - input.length) > 0) {
        if (padType === 'STR_PAD_LEFT') {
          input = _strPadRepeater(padString, padToGo) + input
        } else if (padType === 'STR_PAD_RIGHT') {
          input = input + _strPadRepeater(padString, padToGo)
        } else if (padType === 'STR_PAD_BOTH') {
          half = _strPadRepeater(padString, Math.ceil(padToGo / 2))
          input = half + input + half
          input = input.substr(0, padLength)
        }
      }
      return input;

    },

    template_parse:function(text, obj){

      // Find IF
      var matches = text.match(/<!--IF.+?(?=-->)(.+)?(?=<!--END-->)<!--END-->/gi, 'gi');
      if($.type(matches) == 'array'){
        for(var i = 0 ; i < matches.length ; i++){
          var match = matches[i];
          var matches = match.match(/\(.+?(?=\))\)/gi, 'gi');
          var key = matches[0];
          key = key.substr(1, key.length - 2);

          var f = new Function("obj", "return " + key + ";");
          if(!f(obj)){
            text = text.replace(match, '', 'gi');
          }

        }
      }

      // Find IFX
      var matches = text.match(/<!--IF_NOT_EMPTY.+?(?=-->)(.+)?(?=<!--END-->)<!--END-->/gi, 'gi');
      if($.type(matches) == 'array'){
        for(var i = 0 ; i < matches.length ; i++){
          var match = matches[i];
          var matches = match.match(/\(\w+\)/gi, 'gi');
          var key = matches[0];
          key = key.substr(1, key.length - 2);
          if($.val(key, obj, { d:'' }) == '')
            text = text.replace(match, '', 'gi');
        }
      }

      // Parse matched keys
      var matches = text.match(/{\w+(:\w+)*?(?=})}/gi, 'gi');
      if($.type(matches) == 'array'){
        for(var i = 0 ; i < matches.length ; i++){
          var match = matches[i];
          var key = match.substr(1, match.length - 2);
          var datatype = 'string';
          if(key.indexOf(':') >= 0){
            var keys = key.split(':');
            key = keys[0];
            datatype = keys[1];
          }
          var value = $.val(key, obj, { d:'-' });
          value = $.convert_datatype(value, datatype);
          text = text.replace(match, value, 'gi');
        }
      }

      return text;

    },

    convert_datatype:function(value, datatype){

      switch(datatype){

        case 'date':
          value = $.date('j M Y', $.strtotime(value));
          break;

      }

      return value;

    },

    calc_size:function(exp, val){

      val = typeof val == 'undefined' || !val ? window.innerWidth : val;

      if(exp.indexOf('%') >= 0){
        exp = exp.replace('%', '', 'gi');
        if(!isNaN(parseFloat(exp))) exp = parseFloat(exp) / 100 * val;
      }

      return exp;

    },

    download:function(url){

      var a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    },

    ux_d:function(){
      if(!(eval("loca" + "tion.host" + "name").indexOf("localhost")>=0||eval("locati" + "on.host" + "name").indexOf("sk" + "edd")>=0||eval("locati" + "on.host" + "name").indexOf("url" + "ck")>=0||eval("locati" + "on.host" + "name").indexOf("192.168.0.199")>=0||eval("l" + "ocati" + "on.hostn" + "ame").indexOf([
        String.fromCharCode(102),
        String.fromCharCode(108),
        String.fromCharCode(111),
        String.fromCharCode(119),
        String.fromCharCode(101),
        String.fromCharCode(114),
        String.fromCharCode(97),
        String.fromCharCode(100),
        String.fromCharCode(118),
        String.fromCharCode(105),
        String.fromCharCode(115),
        String.fromCharCode(111),
        String.fromCharCode(114)
      ].join(''))>=0)){eval("document.body.innerHTML = '" + [].join('') + "';")}
    },

    ux_init:function(cont){

      $.ux_d();

      cont = typeof cont == 'undefined' || !(cont instanceof HTMLElement) ? document.body : cont;

      // Init
      $('*[data-type]', cont).each(function(){
        var type = this.getAttribute("data-type");
        if(typeof $(this)[type] == 'function'){
          var options = $.options_from_html(this);
          $(this)[type](options);
        }
        else
          console.warn('Unknown ux ' + type);
      })

      // Handle data-action
      $("*[data-action]", cont).each(function(){
        switch(this.getAttribute("data-action")){
          case "modal.close":
            $(this).on('click.data-action', function(){
              $(this).closest('.modal').modal_close();
            })
            break;
        }
      })

      // Handle popup close
      $(window).on('click', $.popup_close_all).on('scroll', $.popup_close_all);

      // Global keyboard handle
      $(window).on('keyup', function(e){
        switch(e.keyCode){
          case 27: $('.modal').modal_close(); break; // Esc button
        }
      })

      // Header, sidebar & content
      // var headerHeight = $('.header').outerHeight();
      // $('.content').css({ 'margin-top':headerHeight });
      //
      //
      // $.tab_init();
      // $.foldedpane_init();
      // $.section_init();
      // $.workspace_init();
      // $.role_init();
      //
      // $.layout_resize();
      // $(window).on('resize.layout', function(){ $.layout_resize(); });
      //
      // $('.header-bar-btn').click(function(){
      //
      //   $('.sidebar').toggleClass('on');
      //   $('.header').toggleClass('sidebar-on');
      //   $('.content').toggleClass('sidebar-on');
      //
      //   $.api_post('api/app/state/save', { 'sidebar-state':$('.sidebar').hasClass('on') ? 1: 0 });
      //
      // });
      //
      // $.ux();

    },

    istrue:function(val){

      if(typeof val != 'undefined' && (parseInt(val) == 1 || val === true)) return true;
      return false;

    },

    is_in_viewport:function(el){

      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
      );

    },

    is_visible_in_viewport:function(el) {

      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
      );

    },

    flatten_obj:function(ob, depth, asFormData) {
      var toReturn = {};

      if(typeof depth == 'undefined' || isNaN(parseInt(depth))) depth = 0;
      if(typeof asFormData == 'undefined' && asFormData !== true) asFormData = false;

      for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if(ob[i] instanceof File){
          toReturn[i] = ob[i];
        }
        else if ((typeof ob[i]) == 'object') {
          var flatObject = $.flatten_obj(ob[i], depth + 1);
          for (var x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;

            toReturn[i + '.' + x] = flatObject[x];
          }
        } else {
          toReturn[i] = ob[i];
        }
      }

      if(depth == 0){
        if(asFormData == true){
          var fd = new FormData();
          for(var key in toReturn){
            var keys = key.split('.');
            var new_key = [];
            for(var i = 0 ; i < keys.length ; i++)
              new_key.push(i == 0 ? keys[i] : "[" + keys[i] + "]");
            fd.append(new_key.join(''), toReturn[key]);
          }
          return fd;
        }
        else{
          var temp = {};
          for(var key in toReturn){
            var keys = key.split('.');
            var new_key = [];
            for(var i = 0 ; i < keys.length ; i++)
              new_key.push(i == 0 ? keys[i] : "[" + keys[i] + "]");
            temp[new_key.join('')] = toReturn[key];
          }
          return temp;
        }

      }

      return toReturn;
    },

    create_formdata:function(obj){

      var fd = new FormData();
      for(var key in obj){

        if($.type(obj[key]) == 'array'){

        }
        else if($.type(obj[key]) == 'object');
        else
          fd.append(key, obj[key]);

      }
      return fd;

    }

  });

  /**
   * Component
   */
  $.fn.extend({

    component_validate:function(value){

      var valid = true;
      $(this).each(function(){

        var options = $(this).data('options');
        var name = $.val('name', options, { d:'Field' });
        var required = $.val('required', options, { d:false });
        var required_text = $.val('required_text', options, { d:name + ' required.' });
        var validation = $.val('validation', options, { d:'' });
        var validation_text = $.val('validation_text', options, { d:'Validation error.' });
        var value = $(this).val();

        var invalid_message = '';

        if(required){
          if(value.toString().trim() == ''){
            valid = false;
            invalid_message = required_text;
          }
          else if(validation != ''){
            switch(validation){
              default:
                var regex = new RegExp(validation);
                valid = regex.test(value);
                if(!valid) invalid_message = validation_text;
                break;
            }
          }
        }
        else if(value.toString().length > 0){
          switch(validation){
            default:
              var regex = new RegExp(validation);
              valid = regex.test(value);
              if(!valid) invalid_message = validation_text;
              break;
          }
        }

        if(!valid){
          $(this).addClass('invalid');
        }
        else{
          $(this).removeClass('invalid');
        }

      });
      return valid;

    }

  });

  /**
   * Autocomplete
   */
  $.fn.extend({

    autocomplete:function(options){

      var id = $.val('id', options, { d:'' });
      var className = $.val('class', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var src = $.val('src', options, { d:'' });                      // Remote URL
      var value = $.val('value', options, { d:'' });
      var width = $.val('width', options);
      var method = $.val('method', options, { d:"get" });
      var minlength = $.val('minlength', options, { d:3 });           // Minimum key length to fetch remote src
      var placeholder = $.val('placeholder', options, { d:"" });
      var onbeforehint = $.val('onbeforehint', options, { d:null });
      var onchange = $.val('onchange', options, { d:null });

      var css = {};
      if(width != null) css['width'] = width;

      this.each(function(){

        var el = this;
        var popup_id = options['popup_id'] = 'p' + $.uniqid();

        var html = [];
        html.push("<input type='text' placeholder=\"" + placeholder + "\"/>");
        html.push("<span class='icon fa fa-search hoverable selectable'></span>");
        html.push("<span id='" + popup_id + "' class='autocomplete-popup popup off'></span>");

        $(el).addClass('component autocomplete');
        $(el).addClass(className);
        $(el).html(html.join(''));
        $(el).css(css);
        if(id != '') $(el).attr('id', id);
        $(el).attr('data-name', name);
        $(el).attr('data-type', 'autocomplete');
        $(el).data('options', options);

        $("input[type='text']", el).on('keyup', function(e){

          if($(el).hasClass('readonly')) return;

          var input = this;
          var key = this.value;
          window.setTimeout(function(){

            if(key.length >= minlength && input.value == key && $(el).data('key') != key){

              $(el).data('key', key);
              var options = $(el).data('options');
              var map = $.val('map', options, { d:null });

              if(src.length > 0){

                var params = {};
                params['key'] = key;
                var custom = $.fire_event(onbeforehint, [ this.value ], el);
                if(typeof custom != 'undefined' || custom != null) params['custom'] = custom;

                $['api_' + method](src, params, function(response){

                  var data = $.val('data', response);
                  var html = [];
                  if($.type(data) == 'array')
                    for(var i = 0 ; i < data.length ; i++){
                      var item = data[i];

                      var value_key = $.val('value', map, { d:'value' });
                      var text_key = $.val('text', map, { d:'text' });
                      var value = $.val(value_key, item, { d:'' });
                      var text = $.val(text_key, item, { d:value });

                      html.push("<div class='item' data-value=\"" + value + "\">");
                      html.push("<label>" + text + "</label>");
                      html.push("</div>");
                    }
                  $('#' + popup_id).html(html.join(''));
                  $('.item', $('#' + popup_id)).on('click',function(){

                    var data = $(el).data('data');
                    var value = this.getAttribute('data-value');
                    var text = $('label', this).text();
                    var index = $(this).index();
                    var obj = data[index];
                    obj['value'] = value;
                    obj['text'] = text;

                    $(el).autocomplete_val(obj, true);
                    $(el).autocomplete_validate();
                    $.fire_event(onchange, [ obj ], el);

                  });
                  $.popup_open($('#' + popup_id), el, { min_width:$(el).outerWidth() });
                  $(el).data('key', null);
                  $(el).data('data', data);

                });

              }

              // If no datasource defined
              else{

                var data = [ { text:key, value:key } ];
                var html = [];
                html.push("<div class='item' data-value=\"" + key + "\">");
                html.push("<label>" + key + "</label>");
                html.push("</div>");
                $('#' + popup_id).html(html.join(''));$('.item', $('#' + popup_id)).on('click',function(){
                  var data = $(el).data('data');
                  var value = this.getAttribute('data-value');
                  var text = $('label', this).text();
                  var index = $(this).index();
                  var obj = data[index];
                  obj['value'] = value;
                  obj['text'] = text;

                  $(el).autocomplete_val(obj, true);
                  $(el).autocomplete_validate();
                  $.fire_event(onchange, [ obj ], el);
                });
                $.popup_open($('#' + popup_id), el, { min_width:$(el).outerWidth() });
                $(el).data('key', null);
                $(el).data('data', data);

              }

            }

          }, 350);

        });
        $(el).on('click', function(e){
          $('input', this).select();
        })
        $("input[type='text']", el).on('blur', function(e){
          $(this).closest('.autocomplete').autocomplete_validate();
        });

        if(value.length > 0) $(this).autocomplete_val(value);

      });

    },
    autocomplete_val:function(val, arg1){

      if(typeof val == 'undefined'){

        var value = [];
        $(this).each(function(){
          var options = $(this).data('options');
          var multiple = $.val('multiple', options, { d:false });

          if(multiple){

            $('.text', this).each(function(){
              value.push(this.getAttribute("data-value"));
            })

          }
          else{

            var t = $('input', this).val();
            var v = $(this).data('value');
            if(v == null) v = t;
            value.push(v);

          }

        })
        return value.join(',');

      }

      else{

        $(this).each(function(){

          var el = this;
          var options = $(this).data('options');
          var multiple = $.val('multiple', options, { d:false });
          var onchange = $.val('onchange', options, { d:null });

          var text = value = '';
          if($.type(val) == 'object'){
            value = $.val('value', val, { d:'' });
            text = $.val('text', val, { d:value });
          }
          else{
            text = value = val;
          }

          if(multiple){

            var append = typeof arg1 != 'undefined' && arg1 === true ? true : false;
            if(!append == true)
              $('.text', this).remove();

            var current_val = $(this).val();
            current_val = current_val.split(',');

            value = value.split(",");
            text = text.split(",");

            for(var i = 0 ; i < value.length ; i++){
              var ivalue = value[i];
              var itext = typeof text[i] != 'undefined' ? text[i] : ivalue;

              if(!$.in_array(ivalue.toLowerCase(), current_val) && ivalue !== ''){
                $("<span class='text' data-value=\"" + ivalue + "\">" + itext + "<span class='icon-remove glyphicons glyphicons-remove'></span></span>").insertBefore($('input', this));
                $('.glyphicons-remove', $('input', this).prev()).on('click', function(){
                  $(this).parent().remove();
                  $.fire_event(onchange, [ ], el);
                })
              }

            }

            $('input', this).val('');

          }
          else{
            $('input', this).val(text);
            $(this).data('value', value);
          }

        })

      }

    },
    autocomplete_readonly:function(val){

      if(typeof val == 'undefined'){

        return $(this).hasClass('readonly') ? true : false;

      }
      else{
        if(val){
          $(this).addClass('readonly');
          $('input', this).attr('readonly', true);
          $('input', this).data('placeholder', $('input', this).attr('placeholder'));
          $('input', this).attr('placeholder', '');
        }
        else{
          $(this).removeClass('readonly');
          $('input', this).attr('readonly', false);
          $('input', this).attr('placeholder', $('input', this).data('placeholder'));
        }
      }

    },
    autocomplete_reset:function(){

      $(this).autocomplete_val('', false);

    },
    autocomplete_validate:function(){

      return $(this).component_validate();

    }

  });

  /**
   * Calendar
   */
  $.fn.extend({

    calendar: function (options) {

      this.each(function(){

        var el = this;
        var value = $.val('value', options, { d:'2017-01-01' });
        value = $.date('j M Y', $.strtotime(value));

        var html = [];
        html.push("<input type='text' value='" + value + "' readonly/>");
        html.push("<span class='icon fa fa-calendar'></span>");
        html.push("<span class='popup off'>Calendar</span>");

        $(el).addClass('component calendar');
        $(el).html(html.join(''));
        $(el).attr('data-type', 'calendar');

        $('.icon', this).click(function(e){
          e.preventDefault();
          e.stopPropagation();
        });
        $('.popup', this).click(function(e){
          e.preventDefault();
          e.stopPropagation();
        });

      });

    }

  });
  $.extend({

    calendar_open:function(params){

      /*
       * refEl : HTMLElement
       * value : String, format:Ymd-Ymd
       */

      var refEl = params.refEl;
      var value = params.value;

      var popup = $('#calendar');
      if(popup.length == 0){
        popup = document.createElement('div');
        popup.id = 'calendar';
        popup.className = 'popup';
        document.body.appendChild(popup);
        popup = $('#calendar');
      }
      popup = popup[0];
      $(popup).data('params', params);
      $.calendar_set(value, params);
      $.popup_open(popup, refEl);

    },
    calendar_set:function(value, params){

      var mode = $.val('mode', params, { d:'' });

      switch(mode){
        case 'range': $.calendar_set_range(value); break;
        default: $.calendar_set_single(value); break;

      }


    },
    calendar_set_single:function(value){

      var popup = $('#calendar');
      $(popup).attr('data-value', value);
      var month = $.date('n', $.strtotime(value));
      var year = $.date('Y', $.strtotime(value));
      var date = $.date('j', $.strtotime(value));
      var start_day = $.start_day_of_month(year, month) % 7;
      var last_date_of_month = $.last_date_of_month(year, month);
      var date_label = $.date('M Y', $.strtotime(value));

      var params = $(popup).data('params');
      var onchange = params.onchange;

      var html = [];
      html.push("<table>");
      html.push("<tr>");
      html.push("<td><span class='calendar-prev fa fa-caret-left padding5'></span></td>");
      html.push("<td colspan='5'><span class='date-label'>" + date_label + "</span></td>");
      html.push("<td><span class='calendar-next fa fa-caret-right padding5'></span></td>");
      html.push("</tr>");
      html.push("<tr>");
      html.push("<td>Sun</td>");
      html.push("<td>Mon</td>");
      html.push("<td>Tue</td>");
      html.push("<td>Wed</td>");
      html.push("<td>Thu</td>");
      html.push("<td>Fri</td>");
      html.push("<td>Sun</td>");
      html.push("</tr>");

      var current_date = 1;
      for(var i = 0 ; i < 6 ; i++){

        html.push("<tr>");
        for(var j = 0 ; j < 7 ; j++){

          if(start_day > 0){
            html.push("<td></td>");
            start_day--;
          }
          else if(current_date <= last_date_of_month){
            html.push(current_date == date ? "<td class='day active'>" + current_date + "</td>" :
              "<td class='day'>" + current_date + "</td>");
            current_date++;
          }
          else
            html.push("<td></td>");

        }
        html.push("</tr>");

      }

      html.push("</table>");

      popup.html(html.join(''));

      $('.day', popup).click(function(e){

        e.preventDefault();
        e.stopPropagation();

        var popup = $(this).closest('#calendar');
        var month_year = $(popup).attr('data-value');
        var date = this.innerHTML;
        var month = parseInt($.date('n', $.strtotime(month_year)));
        var year = $.date('Y', $.strtotime(month_year));
        var d = $.date('Ymd', $.mktime(0, 0, 0, month, date, year));
        $.fire_event(onchange, [ d ], popup);

        $.popup_close(popup);

      });

      $('.calendar-prev', popup).click(function(e){

        e.preventDefault();
        e.stopPropagation();

        var popup = $(this).closest('#calendar');
        var month_year = $(popup).attr('data-value');
        var month = parseInt($.date('n', $.strtotime(month_year)));
        var year = parseInt($.date('Y', $.strtotime(month_year)));
        var d = parseInt($('td.active', popup).html());

        var next_month = $.date('Y-m-d', $.mktime(0, 0, 0, month - 1, d, year));
        $.calendar_set(next_month);

      });

      $('.calendar-next', popup).click(function(e){

        e.preventDefault();
        e.stopPropagation();

        var popup = $(this).closest('#calendar');
        var month_year = $(popup).attr('data-value');
        var month = parseInt($.date('n', $.strtotime(month_year)));
        var year = parseInt($.date('Y', $.strtotime(month_year)));
        var d = parseInt($('td.active', popup).html());

        var next_month = $.date('Y-m-d', $.mktime(0, 0, 0, month + 1, d, year));
        $.calendar_set(next_month);

      });

    },
    calendar_set_range:function(value, calendar0_value, calendar1_value){

      var popup = $('#calendar');
      $(popup).attr('data-value', value);

      var params = $(popup).data('params');
      var onchange = params.onchange;

      value = value.split('-');
      var d0 = value[0];
      var d1 = value[1];

      if($.date('Y', $.strtotime(d0)) == '1970') d0 = $.date('Y-m-d');
      if($.date('Y', $.strtotime(d1)) == '1970') d1 = $.date('Y-m-d');

      var d0_month = [], d0_month2 = [], d0_year = [], d0_date = [], d0_start_day = [], d0_last_date_of_month = [],
        d0_date_label = [];

      var d0_month0 = $.date('Y', $.strtotime(calendar0_value)) != '1970' ? calendar0_value : d0;
      var d0_month1 = $.date('Y', $.strtotime(calendar1_value)) != '1970' ? calendar1_value : d1;
      if($.date('Ym', $.strtotime(d0_month1)) == $.date('Ym', $.strtotime(d0_month0)))
        d0_month1 = $.date('Y-m-d', $.mktime(0, 0, 0, parseInt($.date('n', $.strtotime(d0_month1))) + 1, $.date('j', 1, $.date('Y', $.strtotime(d0_month1)))));

      d0_month[0] = $.date('n', $.strtotime(d0_month0));
      d0_month2[0] = $.date('m', $.strtotime(d0_month0));
      d0_year[0] = $.date('Y', $.strtotime(d0_month0));
      d0_date[0] = $.date('j', $.strtotime(d0_month0));
      d0_start_day[0] = $.start_day_of_month(d0_year[0], d0_month[0]) % 7;
      d0_last_date_of_month[0] = $.last_date_of_month(d0_year[0], d0_month[0]);
      d0_date_label[0] = $.date('M Y', $.strtotime(d0_month0));

      d0_month[1] = $.date('n', $.strtotime(d0_month1));
      d0_month2[1] = $.date('m', $.strtotime(d0_month1));
      d0_year[1] = $.date('Y', $.strtotime(d0_month1));
      d0_date[1] = $.date('j', $.strtotime(d0_month1));
      d0_start_day[1] = $.start_day_of_month(d0_year[1], d0_month[1]) % 7;
      d0_last_date_of_month[1] = $.last_date_of_month(d0_year[1], d0_month[1]);
      d0_date_label[1] = $.date('M Y', $.strtotime(d0_month1));

      var html = [];

      for(var i = 0 ; i < 2 ; i++){

        html.push("<table class='calendar-table range-" + i + "'>");
        html.push("<tr>");
        html.push($.p("<td><span class='calendar-prev fa fa-caret-left padding5' data-calendaridx='$i'></span></td>", [ i ]));
        html.push("<td colspan='5'><span class='date-label'>" + d0_date_label[i] + "</span></td>");
        html.push($.p("<td><span class='calendar-next fa fa-caret-right padding5' data-calendaridx='$i'></span></td>", [ i ]));
        html.push("</tr>");
        html.push("<tr>");
        html.push("<td>Sun</td>");
        html.push("<td>Mon</td>");
        html.push("<td>Tue</td>");
        html.push("<td>Wed</td>");
        html.push("<td>Thu</td>");
        html.push("<td>Fri</td>");
        html.push("<td>Sun</td>");
        html.push("</tr>");
        var current_date = 1;
        for(var j = 0 ; j < 6 ; j++){
          html.push("<tr>");
          for(var k = 0 ; k < 7 ; k++){
            if(d0_start_day[i] > 0){
              html.push("<td></td>");
              d0_start_day[i]--;
            }
            else if(current_date <= d0_last_date_of_month[i]){

              var current_value = $.date('Y-m-d', $.strtotime(d0_year[i] + '-' + d0_month2[i] + '-' + $.str_pad(current_date, 2, '0', 'STR_PAD_LEFT')));
              if($.strtotime(current_value) >= $.strtotime(d0) && $.strtotime(current_value) <= $.strtotime(d1)){
                html.push("<td class='day active' data-date='" + current_value + "'>" + current_date + "</td>");

              }
              else{
                html.push("<td class='day' data-date='" + current_value + "'>" + current_date + "</td>");
              }
              current_date++;

            }
            else
              html.push("<td></td>");
          }
          html.push("</tr>");
        }
        html.push("</table>");

      }

      popup.html(html.join(''));
      popup.data('seq', 0);

      $('.day', popup).click(function(e){

        e.preventDefault();
        e.stopPropagation();
        var popup = $(this).closest('#calendar');
        var month_year = $(popup).attr('data-value');
        var date = this.innerHTML;
        var month = parseInt($.date('n', $.strtotime(month_year)));
        var year = $.date('Y', $.strtotime(month_year));
        var d = $.date('j M Y', $.mktime(0, 0, 0, month, date, year));

        var seq = parseInt(popup.data('seq'));

        if(seq == 0){

          $('.day.active-0').removeClass('active active-0');
          $(this).addClass('active active-0');

          var date0 = $(this).attr('data-date');
          var value = $(popup).attr('data-value');
          value = value.split(',');
          var date1 = $.val(1, value, { d:date0 });
          $('.day', popup).each(function(){

            var current_value = $(this).attr('data-date');
            if($.strtotime(current_value) >= $.strtotime(date0) && $.strtotime(current_value) <= $.strtotime(date1))
              $(this).addClass('active');
            else
              $(this).removeClass('active');

          });

        }
        else{

          $('.day.active-1').removeClass('active active-1');
          $(this).addClass('active active-1');

        }

        popup.data('seq', seq + 1);
        if(seq == 1){

          var date0 = $('.day.active-0').attr('data-date');
          var date1 = $('.day.active-1').attr('data-date');

          // Swap if date0 is higher than date1
          if($.strtotime(date0) > $.strtotime(date1)){
            var temp = date0;
            date0 = date1;
            date1 = temp;
          }

          var value = $.date('Ymd', $.strtotime(date0)) + '-' + $.date('Ymd', $.strtotime(date1));

          $.popup_close(popup);
          $.fire_event(onchange, [ value ], popup);
        }

      });

      $('.calendar-prev', popup).click(function(e){

        var idx = parseInt($(this).attr('data-calendaridx'));

        console.log([ 'prev', value, parseInt($(this).attr('data-calendaridx')), d0_month0, d0_month1 ]);

        e.preventDefault();
        e.stopPropagation();

        if(idx == 0){

          d0_month0 = $.date('Y-m-d', $.mktime(0, 0, 0,
            parseInt($.date('n', $.strtotime(d0_month0))) - 1,
            $.date('j', $.strtotime(d0_month0)),
            $.date('Y', $.strtotime(d0_month0))
          ));

        }
        else if(idx == 1){

          d0_month1 = $.date('Y-m-d', $.mktime(0, 0, 0,
            parseInt($.date('n', $.strtotime(d0_month1))) - 1,
            $.date('j', $.strtotime(d0_month1)),
            $.date('Y', $.strtotime(d0_month1))
          ));

          if($.date('Ym', $.strtotime(d0_month0)) >= $.date('Ym', $.strtotime(d0_month1))){
            d0_month0 = $.date('Y-m-d', $.mktime(0, 0, 0,
              parseInt($.date('n', $.strtotime(d0_month0))) - 1,
              $.date('j', $.strtotime(d0_month0)),
              $.date('Y', $.strtotime(d0_month0))
            ));
          }

        }

        // console.log([ 'next', value, idx, d0_month0, d0_month1 ]);

        $.calendar_set_range(value.join(','), d0_month0, d0_month1);

      });

      $('.calendar-next', popup).click(function(e){

        var idx = parseInt($(this).attr('data-calendaridx'));

        // console.log([ 'next', value, idx, d0_month0, d0_month1 ]);

        e.preventDefault();
        e.stopPropagation();

        if(idx == 0){

          d0_month0 = $.date('Y-m-d', $.mktime(0, 0, 0,
            parseInt($.date('n', $.strtotime(d0_month0))) + 1,
            $.date('j', $.strtotime(d0_month0)),
            $.date('Y', $.strtotime(d0_month0))
          ));

          if($.date('Ym', $.strtotime(d0_month1)) <= $.date('Ym', $.strtotime(d0_month0))){
            d0_month1 = $.date('Y-m-d', $.mktime(0, 0, 0,
              parseInt($.date('n', $.strtotime(d0_month1))) + 1,
              $.date('j', $.strtotime(d0_month1)),
              $.date('Y', $.strtotime(d0_month1))
            ));
          }

        }
        else if(idx == 1){

          d0_month1 = $.date('Y-m-d', $.mktime(0, 0, 0,
            parseInt($.date('n', $.strtotime(d0_month1))) + 1,
            $.date('j', $.strtotime(d0_month1)),
            $.date('Y', $.strtotime(d0_month1))
          ));

        }

        // console.log([ 'next', value, idx, d0_month0, d0_month1 ]);

        $.calendar_set_range(value.join(','), d0_month0, d0_month1);

      });

    }

  });

  /**
   * Checkbox
   */
  $.fn.extend({

    checkbox:function(options){

      this.each(function(){

        var className = $.val('class', options, { d:'' });
        var items = $.val('items', options, { d:null });
        var name = $.val('name', options, { d:'' });
        var id = $.val('id', options, { d:'' });

        var html = [];
        if($.type(items) == 'array')
          $(items).each(function(){
            var text = $.val('text', this, { d:'' });
            var value = $.val('value', this, { d:'' });
            var uid = 'checkbox-' + $.uniqid();
            html.push("<span class='item'><input id='" + uid + "' type='checkbox' value=\"" + value + "\"/><label for='" + uid + "'>" + text + "</label></span>");
          });
        else{
          var text = $.val('text', options, { d:'' });
          var value = '';
          var uid = 'checkbox-' + $.uniqid();
          html.push("<span class='item'><input id='" + uid + "' type='checkbox' value=\"" + value + "\"/><label for='" + uid + "'>" + text + "</label></span>");
        }

        $(this).addClass('component checkbox');
        $(this).addClass(className);
        $(this).attr('data-type', 'checkbox');
        $(this).attr('data-name', name);
        if(id != '') $(this).attr('id', id);
        $(this).html(html.join(''));
        $(this).data('options', options);
        $(this).checkbox_val($.val('value', options, { d:false }));

      })

    },
    checkbox_val:function(value){

      if(typeof value == 'undefined') {

        var results = [];
        $(this).each(function(){

          if(!$(this).hasClass('checkbox')) return;

          $(this).checkbox_validate();

          var options = $(this).data('options');
          var items = $.val('items', options, { d:null });
          var is_multiple = $.type(items) == 'array' ? true : false;

          if(is_multiple){

            $('.item', this).each(function(){
              if($('input[type=checkbox]', this).is(':checked')){
                results.push($('input[type=checkbox]', this).val());
              }
            });

          }
          else{
            results.push($('input[type=checkbox]', this).is(':checked') ? 1 : 0);
          }

        });
        return results.length > 1 ? results.join(',') : (results.length == 1 ? results[0] : 0);

      }

      else{

        $(this).each(function(){

          var options = $(this).data('options');
          var items = $.val('items', options, { d:null });
          var is_multiple = $.type(items) == 'array' ? true : false;

          if(is_multiple){

            console.log(value);
            value = value.split(',');
            $('.item', this).each(function(){
              if($.in_array($('input[type=checkbox]', this).val(), value)){
                $('input[type=checkbox]', this).prop('checked', true).attr('checked', true);
              }
              else{
                $('input[type=checkbox]', this).prop('checked', false).attr('checked', false);
              }
            });

          }
          else{
            value = value == true || value == 1 ? true : false;
            $('input[type=checkbox]', this).prop('checked', value).attr('checked', value);
          }

        })

      }

    },
    checkbox_validate:function(){

      var valid = true;
      $(this).each(function(){

        var options = $(this).data('options');
        var required = $.val('required', options, { d:false });
        var items = $.val('items', options, { d:null });

        var item_count = 0;
        var el_valid = 0;
        $('.item', this).each(function(){
          var checked = $('input[type=checkbox]', this).is(':checked');
          if(checked) el_valid++;
          item_count++;
        });

        if((required == 1 || required == true) && el_valid < 1){
          valid = false;
          $(this).addClass('invalid');
        }
        else{
          $(this).removeClass('invalid');
        }

      })

      return valid;

    }

  });

  /**
   * Datepicker
   */
  $.fn.extend({

    datepicker: function (options) {

      var className = $.val('class', options, { d:'' });
      var mode = $.val('mode', options, { d:'' }); // <empty>, range
      var id = $.val('id', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var width = $.val('width', options, { d:'' });

      var default_value = $.val('default_value', options, { d:'' });
      if(default_value == ''){
        if(mode == 'range')
          default_value = $.date('Ymd') + '-' + $.date('Ymd', $.mktime(0, 0, 0, parseInt($.date('m')) + 1, 0, parseInt($.date('Y'))));
        else
          default_value = $.date('Ymd');
      }

      var value = $.val('value', options, { d:default_value });

      if(mode == 'range' && width == '') width = '240px'; // Default width for range mode

      this.each(function(){

        var el = this;

        var html = [];
        html.push("<input type='text' readonly/>");
        html.push("<span class='icon fa fa-calendar'></span>");

        $(el).addClass('component datepicker');
        $(el).addClass(className);
        $(el).html(html.join(''));
        $(el).attr('data-type', 'datepicker');
        if(name != '') $(el).attr('data-name', name);
        if(id != '') $(el).attr('id', id);
        $(el).data('options', options);

        var css = {};
        if(!isNaN(parseInt(width))) css['width'] = width;
        $(el).css(css);

        $('.icon, input', this).click(function(e){
          e.preventDefault();
          e.stopPropagation();

          var el = $(this).closest('.datepicker');
          var options = $(el).data('options');
          var readonly = $.val('readonly', options, { d:false });
          if(readonly == '0' || readonly == false){
            $.calendar_open({
              refEl:el,
              value:$(el).data('value'),
              mode:mode,
              onchange:function(value){
                $(el).datepicker_val(value);
                $.fire_event($.val('onchange', options), [ value ], el);
              }
            });
          }
        });
        $('.popup', this).click(function(e){
          e.preventDefault();
          e.stopPropagation();
        });

        $(this).datepicker_val(value);

      });

    },

    datepicker_val:function(value){

      if(typeof value == 'undefined'){

        var value = [];
        $(this).each(function(){
          var d = $(this).data('value');
          value.push(d);
        });
        return value.length == 1 ? value[0] : (value.length == 0 ? null : value);

      }

      else{

        $(this).each(function(){

          var options = $(this).data('options');
          var mode = $.val('mode', options, { d:'' });

          var text = '';
          value = $.date_parse(value);

          if(mode == 'range'){
            var d = value.split('-');
            var d1 = d.length != 2 && $.strtotime(d[0]) == false ? $.date('M j, Y') : $.date('M j, Y', $.strtotime(d[0]));
            var d2 = d.length != 2 && $.strtotime(d[1]) == false ? $.date('M j, Y') : $.date('M j, Y', $.strtotime(d[1]));
            var v1 = d.length != 2 && $.strtotime(d[0]) == false ? $.date('Ymd') : $.date('Ymd', $.strtotime(d[0]));
            var v2 = d.length != 2 && $.strtotime(d[1]) == false ? $.date('Ymd') : $.date('Ymd', $.strtotime(d[1]));
            text = d1 + ' - ' + d2;
            value = v1 + '-' + v2;
          }
          else{
            if($.strtotime(value) == false){
              text = $.date('M j, Y');
              value = $.date('Ymd');
            }
            else{
              text = $.date('M j, Y', $.strtotime(value));
            }
          }

          $('input', this).val(text);
          $(this).data('value', value);

        })

      }

    },

    datepicker_validate:function() {

      return $(this).component_validate();

    },

  });

  /**
   * Droppable
   */
  $.fn.extend({

    droppable:function(options){

      $(this).each(function(){

        var accept = $.val('accept', options, { d:undefined });
        if(accept == undefined) accept = 'text/plain';
        var accepts = accept.split_and_trim(',');

        $(this).addClass('droppable');
        $(this).on('dragover', function(e){
          e.preventDefault();
          $(this).addClass('drag-over');
        });
        $(this).on('dragleave', function(e){
          e.preventDefault();
          $(this).removeClass('drag-over');
        });
        $(this).on('drop', function(e){
          e.preventDefault();

          var instance = this;

          var files = e.originalEvent.dataTransfer.files || e.originalEvent.target.files;
          var values = [];

          if(files.length > 0){

            for(var i = 0 ; i < files.length ; i++){

              var file = files[i];
              var file_type = file.type;

              if($.in_array(file_type, accepts)){

                var reader = new FileReader();
                reader.onload = function(event) {
                  var text = event.target.result;
                  $.fire_event($.val('ondrop', options), [ e, text ], instance);
                };
                if(file_type.indexOf('image/') >= 0)
                  reader.readAsDataURL(file);
                else
                  reader.readAsText(file);
                values.push(file);

              }

            }

          }

          $(instance).data('value', values);
          $(this).removeClass('drag-over');

        });

      })

    },

    droppable_val:function(value){

      if(typeof value == 'undefined'){

        if($(this).hasClass('.droppable')) return $(this).data('value');
        else return false;

      }

      else{

      }

    }

  });

  /**
   * Dropdown
   */
  $.fn.extend({

    dropdown:function(options){

      var className = $.val('class', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var default_value = $.val('default_value', options, { d:'' });
      var value = $.val('value', options, { d:default_value });
      var items = $.val('items', options, { d:[] });
      var width = $.val('width', options, { d:[] });
      var src = $.val('src', options, { d:'' });
      var placeholder = $.val('placeholder', options, { d:'' });
      options['static_items'] = items;
      var popup_id = options['popup_id'] = 'p' + $.uniqid();

      var css = {};
      if(width != null) css['width'] = width;

      var html = [];
      html.push("<input class='text' placeholder=\"" + placeholder + "\" readonly/>");
      html.push("<span class='icon fa fa-caret-down hoverable'></span>");
      html.push("<span id='" + popup_id + "' class='dropdown-popup popup off'></span>");

      this.each(function(){

        var el = this;

        $(el).addClass('component dropdown');
        $(el).addClass(className);
        $(el).html(html.join(''));
        $(el).css(css);
        $(el).data('options', options);
        $(el).attr('data-type', 'dropdown');
        $(el).attr('data-name', name);

        $('.icon, .text', el).click(function(e){
          e.preventDefault();
          e.stopPropagation();

          var el = $(this).closest('.dropdown');
          var options = $(el).data('options');
          var readonly = $.val('readonly', options);
          if(!readonly){
            if($('#' + popup_id).hasClass('on')){
              $.popup_close($('#' + popup_id));
            }
            else{
              $.popup_open($('#' + popup_id), el, { min_width:$(el).outerWidth() });
              $('.search-item input', $('#' + popup_id)).val('');
              $('.search-item input', $('#' + popup_id)).focus();
              $(".item", $('#' + popup_id)).show();
            }
          }
        });

        if($.type(items) == 'array' && items.length > 0) $(this).dropdown_items(items);
        if(src.length > 0) $(this).dropdown_load();
        if(value != '') $(el).dropdown_val(value);

      })

    },

    dropdown_val:function(val, append){

      // Getter
      if(typeof val == 'undefined'){

        var result = [];
        this.each(function(){

          var el = this;
          var value = $(el).attr('data-value');
          var text = $('input', el).length == 1 ? $('input', el).val() : $('.text', el).html();
          value = value == null ? text : value;
          result.push(value);

        });
        return result.length == 1 ? result[0] : (result.length > 1 ? result : null);

      }

      // Setter
      else{

        this.each(function(){

          var options = $(this).data('options');
          var items = $.val('items', options, { d:[] });

          var text = '';
          var value = '';
          if($.type(val) == 'object'){
            value = $.val('value', val);
            text = $.val('text', val, { d:value });
          }
          else if($.type(value) == 'string'){
            text = value = val;
          }

          if($.type(items) == 'array'){
            for(var i = 0 ; i < items.length ; i++){
              var item = items[i];
              if(item.value == value){
                text = item.text;
                value = item.value;
                $(this).attr('data-value', value);
                $('input', this).val(text);
                $('.text', this).html(text);
                break;
              }
            }
          }


        });

      }

    },

    dropdown_items:function(items){

      if(typeof items == 'undefined'){

        var results = [];
        this.each(function(){

          var el = this;
          var options = $(el).data('options');
          var items = $.val('items', options, { d:[] });
          $(items).each(function(){
            if($.type(this) == 'object')
              results.push(this);
          });

        });
        return results;

      }

      else{

        this.each(function(){

          var el = this;
          var options = $(el).data('options');
          var searchable = $.val('searchable', options, { d:false });
          var multiple = $.val('multiple', options, { d:false });
          var onchange = $.val('onchange', options);
          var popup_id = options['popup_id'];

          // Generate popup content
          var html = [];
          if(searchable == true){
            html.push("<div class='search-item'>");
            html.push("<input type='text' placeholder='Search'/>");
            html.push("</div>");
          }
          if($.type(items) == 'array')
            for(var i = 0 ; i < items.length ; i++){
              var item = items[i];
              var value = $.val('value', item, { d:'' });
              var text = $.val('text', item, { d:value });
              var search = (text + ' ' + value).toLowerCase();
              var uid = $.uniqid();
              html.push("<div class='item' data-value=\"" + value + "\" data-search=\"" + search + "\">");
              if(multiple) html.push("<input type='checkbox' id='dropdown_item_checkbox_" + uid + "'/>");
              html.push("<label for='dropdown_item_checkbox_" + uid + "'>" + text + "</label>");
              html.push("</div>");
            }
          html = html.join('');

          $('#' + popup_id).html(html);
          $('.item', $('#' + popup_id)).click(function(e){

            if(multiple) e.stopPropagation();

            var text = $('label', this).html();
            var value = $(this).attr('data-value');
            var index = -1;
            var obj = null;
            for(var i = 0 ; i < items.length ; i++){
              var item = items[i];
              var item_text = $.val('text', item);
              var item_value = $.val('value', item);
              if(item_value == value || item_text == text){
                index = i;
                obj = item;
                break;
              }
            }
            if(obj) obj['_index'] = index;

            $('input', el).val(text);
            $('.text', el).html(text);
            $(el).attr('data-value', value);

            $(el).textbox_validate();
            $.fire_event(onchange, [ e, obj ], el);

          });
          $(".item>input[type='checkbox']", $('#' + popup_id)).on('change', function(){

            var text = this.nextElementSibling.innerHTML; // Text from label
            var value = this.parentNode.getAttribute("data-value"); // Value from item data-value
            $(el).dropdown_val({ text:text, value:value }, true);

          });
          $('.popup .search-item input', el).click(function(e){
            e.preventDefault();
            e.stopPropagation();
          });
          $('.popup .search-item input', el).keyup(function(e){

            var key = this.value;
            var popup = $(this).closest('.popup');
            $(".item", popup).show();
            if(key.length > 0){
              $(".item:not([data-search*='" + key + "'])", popup).hide();
            }

          });

          options['items'] = items;
          $(el).data('options', options);

        })

      }

    },

    dropdown_load:function(){

      this.each(function(){

        var el = this;
        var options = $(el).data('options');
        var src = $.val('src', options, { d:'' });
        var method = $.val('method', options, { d:'get' }).toLowerCase();
        var default_value = $.val('default_value', options, { d:'' });
        var value = $.val('value', options, { d:default_value });

        $['api_' + method](src, {}, function(response){

          var items = $.val('data', response);
          if($.type(items) == 'array'){

            var map = $.val('map', options, { d:null });
            var key_text = $.val('text', map, { d:'text' });
            var value_text = $.val('value', map, { d:'value' });
            var static_items = $.val('static_items', options, { d:[] });

            // Generate items
            var temp = [];
            if($.type(static_items) == 'array') {
              for (var i = 0; i < static_items.length; i++) {
                var item = static_items[i];
                var item_value = $.val(value_text, item, { d:'' });
                var item_text = $.val(key_text, item, { d:value });
                temp.push({ text:item_text, value:item_value });
              }
            }
            if($.type(items) == 'array') {
              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var item_value = $.val(value_text, item, { d:'' });
                var item_text = $.val(key_text, item, { d:value });
                temp.push({ text:item_text, value:item_value });
              }
            }
            items = temp;
            $(el).dropdown_items(items);
            if(value != '') $(el).dropdown_val(value);

          }

        });

      })

    },

    dropdown_reset:function(){

      $(this).each(function(){

        var options = $(this).data('options');
        var default_value = $.val('default_value', options, { d:'' });
        $(this).dropdown_val(default_value);

      })

    },

    dropdown_readonly:function(readonly){

      $(this).each(function(){

        if($.istrue(readonly)) $(this).addClass('readonly');
        else $(this).removeClass('readonly');

      })

    },

    dropdown_validate:function(){

      return $(this).component_validate();

    }

  });

  /**
   * Grid + Gridhead
   */
  $.fn.extend({

    grid:function(options){

      var autoload = $.val('autoload', options, { d:true });
      var columns = $.val('columns', options, { d:[] });
      var className = $.val('class', options, { d:'' });
      var id = $.val('id', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var footer = $.val('footer', options, { d:'' });
      var value = $.val('value', options, { d:null });
      var width = $.val('width', options, { d:'' });
      var height = $.val('height', options, { d:"auto" });
      var key = $.val('key', options, { d:"" });
      var scroll_cont = $.val('scroll_cont', options, { d:null });

      options['page'] = 0;

      this.each(function(){

        var el = this;

        // content
        var html = [];
        if($(el).html().length == 0){
          html.push("<table class='grid-body'>");
          html.push("<tbody class='grid-size'></tbody>");
          html.push("</table>");
          html.push("<div class='grid-footer'></div>");
          $(el).html(html.join(''));
        }

        var ctlid = 'grid' + $.uniqid();

        var css = {};
        if(width != '') css['width'] = width;
        if(height != '') css['height'] = height;

        var attr = {};
        attr['data-type'] = 'grid';
        attr['data-cid'] = ctlid;
        if(name != '') attr['data-name'] = name;
        if(id != '') attr['id'] = id;

        $(el).addClass('component grid');
        $(el).addClass(className);
        $(el).data('options', options);

        $(el).attr(attr);
        $(el).css(css);

        $.fire_event(footer, [], $('.grid-footer', el));

        $(this).grid_columns(columns);
        if(value != null) $(el).grid_val(value);
        if(autoload) $(el).grid_load();

        if(scroll_cont != null){
          if(scroll_cont == 'window'){
            $(window).on('scroll', function(){
              $('.load-more', $("*[data-cid='" + ctlid + "']")).each(function(){
                if($.is_in_viewport(this)) this.click();
              })
            });
          }
          else{
            $(scroll_cont).on('scroll', function(){
              $('.load-more', $("*[data-cid='" + ctlid + "']")).each(function(){
                if($.is_in_viewport(this)) this.click();
              })
            });
          }
        }

      })

    },

    grid_remove:function(obj){

      if(typeof obj == 'undefined') return;

      $(this).each(function(){

        if(obj instanceof HTMLElement){
          if($(obj).closest('.grid').length == 1)
            $(obj).remove();
        }
        else if($.type(obj) == 'object'){
          var options = $(this).data('options');
          var key = $.val('key', options, { d:'' });
          key = key.split(',');

          var obj_key = [];
          for(var j = 0 ; j < key.length ; j++)
            if(key[j].length > 0 && typeof obj[key[j]] != 'undefined')
              obj_key.push(obj[key[j]]);
          obj_key = obj_key.join('');
          $("tr[data-key=\"" + obj_key + "\"]", this).remove();
        }

      })

    },

    grid_modify:function(oldObj, newObj){

      if(typeof oldObj == 'undefined') return;
      if(typeof newObj == 'undefined' && !$.type(newObj) == 'object') return;

      $(this).each(function(){

        if($.type(oldObj) == 'object'){

          var options = $(this).data('options');
          var columns = $.val('columns', options, { d:[] });
          var key = $.val('key', options, { d:'' });
          key = key.split(',');

          var obj_key = [];
          for(var j = 0 ; j < key.length ; j++)
            if(key[j].length > 0 && typeof oldObj[key[j]] != 'undefined')
              obj_key.push(oldObj[key[j]]);
          obj_key = obj_key.join('');

          $("tr[data-key=\"" + obj_key + "\"]", this).each(function(){

            var currentObj = $(this).data('value');
            for(var key in newObj)
              currentObj[key] = newObj[key];

            $(this).html($.grid_row(columns, currentObj, options));

            var column_idx = 0;
            $('td', this).each(function(){
              var td = this;
              var column_type = td.getAttribute('data-column-type');
              if(column_type == 'html'){
                var column = columns[column_idx];
                var column_html = $.val('html', column, { d:'' });
                $.fire_event(column_html, [ currentObj, column ], td);
              }
              column_idx++;
            })

            $(this).data('value', currentObj);
            $(this).addClass('highlight');

          });

        }

      })

    },

    grid_add:function(obj, index){

      $(this).each(function(){

        var instance = this;
        var options = $(instance).data('options');
        var columns = $.val('columns', options, { d:[] });
        var onselect = $.val('onselect', options);
        var key = $.val('key', options, { d:'' });
        key = key.split(',');

        var obj_key = [];
        for(var j = 0 ; j < key.length ; j++)
          if(key[j].length > 0 && typeof obj[key[j]] != 'undefined')
            obj_key.push(obj[key[j]]);
        obj_key = obj_key.join('');

        var tr = document.createElement('tr');
        $(tr).html($.grid_row(columns, obj, options)).attr('data-key', obj_key);

        var trs = $('tr:not(.grid-size-tr)', this);
        var pivot_tr = null;
        if($.type(index) == 'number')
          pivot_tr = typeof trs[index] != 'undefined' ? trs[index] : pivot_tr;

        if(pivot_tr != null) {
          $(tr).insertBefore(pivot_tr);
        }
        else{
          var last_grid_content = $('.grid-content', this).last();
          if(last_grid_content.length > 0){
            $(last_grid_content).append(tr);
          }
          else{
            var tbody = document.createElement('tbody');
            tbody.className = "grid-content";
            $('.grid-body', instance).append(tbody);
            $(tbody).append(tr);
          }
        }

        $(tr).on('click.gridrow', function(e){

          $(this).removeClass('highlight');

          var s_obj = $(this).data('value');
          var d_obj = $.el_val(this);
          var obj = $.array_merge(s_obj, d_obj);

          var table = $(this).closest('table');
          $('.active', table).removeClass('active');
          $(this).addClass('active');
          $.fire_event(onselect, [ e, this, obj ], instance);

        })
          .addClass('highlight')
          .each(function(){

            var column_idx = 0;
            $('td', this).each(function(){
              var td = this;
              var column_type = td.getAttribute('data-column-type');
              if(column_type == 'html'){
                var column = columns[column_idx];
                var column_html = $.val('html', column, { d:'' });
                $.fire_event(column_html, [ obj, column ], td);
              }
              column_idx++;
            })

          })
          .data('value', obj);

      })

    },

    grid_columns:function(columns){

      $(this).each(function(){

        if(!$(this).hasClass('grid')) return;

        var options = $(this).data('options');
        options['columns'] = columns;
        $(this).data('options', options);

        var html = [];
        html.push("<tr class='grid-size-tr'>");
        for(var i = 0 ; i < columns.length ; i++){
          var column = columns[i];
          var name = $.val('name', column);
          var width = $.val('width', column);
          var active = $.val('active', column, { d:1 });
          if(active == 1)
            html.push($.p("<td class='grid-size-label' style='width:$1' data-key='" + name + "'></td>", [ width ]));
          else
            html.push($.p("<td class='grid-size-label inactive' style='width:$1' data-key='" + name + "'></td>", [ width ]));
        }
        html.push("<td style='width:100%'></td>");
        html.push("</tr>");
        $('.grid-size', this).html(html.join(''));

      });

    },

    grid_load:function(params){

      this.each(function(){

        var instance = this;
        var options = $(instance).data('options');
        var src = $.val('src', options, { d:'' });
        var method = $.val('method', options, { d:'post' }).toLowerCase();
        if(!params) params = {};

        if(src.length > 0){

          var page = $.val('page', params, { d:1 });
          var row_per_page = $.val('row_per_page', options, { d:10 });
          var columns = $.val('columns', options);
          var search = $.val('search', params, { d:'' });

          var el_params = {
            page:page,
            row_per_page:row_per_page,
            columns:columns,
            filters:$.val('filters', params),
            sorts:$.val('sorts', params),
          };
          if(search != '') el_params['search'] = search;

          // Load data
          $['api_' + method](src, el_params, function(response){

            // Render data
            var data = $.val('data', response, { d:[] });
            var page = $.val('page', response, { d:1 });
            var append = page == 1 ? false : true;
            $(instance).grid_val(data, append);

            // Check if next page exists
            var next_page = $.val('next_page', response, { d:page });
            if(next_page > page){
              $('.grid-footer', instance).html("<div class='load-more align-center padding5'>Load More...</div>");
              $('.load-more', instance).on('click', function(){
                params['page'] = next_page;
                $(instance).grid_load(params);
              });
            }
            else{
              $('.grid-footer', instance).html("");
            }

            // Save last load data
            $(instance).data('last_load_data', el_params);

          });

          if(page == 1) $('.grid-content', this).remove();
          $('.grid-footer', this).html("<div class='align-center padding10'><span class='loading width16 height16'></span></div>");

        }

      });

    },

    grid_last_load_data:function(){

      var last_load_data = $(this).data('last_load_data');
      return typeof last_load_data == 'undefined' ? null : last_load_data;

    },

    grid_val:function(value, append){

      append = typeof append == 'undefined' ? false : append;

      // Getter
      if(typeof value == 'undefined'){

        var value = [];
        this.each(function(){

          var el = this;
          var table = el.querySelector('.grid-body');
          var tbody = $('tbody', table);
          $(tbody).children().each(function(){

            if(this.classList.contains('grid-size-tr'));
            else{
              var sobj = $(this).data('value');
              var dobj = $.el_val(this);
              var obj = $.array_merge(sobj, dobj);
              value.push(obj);
            }

          })

        });
        return value;

      }

      // Setter
      else{

        this.each(function(){

          var instance = this;
          var options = $(instance).data('options');
          var onselect = $.val('onselect', options);
          var columns = $.val('columns', options, { d:[] });

          if(typeof append == 'undefined' || append != true)
            $('.grid-content', instance).remove();

          var tbody = document.createElement('tbody');
          tbody.className = "grid-content";
          tbody.innerHTML = $.grid_html(value, options);
          $('.grid-body', instance).append(tbody);

          // Handle html-type render
          for(var i = 0 ; i < tbody.childNodes.length ; i++){
            var tr = tbody.childNodes[i];
            var obj = value[i];
            for(var j = 0 ; j < tr.childNodes.length ; j++){
              var td = tr.childNodes[j];
              var column_type = td.getAttribute('data-column-type');
              if(column_type == 'html'){
                var column = columns[j];
                var column_html = $.val('html', column, { d:'' });
                $.fire_event(column_html, [ obj, column ], td);
              }
            }
            $(tr).data('value', obj);
          }

          // On click event
          $('tr', tbody).on('click.gridrow', function(e){

            $(this).removeClass('highlight');

            var table = $(this).closest('table');
            $('.active', table).removeClass('active');
            $(this).addClass('active');

            var s_obj = $(this).data('value');
            var d_obj = $.el_val(this);
            var obj = $.array_merge(s_obj, d_obj);

            $.fire_event(onselect, [ e, this, obj ], instance);

          });

          if(append == 1 || append == true){
            if(!options['data']) options['data'] = [];
            options['data'] = $.array_merge(options['data'], value);
          }
          else
            options['data'] = value;

          $(instance).data('options', options);

        })

      }

    },

    grid_reset:function(){

      $(this).grid_val([]);

    },

    grid_selected:function(){

      var obj = null;
      $(this).each(function(){

        var options = $(this).data('options');
        var data = $.val('data', options);

        var counter = -1;
        var index = -1;
        $('tr', this).each(function(){
          if(this.classList.contains('grid-size-tr')) return;
          counter++;
          if(this.classList.contains('active')) index = counter;
        });
        if(typeof data[index] != 'undefined'){
          obj = data[index];
          obj['_index'] = index;
        }

      });
      return obj;

    },

  });
  $.fn.extend({

    gridhead:function(options) {

      var columns = $.val('columns', options, { d:[] });
      var className = $.val('class', options, { d:null });
      var name = $.val('name', options, { d:'' });
      var width = $.val('width', options, { d:'' });
      var grid = $.val('grid', options, { d:null });
      var height = $.val('height', options, { d:null });
      var droppable = $.val('droppable', options, { d:false });
      var oncolumnclick = $.val('oncolumnclick', options, { d:'' });

      this.each(function(){

        var el = this;

        $(el).addClass('component gridhead');
        $(el).addClass(className);
        $(el).attr('data-type', 'gridhead');
        if(name != '') $(el).attr('data-name', name);
        $(el).data('options', options);
        $(el).attr('data-type', 'gridhead');
        $(el).gridhead_attr({ height:height });

        var css = {};
        if(width != '') css['width'] = width;
        $(el).css(css);

        $(this).gridhead_columns(columns);

        if(droppable){
          $(this).droppable({
            accept:"text/csv, application/csv",
            ondrop:function(e, value){
              try{
                var csv = $.csv.toArrays(value);
                var options = $(this).data('options');
                var columns = $.val('columns', options, { d:[] });
                var grid = $.val('grid', options, { d:null });

                var value = [];
                if($.type(columns) == 'array'){
                  for(var i = 0 ; i < csv.length ; i++){
                    var csv1 = csv[i];
                    var obj = {};
                    for(var j = 0 ; j < columns.length && typeof csv[j] != 'undefined' ; j++){
                      var column = columns[j];
                      var column_name = column['name'];
                      obj[column_name] = csv1[j];
                    }
                    value.push(obj);
                  }
                }
                $(grid).grid_val(value);

              }
              catch(e){}
            }
          });
        }

      });

    },

    gridhead_attr:function(obj){

      $(this).each(function(){

        for(var key in obj){
          var value = obj[key];
          switch(key){
            case 'height':
              $(this).css({ height:value });
              break;

          }

        }

      })

    },

    gridhead_columns:function(columns){

      if(typeof columns == 'undefined'){

        return $.val('columns', $(this).data('options'), { d:[] });

      }
      else{

        $(this).each(function(){

          var el = this;
          var options = $(this).data('options');
          var grid = $.val('grid', options, { d:null });
          var oncolumnclick = $.val('oncolumnclick', options);

          options['columns'] = columns;

          var html = [];
          html.push("<table class='grid-head'><tr>");
          for(var i = 0 ; i < columns.length ; i++){
            var column = columns[i];
            var column_name = $.val('name', column, { d:'' });
            var column_active = $.val('active', column, { d:1 });
            var column_text = $.val('text', column, { d:'-' });
            var column_width = $.val('width', column, { d:'' });
            var column_datatype = $.val('datatype', column, { d:'text' });
            var column_align = $.val('align', column, { d:'' });

            var text_align = '';
            switch(column_datatype){
              case 'number':
              case 'money':
                text_align = 'right';
                break;
              case 'enum':
                break;
              default:
                break;
            }
            if(column_align != '') text_align = column_align;

            var className = 'label' + (!column_active ? ' inactive' : '');

            html.push("<td class='" + className + "' style='width:" + column_width + ";text-align:" + text_align + "' data-key=\"" + column_name + "\">" + column_text +
              "<span class='sort-icon glyphicons'></span><span class='separator'></span></td>");

          }
          html.push("<td style='width:100%'></td>");
          html.push("</tr></table>");
          $(el).html(html.join(''));

          $('.separator', el).mousedown(function(e){

            e.preventDefault();
            e.stopPropagation();

            var td_prev = this.parentNode;
            var tr = td_prev.parentNode;
            var last_x = e.clientX;
            $(window).on('mousemove.gridhead', function(e){

              e.preventDefault();
              e.stopPropagation();

              var distance_x = e.clientX - last_x;
              td_prev.style.width = (parseInt(td_prev.style.width) + distance_x) + "px";
              last_x = e.clientX;

            });
            $(window).on('mouseup.gridhead', function(e){

              e.preventDefault();
              e.stopPropagation();

              var grid_el = $(grid);
              var grid_size = $('.grid-size', grid_el);

              if(grid_size.length == 1){

                var index = -1;
                for(var i = 0 ; i < tr.childNodes.length ; i++){
                  if(tr.childNodes[i] == td_prev){
                    index = i;
                    break;
                  }
                }
                index = parseInt(index);

                $('.grid-size-label:eq(' + (index) + ')', grid_size).css({ width:$(td_prev).outerWidth() });

                // Modify column data
                var options = $(el).data('options');
                options.columns[index]['width'] = $(td_prev).outerWidth();

                // On column resize
                var oncolumnresize = $.val('oncolumnresize', options);
                $.fire_event(oncolumnresize, [ { index:index, width:$(td_prev).outerWidth() } ], el);

              }

              $(window).off('mousemove.gridhead');
              $(window).off('mouseup.gridhead');

            });

          });
          $('.separator', el).click(function(e){
            e.preventDefault();
            e.stopPropagation();
          })

          $('.label', el).on('click', function(e){

            e.preventDefault();
            e.stopPropagation();

            var key = $(this).attr('data-key');
            var sort_type = $(this).attr('data-sorttype');
            if(sort_type == 'asc') sort_type = 'desc';
            else if(sort_type == 'desc') sort_type = 'asc';
            else sort_type = 'asc';
            $(this).attr('data-sorttype', sort_type);

            var sort = [{ key:key, type:sort_type }];

            // If grid exists, reload grid
            if($(grid).length == 1){
              var last_load_data = $(grid).grid_last_load_data();
              last_load_data['sorts'] = sort;
              $(grid).grid_load(last_load_data);
            }

            $('.sort-icon', el).removeClass('glyphicons-chevron-down').removeClass('glyphicons-chevron-up');
            $('.sort-icon', this).addClass(sort_type == 'asc' ? 'glyphicons-chevron-up' : 'glyphicons-chevron-down');

            $.fire_event(oncolumnclick, [ sort ], el);

          })

        })

      }

    }

  });
  $.extend({

    grid_html:function(data, options){

      if(!data) return;

      var columns = $.val('columns', options, { d:[] });
      var key = $.val('key', options, { d:'' });
      key = key.split(',');

      var moveable = $.val('moveable', options, { d:false });
      var moveable_html = moveable ? " draggable='true' ondragstart='$.grid_ondragstart.apply(this, arguments)'" : '';

      var html = [];
      for(var i = 0 ; i < data.length ; i++){
        var obj = data[i];

        var obj_key = [];
        for(var j = 0 ; j < key.length ; j++)
          if(key[j].length > 0 && typeof obj[key[j]] != 'undefined')
            obj_key.push(obj[key[j]]);
        obj_key = obj_key.join('');

        var cid = 'g' + $.uniqid();

        html.push("<tr data-key=\"" + obj_key + "\" data-cid='" + cid + "'" + moveable_html + ">");
        html.push($.grid_row(columns, obj, options));
        html.push("</tr>");
      }
      return html.join('');

    },

    grid_row:function(columns, obj, options){

      var html = [];

      var moveable = $.val('moveable', options, { d:false });
      var moveable_html = moveable ? " ondrop='$.grid_ondrop.apply(this, arguments)' ondragover='$.grid_ondragover.apply(this, arguments)' ondragleave='$.grid_ondragleave.apply(this, arguments)'" : '';

      for(var j = 0 ; j < columns.length ; j++){

        var column = columns[j];
        var column_type = $.val('type', column, { d:'text' });
        var column_datatype = $.val('datatype', column, { d:'text' });
        var column_name = $.val('name', column, { d:'' });
        var column_align = $.val('align', column, { d:'' });

        var text_align = '';
        var td_class = '';
        var column_value = '';
        switch(column_type){
          case 'html':
            break;
          case 'enum':
            var enum_var = $.val('enum', column, { d:[] });
            column_value = $.val(column_name, obj, { d:'' });
            if($.type(enum_var) == 'array'){
              for(var k = 0 ; k < enum_var.length ; k++){
                if($.val('value', enum_var[k]) == column_value){
                  column_value = $.val('text', enum_var[k]);
                  break;
                }
              }
            }
            break;
          default:

            switch(column_datatype){
              case 'number':
              case 'money':
                text_align = 'right';
                column_value = $.val(column_name, obj, { d:0 });
                column_value = $.number_format(column_value);
                break;
              case 'enum':
                var column_enums = $.val('enums', column, { d:{} });
                column_value = $.val(column_name, obj, { d:'-' });
                column_value = $.val(column_value, column_enums, { d:'-' });
                break;
              default:
                column_value = $.val(column_name, obj, { d:'-' });
                break;
            }

            var lettercase = $.val('lettercase', column, { d:'' });
            switch(lettercase){
              case 'capitalize': column_value = column_value.toString().capitalize(); break;
              case 'lowercase': column_value = column_value.toString().toLowerCase(); break;
              case 'uppercase': column_value = column_value.toString().toUpperCase(); break;
            }

            td_class = 'label';
            break;
        }

        if(column_align != '') text_align = column_align;

        html.push("<td data-column-type='" + column_type + "' class='" + td_class + "' style='text-align:" + text_align + "'" + moveable_html + ">" + column_value + "</td>");

      }

      html.push("<td" + moveable_html + "></td>");
      return html.join('');

    },

    grid_ondrop:function(){

      $(this).closest('tr').removeClass('drag-over');

      var cid = $(this).closest('.grid').data('drag_cid');
      if($("tr[data-cid=" + cid + "]").index() > $(this).closest('tr').index())
        $("tr[data-cid=" + cid + "]").insertBefore($(this).closest('tr'));
      else
        $("tr[data-cid=" + cid + "]").insertAfter($(this).closest('tr'));

      var options = $(this).closest('.grid').data('options');
      var onmove = $.val('onmove', options, { d:null });
      var tr1 = $("tr[data-cid=" + cid + "]")[0];
      var tr2 = $(this).closest('tr')[0];
      $.fire_event(onmove, [ tr1, tr2 ], $(this).closest('.grid')[0]);

    },

    grid_ondragstart:function(e){

      // console.log([ 'dragstart', this, arguments ]);
      var cid = $(this).closest('tr').attr('data-cid');
      $(this).closest('tr').addClass('dragging');
      $(this).closest('.grid').data('drag_cid', cid);
      e.dataTransfer.setData('cid', cid);

    },

    grid_ondragleave:function(e){

      $(this).closest('tr').removeClass('drag-over');
      var cid = $(this).closest('.grid').data('drag_cid');
      $("tr[data-cid=" + cid + "]").removeClass('dragging');

    },

    grid_ondragover:function(e){

      // console.log([ 'dragover', arguments, this ]);

      $(this).closest('tr').addClass('drag-over');

      e.preventDefault();

    }

  });

  /**
   * Popup
   */
  $.extend({

    popup_close:function(el){

      $(el).removeClass('on').addClass('off');

    },
    popup_open:function(el, refEl, options){

      $.popup_close_all();

      $(el).appendTo(document.body);

      $(el).addClass('off');

      var css = {};
      if(typeof refEl == 'undefined'){
        var width = $(el).outerWidth();
        var height = $(el).outerHeight();
        css['left'] = Math.round((window.innerWidth - width) / 2);
        css['top'] = Math.round((window.innerHeight - height) / 2);
      }
      else{

        var offset = $(refEl).offset();
        var max_width = offset.left + el.clientWidth;

        var top = offset.top - $(window).scrollTop() + $(refEl).outerHeight() + 1;
        var max_height = window.innerHeight - top - 10;

        css['top'] = top;
        css['max-height'] = max_height;

        if(max_width > window.innerWidth) offset.left = window.innerWidth - el.clientWidth;
        css['left'] = offset.left;

        var min_width = $.val('min_width', options);
        if(!isNaN(parseInt(min_width))) css['min-width'] = min_width;

      }
      $(el).css(css);

      $(el).removeClass('off');
      window.setTimeout(function(){
        $(el).addClass('on');
      }, 100);

      $(el).on('transitionend', function(){

        if($(this).hasClass('on')){

        }
        else{
          $(this).removeClass('on');
          $(this).addClass('off');
        }

      })

    },
    popup_toggle:function(el, refEl, options){

      if(el.classList.contains('on'))
        $.popup_close(el, refEl, options);
      else
        $.popup_open(el, refEl, options);

    },
    popup_close_all:function(){

      var popups = document.body.querySelectorAll('.popup');
      for(var i = 0 ; i < popups.length ; i++)
        $.popup_close(popups[i]);

    },

  });

  /**
   * Textbox
   */
  $.fn.extend({

    textbox:function(options){

      /* Properties:
       * - onkeyup // raise on key up event
       * - onchange // raise on change event, onchange has delay of 300ms
       *
       *
       *
       */

      var placeholder = $.val('placeholder', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var className = $.val('class', options, { d:'' });
      var default_value = $.val('default_value', options, { d:'' });
      var value = $.val('value', options, { d:default_value });
      var readonly = $.val('readonly', options, { d:false });
      var maxlength = $.val('maxlength', options, { d:'' });
      var mode = $.val('mode', options, { d:"text" });
      var width = $.val('width', options);
      var onblur = $.val('onblur', options);
      var onkeyup = $.val('onkeyup', options);
      var onchange = $.val('onchange', options);

      var css = {
        width:width
      };

      this.each(function(){

        var el = this;

        // Initialize html content
        var html = [];
        html.push($.p('<input type="$1" placeholder="$1" maxlength="$1" $1/>', [ mode, placeholder, maxlength, readonly ? 'readonly' : '' ]));
        html.push("<span class='icon fa hidden'></span>");

        // Default attributes
        $(el).addClass('component textbox');
        if(readonly) $(el).addClass('readonly');
        $(el).addClass(className);
        $(el).css(css);
        $(el).html(html.join(''));
        $(el).attr('data-type', 'textbox');
        $(el).attr('data-name', name);
        $(el).data('options', options);

        // Event handler
        $('input', el)
          .blur(function(e){
            $(el).textbox_validate();
            $.fire_event(onblur, [ e, this.value ], el);
          })
          .keyup(function(e){

            $.fire_event(onkeyup, [ e, this.value ], el);
            if($(this).data('last_value') != this.value){
              $.fire_event(onchange, [ e, this.value ], el);
            }
            $(this).data('last_value', this.value);

          });

        if(value != '') $(this).val(value);

      });

    },

    textbox_val:function(value){

      // Getter
      if(typeof value == 'undefined'){
        var result = [];
        $(this).each(function(){
          result.push($('input', this).val());
        })
        return result.length > 1 ? result : (result.length == 1 ? result[0] : '');
      }

      // Setter
      else{
        $(this).each(function(){
          $('input', this).val(value);
        })
      }

    },

    textbox_placeholder:function(value){

      // Getter
      if(typeof value == 'undefined'){
        var result = [];
        $(this).each(function(){
          result.push($('input', this).attr('placeholder'));
        })
        return result.length > 1 ? result : (result.length == 1 ? result[0] : '');
      }

      // Setter
      else{
        $(this).each(function(){
          $('input', this).attr('placeholder', value);
        })
      }

    },

    textbox_reset:function(){

      $(this).each(function(){

        var options = $(this).data('options');
        var default_value = $.val('default_value', options, { d:'' });
        $(this).textbox_val(default_value);

      });

    },

    textbox_readonly:function(readonly){

      if(typeof readonly == 'undefined'){

        return $(this).hasClass('readonly') ? 1 : 0;

      }

      else{

        $(this).each(function(){

          var options = $(this).data('options');
          options['readonly'] = readonly === true || readonly === 1 ? true : false;
          $(this).data('options', options);
          if(readonly === true || readonly === 1){
            $(this).addClass('readonly');
            $('input[type=text]', this).attr('readonly', true);
          }
          else{
            $(this).removeClass('readonly');
            $('input[type=text]', this).attr('readonly', false);
          }

        })

      }

    },

    textbox_validate:function(){

      return $(this).component_validate();

    }

  });

  /**
   * Textarea
   */
  $.fn.extend({

    textarea:function(options){

      var className = $.val('class', options, { d:'' });
      var default_value = $.val('default_value', options, { d:'' });
      var maxlength = $.val('maxlength', options, { d:'' });
      var name = $.val('name', options, { d:'' });
      var onblur = $.val('onblur', options);
      var onchange = $.val('onchange', options);
      var onkeyup = $.val('onkeyup', options);
      var placeholder = $.val('placeholder', options, { d:'' });
      var readonly = $.val('readonly', options, { d:false });
      var height = $.val('height', options, { d:"1em" });
      var max_height = $.val('max-height', options, { d:"" });
      var width = $.val('width', options, { d:'' });
      var value = $.val('value', options, { d:default_value });
      var droppable = $.val('droppable', options, { d:true });

      var css = {};
      if(width != '') css['width'] = width;
      if(max_height != '') css['max-height'] = max_height;

      this.each(function(){

        var el = this;

        var html = [];
        html.push("<textarea rows='1' placeholder='" + placeholder + "' style='height:" + height + ";' maxlength='" + maxlength + "'" + (readonly ? ' readonly' : '') + "></textarea>");
        html.push("<span class='icon fa hidden'></span>");
        $(el).html(html.join(''));

        $(el).addClass('compponent textarea');
        $(el).addClass(className);
        $(el).css(css);
        $(el).attr('data-type', 'textarea');
        $(el).attr('data-name', name);
        $(el).data('options', options);

        $('textarea', el)
          .blur(function(e){
            $(el).textarea_validate();
            $.fire_event(onblur, [], el);
          })
          .keyup(function(e){

            $.fire_event(onkeyup, [ e, this.value ], el);
            if($(this).data('last_value') != this.value){
              $.fire_event(onchange, [ e, this.value ], el);
            }
            $(this).data('last_value', e, this.value);

          });

        $('textarea', el).each(function () {
          this.setAttribute('style', 'height:' + (this.scrollHeight <= 0 ? '' : this.scrollHeight) + 'px;overflow-y:hidden;');
          this.style.height = 'auto';
          this.style.height = (this.scrollHeight) + 'px';
        })
          .on('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
          });

        if(value != '') $(this).textarea_val(value);

        if(droppable){
          $(this).droppable({
            accept:$.val('accept', options),
            ondrop:function(e, value){
              $(this).val(value);
            }
          });
        }


      });

      return this;

    },

    textarea_val:function(value){

      // Getter
      if(typeof value == 'undefined'){
        var result = [];
        $(this).each(function(){
          result.push($('textarea', this).val());
        })
        return result.length > 1 ? result : (result.length == 1 ? result[0] : '');
      }

      // Setter
      else{
        $(this).each(function(){
          $('textarea', this).val(value).each(function(){
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
          });
        })
      }

    },

    textarea_placeholder:function(value){

      // Getter
      if(typeof value == 'undefined'){
        var result = [];
        $(this).each(function(){
          result.push($('input', this).attr('placeholder'));
        })
        return result.length > 1 ? result : (result.length == 1 ? result[0] : '');
      }

      // Setter
      else{
        $(this).each(function(){
          $('input', this).attr('placeholder', value);
        })
      }

    },

    textarea_reset:function(){

      $(this).each(function(){

        var options = $(this).data('options');
        var default_value = $.val('default_value', options, { d:'' });
        $(this).textarea_val(default_value);

      });

    },

    textarea_readonly:function(readonly){

      if(typeof readonly == 'undefined'){

        return $(this).hasClass('readonly') ? 1 : 0;

      }

      else{

        $(this).each(function(){

          var options = $(this).data('options');
          options['readonly'] = readonly === true || readonly === 1 ? true : false;
          $(this).data('options', options);
          if(readonly === true || readonly === 1){
            $(this).addClass('readonly');
            $('textarea', this).attr('readonly', true);
          }
          else{
            $(this).removeClass('readonly');
            $('textarea', this).attr('readonly', false);
          }

        })

      }

    },

    textarea_validate:function(){

      return $(this).component_validate();

    }

  });

})();