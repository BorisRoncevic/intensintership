export type Skill = {
    id: number;
    name: string;
  };
  
  export type Candidate = {
    id: number;
    fullName: string;
    skills: Skill[];
  };