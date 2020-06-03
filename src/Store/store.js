const state = {
    userId: null,
    userToken: null
}

const reducer = (initialState = state, action) => {
    if(action.type === 'login') {

        const data = {
            userId: action.userId,
            userToken: action.userToken
        }
        localStorage.setItem('userData', JSON.stringify(data));
        return {
            ...state,
            userId: action.userId,
            userToken: action.userToken
        }
    }

    if(action.type === 'signup') {

        const data = {
            userId: action.userId,
            userToken: action.userToken
        }
        localStorage.setItem('userData', JSON.stringify(data));
        return {
            ...state,
            userId: action.userId,
            userToken: action.userToken
        }
    }

    if(action.type === 'logout') {
        localStorage.removeItem('userData');
        localStorage.removeItem('history');
        return {
            state
        }
    }
    return state;
};

export default reducer;