import React from "react";

function Heading({ text, size = 1, classes,noTrim }) {
  if (!text) return;

  const HeadingTag = `h${size}`;

  let textWithLineBreak = <HeadingTag className={classes}>{text}</HeadingTag>;

  // Check if it's a single long word (no spaces, longer than 20 chars)
  if (text.trim().length > 20 && !noTrim) {
    const firstPart = text.slice(0, 15);
    const secondPart = text.slice(15);
    textWithLineBreak = (
      <HeadingTag className={classes}>
        {firstPart}
        <br />
        {secondPart}
      </HeadingTag>
    );
  }

  //   const headingSizes = {
  //     1: <h1>{textWithLineBreak}</h1>,
  //     2: <h2>{textWithLineBreak}</h2>,
  //     3: <h3>{textWithLineBreak}</h3>,
  //   };

  return textWithLineBreak;
}

export default Heading;
