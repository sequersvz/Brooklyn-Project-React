const mainIconSize = 20;

export default handlers => {
  const { openModalAddVendor, importCsv, importApi } = handlers;
  return [
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      click: openModalAddVendor
    },
    {
      iconName: "faFileCsv",
      iconSize: mainIconSize,
      click: importCsv
    },
    {
      iconName: "faFileImport",
      iconSize: mainIconSize,
      click: importApi
    },
    {
      iconName: "faCog",
      iconSize: mainIconSize
    }
  ];
};
