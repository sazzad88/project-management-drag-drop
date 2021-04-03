"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validatableInput) {
    var isValid = true;
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
function autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
var ProjectList = /** @class */ (function () {
    function ProjectList(type) {
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = this.type + "-projects";
        this.attach();
        this.renderContent();
    }
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-project-lists";
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h3").textContent = this.type.toUpperCase() + " PROJECTS";
    };
    ProjectList.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    };
    return ProjectList;
}());
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("my-form");
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.gatherUserInput = function () {
        var enteredTitle = this.titleInputElement.value;
        var enteredDescritption = this.descriptionInputElement.value;
        var enteredPeopleAmount = this.peopleInputElement.value;
        var validTitle = validate({ value: enteredTitle, required: true, minLength: 2 });
        var validDesc = validate({ value: enteredDescritption, required: true, minLength: 5 });
        var validPeople = validate({ value: +enteredPeopleAmount, required: true, min: 1, max: 5 });
        if (!validTitle || !validDesc || !validPeople) {
            alert("some error");
        }
        else
            return [enteredTitle, enteredDescritption, +enteredPeopleAmount];
    };
    ProjectInput.prototype.clearInput = function () {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    };
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], desc = userInput[1], people = userInput[2];
            this.clearInput();
        }
    };
    ProjectInput.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    };
    ProjectInput.prototype.configure = function () {
        //this.element.addEventListener("submit", this.submitHandler.bind(this));
        this.element.addEventListener("submit", this.submitHandler);
    };
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var projectInput = new ProjectInput();
var activeProjectList = new ProjectList("active");
var finihsedProjectList = new ProjectList("finished");
