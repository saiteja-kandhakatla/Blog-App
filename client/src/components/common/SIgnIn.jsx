import React from "react";
import { SignIn } from "@clerk/clerk-react";
function SIgnIn() {
  return (
    <div className="d-flex justify-content-center h-100 align-items-center">
      <SignIn />
    </div>
  );
}

export default SIgnIn;
