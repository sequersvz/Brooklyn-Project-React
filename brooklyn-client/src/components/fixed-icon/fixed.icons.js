import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import timeout from "timeout";
import { OverlayTrigger } from "react-bootstrap";
import ContractStatusFilterPanel from "../contract-status-filter-panel";

class FixedIcons extends PureComponent {
  state = {
    size: 130
  };
  render() {
    const { iconsData } = this.props;
    const { aditionTop } = this.props;
    let { iconId, dontMove, subIconsCount } = this.state;
    const IconMap = iconsData.map((icon, _index) => {
      let SubIconMap;
      let iconParent = icon;
      let subicon = icon.subIcon;
      let aditionTopMain = !aditionTop ? 0 : aditionTop;
      if (typeof icon.subIcon !== "undefined") {
        SubIconMap = icon.subIcon.map((icon, index) => {
          return (
            <div
              data-tip={icon.toolTipInfo}
              key={index}
              style={{
                position: "fixed",
                padding: 8,
                background: "rgba(0, 0, 0, .5)",
                zIndex: 1031,
                borderRadius: 20,
                textAlign: "center",
                cursor: "pointer",
                width: 30,
                height: icon.height,
                right: icon.right,
                top: aditionTopMain + 190 + _index * 45 + index * 35,
                display: iconParent.id === iconId ? "block" : "none"
              }}
              onClick={icon.disabled ? null : icon.click ? icon.click : null}
              onMouseOver={() => {
                timeout.timeout("myTimeout", null);
              }}
              onMouseOut={() => {
                timeout.timeout("myTimeout", null);
              }}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: icon.fontSize,
                  color: "rgb(255, 255, 255)"
                }}
                icon={icons[icon.iconName]}
              />
            </div>
          );
        });
      } else {
        SubIconMap = <div />;
      }
      const len = subicon ? 20 * subIconsCount : 45;
      const fixedLen = 45 * _index + 145 + aditionTopMain;
      const top =
        icon.id > iconId ? aditionTopMain + len + fixedLen + 45 : fixedLen;
      const topCalc = dontMove ? fixedLen : top;
      const iconDiv = (
        <div
          data-testid="newReviewItemButton"
          data-tip={icon.toolTipInfo}
          key={_index}
          style={{
            transition: "all 250ms",
            position: "fixed",
            top: topCalc,
            right: 5,
            width: iconsData.width === undefined ? 40 : iconsData.width,
            height: 40,
            padding: 10,
            background: "rgba(0, 0, 0, .5)",
            zIndex: 1031,
            borderRadius: 20,
            textAlign: "center",
            cursor: "pointer"
          }}
          onClick={icon.click ? icon.click : null}
          onMouseOver={() => {
            let dontMove = !!icon.unique;
            this.setState({
              iconId: icon.id,
              dontMove: dontMove,
              subIconsCount: icon.subIcon ? icon.subIcon.length : 0
            });
          }}
          onMouseOut={() => {
            this.setState({ blockSubIconDIv: true });
            timeout.timeout("myTimeout", 3000, () => {
              this.setState({ blockSubIconDIv: false });
              this.state.blockSubIconDIv === false
                ? this.setState({ iconId: 100 })
                : this.setState({ iconId: icon.id });
            });
          }}
        >
          <FontAwesomeIcon
            style={{
              fontSize: icon.iconSize,
              color: "rgb(255, 255, 255)"
            }}
            icon={icons[icon.iconName]}
          />
          {SubIconMap}
        </div>
      );

      return icon.iconName === "faFilter" ? (
        <OverlayTrigger
          key={_index}
          container={this}
          placement="left"
          trigger="click"
          rootClose
          overlay={<ContractStatusFilterPanel top={topCalc - 130} />}
        >
          {iconDiv}
        </OverlayTrigger>
      ) : icon.overlay ? (
        <OverlayTrigger
          ref={n => (this.overlay = n)}
          key={_index}
          container={this}
          placement="left"
          trigger="click"
          rootClose
          overlay={icon.overlay}
        >
          {iconDiv}
        </OverlayTrigger>
      ) : (
        iconDiv
      );
    });
    return (
      <>
        <div>
          {IconMap}
          <ReactTooltip />
        </div>
      </>
    );
  }
}

export default FixedIcons;
