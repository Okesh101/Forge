import React from "react";
import PageNav from "../Utilities/PageNav";
import SideBar from "../Utilities/SideBar";

export default function HowForgeWorks() {
  return (
    <>
      {/* <PageNav/> */}
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="how_it_works">
          <div>HowForgeWorks</div>
        </div>
      </div>
    </>
  );
}
