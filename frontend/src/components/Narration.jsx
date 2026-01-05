import React from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function Narration() {
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="narration-page">Narration</div>
      </div>
    </>
  );
}
