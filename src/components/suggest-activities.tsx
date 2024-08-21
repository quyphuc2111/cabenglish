import React from "react";
import SuggestCard from "./course-card/suggest-card";

function SuggestActivities() {
  return (
    <>
      {Array(1)
        .fill("")
        .map((item, index) => {
          return <SuggestCard />;
        })}
    </>
  );
}

export default SuggestActivities;
