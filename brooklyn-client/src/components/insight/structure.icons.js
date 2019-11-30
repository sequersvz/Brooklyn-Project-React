const mainIconSize = 20;

export default handlers => {
  const { openModalAdd } = handlers;
  return [
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      id: 2,
      substractLast: true,
      click: openModalAdd
    }
  ];
};
