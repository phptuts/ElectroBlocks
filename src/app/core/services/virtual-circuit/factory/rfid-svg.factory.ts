import { VirtualCircuit } from '../svg/virtual-circuit';
import { RFIDState } from '../../player/arduino/state/rfid.state';
import { fetchSVGXMLData } from './fetch.svg';
import { RFIDSvg } from '../svg/rfid.svg';
import { Element, Parent } from 'svg.js';
import {
  createBreadboardWire,
  createGroundWire,
  createPowerWire
} from '../svg/wire';
import { virtualCircuitPin } from '../svg/arduino.svg';
import { groundPowerOnePinComponents } from './factory_helpers';
import { resistorPinWhole as resistorPinHole } from './led.factory';

export const rfidFactory = async (
  virtualCircuit: VirtualCircuit,
  componentState: RFIDState,
  componentOnly = false
) => {
  const rfidSvgString = './assets/svgs/rfid.svg';

  const rfidSvg = new RFIDSvg(componentState, virtualCircuit.baseSVG
    .svg(await fetchSVGXMLData(rfidSvgString))
    .children()
    .pop() as Parent);

  virtualCircuit.nodes.add(rfidSvg.svg);
  (rfidSvg.svg as any).draggy();
  virtualCircuit.arduino.showWire(virtualCircuitPin(componentState.txPin));
  rfidSvg.height('2.1in');

  createBreadboardWire(
    virtualCircuit,
    rfidSvg,
    rfidSvg.svg.select('#TX_WIRE').first() as Element,
    componentState.txPin,
    '#FFA500'
  );

  const txPinHole = virtualCircuit.baseSVG
    .select(`#${resistorPinHole(componentState.txPin)}`)
    .first();

  const positionX = txPinHole.ctm().extract().x + txPinHole.cx() - 100;

  groundPowerOnePinComponents(rfidSvg, componentState.txPin, virtualCircuit);

  const positionY =
    virtualCircuit.baseSVG
      .select(`#breadboardbreadboard`)
      .first()
      .ctm()
      .extract().transformedY - 175;

  rfidSvg.move(positionX, positionY);
  rfidSvg.updateWires();

  return rfidSvg;
};