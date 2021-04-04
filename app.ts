// Drag and Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

interface validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];

  addProject(title: string, description: string, numOfPeople: number): void {
    const project = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);

    this.projects.push(project);

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const selectedProject = this.projects.find((item) => item.id === projectId);

    if (selectedProject && selectedProject.status !== newStatus) {
      selectedProject.status = newStatus;

      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(JSON.parse(JSON.stringify(this.projects)));
    }
  }
}

const projectState = new ProjectState();

function validate(validatableInput: validatable): boolean {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (validatableInput.min != null && typeof validatableInput.value === "number") {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (validatableInput.max != null && typeof validatableInput.value === "number") {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// autobind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  public templateElement: HTMLTemplateElement;
  public hostElement: T;
  public element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) this.element.id = newElementId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get persons() {
    return this.project.people === 1 ? "1 person" : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  @autobind
  dragEndHandler(_: DragEvent) {
    console.log("drag ended");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h4")!.textContent = this.project.title;
    this.element.querySelector("h5")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public peopleInputElement: HTMLInputElement;
  constructor() {
    super("project-input", "my-form", true);

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescritption = this.descriptionInputElement.value;
    const enteredPeopleAmount = this.peopleInputElement.value;

    const validTitle = validate({ value: enteredTitle, required: true, minLength: 2 });
    const validDesc = validate({ value: enteredDescritption, required: true, minLength: 2 });
    const validPeople = validate({ value: +enteredPeopleAmount, required: true, min: 1, max: 500 });

    // console.log({
    //   validTitle,
    //   validDesc,
    //   validPeople,
    // });
    if (!validTitle || !validDesc || !validPeople) {
      alert("some error");
    } else return [enteredTitle, enteredDescritption, +enteredPeopleAmount];
  }

  private clearInput(): void {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInput();
    }
  }

  renderContent() {}

  configure() {
    //this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finihsedProjectList = new ProjectList("finished");
