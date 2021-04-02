class ProjectInput {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLDivElement;
  public element: HTMLFormElement;
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public peopleInputElement: HTMLInputElement;
  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }
}

const firstInput = new ProjectInput();
