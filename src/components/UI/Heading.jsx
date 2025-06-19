import React from "react";

function Heading({ text, size = 1 }) {
  if (!text) return;
  let textWithLineBreak = text;

  // Check if it's a single long word (no spaces, longer than 20 chars)
  if (text.trim().length > 20 && !text.includes(" ")) {
    const firstPart = text.slice(0, 20);
    const secondPart = text.slice(20);
    textWithLineBreak = (
      <>
        {firstPart}
        <br />
        {secondPart}
      </>
    );
  }

  const headingSizes = {
    1: <h1>{textWithLineBreak}</h1>,
    2: <h2>{textWithLineBreak}</h2>,
    3: <h3>{textWithLineBreak}</h3>,
  };

  return headingSizes[size];
}

export default Heading;
