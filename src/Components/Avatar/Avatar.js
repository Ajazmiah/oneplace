"use client";
import React, { forwardRef } from "react";


const Avatar = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="w-10 h-10 rounded-full overflow-hidden border border-gray-200"
    >
      <img
        src={props.session?.user.image}
        alt="User Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
