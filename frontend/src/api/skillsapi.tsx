const BASE_URL = "http://localhost:8080/api/skills";

export async function getAllSkills() {
    const res = await fetch(BASE_URL);
  
    if (!res.ok) {
      throw new Error("Failed to fetch skills");
    }
  
    return res.json();
  }

  export async function getSkillById(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`);
  
    if (!res.ok) {
      throw new Error("Skill not found");
    }
  
    return res.json();
  }

  export async function createSkill(data: any) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create skill");
    }
  
    return res.json();
  }

  export async function updateSkill(id: number, data: any) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error("Failed to update skill");
    }
  
    return res.json();
  }


  