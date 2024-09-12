import React, { Fragment } from "react";
import SuggestCard from "./course-card/suggest-card";

function SuggestActivities() {
  return (
    <>
      {Array(1)
        .fill("")
        .map((item, index) => {
          return (
            <Fragment key={index}>
              <SuggestCard />
            </Fragment>
          );
        })}
    </>
  );
}

export default SuggestActivities;
