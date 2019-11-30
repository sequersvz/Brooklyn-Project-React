import { checkpointsActions } from "../actions/checkpoints";

const initialState = {
  selectedCheckpoint: ""
};

const setSelectedCheckpointName = (state, { checkpoint }) => ({
  ...state,
  selectedCheckpoint: checkpoint
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case checkpointsActions.setSelectedCheckpointName:
      return setSelectedCheckpointName(state, action);
    default:
      return state;
  }
};

export default reducer;
