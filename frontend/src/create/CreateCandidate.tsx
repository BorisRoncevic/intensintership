import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../api/candidateApi";
import { getAllSkills } from "../api/skillsapi";

type Skill = { id: number; name: string };

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

  useEffect(() => {
    getAllSkills().then(setAllSkills);
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: Skill) => {
    const exists = form.skillIds.includes(skill.id);

    const updated = exists
      ? form.skillIds.filter(id => id !== skill.id)
      : [...form.skillIds, skill.id];

    setForm(prev => ({ ...prev, skillIds: updated }));
  };

  const handleSubmit = async () => {
    try {
      await create(form);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Candidate</h2>

      <input
        placeholder="Full Name"
        value={form.fullName}
        onChange={e => handleChange("fullName", e.target.value)}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => handleChange("email", e.target.value)}
      />

      <input
        placeholder="Contact Number"
        value={form.contactNumber}
        onChange={e => handleChange("contactNumber", e.target.value)}
      />

      <input
        type="date"
        value={form.dateOfBirth}
        onChange={e => handleChange("dateOfBirth", e.target.value)}
      />

      <div>
        <h4>Skills</h4>
        {allSkills.map(skill => (
          <label key={skill.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={form.skillIds.includes(skill.id)}
              onChange={() => toggleSkill(skill)}
            />
            {skill.name}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}