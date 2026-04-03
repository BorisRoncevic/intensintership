import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findById, update } from "../api/candidateApi";
import { getAllSkills } from "../api/skillsapi";
import { remove } from "../api/candidateApi";
import { useNavigate } from "react-router-dom";
type Skill = {
  id: number;
  name: string;
};

export default function CandidateDetails() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState<any>(null);
  const [originalCandidate, setOriginalCandidate] = useState<any>(null); 
  const [editMode, setEditMode] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return;

    findById(Number(id)).then(data => {
      setCandidate(data);
      setOriginalCandidate(data); 
    });

    getAllSkills().then(setAllSkills);
  }, [id]);

  if (!candidate) return <p>Loading...</p>;

  const handleChange = (field: string, value: any) => {
    setCandidate((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async () => {
    if (!id) return;
  
    const confirmDelete = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmDelete) return;
  
    try {
      await remove(Number(id));
      navigate("/"); 
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSkill = (skill: Skill) => {
    const exists = candidate.skills?.some(
      (s: Skill) => s.id === skill.id
    );

    const updatedSkills = exists
      ? candidate.skills.filter((s: Skill) => s.id !== skill.id)
      : [...(candidate.skills || []), skill];

    setCandidate((prev: any) => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleSave = async () => {
    try {
      await update(Number(id), candidate);
      setOriginalCandidate(candidate); 
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setCandidate(originalCandidate); 
    setEditMode(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Candidate Details</h2>

      <div>
        <label>Full Name:</label>
        {editMode ? (
          <input
            value={candidate.fullName || ""}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
          />
        ) : (
          <p>{candidate.fullName}</p>
        )}
      </div>

      <div>
        <label>Email:</label>
        {editMode ? (
          <input
            value={candidate.email || ""}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
          />
        ) : (
          <p>{candidate.email}</p>
        )}
      </div>

      <div>
        <label>Contact:</label>
        {editMode ? (
          <input
            value={candidate.contactNumber || ""}
            onChange={(e) =>
              handleChange("contactNumber", e.target.value)
            }
          />
        ) : (
          <p>{candidate.contactNumber}</p>
        )}
      </div>

      <div>
        <label>Date of Birth:</label>
        {editMode ? (
          <input
            type="date"
            value={candidate.dateOfBirth || ""}
            onChange={(e) =>
              handleChange("dateOfBirth", e.target.value)
            }
          />
        ) : (
          <p>{candidate.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label>Skills:</label>

        {editMode ? (
          <div>
            {allSkills.map(skill => (
              <label key={skill.id} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={candidate.skills?.some(
                    (s: Skill) => s.id === skill.id
                  )}
                  onChange={() => toggleSkill(skill)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        ) : (
          <ul>
            {candidate.skills?.map((s: Skill) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
  {editMode ? (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </>
  ) : (
    <>
      <button onClick={() => setEditMode(true)}>
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
      >
        Delete
      </button>
    </>
  )}
</div>
    </div>
  );
}