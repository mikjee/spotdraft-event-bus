import { Observable, Subject } from 'rxjs';

import { TypedEventBus } from './TypedEventBus/TypedEventBus';
import {
	EventA,
	EventB,
	EventC,
} from "./events";

// --------------------

const s = new Subject();
const events = new TypedEventBus(s);

events.subscribe(EventA)(e => console.log(e.payload.join(" ")));
events.subscribe(EventB)(e => console.log("Number: " + e.payload));

s.next(new EventA(["hello", "world"]));
s.next(new EventB());




