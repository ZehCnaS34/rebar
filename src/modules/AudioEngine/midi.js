import { Observable } from "rxjs";

export const midiAccess = () =>
  new Observable(observer =>
    navigator
      .requestMIDIAccess()
      .then(access => {
        observer.next(access);
        observer.complete();
      })
      .catch(() => {
        console.log("hi");
        observer.error();
      })
  );

export function MidiListener() {
  console.log("hi");
  // let access = midiAccess();
  // let accessHandle = access.subscribe(status => console.log({ status }));

  // let accessStatus = access.pipe(
  //   map(access => fromEvent(access, "statechange")),
  //   concatAll()
  // );

  // let accessStatusHandle = accessStatus.subscribe(v => console.log(v));

  return {
    dispose() {
      // accessStatusHandle.unsubscribe();
      // accessHandle.unsubscribe();
    }
  };
}
