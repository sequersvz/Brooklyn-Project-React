import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFileNameFromUrl, getIconFromFileName } from "../../../Utils";

class FileTable extends PureComponent {
  state = {
    data: [],
    columns: []
  };

  componentDidMount() {
    this.buildTableColumns();
    this.buildTableData(this.props.files);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.files !== this.props.files) {
      this.buildTableData(nextProps.files);
    }
  }

  getIconFileType(filePath) {
    let file = getFileNameFromUrl(filePath);
    let fileExtension = getIconFromFileName(file.pretty);
    file.iconfileType = fileExtension;
    return file;
  }

  buildTableColumns() {
    const { type, handleOnDeleteClick, handleOnFileClick } = this.props;
    let cols = [];
    if (handleOnFileClick) {
      cols = [
        {
          dataField: "name",
          text: "File",
          formatter: this.fileFormatter
        }
      ];
    }

    if (type === "reviewitem") {
      cols = cols.concat([
        {
          dataField: "date",
          text: "Date",
          sort: true,
          formatter: this.dateFormatter
        },
        {
          dataField: "reviewName",
          text: "Review",
          formatter: this.reviewFormatter
        },
        {
          dataField: "checkpointName",
          text: "Checkpoint",
          formatter: this.checkpointFormatter
        },
        {
          dataField: "reviewitemName",
          text: "Review Item",
          formatter: this.reviewItemFormatter
        }
      ]);
    }

    if (handleOnDeleteClick) {
      cols = cols.concat([
        {
          dataField: "id",
          text: "",
          formatter: this.deleteFormatter
        }
      ]);
    }

    this.setState({ columns: cols });
  }

  buildTableData(files) {
    let tempData = files.map((file, i) => {
      let tempFile = {};
      let iconfile = this.getIconFileType(file.path);
      tempFile.name = iconfile.pretty;
      tempFile.key = iconfile.original + i;
      tempFile.original = iconfile.original;
      tempFile.iconfile = iconfile.iconfileType;

      if (file.date) file.date = this.formatDate(file.date);
      Object.assign(tempFile, file);
      return tempFile;
    });
    this.setState({
      data: tempData
    });
  }

  formatDate(date) {
    let options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  fileFormatter = (cell, row, rowIndex) => {
    const { iconfile, name, original } = this.state.data[rowIndex];
    const { handleOnFileClick, type } = this.props;
    return (
      <div>
        <FontAwesomeIcon
          icon={iconfile}
          style={{
            fontSize: 14
          }}
          color={"#555555"}
        />
        <div className="block">
          <p
            style={{
              color: "#555555",
              cursor: "pointer"
            }}
            onClick={
              type === "reviewitem"
                ? handleOnFileClick(original)
                : handleOnFileClick(original, true)
            }
          >
            {name}
          </p>
        </div>
      </div>
    );
  };

  deleteFormatter = cell => {
    const fileName = (this.state.data.find(item => item.id === cell) || {})
      .original;
    return (
      <div style={{ float: "right" }}>
        <FontAwesomeIcon
          icon={faTrash}
          style={{
            cursor: "pointer",
            fontSize: 14
          }}
          color={"#555555"}
          onClick={this.props.handleOnDeleteClick(cell, fileName)}
        />
      </div>
    );
  };

  reviewFormatter = (cell, row, rowIndex) => {
    const { reviewId } = this.state.data[rowIndex];

    return (
      <Link to={`/assurance/review/${reviewId}`}>
        <p
          style={{
            color: "#555555",
            cursor: "pointer"
          }}
        >
          {cell}
        </p>
      </Link>
    );
  };
  dateFormatter = cell => {
    return (
      <p
        style={{
          color: "#555555"
        }}
      >
        {cell}
      </p>
    );
  };
  checkpointFormatter = (cell, row, rowIndex) => {
    const { reviewId, checkpointId, categoryId } = this.state.data[rowIndex];

    return (
      <Link
        to={`/assurance/review/${reviewId}?checkpointId=${checkpointId}&categoryId=${categoryId}`}
      >
        <p
          style={{
            color: "#555555",
            cursor: "pointer"
          }}
        >
          {cell}
        </p>
      </Link>
    );
  };

  reviewItemFormatter = (cell, row, rowIndex) => {
    const { reviewId, checkpointId, categoryId } = this.state.data[rowIndex];

    return (
      <Link
        to={`/assurance/review/${reviewId}?checkpointId=${checkpointId}&categoryId=${categoryId}`}
      >
        <p
          style={{
            color: "#555555",
            cursor: "pointer"
          }}
        >
          {cell}
        </p>
      </Link>
    );
  };

  render() {
    const { columns, data } = this.state;
    if (data.length < 1) {
      return (
        <div>
          <p>
            {this.props.type === "reviewitem"
              ? "No files attached to any Review Item"
              : "No files attached to the Vendor record"}
          </p>
        </div>
      );
    } else if (data.length > 0) {
      return (
        <BootstrapTable
          keyField="key"
          data={data}
          columns={columns}
          bordered={false}
        />
      );
    }
  }
}

export default FileTable;
