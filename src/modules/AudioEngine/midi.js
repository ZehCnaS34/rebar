import { fromEvent, Observable } from "rxjs";
import { map, concatAll } from "rxjs/operators";

export const midiAccess = () =>
  new Observable(observer =>
    navigator
      .requestMIDIAccess()
      .then(access => {
        observer.next(access);
        observer.complete();
      })
      .catch(() => {
        observer.error();
      })
  );

export function setupMidiListener() {
  let access = midiAccess();
  let accessHandle = access.subscribe(status => console.log({ status }));

  let accessStatus = access.pipe(
    map(access => fromEvent(access, "statechange")),
    concatAll()
  );

  let accessStatusHandle = accessStatus.subscribe(v => console.log(v));

  return {
    dispose() {
      accessStatusHandle.unsubscribe();
      accessHandle.unsubscribe();
    }
  };
}
