const BASE_URL = "http://localhost:8080/api/candidates";


export async function create(data: any) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error("Create error");
    }
  
    if (res.status === 204) return null;
  
    return res.json();
  }

export async function update(id: number, data: any) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error("Update error");
    }
  
    return res.json();
  }

  export async function findAll() {
    const res = await fetch(BASE_URL);
  
    if (!res.ok) {
      throw new Error("Error with fetching");
    }
  
    return res.json();
  }

  export async function findById(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`);
  
    if (!res.ok) {
      throw new Error("Item not found");
    }
  
    return res.json();
  }
  export async function remove(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  
    if (!res.ok) {
      throw new Error("Error");
    }
  
    return true;
  }


  export async function fetchCandidatesApi(
    name: string,
    skills: number[],
    page: number = 0,
    size: number = 5
  ) {
    const params = new URLSearchParams();
  
    if (name.trim()) {
      params.append("name", name.trim());
    }
  
    skills.forEach((skillId) => {
      params.append("skills", skillId.toString());
    });
  
    params.append("page", page.toString());
    params.append("size", size.toString());
  
    const hasFilters = name.trim() || skills.length > 0;
  
    const url = hasFilters
      ? `${BASE_URL}/search?${params.toString()}`
      : `${BASE_URL}?page=${page}&size=${size}`;
  
    const res = await fetch(url);
  
   
  
    return res.json();
  }