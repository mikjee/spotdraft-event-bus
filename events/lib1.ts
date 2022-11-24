export class EventA {
	payload: string[] = [];

	constructor(initial: string[]) {
		this.payload = initial;
	}
}

export class EventB {
	payload: number = 42;
}

export class EventC {
	
}