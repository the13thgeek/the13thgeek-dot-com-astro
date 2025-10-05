import { useState } from "react";
import projects from "../data/projects.json";
import "./ProjectsGrid.scss";

interface ProjectStackItem {
  name: string;
  icon: string;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string | null;
  gridClass: string;
  stack: ProjectStackItem[];
  notes?: string;
}

/* type GridClass =
  | "featured-item"
  | "wide-item"
  | "tall-item"
  | "regular-1"
  | "regular-2"
  | "small-item"; */

export default function ProjectsGrid() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <>
      <ul className="projects">
        {projects.map((project: ProjectItem) => (
          <li
            key={project.id}
            className={`project-item ${project.type} ${project.gridClass} ${project.id}`}
            onClick={() => setSelected(project)}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <img src="https://placehold.co/640x500" className="thumbnail" />
          </li>
        ))}
      </ul>

      {/* <Modal project={selected} onClose={() => setSelected(null)} /> */}
    </>
  );
}