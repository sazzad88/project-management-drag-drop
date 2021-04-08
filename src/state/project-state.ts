namespace App {
  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
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

  export const projectState = new ProjectState();
}
