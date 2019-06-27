import Config from '../Config';


//override console
const _console = {
    info: function (message, obj) {
        Config.logReduxState && console.log(message, obj);
    },
    log: function (message, obj) {
        Config.logReduxState && console.info(message, obj);
    },
    warn: function (message, obj) {
        Config.logReduxState && console.warn(message, obj);
    },
}


/**
 * Http response state error handler
 */
const httpResponseErrorHandler = store => next => action => {
    _console.info('dispatching', action);
    let result = null;
    let flagOriginalActionToHandled = (action) => (action.error.isHandled = true); //update original action object , flag this error action already be handled.

    if (action.error) {
        if (action.error.status) {
            switch (action.error.status) {
                case 400:
                    break;
                case 401:
                    break;
                case 500:
                    break;
                default:
                    break;
            }
        } else if (action.error.message === 'Network request failed') {
            if (action.type != "FETCH_TRANSLATION_FAILURE"){
            }

            result = Promise.reject(next(action).error);

        }
    }
    else {
        result = next(action);
    }

    _console.log('next state', store.getState());
    return result;
}


export default httpResponseErrorHandler;