import { Block } from 'blockly';
import { FrameLocation } from '../frame/frame';
import { ArduinoFrame } from '../arduino/arduino_frame';
import { getInputValue } from '../frame/blockly_helper';
import { ArduinoState } from '../arduino/state/arduino.state';
import {
  LCD_SCREEN_MEMORY_TYPE,
  LCDScreenState
} from '../arduino/state/lcd_screen.state';
import * as _ from 'lodash';

export const lcd_setup_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const memoryType = block.getFieldValue(
    'MEMORY_TYPE'
  ) as LCD_SCREEN_MEMORY_TYPE;

  const rows = block.getFieldValue('SIZE') === '16 x 2' ? 2 : 4;
  const columns = block.getFieldValue('SIZE') === '16 x 2' ? 16 : 20;

  const emptyRowsOfText = [];

  for (let i = 0; i < rows; i += 1) {
    emptyRowsOfText[i] = appendSpace('', columns);
  }

  const lcdComponent = new LCDScreenState(
    rows,
    columns,
    memoryType,
    emptyRowsOfText,
    { row: -1, column: -1, blinking: false },
    true
  );
  const state = previousFrame
    ? previousFrame.copyState()
    : ArduinoState.makeEmptyState();

  state.components.push(lcdComponent);

  return [
    new ArduinoFrame(block.id, state, frameLocation, `Setting up LCD Screen.`)
  ];
};

export const lcd_screen_print_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const lcdScreenState = previousFrame.state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  let row = parseInt(
    getInputValue(block, 'ROW', 0, frameLocation, previousFrame).toString(),
    0
  );

  let column = parseInt(
    getInputValue(block, 'COLUMN', 0, frameLocation, previousFrame).toString(),
    0
  );

  row = row <= 0 ? 0 : row - 1;
  column = column <= 0 ? 0 : column - 1;

  const print = getInputValue(
    block,
    'PRINT',
    '',
    frameLocation,
    previousFrame
  ).toString();

  const stringToPrint = lcdScreenState.rowsOfText[row].split('');
  let counter = 0;
  for (let i = column; i < column + print.length; i += 1) {
    stringToPrint[i] = print[counter];
    counter += 1;
  }

  const state = previousFrame.copyState();

  (state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState).rowsOfText[row <= 0 ? 0 : row - 1] = stringToPrint.join(
    ''
  );

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Printing "${stringToPrint.join('').trim()}" starting at (${column +
        1}, ${row + 1}).`
    )
  ];
};

export const lcd_screen_simple_print_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const row1 = getInputValue(
    block,
    'ROW_1',
    '',
    frameLocation,
    previousFrame
  ).toString();

  const row2 = getInputValue(
    block,
    'ROW_2',
    '',
    frameLocation,
    previousFrame
  ).toString();

  const row3 = getInputValue(
    block,
    'ROW_3',
    '',
    frameLocation,
    previousFrame
  ).toString();

  const row4 = getInputValue(
    block,
    'ROW_4',
    '',
    frameLocation,
    previousFrame
  ).toString();

  const delay =
    parseFloat(
      getInputValue(block, 'DELAY', 1, frameLocation, previousFrame).toString()
    ) * 1000;

  const state = { ...previousFrame.copyState(), delay };

  const lcdScreenState = state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  lcdScreenState.rowsOfText[0] = appendSpace(row1, lcdScreenState.columns);
  lcdScreenState.rowsOfText[1] = appendSpace(row2, lcdScreenState.columns);

  if (lcdScreenState.rows === 4) {
    lcdScreenState.rowsOfText[2] = appendSpace(row3, lcdScreenState.columns);
    lcdScreenState.rowsOfText[3] = appendSpace(row4, lcdScreenState.columns);
  }

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Printing messages LCD Screen for ${delay / 1000} seconds.`
    )
  ];
};

export const lcd_screen_clear_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const state = previousFrame.copyState();

  const lcdScreenState = state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  for (let i = 0; i < lcdScreenState.rows; i += 1) {
    lcdScreenState.rowsOfText[i] = appendSpace('', lcdScreenState.columns);
  }

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Clear text on LCD Screen.`
    )
  ];
};

export const lcd_scroll_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const state = previousFrame.copyState();

  const lcdScreenState = state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  const direction = block.getFieldValue('DIR');

  for (let i = 0; i < lcdScreenState.rows; i += 1) {
    if (direction === 'RIGHT') {
      lcdScreenState.rowsOfText[i] =
        ' ' +
        lcdScreenState.rowsOfText[i].substring(
          0,
          lcdScreenState.rowsOfText[i].length - 1
        );
    } else {
      lcdScreenState.rowsOfText[i] =
        lcdScreenState.rowsOfText[i].substring(1) + ' ';
    }
  }

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Scroll text ${direction} one space on LCD Screen.`
    )
  ];
};

export const lcd_screen_blink_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const state = previousFrame.copyState();

  const lcdScreenState = state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  const row = parseInt(
    getInputValue(block, 'ROW', 0, frameLocation, previousFrame).toString(),
    0
  );

  const column = parseInt(
    getInputValue(block, 'COLUMN', 0, frameLocation, previousFrame).toString(),
    0
  );

  lcdScreenState.blink.blinking = block.getFieldValue('NAME') === 'BLINK';
  lcdScreenState.blink.row = row;
  lcdScreenState.blink.column = column;

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Blink space (${column}, ${row}) on LCD Screen.`
    )
  ];
};

export const lcd_backlight_block = (
  block: Block,
  frameLocation: FrameLocation,
  previousFrame?: ArduinoFrame
): ArduinoFrame[] => {
  const state = previousFrame.copyState();

  const lcdScreenState = state.components.find(
    (component) => component instanceof LCDScreenState
  ) as LCDScreenState;

  const componentIndex = state.components.findIndex(
    (component) => component instanceof LCDScreenState
  );

  const isOn = block.getFieldValue('BACKLIGHT') === 'ON';

  state.components[componentIndex] = new LCDScreenState(
    lcdScreenState.rows,
    lcdScreenState.columns,
    lcdScreenState.memoryType,
    _.cloneDeep(lcdScreenState.rowsOfText),
    _.cloneDeep(lcdScreenState.blink),
    isOn
  );

  return [
    new ArduinoFrame(
      block.id,
      state,
      frameLocation,
      `Turn ${isOn ? 'on' : 'off'} backlight on LCD Screen.`
    )
  ];
};

const appendSpace = (printString: string, numberOfColumns: number): string => {
  const spacesToPrint = numberOfColumns - printString.length;

  for (let i = 0; i < spacesToPrint; i += 1) {
    printString += ' ';
  }

  return printString;
};
