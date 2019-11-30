import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";

const styles = {
  avatar: {
    width: 35,
    height: 35,
    margin: "0px 2px"
  },
  redBackground: {
    backgroundColor: colors.red[500]
  },
  pinkBackground: {
    backgroundColor: colors.pink[500]
  },
  purpleBackground: {
    backgroundColor: colors.purple[500]
  },
  deepPurpleBackground: {
    backgroundColor: colors.deepPurple[500]
  },
  indigoBackground: {
    backgroundColor: colors.indigo[500]
  },
  blueBackground: {
    backgroundColor: colors.blue[500]
  },
  lightBlueBackground: {
    backgroundColor: colors.lightBlue[500]
  },
  cyanBackground: {
    backgroundColor: colors.cyan[500]
  },
  tealBackground: {
    backgroundColor: colors.teal[500]
  },
  greenBackground: {
    backgroundColor: colors.green[500]
  },
  lightGreenBackground: {
    backgroundColor: colors.lightGreen[500]
  },
  limeBackground: {
    backgroundColor: colors.lime[500]
  },
  yellowBackground: {
    backgroundColor: colors.yellow[500]
  },
  amberBackground: {
    backgroundColor: colors.amber[500]
  },
  orangeBackground: {
    backgroundColor: colors.red[500]
  },
  deepOrangeBackground: {
    backgroundColor: colors.deepOrange[500]
  },
  brownBackground: {
    backgroundColor: colors.brown[500]
  },
  greyBackground: {
    backgroundColor: colors.grey[500]
  },
  blueGreyBackground: {
    backgroundColor: colors.blueGrey[500]
  }
};

const TimelineAvatar = ({ user, classes }) => {
  if (!user) {
    return null;
  }
  if (user.picture) {
    return (
      <Avatar src={user.picture} alt={user.name} className={classes.avatar} />
    );
  } else {
    // assuming the user's name is firstName and LastName
    const [first, last] = (user.name || "").toUpperCase().split(" ");
    const palettes = [
      "red",
      "pink",
      "purple",
      "deepPurple",
      "indigo",
      "blue",
      "lightBlue",
      "cyan",
      "teal",
      "green",
      "lightGreen",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deepOrange",
      "brown",
      "grey",
      "blueGray"
    ];
    const randomPalette = Math.floor(Math.random() * 19);
    return (
      <Avatar
        className={[
          classes.avatar,
          classes[`${palettes[randomPalette]}Background`]
        ].join(" ")}
      >
        {(first && first[0]) + (last ? last[0] : "")}
      </Avatar>
    );
  }
};

export default withStyles(styles)(TimelineAvatar);
