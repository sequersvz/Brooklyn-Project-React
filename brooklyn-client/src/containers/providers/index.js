import React from "react";
import AlertContext, { useAlert, initialState } from "./context/Alert";

function AllProviders({ children }) {
  const { message, variant, open, closeAlert, openAlert } = useAlert(
    initialState
  );
  return (
    <>
      <AlertContext.Provider
        value={{
          open,
          message,
          variant,
          openAlert,
          closeAlert
        }}
      >
        {children}
      </AlertContext.Provider>
    </>
  );
}
export default React.memo(AllProviders);
