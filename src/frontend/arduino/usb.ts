import { Command } from "../frame/command";

export interface USB {

    /**
     * This will generate a usb command to send
     */
    usbCommand(): Command;

    /**
     * This will only do the component part of the command.
     */
    setupCommandUSB(): Command;

}


export enum USB_COMMAND_TYPES  { 
    MOVE = 'M',
    SETUP = 'S',
    SERVO = 'S',
    PIN = 'P',
    LCD = 'L',
    LED_MATRIX = 'LC',
    NEO_PIXEL = 'N',
    END_OF_COMMAND = '|'
};

