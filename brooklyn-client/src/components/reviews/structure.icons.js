const rightSubIcon = 11;
const mainIconSize = 20;
const secondaryIconSize = 5;

export default handlers => {
  const {
    addReviewItem,
    openModalAddReviewCheckpoint,
    openModalExport,
    openModalReview,
    isOldReview,
    isAddingReviewItem,
    openModalDeleteReview,
    disableAddReviewItemButton,
    categoryNAME,
    goToRoute,
    cloneReview
  } = handlers;

  //filter icon when review is old
  const filterIcon = (item, filteredIcon) => {
    if (isOldReview) {
      return item.iconName !== filteredIcon;
    }
    if (filteredIcon === "faPlus" && disableAddReviewItemButton) {
      return item.iconName !== filteredIcon;
    }
    return true;
  };

  return [
    {
      iconName: "faPlus",
      iconSize: mainIconSize,
      id: 2,
      substractLast: true,
      subIcon: [
        {
          click: addReviewItem,
          disabled: isAddingReviewItem,
          iconName: "faListUl",
          iconSize: secondaryIconSize,
          toolTipInfo:
            categoryNAME !== "Action Log" ? "Review item" : "Action Item",
          width: 30,
          height: 30,
          fontSize: 10,
          right: rightSubIcon,
          id: 3,
          subtractTopSubicon: 46
        },
        {
          click: openModalAddReviewCheckpoint,
          iconName: "faMapPin",
          iconSize: secondaryIconSize,
          toolTipInfo: "Checkpoint",
          width: 30,
          height: 30,
          fontSize: 10,
          right: rightSubIcon,
          id: 3.1,
          subtractTopSubicon: 55
        }
        // disable add checkpoint button when action log category is selected
      ].filter(
        icon =>
          categoryNAME !== "Action Log" ||
          (icon.iconName !== "faMapPin" && categoryNAME === "Action Log")
      )
    },
    {
      iconName: "faDownload",
      iconSize: mainIconSize,
      id: 4,
      click: openModalExport,
      subIcon: [
        {
          iconName: "faFilePdf",
          iconSize: secondaryIconSize,
          toolTipInfo: "PDF",
          width: 30,
          height: 30,
          fontSize: 10,
          right: rightSubIcon,
          id: 4.1,
          subtractTopSubicon: 90
        }
      ]
    },
    {
      iconName: "faCog",
      iconSize: mainIconSize,
      id: 5,
      lastIcon: true,
      subIcon: [
        {
          click: openModalReview,
          iconName: "faPlusCircle",
          iconSize: secondaryIconSize,
          toolTipInfo: "New Review",
          width: 30,
          height: 30,
          fontSize: 12,
          right: rightSubIcon,
          id: 5.1,
          subtractTopSubicon: 46
        },
        {
          click: openModalDeleteReview,
          iconName: "faTrash",
          iconSize: secondaryIconSize,
          toolTipInfo: "Delete Review",
          width: 30,
          height: 30,
          fontSize: 12,
          right: rightSubIcon,
          id: 5.2,
          subtractTopSubicon: 55
        },
        {
          click: cloneReview,
          iconName: "faClone",
          iconSize: secondaryIconSize,
          toolTipInfo: "Clone Review",
          width: 30,
          height: 30,
          fontSize: 12,
          right: rightSubIcon,
          id: 5.2,
          subtractTopSubicon: 55
        }
        //cog sub icons
      ].filter(item => filterIcon(item, "faTrash"))
    },
    {
      iconName: "faList",
      iconSize: mainIconSize,
      id: 6,
      toolTipInfo: "What do I have to do today",
      unique: true,
      click: goToRoute("/assurance/what-do-i-have-to-do-today")
    }
    //main icons
  ].filter(item => filterIcon(item, "faPlus"));
};
