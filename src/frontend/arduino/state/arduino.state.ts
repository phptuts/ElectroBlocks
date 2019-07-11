import { ElectricAttachmentComponentState, ElectricComponentState } from "./electric.state";
import { ElectricComponentType } from "./electric.component.type";
import { Variable } from "../../frame/variable";
import * as _ from "lodash";

export class ArduinoState implements ElectricComponentState {

	public readonly electricComponentType = ElectricComponentType.ARDUINO;

	public readonly rxLedOn: boolean;

	constructor(public readonly components: ElectricAttachmentComponentState[],
	            public readonly variables: { [ key: string ]: Variable },
	            public readonly txLedOn = false,
	            public readonly sendMessage = '', // message arduino is sending
	            public readonly delay = 0, // Number of milliseconds to delay
	            public readonly powerLedOn = true) {
		this.rxLedOn = this.sendMessage.length > 0;
	}


	public static makeEmptyState() {
		return new ArduinoState([], {}, false);
	}

	public copyState() {

		const components = _.cloneDeep(this.components);

		const updatedComponents = components.map(component => component.copyState());

		return new ArduinoState(updatedComponents, _.cloneDeep(this.variables));
	}
}