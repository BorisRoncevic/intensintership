import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSkill } from "../api/skillsapi";
import Navbar from "../layout/NavBar";

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
    <>
      <Navbar onFilterChange={() => {}} />
  
      <div className="create-skill-page">
        <h2>Create Skill</h2>
  
        <input
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
  
        <button onClick={handleSubmit}>Create</button>
      </div>
    </>
  );
}