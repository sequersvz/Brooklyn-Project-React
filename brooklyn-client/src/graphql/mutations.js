// eslint-disable
// this is an auto generated file. This will be overwritten

export const CreateInboundEmail = `mutation CreateInboundEmails($input: CreateInboundEmailsInput!) {
  createInboundEmails(input: $input) {
    vendorId
    eeEmail
    miEmail
    vendorManagerEmail
    alertPref
  }
}
`;
export const UpdateInboundEmail = `mutation UpdateInboundEmails($input: UpdateInboundEmailsInput!) {
  updateInboundEmails(input: $input) {
    vendorId
    eeEmail
    miEmail
    vendorManagerEmail
    alertPref
  }
}
`;
export const DeleteInboundEmail = `mutation DeleteInboundEmails($input: DeleteInboundEmailsInput!) {
  deleteInboundEmails(input: $input) {
    vendorId
  }
}
`;
