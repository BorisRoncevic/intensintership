import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import { fetchCandidatesApi } from "../api/candidateApi";

type Skill = {
  id: number;
  name: string;
};

type Candidate = {
  id: number;
  fullName: string;
  skills: Skill[];
};

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCandidatesApi(name, skills, page, 20)
        .then((data) => {
          if (Array.isArray(data)) {
            setCandidates(data);
            setTotalPages(1);
          } else {
            setCandidates(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
          }
        })
        .catch((err) => {
          console.error(err);
          setCandidates([]);
          setTotalPages(0);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [name, skills, page]);

  return (
    <>
      <Navbar
        onFilterChange={(n, s) => {
          setName(n);
          setSkills(s);
          setPage(0);
        }}
      />

      <div>
        {candidates.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/candidates/${c.id}`)}
            style={{
              border: "1px solid gray",
              margin: 10,
              padding: 10,
              cursor: "pointer",
            }}
          >
            <h3>{c.fullName}</h3>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}