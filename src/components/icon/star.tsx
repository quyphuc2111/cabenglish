import React from "react";

function StarIcon({width, height, color}: {width: number, height: number, color: string}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.2378 1.92275L30 1.19098L29.7622 1.92275L23.3075 21.7885L2.41936 21.7885H1.64994L2.27241 22.2408L19.1712 34.5185L12.7165 54.3842L12.4787 55.116L13.1012 54.6637L30 42.386L46.8988 54.6637L47.5213 55.116L47.2835 54.3842L40.8288 34.5185L57.7276 22.2408L58.3501 21.7885H57.5806L36.6925 21.7885L30.2378 1.92275Z"
        fill={color}
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default StarIcon;
