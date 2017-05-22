/**
 * Created by bstojchevski on 5/22/2017.
 */
export class Store {

    constructor(dispatcher) {
        this.__listeners = [];
        this.__state = this.getInitialState();
        dispatcher.register(this.__onDispatch.bind(this));
    }

    __onDispatch() {
        throw new Error("Subclasses must override __onDispatch() method of a Flux Store");
    }

    getInitialState() {
        throw new Error("Subclasses must override getInitialState() method of a Flux Store");
    }

    addListener(listener) {
        this.__listeners.push(listener);
    }

    __emitChange() {
        this.__listeners.forEach(listener => listener(this.__state));
    }
}