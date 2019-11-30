const mainIconSize = 20;

export default ({ add, get, title, overlay }) => {
  return [
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      id: 2,
      toolTipInfo: `Add ${title} Item`,
      click: add,
      unique: true,
      overlay
    },
    {
      iconName: "faRedo",
      iconSize: mainIconSize,
      id: 2,
      toolTipInfo: `Reload ${title} list`,
      click: get,
      unique: true
    }
  ];
};
