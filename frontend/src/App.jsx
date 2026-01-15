import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Form from "./components/Form";
import Analytics from "./components/Analytics";
import Timeline from "./components/Timeline";
import Narration from "./components/Narration";
import ScrollToTop from "./components/ScrollToTop";
import LogPracticeSession from "./components/LogPracticeSession";
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/logSession" element={<LogPracticeSession />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/narration" element={<Narration />} />
      </Routes>
    </>
  );
}

export default App;
