import { useEffect, useState } from "react";
import { getAllSkills } from "../api/skillsapi";
import { useNavigate } from "react-router-dom";

type Skill = {
  id: number;
  name: string;
};

type Props = {
  onFilterChange: (name: string, skills: number[]) => void;
};

export default function Navbar({ onFilterChange }: Props) {
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllSkills()
      .then(setSkills)
      .catch(console.error);
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
    <div style={{ borderBottom: "1px solid gray", padding: 10 }}>
      <input
        type="text"
        placeholder="Search by name..."
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        style={{ padding: 8, marginRight: 20 }}
      />

      {skills.map((skill) => (
        <label key={skill.id} style={{ marginRight: 10 }}>
          <input
            type="checkbox"
            checked={selectedSkills.includes(skill.id)}
            onChange={() => toggleSkill(skill.id)}
          />
          {skill.name}
        </label>
      ))}

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => navigate("/create-candidate")}
          style={{ marginRight: 10 }}
        >
          Add Candidate
        </button>

        <button onClick={() => navigate("/create-skill")}>
          Add Skill
        </button>
      </div>
    </div>
  );
}