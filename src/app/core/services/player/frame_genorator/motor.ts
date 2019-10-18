import { Block } from 'blockly';
import { FrameLocation } from "../frame/frame";
import { ArduinoFrame } from "../arduino/arduino_frame";
import { getInputValue } from "../frame/blockly_helper";
import { MOTOR_DIRECTION } from "../arduino/state/motor.state";
import { ArduinoState } from "../arduino/state/arduino.state";
import { MotorState } from "../arduino/state/motor.state";

export const move_motor_block = (block: Block, frameLocation: FrameLocation, previousFrame?: ArduinoFrame) : ArduinoFrame[] => {

	let motorNumber = parseInt(getInputValue(block, 'MOTOR', 1, frameLocation, previousFrame).toString());

	if (motorNumber < 0 || motorNumber > 4) {
		motorNumber = 1;
	}

	const direction = block.getFieldValue('DIRECTION') as MOTOR_DIRECTION;

	const speed = parseInt(getInputValue(block, 'SPEED', 10, frameLocation, previousFrame).toString());

	const state = previousFrame ? previousFrame.copyState() : ArduinoState.makeEmptyState();

	const motor = state.components.find(c => c instanceof MotorState && c.motorNumber == motorNumber) as MotorState;

	const motorIndex = state.components.findIndex(c => c instanceof MotorState && c.motorNumber == motorNumber);

	if (motor) {
		state.components[motorIndex] = new MotorState(motorNumber, speed, direction);
	} else {
		state.components.push(new MotorState(motorNumber, speed, direction));
	}


	return [new ArduinoFrame(block.id, state, frameLocation)]
};
