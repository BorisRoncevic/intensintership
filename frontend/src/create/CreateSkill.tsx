import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSkill } from "../api/skillsapi";

export default function CreateSkillPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await createSkill({ name });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Skill</h2>

      <input
        placeholder="Skill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}