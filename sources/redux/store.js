import {createStore} from 'redux';

const initState = {
  loading: false,
  name: 'Namaku',
  address: 'Jalan saja',
};

const reducer = (state = initState, action) => {
  if (action.type === 'SET_LOAD') {
    return {
      ...state,
      loading: action.value,
    };
  }
  if (action.type === 'SET_NANE') {
    return {
      ...state,
      name: action.value,
    };
  }
  return state;
};

const store = createStore(reducer);
export default store;
