const mainIconSize = 20;

export default handlers => {
  const { openModalReview, goToRoute } = handlers;
  return [
    {
      iconName: "faList",
      iconSize: mainIconSize,
      id: 3,
      toolTipInfo: "What do I have to do today",
      unique: true,
      click: goToRoute("/assurance/what-do-i-have-to-do-today")
    },
    {
      iconName: "faFire",
      iconSize: mainIconSize,
      id: 5,
      toolTipInfo: "Action Log",
      click: goToRoute("/assurance/action-log"),
      unique: true
    },
    {
      iconName: "faExclamationTriangle",
      iconSize: 18,
      id: 4,
      toolTipInfo: "Risk Log",
      click: goToRoute("/assurance/risks"),
      unique: true
    },
    {
      iconName: "faPlusCircle",
      iconSize: mainIconSize,
      id: 2,
      toolTipInfo: "New Review",
      click: openModalReview,
      unique: true
    }
  ];
};
