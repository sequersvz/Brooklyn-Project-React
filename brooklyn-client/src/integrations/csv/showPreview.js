import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

const previewStyles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {}
});
const Preview = props => (
  <Card className={props.classes.root}>
    <CardContent>
      <Table className={props.classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{props.data[props.dataFields["name"]]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Invoiced YTD</TableCell>
            <TableCell>{props.data[props.dataFields["invoice"]]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total cost optimizations</TableCell>
            <TableCell>{props.data[props.dataFields["tco"]]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Number of cost optimizations</TableCell>
            <TableCell>{props.data[props.dataFields["nco"]]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CSAT (%)</TableCell>
            <TableCell>{props.data[props.dataFields["csat"]]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
const StyledPreview = withStyles(previewStyles)(Preview);

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

const ShowPreview = props => (
  <div>
    {props.data.map((d, index) => (
      <StyledPreview data={d} key={index} dataFields={props.dataFields} />
    ))}
    <Button
      onClick={props.onReady}
      variant="contained"
      color="primary"
      className={props.classes.button}
    >
      Next
    </Button>
  </div>
);
export default withStyles(styles)(ShowPreview);
