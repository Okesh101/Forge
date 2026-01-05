import React from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function Timeline() {
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="timeline-page">Timeline</div>
      </div>
    </>
  );
}
