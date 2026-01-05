import React from "react";
import SideBar from "./Utilities/SideBar";
import PageNav from "./Utilities/PageNav";

export default function Analytics() {
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="analytics-page">Analytics</div>
      </div>
    </>
  );
}
