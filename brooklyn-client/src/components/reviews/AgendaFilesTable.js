import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFileNameFromUrl, getIconFromFileName } from "../../Utils";

const styles = () => ({
  head: {
    fontSize: "1.40rem",
    fontWeight: "600"
  }
});

const AgendaFilesTable = ({ files, getFile, classes }) => {
  const allFiles = files.slice();
  // show only files from itemreview parent
  files = files.filter(file => {
    const search = allFiles.find(searchFile => searchFile.path === file.path);
    const reverseSearch = allFiles
      .reverse()
      .find(reverseSearchFile => reverseSearchFile.path === file.path);
    const sameFileDifferentCategory =
      search.categoryCheckpoint !== reverseSearch.categoryCheckpoint;
    if (
      // current file is from Action Log category and the parent RI has the same file
      file.categoryCheckpoint.includes("Action Log") &&
      sameFileDifferentCategory
    ) {
      return false;
    }
    return true;
  });

  const body = files.map((file, index) => {
    const fileName = getFileNameFromUrl(file.path);
    const icon = getIconFromFileName(fileName.pretty);
    return (
      <TableRow key={index}>
        <TableCell>
          <FontAwesomeIcon
            icon={icon}
            pull="left"
            color="#555555"
            style={{ marginRight: 5 }}
            data-tip="File type"
          />
          <p
            onClick={() => getFile(fileName.original)}
            style={{
              cursor: "pointer",
              display: "inline-block"
            }}
          >
            {fileName.pretty}
          </p>
        </TableCell>
        <TableCell>{file.categoryCheckpoint}</TableCell>
      </TableRow>
    );
  });
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.head}>Files</TableCell>
          <TableCell className={classes.head}>Category / Checkpoint</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{body}</TableBody>
    </Table>
  );
};

export default withStyles(styles)(AgendaFilesTable);
