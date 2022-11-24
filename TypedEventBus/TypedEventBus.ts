import { Observable } from 'rxjs';

// -------------------------

interface IGenericEventCallback {
	(e: any): void;
}

interface IEventCallback<E> {
	(e: E): void;
}

interface IUnsubscribe {
	(): void
};

type TSubscription = {
	unsubscribe: IUnsubscribe
};

// ---------------------

export class TypedEventBus {

	private _observable: Observable<unknown>;
	private _subIdCounter: number = 0;

	private _classMap = new Map<{ new (...args: any): unknown }, {
		[subId: number]: IGenericEventCallback;
	}>();

	constructor(o: InstanceType<typeof Observable<unknown>>) {
		this._observable = o;
		this._observable.subscribe(e => this.listener(e));
	}

	public subscribe<E>(eventClass: {
		new (...args: any): E;
	}) {
		return (callback: IEventCallback<E>): TSubscription => {
			this._subIdCounter ++;
			const subsId = this._subIdCounter;

			if (!this._classMap.has(eventClass)) this._classMap.set(eventClass, {});
			const subscriptionMap = this._classMap.get(eventClass);
			subscriptionMap![subsId] = callback;

			return { unsubscribe: () => this.unsubscribe(eventClass, subsId) };
		};
	}

	private unsubscribe<E>(eventClass: {new (...args: any): E}, subsId: number) {
		if (!this._classMap.has(eventClass)) return;
		const subscriptionMap = this._classMap.get(eventClass);
		delete subscriptionMap![subsId];
	}

	private listener(e: any): void {
		const eventClass = Object.getPrototypeOf(e)?.constructor;
		if (!this._classMap.has(eventClass)) return;
		const subscriptionMap = this._classMap.get(eventClass);

		Object
			.values(subscriptionMap!)
			.forEach(callback => callback(e));
	}

}
