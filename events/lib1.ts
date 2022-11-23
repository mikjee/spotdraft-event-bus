import { EVENT_TYPE_KEY, TypedEvent } from '../TypedEventBus';

export class EventA {
	public static readonly [EVENT_TYPE_KEY] = "EVENT_LIB_1_A";
	payload: string[] = [];

	constructor(initial: string[]) {
		this.payload = initial;
	}
};

export class EventB {
	public static readonly [EVENT_TYPE_KEY] = "EVENT_LIB_1_B";
	payload: number = 42;
};

export class EventC {
	//public static readonly event = "EVENT_LIB_1_C";
};

@TypedEvent("EVENT_LIB_1_D")
export class EventD {
	payload: string = "Hmm";
};
