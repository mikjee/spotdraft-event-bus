import { Observable } from 'rxjs';

// -------------------------

export const EVENT_TYPE_KEY = "__event__";

abstract class GenericEvent {
	public static readonly [EVENT_TYPE_KEY]: unknown;
}

interface IGenericEventCallback {
	(e: any): void;
}

interface IEventCallback<E extends GenericEvent> {
	(e: E): void;
}

type TSubscriberMap = {
	[eventType: string]: {
		[subId: number]: IGenericEventCallback;
	}
};

interface IUnsubscribe {
	(): void
};

type TSubscription = {
	unsubscribe: IUnsubscribe
};

type ValueOf<T> = T[keyof T];

// ---------------------

export class TypedEventBus {

	private _listeners: TSubscriberMap = {};
	private _observable: Observable<unknown>;
	private _subIdCounter: number = 0;

	constructor(o: InstanceType<typeof Observable<unknown>>) {
		this._observable = o;
		this._observable.subscribe(e => this.listener(e));
	}

	public subscribe<E extends GenericEvent>(eventClass: {
		new (...args: any): E;
		[EVENT_TYPE_KEY]: string;
	}) {
		return (callback: IEventCallback<InstanceType<new (...args: any) => E>>): TSubscription => {

			this._subIdCounter ++;
			const subsId = this._subIdCounter;

			const eventType = eventClass[EVENT_TYPE_KEY];

			if (!this._listeners[eventType]) this._listeners[eventType] = {};
			this._listeners[eventType][subsId] = callback;
			
			return { unsubscribe: () => this.unsubscribe(eventType, subsId)	};

		};
	}

	private unsubscribe(eventType: string, subsId: number) {
		const listenersObj = this._listeners[eventType];
		if (typeof listenersObj !== 'object') return;

		delete listenersObj[subsId];
	}

	private listener(e: any): void {

		const eventType = Object.getPrototypeOf(e)?.constructor?.[EVENT_TYPE_KEY];
		if (typeof eventType !== 'string') return;

		const listenersObj = this._listeners[eventType];
		if (typeof listenersObj !== 'object') return;

		Object
			.values(listenersObj)
			.forEach(callback => callback(e));

	}

}
