// eslint-disable
// this is an auto generated file. This will be overwritten

export const GetInboundEmails = `query GetInboundEmails($vendorId: String!) {
  getInboundEmails(vendorId: $vendorId) {
    vendorId
    eeEmail
    miEmail
    vendorManagerEmail
    alertPref
  }
}
`;
export const ListInboundEmails = `query ListInboundEmails(
  $filter: TableInboundEmailsFilterInput
  $limit: Int
  $nextToken: String
) {
  listInboundEmails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      vendorId
      eeEmail
      miEmail
    	vendorManagerEmail
      alertPref
    }
    nextToken
  }
}
`;

export const ListActivities = `query ListActivities(
  $filter: TableActivitiesFilterInput
  $limit: Int
  $nextToken: String
) {
  listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      type
      status
      vendorId
      timestamp
      body
      errorMessage
    }
    nextToken
  }
}
`;
