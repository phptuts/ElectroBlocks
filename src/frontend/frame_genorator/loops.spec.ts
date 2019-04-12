import 'jasmine';
import { Block } from "../frame/block";
import * as blockHelper from "../frame/blockly_helper";
import * as  variableHelper  from "./variables";

import { ArduinoFrame } from "../arduino/arduino_frame";
import { controls_for_block, controls_repeat_ext_block } from "./loops";
import { generateFrameForInputStatement } from "../frame/blockly_helper";

describe('loops', () => {

	let block: any|Block;

	let blockSpy: jasmine.Spy;

	let getInputValueSpy: jasmine.Spy;

	let generateFrameForInputStatementSpy: jasmine.Spy;

	let getVariableNameSpy: jasmine.Spy;

	beforeEach(() => {
		block =  {
			id: 'loop_block',
			getFieldValue( fieldName: string ): any {
			}
		};

		blockSpy = spyOn(block, 'getFieldValue');

		getInputValueSpy = spyOn(blockHelper, 'getInputValue');

		generateFrameForInputStatementSpy = spyOn(blockHelper, 'generateFrameForInputStatement');

		getVariableNameSpy = spyOn(variableHelper, 'getVariableName');
	});

	describe('controls_repeat_ext_block', () => {
		it('should generate x number from frames', () => {
			getInputValueSpy.withArgs(block, 'TIMES', 1, undefined)
				.and.returnValue(2);

			generateFrameForInputStatementSpy.withArgs(block, 'DO', jasmine.any(ArduinoFrame)).and.returnValue([ArduinoFrame.makeEmptyFrame('block1'), ArduinoFrame.makeEmptyFrame('block2')]);

			const frames = controls_repeat_ext_block(block);

			expect(frames.length).toBe(6);

			expect(frames[0].blockId).toBe('loop_block');
			expect(frames[1].blockId).toBe('block1');
			expect(frames[2].blockId).toBe('block2');
			expect(frames[3].blockId).toBe('loop_block');
			expect(frames[4].blockId).toBe('block1');
			expect(frames[5].blockId).toBe('block2');

		});

		it('should not generate any if times is 0 or less', () => {
			getInputValueSpy.withArgs(block, 'TIMES', 1, undefined)
				.and.returnValue(0);

			const frames = controls_repeat_ext_block(block);

			expect(frames.length).toBe(1);

		});
	});

	describe('controls_for_block', () => {

		it ('should be able to to go forwards', () => {
			getInputValueSpy.withArgs(block, 'FROM', 1, undefined)
				.and.returnValue(1);

			getInputValueSpy.withArgs(block, 'TO', 1, undefined)
				.and.returnValue(3);

			getInputValueSpy.withArgs(block, 'BY', 1, undefined)
				.and.returnValue(1);

			getVariableNameSpy.withArgs(block).and.returnValue('indexVariable');

			generateFrameForInputStatementSpy.withArgs(block, 'DO', jasmine.any(ArduinoFrame))
				.and.callFake((block: Block, inputStatement: string, previousFrame: ArduinoFrame): ArduinoFrame[] => {

					return [ previousFrame.makeCopy('block1'), previousFrame.makeCopy('block2') ];
			});

			const frames = controls_for_block(block) as ArduinoFrame[];

			expect(frames.length).toBe(9);

			expect(frames[0].variables['indexVariable'].value).toBe(1);
			expect(frames[0].blockId).toBe('loop_block');

			expect(frames[1].variables['indexVariable'].value).toBe(1);
			expect(frames[1].blockId).toBe('block1');

			expect(frames[2].variables['indexVariable'].value).toBe(1);
			expect(frames[2].blockId).toBe('block2');


			expect(frames[3].variables['indexVariable'].value).toBe(2);
			expect(frames[3].blockId).toBe('loop_block');

			expect(frames[4].variables['indexVariable'].value).toBe(2);
			expect(frames[4].blockId).toBe('block1');

			expect(frames[5].variables['indexVariable'].value).toBe(2);
			expect(frames[5].blockId).toBe('block2');

			expect(frames[6].variables['indexVariable'].value).toBe(3);
			expect(frames[6].blockId).toBe('loop_block');

			expect(frames[7].variables['indexVariable'].value).toBe(3);
			expect(frames[7].blockId).toBe('block1');

			expect(frames[8].variables['indexVariable'].value).toBe(3);
			expect(frames[8].blockId).toBe('block2');

		});

		it('it should be able to go backwards', () => {
			getInputValueSpy.withArgs(block, 'FROM', 1, undefined)
				.and.returnValue(3);

			getInputValueSpy.withArgs(block, 'TO', 1, undefined)
				.and.returnValue(1);

			getInputValueSpy.withArgs(block, 'BY', 1, undefined)
				.and.returnValue(1);

			getVariableNameSpy.withArgs(block).and.returnValue('indexVariable');

			generateFrameForInputStatementSpy.withArgs(block, 'DO', jasmine.any(ArduinoFrame))
				.and.callFake((block: Block, inputStatement: string, previousFrame: ArduinoFrame): ArduinoFrame[] => {

				return [ previousFrame.makeCopy('block1'), previousFrame.makeCopy('block2') ];
			});

			const frames = controls_for_block(block) as ArduinoFrame[];

			expect(frames.length).toBe(9);

			expect(frames[0].variables['indexVariable'].value).toBe(3);
			expect(frames[0].blockId).toBe('loop_block');

			expect(frames[1].variables['indexVariable'].value).toBe(3);
			expect(frames[1].blockId).toBe('block1');

			expect(frames[2].variables['indexVariable'].value).toBe(3);
			expect(frames[2].blockId).toBe('block2');


			expect(frames[3].variables['indexVariable'].value).toBe(2);
			expect(frames[3].blockId).toBe('loop_block');

			expect(frames[4].variables['indexVariable'].value).toBe(2);
			expect(frames[4].blockId).toBe('block1');

			expect(frames[5].variables['indexVariable'].value).toBe(2);
			expect(frames[5].blockId).toBe('block2');

			expect(frames[6].variables['indexVariable'].value).toBe(1);
			expect(frames[6].blockId).toBe('loop_block');

			expect(frames[7].variables['indexVariable'].value).toBe(1);
			expect(frames[7].blockId).toBe('block1');

			expect(frames[8].variables['indexVariable'].value).toBe(1);
			expect(frames[8].blockId).toBe('block2');

		});

		it('should be able to change change by', () => {
			getInputValueSpy.withArgs(block, 'FROM', 1, undefined)
				.and.returnValue(1);

			getInputValueSpy.withArgs(block, 'TO', 1, undefined)
				.and.returnValue(5);

			getInputValueSpy.withArgs(block, 'BY', 1, undefined)
				.and.returnValue(2);

			getVariableNameSpy.withArgs(block).and.returnValue('indexVariable');

			generateFrameForInputStatementSpy.withArgs(block, 'DO', jasmine.any(ArduinoFrame))
				.and.callFake((block: Block, inputStatement: string, previousFrame: ArduinoFrame): ArduinoFrame[] => {

				return [ previousFrame.makeCopy('block1'), previousFrame.makeCopy('block2') ];
			});

			const frames = controls_for_block(block) as ArduinoFrame[];

			expect(frames.length).toBe(9);

			expect(frames[0].variables['indexVariable'].value).toBe(1);
			expect(frames[0].blockId).toBe('loop_block');

			expect(frames[1].variables['indexVariable'].value).toBe(1);
			expect(frames[1].blockId).toBe('block1');

			expect(frames[2].variables['indexVariable'].value).toBe(1);
			expect(frames[2].blockId).toBe('block2');


			expect(frames[3].variables['indexVariable'].value).toBe(3);
			expect(frames[3].blockId).toBe('loop_block');

			expect(frames[4].variables['indexVariable'].value).toBe(3);
			expect(frames[4].blockId).toBe('block1');

			expect(frames[5].variables['indexVariable'].value).toBe(3);
			expect(frames[5].blockId).toBe('block2');

			expect(frames[6].variables['indexVariable'].value).toBe(5);
			expect(frames[6].blockId).toBe('loop_block');

			expect(frames[7].variables['indexVariable'].value).toBe(5);
			expect(frames[7].blockId).toBe('block1');

			expect(frames[8].variables['indexVariable'].value).toBe(5);
			expect(frames[8].blockId).toBe('block2');

		});

	});
});