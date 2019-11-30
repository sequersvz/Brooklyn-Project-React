import React, { useState, useCallback, useContext } from "react";
const initialState = {
  message: "Welocome Back To Brooklyn!",
  variant: "success",
  open: false
};
const AlertContext = React.createContext();

function useAlert(initialValue) {
  const [alertState, setAlert] = useState(initialValue);
  const { message, variant, open } = alertState;

  const openAlert = useCallback(({ message, variant }) => {
    setAlert({ ...alertState, open: true, message, variant });
  });

  const closeAlert = useCallback(() => {
    setAlert({ ...alertState, open: false, message: "" });
  });

  return { openAlert, closeAlert, message, variant, open };
}

function useBrooklynAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("Alert Context must be used within an Alert Provider");
  }
  return context;
}
export { initialState, useAlert, useBrooklynAlert };
export default AlertContext;
