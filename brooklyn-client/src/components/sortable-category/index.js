import React, { useState, useEffect } from "react";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
  arrayMove
} from "react-sortable-hoc";
import { EqualsIcon } from "../reviewitems/item.icons";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
export default React.memo(function SortableCategory({
  items,
  isOldReview,
  sortCategories,
  renderReviewItems
}) {
  const [sortedCategories, setSortedCategories] = useState([]);
  const [categoryPanels, setCategoryPanels] = useState({});

  useEffect(
    () => {
      const categories = items
        .reduce((categories, curItem) => {
          const { categoryName, categoryMeetingOrder, categoryId } = curItem;
          let index = categories.findIndex(c => c.name === categoryName);
          if (index === -1) {
            index = categories.length;
            let newCat = {
              id: categoryId,
              name: categoryName,
              items: [],
              order: categoryMeetingOrder
            };
            categories = [...categories, newCat];
          }
          let items = [...categories[index].items, curItem];
          categories[index].items = items;
          return categories;
        }, [])
        .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0));
      setSortedCategories(categories);
    },
    [items]
  );

  const handleChangePanel = name => () => {
    let value = categoryPanels[name];
    setCategoryPanels({ ...categoryPanels, [name]: !value });
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    let soritems = sortedCategories;
    soritems = arrayMove(soritems, oldIndex, newIndex);
    sortCategories(soritems);
  };

  const SortableCategory = SortableElement(({ category }) => (
    <Grid container key={category.id}>
      <Grid item xs={12} sm={12}>
        <ExpansionPanel
          expanded={categoryPanels[category.name]}
          onChange={handleChangePanel(category.name)}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <EqualsIcon
              sortableHandle={sortableHandle}
              style={{ marginTop: 3 }}
            />
            <strong style={{ fontSize: "1.4em" }}>{category.name}</strong>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid item xs={12} sm={12}>
              {renderReviewItems(category.items)}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    </Grid>
  ));

  const SortableList = SortableContainer(({ categories }) => (
    <ul style={{ cursor: "all-scroll" }}>
      {categories.map((category, index) => (
        <SortableCategory
          key={`category-${index}`}
          index={index}
          category={category}
          disabled={isOldReview}
        />
      ))}
    </ul>
  ));
  return (
    <div className="itemreview">
      <SortableList
        categories={sortedCategories}
        useDragHandle
        onSortEnd={onSortEnd}
        helperClass={"sortBox"}
        pressDelay={200}
      />
    </div>
  );
});
