const mainIconSize = 20;

export default handlers => {
  const { openModalAddUser } = handlers;
  return [
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      click: openModalAddUser
    }
  ];
};
