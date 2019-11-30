import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

class SearchBox extends React.Component {
  state = { showDisplay: false };

  handleSearchDisplayState = state =>
    this.setState(prevState => ({
      showDisplay: state || !prevState.showDisplay
    }));

  render() {
    const { showDisplay } = this.state;
    return (
      <div className="search">
        <form>
          <span className="boxIcon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            name="name"
            placeholder="Search"
            autoComplete="off"
            onFocus={() => {
              this.handleSearchDisplayState(true);
            }}
            onBlur={() => {
              this.handleSearchDisplayState(false);
            }}
          />
        </form>

        {showDisplay && (
          <div className="searchDisplay">
            <p className="searchTitle">Reviews</p>
            <hr />
            <p className="searchName">Review Test AWS</p>
            <p className="searchCategory">Delivery / Accuracy</p>
            <p className="searchDate">12 march 2019</p>
            <p className="searchName">Test Configuration</p>
            <p className="searchCategory">Delivery / Accuracy</p>
            <p className="searchDate">25 march 2019</p>
            <p className="searchTitle">Files</p>
            <hr />
            <p className="searchName">file25032019.pdf</p>
            <p className="searchDate">02 april 2019</p>
            <p className="searchName">Brooklyn25032019.png</p>
            <p className="searchDate">19 april 2019</p>
          </div>
        )}
      </div>
    );
  }
}

export default SearchBox;
