const mainIconSize = 20;

export default ({ openModalInitiatives, goToStakeholderView }) => {
  return [
    {
      iconName: "faCrosshairs",
      iconSize: mainIconSize,
      id: 1,
      toolTipInfo: "Go to Stakeholder View",
      click: goToStakeholderView,
      unique: true
    },
    {
      iconName: "faFilter",
      iconSize: mainIconSize,
      id: 2,
      toolTipInfo: "Filter",
      click: () => {},
      unique: true
    },
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      id: 3,
      toolTipInfo: "Add Initiative",
      click: openModalInitiatives,
      unique: true
    }
  ];
};
