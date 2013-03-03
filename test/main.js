define([
    'src/i18n'
], function(i18n) {    
    module('i18n', {
        teardown: function() {
            i18n.l.defaults = {};            
            i18n.t.translations = {};            
        }
    });
    
    test('l', function() {
        equal(i18n.l('currency', 1000), '$1,000.00', 'Default currency formatting');
        i18n.l.defaults = { delimiter: '.', separator: ',', unit: '¢' };
        equal(i18n.l('currency', 1000), '¢1.000,00', 'Extending l10n currency formatting');
        
        i18n.l.defaults = {};
        equal(i18n.l('percentage', 1000), '1000%', 'Default percentage formatting');
        
        i18n.l.defaults = {};
        equal(i18n.l('number', 1000), '1,000', 'Default number formatting');
        i18n.l.defaults = { delimiter: '.' };
        equal(i18n.l('number', 1000), '1.000', 'Extending l10n number formatting');
    });

    test('l.toCurrency', function() {        
        equal(i18n.l.toCurrency(1000, { delimiter: '', format: '#,##0.00', precision: 0 }), '1000', 'Overriding currency defaults with options');
    });

    test('l.toNumber', function() {        
        equal(i18n.l.toNumber(1000, { delimiter: '', precision: 0 }), '1000', 'Overriding number defaults with options');
    });

    test('l.toPercentage', function() {        
        equal(i18n.l.toPercentage(1000, { delimiter: ',', precision: 1 }), '1,000.0%', 'Overriding percentage defaults with options');
    });

    test('t', function() {
        _.extend(i18n.t.translations, { 
            test1: 'test',
            test2: '{0}, {1}, {2}',
            test3: '{0}, {0}, {0}'      
        });
        equal(i18n.t('test1'), 'test', 'Extending i18n');
        equal(i18n.t('test2', 'a', 'b', 'c'), 'a, b, c', 'Parameter substitution');
        equal(i18n.t('test3', 'a', 'b', 'c'), 'a, a, a', 'Duplicate parameter substitution');
        ok(_.isString(i18n.t('test4')), 'Missing value for key still returns a string');        
    });
});