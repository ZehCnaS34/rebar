// @flow

export interface Node<T> {
  connect: T => void;
}

class Pluggable<U, T: Node<U>> {
  set input(value: T) {
    throw Error("Cannot use base class implmentation");
  }

  set output(value: T) {
    throw Error("Cannot use base class implmentation");
  }
}

export { Pluggable };
