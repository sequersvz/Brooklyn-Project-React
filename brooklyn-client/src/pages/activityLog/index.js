import React from "react";
import ActivityCont from "../../containers/activities";
import ActivityList from "../../components/activities";

const ActivityLog = () => (
  <ActivityCont>{activities => <ActivityList {...activities} />}</ActivityCont>
);
export default ActivityLog;
