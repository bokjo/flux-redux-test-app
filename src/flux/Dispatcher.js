/**
 * Created by bstojchevski on 5/22/2017.
 */
export class Dispatcher {

    constructor(){
        this.__listeners = [];
    }

    dispatch(action) {
        this.__listeners.forEach(listener => listener(action));
    }

    register(listener) {
        this.__listeners.push(listener);
    }

}