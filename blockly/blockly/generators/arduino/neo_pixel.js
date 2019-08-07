'use strict';

goog.provide('Blockly.Arduino.neo_pixel');

goog.require('Blockly.Arduino');


Blockly.Arduino['neo_pixel_setup'] = function (block) {

    var numberOfLeds = block.getFieldValue('NUMBER_LEDS');
    var pin = block.getFieldValue('PIN');

    Blockly.Arduino.libraries_['define_neo_pixel'] =
        '#include <Adafruit_NeoPixel.h>;\n' +
        '#ifdef __AVR__ \n' +  '' +
        '\t#include <avr/power.h>; \n' +
        '#endif\n';
    Blockly.Arduino.libraries_['neo_pixel_setup'] = "Adafruit_NeoPixel pixels = Adafruit_NeoPixel("
        + numberOfLeds + ", " +  pin + ", NEO_GRB + NEO_KHZ800);\n\n";

    Blockly.Arduino.setupCode_['neo_pixel'] = '\tpixels.begin();\n';

    return '';
};

Blockly.Arduino['neo_pixel_set_color'] = function(block) {
    Blockly.Arduino.functionNames_['set_color'] = '\n\nvoid setNeoPixelColor(double pos, RGB color) {\n' +
        '\tpos = pos <= 0 ? 0 : pos;\n' +
        '\tpos = pos >= 1 ? pos - 1 : pos;\n' +
        '\tpixels.setPixelColor((int)pos, color.red, color.green, color.blue);\n' +
        '\tpixels.show();\n' +
    '}\n';

    var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_ATOMIC);

    var position = Blockly.Arduino.valueToCode(block, 'POSITION', Blockly.Arduino.ORDER_ATOMIC);

    return '\tsetNeoPixelColor(' + position + ',' + color + ');\n';
};
