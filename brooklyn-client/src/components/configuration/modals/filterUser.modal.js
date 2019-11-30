import React, { PureComponent } from "react";

class FilterVendor extends PureComponent {
  render() {
    const {
      show,
      handleInputChange,
      queryOrderBy,
      itemCheckedFilterModal,
      changeItemCheckedFilterModal
    } = this.props;

    return (
      <div
        className="row"
        style={{
          display: show === true ? "block" : "none"
        }}
      >
        <div className="col-md-2">
          <div
            className="card"
            style={{
              position: "fixed",
              top: 117,
              float: "right",
              width: 181,
              left: 1133
            }}
          >
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-left">
                      <b>Filter</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left">
                      <div className="form-check form-check-inline">
                        <label className="form-check-label">
                          <span
                            style={{
                              position: "relative",
                              top: -11
                            }}
                          >
                            ID
                          </span>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="id"
                            onChange={e => {
                              handleInputChange(e);
                              queryOrderBy("id");
                              changeItemCheckedFilterModal("id");
                            }}
                            checked={
                              itemCheckedFilterModal === "id" ? true : ""
                            }
                          />
                          <span className="form-check-sign">
                            <span className="check" />
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">
                      <div className="form-check form-check-inline">
                        <label className="form-check-label">
                          <span
                            style={{
                              position: "relative",
                              top: -11
                            }}
                          >
                            NAME
                          </span>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="name"
                            onChange={e => {
                              handleInputChange(e);
                              queryOrderBy("name");
                              changeItemCheckedFilterModal("name");
                            }}
                            checked={
                              itemCheckedFilterModal === "name" ? true : ""
                            }
                          />
                          <span className="form-check-sign">
                            <span className="check" />
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FilterVendor;
