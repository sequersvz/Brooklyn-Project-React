export const checkpointsActions = {
  setSelectedCheckpointName: "SET SELECTED CHECKPOINT NAME"
};

export const setSelectedCheckpointName = checkpoint => ({
  type: checkpointsActions.setSelectedCheckpointName,
  checkpoint
});
