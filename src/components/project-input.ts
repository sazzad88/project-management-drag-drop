import { Component } from "./base-component";
import { Validatable, validate } from "../util/validation";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const validTitle: Validatable = { value: enteredTitle, required: true, minLength: 2 };
    const validDesc: Validatable = { value: enteredDescritption, required: true, minLength: 2 };
    const validPeople: Validatable = { value: +enteredPeopleAmount, required: true, min: 1, max: 500 };

    if (!validate(validTitle) || !validate(validDesc) || !validate(validPeople)) {
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
