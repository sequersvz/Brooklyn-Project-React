import React from "react";
import PropTypes from "prop-types";

const InputSlider = ({
  title,
  showEdit,
  showInputEdit,
  handleInputChange,
  nameLabel,
  ...props
}) => {
  return (
    <React.Fragment>
      {!showEdit[title] ? (
        <p className="itemAlign" onClick={() => showInputEdit(title, true)}>
          {title}
        </p>
      ) : (
        <input
          name={nameLabel}
          type="text"
          style={{ fontSize: 14, width: 200 }}
          defaultValue={title}
          onBlur={handleInputChange}
          onKeyPress={event => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.target.blur();
            }
          }}
          autoFocus={true}
        />
      )}
      <input {...props} id="typeinp" type="range" min="1" max="5" step="1" />
      <br />
    </React.Fragment>
  );
};

export default React.memo(InputSlider);

InputSlider.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
