import React from "react";
import { Row, Col } from "react-bootstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const SearchKitCheckboxOption = props => {
  return (
    <span>
      <Row
        style={{
          marginBottom: 11,
          marginTop: -26
        }}
      >
        <Col md={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.checked}
                onClick={props.onClick}
                color="default"
                name={props.label}
              />
            }
            label={props.label}
            className="nameInsideTheFilters"
          />
        </Col>
      </Row>
    </span>
  );
};

export default SearchKitCheckboxOption;
