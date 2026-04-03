import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./layout/HomePage";
import CandidateDetails from "./layout/CandidateDetails";
import CreateCandidatePage from "./create/CreateCandidate";
import CreateSkillPage from "./create/CreateSkill";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/candidates/:id" element={<CandidateDetails />} />
        <Route path="/create-candidate" element={<CreateCandidatePage />} />
        <Route path="/create-skill" element={<CreateSkillPage />} />
      </Routes>
    </BrowserRouter>
  );
}