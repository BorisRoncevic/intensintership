import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findById, update, remove } from "../api/candidateApi";
import { getAllSkills } from "../api/skillsapi";
import { Skill } from "../model/model";
import "../style/CandidateDetails.css";
import Navbar from "./NavBar";

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<any>(null);
  const [originalCandidate, setOriginalCandidate] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [dateError, setDateError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!id) return;

    findById(Number(id)).then((data) => {
      setCandidate(data);
      setOriginalCandidate(data);
    });

    getAllSkills().then(setAllSkills);
  }, [id]);

  if (!candidate) return <p className="loading">Loading...</p>;

  const handleChange = (field: string, value: any) => {
    setCandidate((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "dateOfBirth") {
      if (value && value > today) {
        setDateError("Date of birth cannot be in the future.");
      } else {
        setDateError("");
      }
    }
  };

  const handleDelete = async () => {
    if (deleting || !id) return;

    setDeleting(true);

    try {
      await remove(Number(id));
      navigate("/");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const toggleSkill = (skill: Skill) => {
    const exists = candidate.skills?.some((s: Skill) => s.id === skill.id);

    const updatedSkills = exists
      ? candidate.skills.filter((s: Skill) => s.id !== skill.id)
      : [...(candidate.skills || []), skill];

    setCandidate((prev: any) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleSave = async () => {
    if (candidate.dateOfBirth && candidate.dateOfBirth > today) {
      setDateError("Date of birth cannot be in the future.");
      return;
    }

    await update(Number(id), candidate);
    setOriginalCandidate(candidate);
    setEditMode(false);
  };

  const handleCancel = () => {
    setCandidate(originalCandidate);
    setEditMode(false);
    setDateError("");
  };

  return (
    <>
    <Navbar onFilterChange={() => {}} />
    
    <div className="details-page">
      <div className="details-card">

        <h2>Candidate Details</h2>

        <div className="field">
          <label>Full Name</label>
          {editMode ? (
            <input
              value={candidate.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          ) : (
            <p>{candidate.fullName}</p>
          )}
        </div>

        <div className="field">
          <label>Email</label>
          {editMode ? (
            <input
              value={candidate.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          ) : (
            <p>{candidate.email}</p>
          )}
        </div>

        <div className="field">
          <label>Contact</label>
          {editMode ? (
            <input
              value={candidate.contactNumber || ""}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
            />
          ) : (
            <p>{candidate.contactNumber}</p>
          )}
        </div>

        <div className="field">
          <label>Date of Birth</label>
          {editMode ? (
            <>
              <input
                type="date"
                value={candidate.dateOfBirth || ""}
                max={today}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
              {dateError && <p className="error">{dateError}</p>}
            </>
          ) : (
            <p>{candidate.dateOfBirth}</p>
          )}
        </div>

        <div className="field">
          <label>Skills</label>

          {editMode ? (
            <div className="skills-grid">
              {allSkills.map((skill) => (
                <label key={skill.id} className="skill-item">
                  <input
                    type="checkbox"
                    checked={candidate.skills?.some((s: Skill) => s.id === skill.id)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          ) : (
            <div className="skills-list">
              {candidate.skills?.map((s: Skill) => (
                <span key={s.id} className="skill-badge">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="actions">
          {editMode ? (
            <>
              <button onClick={handleSave} disabled={!!dateError}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button
                className="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                Delete
              </button>
            </>
          )}
        </div>

      </div>
    </div>
    </>
  );
}