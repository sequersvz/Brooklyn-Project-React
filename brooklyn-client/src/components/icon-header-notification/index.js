import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./icon-header-notification.css";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import headerNotifications from "./header-notifications.png";
import { mockup } from "../../config/config";

export default function HeaderNotification() {
  const [showImgNotifications, setShowImgNotifications] = useState(false);
  const ref = useRef(null);

  const clickShowNotifications = e => {
    e.preventDefault();
    if (!mockup) return;
    const notificacionState = !showImgNotifications;
    setShowImgNotifications(notificacionState);
  };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowImgNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div className="drop-icon-header-notification" ref={ref}>
      {!showImgNotifications &&
        mockup && (
          <span
            className="circle-notification"
            style={{
              cursor: "pointer"
            }}
            onClick={clickShowNotifications}
          />
        )}
      <div
        className="btn btn-alert"
        onClick={clickShowNotifications}
        role="button"
      >
        <FontAwesomeIcon icon={faBell} />
      </div>
      {showImgNotifications && (
        <div className="drop-content-icon-header-notification">
          <img src={headerNotifications} alt="notifications" />
        </div>
      )}
    </div>
  );
}
