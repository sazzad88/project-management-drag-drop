/// <reference path="base-component.ts" />
namespace App {
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
}
