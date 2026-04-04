import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import { fetchCandidatesApi } from "../api/candidateApi";
import { Candidate } from "../model/model";
import "../style/HomePage.css";

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCandidatesApi(name, skills, page, 5)
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

      <div className="home">
        <div className="home-container">

          <div className="candidate-list">
            {candidates.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/candidates/${c.id}`)}
                className="candidate-card"
              >
                <h3 className="candidate-name">{c.fullName}</h3>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              Previous
            </button>

            <span>
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </>
  );
}