"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = /** @class */ (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var State = /** @class */ (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    return State;
}());
var ProjectState = /** @class */ (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.projects = [];
        return _this;
    }
    ProjectState.prototype.addProject = function (title, description, numOfPeople) {
        var project = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(project);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(JSON.parse(JSON.stringify(this.projects)));
        }
    };
    return ProjectState;
}(State));
var projectState = new ProjectState();
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
var Component = /** @class */ (function () {
    function Component(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    };
    return Component;
}());
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, "single-project", hostId, false, project.id) || this;
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            return this.project.people === 1 ? "1 person" : this.project.people + " persons";
        },
        enumerable: false,
        configurable: true
    });
    ProjectItem.prototype.dragStartHandler = function (event) {
        console.log(event);
    };
    ProjectItem.prototype.dragEndHandler = function (_) {
        console.log("drag ended");
    };
    ProjectItem.prototype.configure = function () {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    };
    ProjectItem.prototype.renderContent = function () {
        this.element.querySelector("h4").textContent = this.project.title;
        this.element.querySelector("h5").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    };
    __decorate([
        autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    return ProjectItem;
}(Component));
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, "project-list", "app", false, type + "-projects") || this;
        _this.type = type;
        _this.assignedProjects = [];
        _this.assignedProjects = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.dragOverHandler = function (_) {
        var listEl = this.element.querySelector("ul");
        listEl.classList.add("droppable");
    };
    ProjectList.prototype.dropHandler = function (_) { };
    ProjectList.prototype.dragLeaveHandler = function (_) {
        this.element.querySelector("ul").classList.remove("droppable");
    };
    ProjectList.prototype.renderProjects = function () {
        var eL = document.getElementById(this.type + "-project-lists");
        eL.innerHTML = "";
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
        }
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (prj) {
                if (_this.type == "active")
                    return prj.status == ProjectStatus.Active;
                return prj.status == ProjectStatus.Finished;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-project-lists";
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h3").textContent = this.type.toUpperCase() + " PROJECTS";
    };
    __decorate([
        autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    return ProjectList;
}(Component));
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "project-input", "my-form", true) || this;
        _this.titleInputElement = _this.element.querySelector("#title");
        _this.descriptionInputElement = _this.element.querySelector("#description");
        _this.peopleInputElement = _this.element.querySelector("#people");
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.gatherUserInput = function () {
        var enteredTitle = this.titleInputElement.value;
        var enteredDescritption = this.descriptionInputElement.value;
        var enteredPeopleAmount = this.peopleInputElement.value;
        var validTitle = validate({ value: enteredTitle, required: true, minLength: 2 });
        var validDesc = validate({ value: enteredDescritption, required: true, minLength: 5 });
        var validPeople = validate({ value: +enteredPeopleAmount, required: true, min: 1, max: 5 });
        // console.log({
        //   validTitle,
        //   validDesc,
        //   validPeople,
        // });
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
            projectState.addProject(title, desc, people);
            this.clearInput();
        }
    };
    ProjectInput.prototype.renderContent = function () { };
    ProjectInput.prototype.configure = function () {
        //this.element.addEventListener("submit", this.submitHandler.bind(this));
        this.element.addEventListener("submit", this.submitHandler);
    };
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}(Component));
var projectInput = new ProjectInput();
var activeProjectList = new ProjectList("active");
var finihsedProjectList = new ProjectList("finished");
