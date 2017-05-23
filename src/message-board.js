/**
 * Created by bstojchevski on 5/22/2017.
 */
import { createStore, combineReducers, applyMiddleware } from "redux";
import { get                                           } from "./http";
import { logger, createLogger                          } from "redux-logger";

// Keep in mind the "Redux Thunk" and "Redux Saga" for future improvements
// They are part of the Redux Middleware!
// https://github.com/gaearon/redux-thunk
// https://github.com/redux-saga/redux-saga

export const ONLINE  = "ONLINE";
export const AWAY    = "AWAY";
export const BUSY    = "BUSY";
export const OFFLINE = "OFFLINE";

export const UPDATE_STATUS      = "UPDATE STATUS";
export const CREATE_NEW_MESSAGE = "CREATE_NEW_MESSAGE";

export const READY   = "READY";
export const WAITING = "WAITING";
export const NEW_MESSAGE_SERVER_ACCEPTED = "NEW_MESSAGE_SERVER_ACCEPTED";

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    };
};

const newMessageAction = (content, postedBy) => {
    const date = new Date();

    get("/api/create", (id) => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        });
    });

    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    };
};

const defaultState = {
    messages: [{
            date: new Date("2017-05-23 11:45:00"),
            postedBy: "Bokjo",
            content: "Implementing redux into the Productivity App!"
        }, {
            date: new Date("2017-05-23 11:45:30"),
            postedBy: "Torko",
            content: "Great stuff bro!"
        }, {
            date: new Date("2017-05-23 11:46:00"),
            postedBy: "Richard",
            content: "Woohoo topotnici"
        }],
    userStatus: ONLINE,
    apiCommunicationStatus: READY
};

// Creating reducer (always takes "state" and "action" as arguments)

const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
    switch (type) {
        case UPDATE_STATUS:
            return value;
    }
    return state;
};

const apiCommunicationStatusReducer = (state = READY, {type}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            return WAITING;
        case NEW_MESSAGE_SERVER_ACCEPTED:
            return READY;
    }
    return state;

};

const messagesReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch(type) {
        case CREATE_NEW_MESSAGE:
            //create copy of the state since the Array type is mutable!
            const newState = [ { date, postedBy, content: value }, ...state ];
            return newState;
    }
    return state;
};

const combinedReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer,
    apiCommunicationStatus: apiCommunicationStatusReducer
});

//Creating new store

const store = createStore(combinedReducer, applyMiddleware(logger));
// /* eslint-disable no-underscore-dangle */
// const store = createStore(combinedReducer, applyMiddleware(logger),
//     /* preloadedState, */
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
// /* eslint-enable */

document.forms.selectStatus.status.addEventListener("change", (e) =>{
    e.preventDefault();
    store.dispatch(statusUpdateAction(e.target.value));
});

document.forms.newMessage.addEventListener("submit", (e) =>{
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage["preferences"] ? JSON.parse(localStorage["preferences"]).userName : "John Doe";

    store.dispatch(newMessageAction(value, username));
    e.target.newMessage.value = "";
});

const render = () => {
    const { messages, userStatus, apiCommunicationStatus } = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort( (a,b) => b.date - a.date )
        .map(message => (`
                <div>
                    ${message.postedBy}: ${message.content}
                </div>
                `
        )).join("");

    // document.forms.newMessage.value = "";
    document.forms.newMessage.fields.disabled = ( userStatus === OFFLINE || apiCommunicationStatus === WAITING);
};

render();

store.subscribe(render);

get("www.google.com", (id) => {
    console.log("Received callback...", id);
});