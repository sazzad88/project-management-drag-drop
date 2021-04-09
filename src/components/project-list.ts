import { Component } from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { Project } from "../models/project";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";
import { ProjectStatus } from "../models/project";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  public assignedProjects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer! && event.dataTransfer!.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
  }
  @autobind
  dragLeaveHandler(_: DragEvent) {
    this.element.querySelector("ul")!.classList.remove("droppable");
  }

  private renderProjects() {
    const eL = document.getElementById(`${this.type}-project-lists`)! as HTMLUListElement;
    eL.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj: Project) => {
        if (this.type == "active") return prj.status == ProjectStatus.Active;
        return prj.status == ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-lists`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h3")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  // private attach() {
  //   this.hostElement.insertAdjacentElement("beforeend", this.element);
  // }
}
