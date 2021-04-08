import { Project } from "../models/project.js";
import { ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
    constructor() {
        super(...arguments);
        this.projects = [];
    }
    addProject(title, description, numOfPeople) {
        const project = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(project);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const selectedProject = this.projects.find((item) => item.id === projectId);
        if (selectedProject && selectedProject.status !== newStatus) {
            selectedProject.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(JSON.parse(JSON.stringify(this.projects)));
        }
    }
}
export const projectState = new ProjectState();
