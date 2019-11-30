export const globalFilters = [
  {
    label: "Strategic",
    name: "strategic",
    open: false,
    type: "checkbox",
    options: [
      { label: "Strategic", value: true, checked: false },
      { label: "Non-Strategic", value: false, checked: false }
    ],
    selected: []
  },
  {
    label: "Critical",
    name: "critical",
    open: false,
    type: "checkbox",
    options: [
      { label: "Critical", value: true, checked: false },
      { label: "Non-Critical", value: false, checked: false }
    ],
    selected: []
  },
  {
    label: "Vendor Tier",
    name: "tierId",
    open: false,
    type: "checkbox",
    options: [
      { label: "1", value: 1, checked: false },
      { label: "2", value: 2, checked: false },
      { label: "3", value: 3, checked: false },
      { label: "4", value: 4, checked: false },
      { label: "5", value: 5, checked: false }
    ],
    selected: []
  },
  {
    label: "PIP",
    name: "performanceImprovementPlan",
    open: false,
    type: "checkbox",
    options: [
      { label: "Performance Improvement Plan", value: true, checked: false },
      {
        label: "Non-Performance Improvement Plan",
        value: false,
        checked: false
      }
    ],
    selected: []
  },
  {
    label: "Vendor",
    name: "vendorId",
    open: false,
    type: "select",
    isRemote: true,
    options: [],
    selected: []
  },
  {
    label: "BU Owner",
    name: "businessunit",
    open: false,
    type: "select",
    isRemote: false,
    options: [],
    selected: []
  },
  {
    label: "Vendor Manager",
    name: "manager",
    open: false,
    type: "select",
    isRemote: false,
    options: [],
    selected: []
  },
  {
    label: "Group",
    name: "groupId",
    open: false,
    type: "select",
    isRemote: false,
    options: [],
    selected: []
  }
];
const ownerFilter = [
  {
    label: "Owner",
    name: "ownerId",
    open: false,
    type: "select",
    options: [],
    selected: []
  }
];

const statusFilter = [
  {
    label: "Status",
    name: "closed",
    open: false,
    type: "checkbox",
    options: [
      { label: "Open", value: false, checked: false },
      { label: "Closed", value: true, checked: false }
    ],
    selected: []
  }
];
export const reportsFiltersActionLog = [...statusFilter, ...ownerFilter];

export const reportsFilters = [
  {
    label: "Category",
    name: "category",
    open: false,
    type: "select",
    isRemote: false,
    options: [],
    selected: []
  },
  {
    label: "Checkpoint",
    name: "checkpoint",
    open: false,
    type: "select",
    isRemote: true,
    options: [],
    selected: []
  },
  {
    label: "Aspect",
    name: "aspect",
    open: false,
    type: "select",
    isRemote: false,
    options: [
      { label: "Total Cost Optimizations", value: 1 },
      { label: "Invoiced YTD", value: 2 },
      { label: "Annual Contract Value", value: 3 },
      { label: "Total Contract Value", value: 4 }
    ],
    selected: []
  }
];

export const globalSetFilters = [
  {
    label: "Global Set",
    name: "set",
    open: false,
    type: "select",
    options: [
      { label: "Strategic / Non Strategic", value: 1 },
      { label: "Critical / Non Critical", value: 2 },
      { label: "Vendor Tier", value: 3 },
      { label: "PIP / Non PIP", value: 4 },
      { label: "BU Owner", value: 6 },
      { label: "Vendor Manager", value: 7 }
    ],
    selected: []
  }
];
