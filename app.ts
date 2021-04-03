interface validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

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

class ProjectList {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLDivElement;
  public element: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-project-lists`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h3")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLDivElement;
  public element: HTMLFormElement;
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public peopleInputElement: HTMLInputElement;
  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("my-form")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescritption = this.descriptionInputElement.value;
    const enteredPeopleAmount = this.peopleInputElement.value;

    const validTitle = validate({ value: enteredTitle, required: true, minLength: 2 });
    const validDesc = validate({ value: enteredDescritption, required: true, minLength: 5 });
    const validPeople = validate({ value: +enteredPeopleAmount, required: true, min: 1, max: 5 });

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
      this.clearInput();
    }
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }

  private configure() {
    //this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finihsedProjectList = new ProjectList("finished");
