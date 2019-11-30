import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const CompanyName = ({ name, changeCompanyName }) => {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <div>
      <Formik
        enableReinitialize
        initialValues={{ name }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .trim()
            .min(2, "The name is too short")
            .required("The company name cannot be empty")
        })}
        onSubmit={values => {
          changeCompanyName(values.name);
          setEditing(false);
        }}
        render={props => (
          <React.Fragment>
            <input
              name="name"
              value={props.values.name}
              onChange={props.handleChange}
              onBlur={props.handleSubmit}
              onKeyPress={event => {
                if (event.key === "Enter") {
                  props.handleSubmit();
                }
              }}
              autoFocus
            />
            {props.errors.name && (
              <p style={{ color: "red" }}>{props.errors.name}</p>
            )}
          </React.Fragment>
        )}
      />
    </div>
  ) : (
    <div onClick={() => setEditing(true)}>
      <p>
        <strong>Company Name:</strong> {name}
      </p>
      <hr />
    </div>
  );
};

export default CompanyName;
