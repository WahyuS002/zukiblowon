const initialState = {
    mintAmount: [3],
}

const mintingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_MINT_AMOUNT':
            return {
                ...state,
                mintAmount: action.payload.mintAmount,
            }
        default:
            return state
    }
}

export default mintingReducer
