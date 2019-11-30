import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import CircularProgressbar from "./CircularProgressBar";
import InputSlider from "./InputSlider";
import { makeCancelable } from "../../../Utils";
import { API } from "aws-amplify";
let lastTierRequest = undefined;

export default function vendorTierAndScoreTab(props) {
  const {
    account,
    vendor,
    editAccount,
    editVendorProfile,
    renderVendorLogo
  } = props;
  const [tierInfo, setTierInfo] = useState({});
  const [showEdit, setShowEdit] = useState(null);
  const [tier, setTier] = useState(0);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState([]);

  const handleInputChange = ({ target: { name, value } }) => {
    editAccount(account.id, { [name]: value });
    setShowEdit(null);
  };

  const showInputEdit = (property, value) => setShowEdit({ [property]: value });

  const loadScore = event => {
    let scoreName = event.target.name;
    let scoreOne = { [scoreName]: parseInt(event.target.value, 10) };
    let newScores = Object.assign({}, scores, scoreOne);
    delete newScores.tierId;
    setScores(newScores);
    let newScore = Object.values(newScores).reduce(
      (pre, item) => (pre += parseInt(item, 10)),
      0
    );
    let tier = loadTier(newScore);
    newScores["tierId"] = tier;
    setScore(newScore);
    setTier(tier);
    editVendorProfile(vendor.id, newScores);
  };

  const getTierInfo = async tier => {
    try {
      if (lastTierRequest) {
        lastTierRequest.cancel();
      }
      const request = API.get(
        "UsersAPI",
        `/vendors/tier/info?tier=${tier}`,
        {}
      );
      const cancelableRequest = makeCancelable(request);
      const tierInfo = await cancelableRequest.promise;
      lastTierRequest = undefined;
      setTierInfo(tierInfo);
    } catch (error) {
      console.log(error);
      lastTierRequest = undefined;
    }
  };

  const loadTier = score => {
    let tier = 0;
    switch (true) {
      case score <= 10 && score >= 5:
        tier = 5;
        break;
      case score <= 14 && score >= 11:
        tier = 4;
        break;
      case score <= 18 && score >= 15:
        tier = 3;
        break;
      case score <= 21 && score >= 19:
        tier = 2;
        break;
      case score <= 25 && score >= 22:
        tier = 1;
        break;
      default:
        break;
    }
    getTierInfo(tier);
    return tier;
  };

  const loadProfile = () => {
    let scoresValues = {};
    const profile = vendor.profile[0];
    if (!profile) return;
    scoresValues = {
      tierSlider1: profile.tierSlider1 || 1,
      tierSlider2: profile.tierSlider2 || 1,
      tierSlider3: profile.tierSlider3 || 1,
      tierSlider4: profile.tierSlider4 || 1,
      tierSlider5: profile.tierSlider5 || 1
    };
    let scores = Object.assign({}, scoresValues);
    let score = Object.values(scores).reduce(
      (pre, item) => (pre += parseInt(item, 10)),
      0
    );
    let tier = loadTier(score);
    setScores(scores);
    setScore(score);
    setTier(tier);
  };

  let checkpoints = tierInfo.checkpoints || 17;
  if (
    vendor &&
    "name" in vendor &&
    vendor.profile &&
    vendor.profile.length > 0
  ) {
    const mfrequency =
      vendor.profile && vendor.profile.length
        ? vendor.profile[0].frequency.reviewFrequency
        : "Monthly";
    const frequency = tierInfo.frequency || mfrequency;

    const handlerForSlider = {
      showInputEdit,
      handleInputChange,
      showEdit: showEdit || {}
    };

    useEffect(() => {
      loadProfile();
    }, []);
    return (
      <Grid
        fluid
        style={{
          marginBottom: 30,
          padding: 30
        }}
      >
        <Row>
          <Col md={6}>
            <div className="vendorLogoSize">{renderVendorLogo()}</div>
            {[...Array(5)].map((_, index) => (
              <InputSlider
                key={index}
                title={account[`labelTier${index + 1}`]}
                name={`tierSlider${index + 1}`}
                nameLabel={`labelTier${index + 1}`}
                defaultValue={parseInt(
                  vendor.profile[0][`tierSlider${index + 1}`],
                  10
                )}
                onChange={loadScore}
                {...handlerForSlider}
              />
            ))}
          </Col>
          <Col md={6}>
            <h3 style={{ marginTop: 0, textAlign: "left" }}>
              Suggested Review Frequency: {frequency}
            </h3>
            <h3 style={{ marginTop: 0, marginBottom: 30, textAlign: "left" }}>
              Suggested Checkpoint: {checkpoints}
            </h3>
            <Row>
              <Col md={6}>
                <CircularProgressbar
                  percentage={score * 4}
                  text={`${score}`}
                  title="SCORE"
                />
              </Col>

              <Col md={6}>
                <CircularProgressbar
                  percentage={tier * 20}
                  text={`${tier}`}
                  tspan={"score"}
                  title="TIER"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
  return null;
}
