import { useEffect, useState } from "react";
import { getAllSkills } from "../api/skillsapi";
import { useNavigate } from "react-router-dom";
import "../style/NavBar.css";
import { Skill } from "../model/model";


type Props = {
  onFilterChange: (name: string, skills: number[]) => void;
};

export default function Navbar({ onFilterChange }: Props) {
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllSkills().then(setSkills).catch(console.error);
  }, []);

  const toggleSkill = (skillId: number) => {
    const updated = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId];

    setSelectedSkills(updated);
    onFilterChange(name, updated);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    onFilterChange(value, selectedSkills);
  };

  return (
    <div className="navbar">
      <div className="navbar-top">
        <h2 className="logo">Candidates</h2>

        <input
          type="text"
          placeholder="Search..."
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="search"
        />

        <div className="actions">
        <button onClick={() => navigate("/")}>
    Home
  </button>

  <button onClick={() => navigate("/create-candidate")}>
    + Candidate
  </button>

  <button onClick={() => navigate("/create-skill")}>
    + Skill
  </button>
        </div>
      </div>

      <div className="navbar-filters">
        {skills.map((skill) => (
          <button
            key={skill.id}
            className={`filter ${selectedSkills.includes(skill.id) ? "active" : ""}`}
            onClick={() => toggleSkill(skill.id)}
          >
            {skill.name}
          </button>
        ))}
      </div>
    </div>
  );
}