function num( state = 0, action ) {
  switch ( action.type ) {
    case 'ADD':
      return state + 1;
    case 'MINUS':
      return state - 1;
    default:
      return state;
  }
}

function list( state = [], action ) {
  switch ( action.type ) {
    case 'PUSH':
      return [
        ...state,
        action.text
      ];
    case "POP":
      let ret = [ ...state ];
      ret.pop();
      return ret;
    default:
      return state;
  }
}

export default { num, list };
