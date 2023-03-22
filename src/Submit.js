import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Submit({ data }) {
  const {
    Name,
    Title,
    Location,
    About,
    Experiences,
    Education,
    Recommendations,
  } = data;

  const bgcolor = {
    background: "linear-gradient(to left, #87CEEB, #00BFFF)",
    transition: "background-color 0.5s ease",
  };

  const liBg = {
    background: "none",
    color: "white",
    border: "none",
    fontWeight: "bold",
  };

  return (
    <div class="container ">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mb-3 text-white shadow-lg" style={bgcolor}>
            <div class="card-body">
              <h3 class="card-title text-center">Scraped Data:</h3>
              <div class="col mb-3">
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Name:</span>
                    <span class="fs-5 fw-bold">{Name}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Title:</span>
                    <span class="fs-5 fw-bold">{Title}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Location:</span>
                    <span class="fs-5 fw-bold">{Location}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">About:</span>
                    <span class="fs-5 fw-bold">{About}</span>
                  </div>
                </div>
              </div>

              {Experiences.map((exp, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Experiences:</h5>
                    <li class="list-group-item " style={liBg}>
                      Position: {exp.Position}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Company: {exp.Company}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date Range: {exp["Date Range"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Location: {exp.Location}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {exp.Description}
                    </li>
                  </ul>
                </li>
              ))}
              {Education.map((edu, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Education:</h5>
                    <li class="list-group-item " style={liBg}>
                      School: {edu.School}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Degree: {edu.Degree}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date Range: {edu["Date Range"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {edu.Description}
                    </li>
                  </ul>
                </li>
              ))}
              {Recommendations.map((rec, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Recommendations:</h5>
                    <li class="list-group-item " style={liBg}>
                      Recommender: {rec.Recommender}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Company: {rec.Company}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date and Relation: {rec["Date and Relation"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {rec.Description}
                    </li>
                  </ul>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;