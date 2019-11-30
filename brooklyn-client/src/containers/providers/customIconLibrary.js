import { memo, useEffect } from "react";
import { getAllCategories } from "../service/category.service";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as icons from "@fortawesome/free-solid-svg-icons";

const faActivityPipeline = {
  prefix: "fas",
  iconName: "activity-pipeline",
  icon: [
    5000,
    2000,
    [],
    null,
    //this value what's inside d="" in the svg
    "M364.3,2103.1c-179-93-296-326-341-680c-23-183-15-613,15-773c27-147,63-260,119-375c37-76,62-110,122-171c41-41,91-83,112-92c33-16,175-17,1940-16c1046,1,1887,4,1867,8c-166,33-302,315-355,741c-18,148-18,482,0,630c53,426,189,708,355,741c20,4-826,7-1879,7l-1915,1L364.3,2103.1zM4211.3,2043.1c-185-91-317-566-299-1073c22-605,224-1005,451-895c61,29,109,87,161,195c53,108,86,218,116,391c21,114,23,161,23,399s-2,285-23,399c-30,173-63,283-116,391c-52,107-100,166-158,194C4311.3,2071.1,4265.3,2071.1,4211.3,2043.1z"
  ]
};

const faRisk = {
  prefix: "fas",
  iconName: "risk",
  icon: [
    348,
    512,
    [],
    null,
    //this value what's inside d="" in the svg
    "M33,360.6L220.2,36.3c7-12.1,24.5-12.1,31.5,0L439,360.6c7,12.1-1.8,27.3-15.8,27.3H48.8C34.8,387.9,26,372.7,33,360.6z"
  ]
};

function CustomIconLibrary({ user }) {
  const onError = error => {
    console.log(error);
  };
  const stringToIconName = _string => {
    return `fa${_string[0].toUpperCase() + _string.slice(1)}`;
  };
  const toCamelCase = str => {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
  };
  const getIconFromCategoriesOnSuccess = result => {
    result.forEach(({ iconClassName }) => {
      if (!iconClassName) return;
      let iconName = stringToIconName(toCamelCase(iconClassName));
      if (!icons[iconName]) return;
      library.add(icons[iconName]);
    });

    library.add(
      faActivityPipeline,
      faRisk,
      icons["faFilter"],
      icons["faMobileAlt"],
      icons["faEnvelope"],
      icons["faEdit"],
      icons["faAngleDoubleUp"],
      icons["faSpinner"],
      icons["faUsers"],
      icons["faChartLine"],
      icons["faRobot"]
    );
  };

  const getIconFromCategories = getAllCategories(
    getIconFromCategoriesOnSuccess,
    onError
  );

  useEffect(
    () => {
      getIconFromCategories();
    },
    [user]
  );

  return null;
}

export default memo(
  CustomIconLibrary,
  (prev, next) => prev.user.id === next.user.id
);
