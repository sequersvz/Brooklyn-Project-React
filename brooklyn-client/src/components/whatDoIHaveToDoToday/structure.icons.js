const mainIconSize = 20;

export default handlers => {
  const { goToRoute } = handlers;
  return [
    {
      iconName: "faArrowLeft",
      iconSize: mainIconSize,
      id: 1,
      toolTipInfo: "Timeline view",
      click: goToRoute,
      unique: true
    }
  ];
};
