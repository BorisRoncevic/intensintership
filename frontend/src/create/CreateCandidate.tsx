import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../api/candidateApi";
import { getAllSkills } from "../api/skillsapi";
import { Skill } from "../model/model";
import "../style/CreateCandidate.css";
import Navbar from "../layout/NavBar";


export default function CreateCandidatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    skillIds: [] as number[],
  });

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    getAllSkills().then(setAllSkills);
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "dateOfBirth") {
      if (value && value > today) {
        setDateError("Date of birth cannot be in the future.");
      } else {
        setDateError("");
      }
    }
  };

  const toggleSkill = (skill: Skill) => {
    const exists = form.skillIds.includes(skill.id);

    const updated = exists
      ? form.skillIds.filter((id) => id !== skill.id)
      : [...form.skillIds, skill.id];

    setForm((prev) => ({ ...prev, skillIds: updated }));
  };

  const handleSubmit = async () => {
    if (dateError) return;

    try {
      await create(form);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar onFilterChange={() => {}} />
  
      <div className="create-candidate-page">
        <h2>Create Candidate</h2>
  
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
  
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
  
        <input
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
        />
  
        <input
          type="date"
          max={today}
          value={form.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        />
  
        {dateError && <p className="error">{dateError}</p>}
  
        <h4>Skills</h4>
  
        <div className="skills-container">
          {allSkills.map((skill) => (
            <label key={skill.id} className="skill-label">
              <input
                type="checkbox"
                checked={form.skillIds.includes(skill.id)}
                onChange={() => toggleSkill(skill)}
              />
              {skill.name}
            </label>
          ))}
        </div>
  
        <button onClick={handleSubmit} disabled={!!dateError}>
          Create
        </button>
      </div>
    </>
  );
}