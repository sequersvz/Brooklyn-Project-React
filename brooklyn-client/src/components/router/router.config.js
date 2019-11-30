import React from "react";
import { Redirect } from "react-router-dom";
import Review from "../app/App.layout";
import Assurance from "../../pages/assurance";
import VendorStudio from "../../pages/vendorStudio";
import Vendor from "../../pages/vendor";
import Collaborate from "../../pages/collaborate";
import Insight from "../../pages/insight";
import Home from "../../pages/home";
import machineLearningStudio from "../../pages/machineLearningStudio";
import invoiceStudioStudio from "../../pages/invoiceStudioStudio";
import journey from "../../pages/journey";
import Configuration from "../../pages/configuration";
import WhatDoIHaveToDoToday from "../../pages/whatDoIHaveToDoToday";
import userProfile from "../../pages/userProfile";
import IntCsv from "../../integrations/csv";
import IntApi from "../../integrations/api";
import Reports from "../../pages/reports";
import ActivityLog from "../../pages/activityLog";
import Risks from "../../pages/risks";
import ActionLog from "../../pages/actionLog";
import StakeholderNavigator from "../../pages/stakeholderNavigator";

const routerConfig = isAdmin => {
  const adminRoute = AdminRoute =>
    isAdmin ? <AdminRoute /> : <Redirect to="/home" />;
  return [
    {
      path: "/home",
      component: Home,
      name: "Home",
      exact: true,
      strict: true
    },
    {
      path: "/activitylog",
      component: ActivityLog,
      name: "Activty Log",
      exact: true,
      strict: true
    },
    {
      path: "/assurance",
      component: Assurance,
      name: "Assurance",
      exact: true,
      strict: true
    },
    {
      path: "/assurance/review/:id",
      component: Review,
      name: "Review",
      exact: true
    },
    {
      path: "/assurance/what-do-i-have-to-do-today",
      component: WhatDoIHaveToDoToday,
      name: "What do I have to do today",
      exact: true
    },
    {
      path: "/assurance/risks",
      component: Risks,
      name: "Risks",
      exact: true
    },
    {
      path: "/assurance/action-log",
      component: ActionLog,
      name: "Action Log",
      exact: true,
      strict: true
    },
    {
      path: "/vendor",
      component: VendorStudio,
      name: "Vendor Studio",
      routes: [
        {
          path: "/vendor/:id/journey",
          component: journey,
          name: "Journey",
          exact: true,
          strict: true
        },
        {
          path: "/vendor/:id",
          component: Vendor,
          name: "Vendor"
        },
        {
          name: "Tier",
          path: `/vendor/:id/tier`
        },
        {
          name: "Profile",
          path: `/vendor/:id/profile`
        },
        {
          name: "Contacts",
          path: `/vendor/:id/contacts`
        },
        {
          name: "Email settings",
          path: `/vendor/:id/email-settings`
        },
        {
          name: "Activity",
          path: `/vendor/:id/activity`
        },
        {
          name: "Files",
          path: `/vendor/:id/files`
        }
      ]
    },
    {
      path: "/collaborate",
      component: Collaborate,
      name: "Collaborate",
      exact: true,
      strict: true
    },
    {
      path: "/insight",
      component: Insight,
      name: "Insight",
      exact: true,
      strict: true
    },
    {
      path: "/machine-learning-studio",
      component: machineLearningStudio,
      name: "Machine Learning Studio",
      exact: true,
      strict: true
    },
    {
      path: "/invoice-studio",
      component: invoiceStudioStudio,
      name: "Invoice Studio",
      exact: true,
      strict: true
    },
    {
      path: "/integrations/csv",
      component: IntCsv,
      name: "",
      exact: true,
      strict: true
    },
    {
      path: "/integrations/api",
      component: IntApi,
      name: "",
      exact: true,
      strict: true
    },
    {
      path: "/profile",
      component: userProfile,
      name: "Profile",
      exact: true,
      strict: true
    },
    {
      path: "/report",
      component: Reports,
      name: "Reports",
      exact: true,
      strict: true
    },
    {
      path: "/configuration",
      name: "Configuration",
      component: function AdminRoute() {
        return adminRoute(Configuration);
      },
      exact: true
    },
    {
      path: "/stakeholder",
      name: "Stakeholder Navigator",
      component: StakeholderNavigator,
      exact: true
    }
  ];
};

export default routerConfig;
