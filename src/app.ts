// <reference path="models/drag-drop.ts" />
// <reference path="models/project.ts" />
// <reference path="state/project-state.ts" />
// <reference path="util/validation.ts" />
// <reference path="decorators/autobind.ts" />
// <reference path="components/project-list.ts" />
// <reference path="components/project-input.ts" />
import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
