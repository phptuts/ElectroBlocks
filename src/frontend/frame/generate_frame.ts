import { ArduinoFrame } from "../arduino/arduino_frame";
import { frameGeneratingBlocks } from "./frame_list";
import { generateFrameForInputStatement } from "./blockly_helper";
import { get_blockly } from "./block";

export const generateListOfFrame = (numberOfTimesThroughLoop: number = 1) => {
	let arduinoBlock = get_blockly().mainWorkspace.getAllBlocks().filter(function (block) {
		return block.type == 'arduino_start';
	})[0];

	let topBlocks = get_blockly()
		.mainWorkspace
		.getTopBlocks()
		.filter(block => block.type != 'arduino_start');

	let frames = new Array<ArduinoFrame>();



	topBlocks
		.filter(block => !block.disabled)
		.filter(block => block.type != 'procedures_defnoreturn')
		.forEach(block => {
			frameGeneratingBlocks[block.type + '_block'](block, frames.length == 0 ? null : frames[frames.length - 1])
				.filter(frame => frame instanceof ArduinoFrame)
				.forEach((currentFrame: ArduinoFrame) => frames.push(currentFrame));
		});


	let setupFrames = generateFrameForInputStatement(
		arduinoBlock,
		'setup',
		frames.length == 0 ? null : frames[frames.length - 1]
	) as ArduinoFrame[];

	setupFrames.forEach(currentFrame => frames.push(currentFrame));


	for (let i = 0; i < numberOfTimesThroughLoop; i += 1) {
		let loopFrames = generateFrameForInputStatement(
			arduinoBlock,
			'loop',
			frames.length == 0 ? null : frames[frames.length - 1]
		) as ArduinoFrame[];

		loopFrames.forEach(currentFrame => frames.push(currentFrame));
	}

	console.log(frames, 'Arduino Frames Generated');

	return frames;
};
