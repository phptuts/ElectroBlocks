"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const logic_1 = require("./logic");
const blockHelper = require("../frame/blockly_helper");
const arduino_frame_1 = require("../arduino/arduino_frame");
describe('logic', () => {
    let block;
    let blockSpy;
    let getInputValueSpy;
    let generateFrameForInputStatementSpy;
    beforeEach(() => {
        block = {
            id: 'block_id',
            getFieldValue(fieldName) {
            }
        };
        blockSpy = spyOn(block, 'getFieldValue');
        getInputValueSpy = spyOn(blockHelper, 'getInputValue');
        generateFrameForInputStatementSpy = spyOn(blockHelper, 'generateFrameForInputStatement');
    });
    describe('logic_boolean_block', () => {
        it('should return true it\'s set to TRUE', () => {
            blockSpy.withArgs('BOOL').and.returnValue('TRUE');
            expect(logic_1.logic_boolean_block(block)).toBeTruthy();
        });
        it('should return false it\'s set to FALSE', () => {
            blockSpy.withArgs('BOOL').and.returnValue('FALSE');
            expect(logic_1.logic_boolean_block(block)).toBeFalsy();
        });
    });
    describe('logic_compare_block', () => {
        it('should return true for EQ if both sides are the same', () => {
            blockSpy.withArgs('OP').and.returnValue('EQ');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(3);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(3);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
        it('should return false for EQ if both sides are not the same', () => {
            blockSpy.withArgs('OP').and.returnValue('EQ');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(3);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(4);
            expect(logic_1.logic_compare_block(block)).toBeFalsy();
        });
        it('should return true if both sides are not equal and using NEQ operator', () => {
            blockSpy.withArgs('OP').and.returnValue('NEQ');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(3);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(4);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
        it('should return true if side A is less than side B using LT', () => {
            blockSpy.withArgs('OP').and.returnValue('LT');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(3);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(4);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
        it('should return true if side A and side B are equal using LTE', () => {
            blockSpy.withArgs('OP').and.returnValue('LTE');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(4);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(4);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
        it('should return true if side A is greater than side B using GT', () => {
            blockSpy.withArgs('OP').and.returnValue('GT');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(4);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(2);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
        it('should return true if side A is greater than side B using GTE', () => {
            blockSpy.withArgs('OP').and.returnValue('GTE');
            getInputValueSpy.withArgs(block, 'A', true, undefined).and.returnValue(4);
            getInputValueSpy.withArgs(block, 'B', false, undefined).and.returnValue(2);
            expect(logic_1.logic_compare_block(block)).toBeTruthy();
        });
    });
    describe('control_if_block', () => {
        it('should generate frames that are inside do statement if the if blocks are true', () => {
            getInputValueSpy.withArgs(block, 'IF0', true, undefined)
                .and.returnValue(true);
            generateFrameForInputStatementSpy.withArgs(block, 'DO0', jasmine.any(arduino_frame_1.ArduinoFrame)).and.returnValue([arduino_frame_1.ArduinoFrame.makeEmptyFrame('block1'), arduino_frame_1.ArduinoFrame.makeEmptyFrame('block2')]);
            const frames = logic_1.control_if_block(block);
            expect(frames.length).toBe(3);
            expect(frames[0].blockId).toBe('block_id');
            expect(frames[1].blockId).toBe('block1');
            expect(frames[2].blockId).toBe('block2');
        });
        it('should return with on frame if if blocks are false', () => {
            getInputValueSpy.withArgs(block, 'IF0', true, undefined)
                .and.returnValue(false);
            expect(generateFrameForInputStatementSpy).not.toHaveBeenCalledWith();
            const frames = logic_1.control_if_block(block);
            expect(frames.length).toBe(1);
            expect(frames[0].blockId).toBe('block_id');
        });
    });
    describe('controls_ifelse_block', () => {
        it('should execute blocks in else if false is connected', () => {
            getInputValueSpy.withArgs(block, 'IF0', true, undefined)
                .and.returnValue(false);
            generateFrameForInputStatementSpy.withArgs(block, 'ELSE', jasmine.any(arduino_frame_1.ArduinoFrame)).and.returnValue([arduino_frame_1.ArduinoFrame.makeEmptyFrame('block1'), arduino_frame_1.ArduinoFrame.makeEmptyFrame('block2')]);
            const frames = logic_1.controls_ifelse_block(block);
            expect(frames.length).toBe(3);
            expect(frames[0].blockId).toBe('block_id');
            expect(frames[1].blockId).toBe('block1');
            expect(frames[2].blockId).toBe('block2');
        });
    });
    describe('logic_negate_block', () => {
        it('should turn true to false', () => {
            getInputValueSpy.withArgs(block, 'BOOL', true, undefined).and.returnValue(false);
            expect(logic_1.logic_negate_block(block)).toBeTruthy();
        });
        it('should turn true to false', () => {
            getInputValueSpy.withArgs(block, 'BOOL', true, undefined).and.returnValue(true);
            expect(logic_1.logic_negate_block(block)).toBeFalsy();
        });
    });
});
//# sourceMappingURL=logic.spec.js.map