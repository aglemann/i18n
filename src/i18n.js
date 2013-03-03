define([
    'underscore'
], 
function(_) {
    
    // Inspired by [i18n-js](https://github.com/fnando/i18n-js).
    // Tuned to be used with Java's [NumberFormat](http://docs.oracle.com/javase/6/docs/api/java/text/NumberFormat.html).
    var i18n = {
        
        // l(ocalise)
        // -------------
        //  `i18n.l()` for localized values, for example: `i18n.l('currency', 100)`
        // which would return "$100.00". Or use the helpers directly
        // for more granular control: `i18n.l.toCurrency(100, { separator: ',', unit: '¢' })`
        // which would return "¢100,00" (puravida!).
        l: function(scope, value) {
            switch (scope) {
                case 'currency':
                    return i18n.l.toCurrency(value);
                case 'percentage':
                    return i18n.l.toPercentage(value);
                default:
                    return i18n.l.toNumber(value);
            }
        },
        
        // t(ranslate)
        // -------------
        // `i18n.t()` for translated strings. Accepts a string `key`
        // and optional parameters for substitution using the `{n}` pattern.
        // For example, if the json has a key/value of `get.out: 'get your {0} out of my {1}'`
        // a usage could be `i18n.t('get.out', 'nose', 'business')` which would return
        // 'get your nose out of my business'.
        t: function(key) {
            var args = [].slice.call(arguments, 1),
                str = i18n.t.translations[key] || '';
            return str.replace(/\{(\d+)\}/g, function(match, i) {
                return args[i] || '';
            });
        }        
    };
    
    _.extend(i18n.l, {
        defaults: {},
        toCurrency: function(number, options) {
            options = options || {};
            _.defaults(
                options, 
                _.pick(i18n.l.defaults, 'precision', 'unit'),
                { format: '\xA4#,##0.00', precision: 2, unit: '$' }
            );
            number = i18n.l.toNumber(number, options);
            number = options.format.replace(/[^\xA4]+/, number).replace(/\xA4+/, options.unit);
            return number;
        },
        toNumber: function(number, options) {
            var isNegative, parts, format, groupingSize, groupingRE;
            options = options || {};
            _.defaults(
                options, 
                _.pick(i18n.l.defaults, 'delimiter', 'separator'),
                { delimiter: ',', format: '\xA4#,##0.00', precision: 0, separator: '.' }
            );
            isNegative = number < 0;
            parts = Math.abs(number).toFixed(options.precision).split('.');
            format = options.format.split(';');
            format = isNegative ? format[1] || format[0] : format[0];
            groupingSize = /,([^.]+)\./.test(format) ? RegExp.$1.length : 0;
            groupingRE = new RegExp('\\B(?=(\\d{' + groupingSize + '})+(?!\\d))', 'g');
            number = parts[0].replace(groupingRE, options.delimiter);
            if (options.precision > 0) {
                number += options.separator + parts[1];
            }
            if (isNegative) {
                number = '-' + number;
            }
            return number;
        },
        toPercentage: function(number, options) {
            options = options || {};
            _.defaults(
                options,
                { delimiter: '', format: '#,##0.0%' }
            );
            number = i18n.l.toNumber(number, options);
            number = options.format.replace(/[^%]+/, number);
            return number;
        }
    });
    
    _.extend(i18n.t, { 
        translations: {} 
    });
    
    return i18n;
});