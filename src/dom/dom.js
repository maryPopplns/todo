import { differenceInDays } from "date-fns";
import { groups } from "../app.js";
import {
  ATTACH_DELETE_GROUP_LISTENER,
  ATTACH_RENDER_GROUP_LISTENER,
  CANCEL_ADD_TASK,
  APPLY_ADD_TASK,
  ATTACH_ADD_TASK_LISTENER,
  ATTACH_DELETE_TASK_LISTENER,
  ATTACH_DUE_TODAY_LISTENER,
  ATTACH_HIGH_PRIORITY_LISTENER,
} from "./event_listeners.js";

const META_DATA = () => {
  const FONT_AWESOME = document.createElement("link");

  FONT_AWESOME.setAttribute("rel", "stylesheet");
  FONT_AWESOME.setAttribute(
    "href",
    "https://use.fontawesome.com/releases/v5.15.3/css/all.css"
  );
  FONT_AWESOME.setAttribute(
    "integrity",
    "sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk"
  );
  FONT_AWESOME.setAttribute("crossorigin", "anonymous");

  document.head.append(FONT_AWESOME);
};

const MENU_BUTTON = () => {
  const HAMBURGER_MENU_BUTTON = document.createElement("button");
  const HAMBURGER_BUTTON_ICON = document.createElement("i");

  HAMBURGER_MENU_BUTTON.id = "hamburger_menu_button";
  HAMBURGER_BUTTON_ICON.classList = "fas fa-align-justify";

  document.body.append(HAMBURGER_MENU_BUTTON);
  HAMBURGER_MENU_BUTTON.append(HAMBURGER_BUTTON_ICON);
};

const HEADER = () => {
  const HEADER_CONTAINER = document.createElement("header");
  const NAV_BAR_TEXT = document.createElement("h1");

  NAV_BAR_TEXT.innerText = "Task Master";
  NAV_BAR_TEXT.id = "header";

  document.body.append(HEADER_CONTAINER);
  HEADER_CONTAINER.append(NAV_BAR_TEXT);
};

const NAV_BAR = () => {
  const MAIN = document.createElement("main");
  const NAV_CONTAINER = document.createElement("nav");
  const DUE_CONTAINER = document.createElement("ol");
  const DUE_TODAY = document.createElement("li");
  const HIGH_PRIORITY = document.createElement("li");
  const GROUP_CONTAINER = document.createElement("div");
  const GROUP_HEADING = document.createElement("h2");
  const GROUP_LIST = document.createElement("ol");

  NAV_CONTAINER.id = "nav_container";
  DUE_CONTAINER.id = "due_container";
  DUE_TODAY.id = "due_today";
  HIGH_PRIORITY.id = "high_priority";
  GROUP_CONTAINER.id = "group_container";
  GROUP_HEADING.id = "group_heading";
  GROUP_LIST.id = "task_group_container";

  const TIME_PERIOD_VIEW = [DUE_TODAY, HIGH_PRIORITY].map(
    (element) => (element.classList = "important_tasks")
  );

  DUE_TODAY.innerText = "Due today";
  HIGH_PRIORITY.innerText = "High Priority";
  GROUP_HEADING.innerText = "Groups";

  document.body.append(MAIN);
  MAIN.append(NAV_CONTAINER);
  NAV_CONTAINER.append(DUE_CONTAINER);
  DUE_CONTAINER.append(DUE_TODAY);
  DUE_CONTAINER.append(HIGH_PRIORITY);
  NAV_CONTAINER.append(GROUP_CONTAINER);
  GROUP_CONTAINER.append(GROUP_HEADING);
  GROUP_CONTAINER.append(GROUP_LIST);

  ATTACH_DUE_TODAY_LISTENER(DUE_TODAY);
  ATTACH_HIGH_PRIORITY_LISTENER(HIGH_PRIORITY);

  const ADD_GROUP_BUTTON = (() => {
    const ADD_GROUP_BUTTON = document.createElement("button");
    const ADD_GROUP_PLUS_ICON = document.createElement("i");

    ADD_GROUP_BUTTON.id = "add_group";
    ADD_GROUP_BUTTON.innerText = "group";
    ADD_GROUP_PLUS_ICON.id = "add_group_plus_sign";
    ADD_GROUP_PLUS_ICON.classList = "fas fa-plus-circle";

    document.getElementById("group_container").append(ADD_GROUP_BUTTON);
    ADD_GROUP_BUTTON.prepend(ADD_GROUP_PLUS_ICON);
  })();
};

const RENDER_NAV_BAR_GROUPS = () => {
  const REMOVE_ALL_GROUPS = [
    ...document.getElementById("task_group_container").children,
  ].map((node) => node.remove());

  const GROUPS_CONTAINER = document.getElementById("task_group_container");
  for (let prop in groups) {
    const GROUP = document.createElement("li");
    const TEXT = document.createElement("h3");
    const TRASH = document.createElement("i");

    GROUP.setAttribute("data-group-container", prop);
    GROUP.classList = "nav_bar_group";
    TEXT.setAttribute("data-group-text", prop);
    TEXT.innerText = prop;
    TEXT.classList = "individual_group_heading";
    TRASH.classList = "delete_group fa fa-trash";
    TRASH.setAttribute("data-group", prop);
    TRASH.setAttribute("aria-hidden", "true");

    ATTACH_DELETE_GROUP_LISTENER(TRASH);
    ATTACH_RENDER_GROUP_LISTENER(TEXT);

    GROUPS_CONTAINER.append(GROUP);
    GROUP.append(TEXT);
    GROUP.append(TRASH);
  }
};

const ADD_GROUP_INPUT = () => {
  const GROUP_CONTAINER = document.getElementById("group_container");
  const FORM = document.createElement("form");
  const CANCEL = document.createElement("i");
  const INPUT = document.createElement("input");
  const SUBMIT = document.createElement("i");

  FORM.id = "add_group_form";
  CANCEL.id = "cancel_group_icon";
  CANCEL.classList = "fas fa-window-close";
  INPUT.id = "add_group_input";
  SUBMIT.classList = "fas fa-sign-in-alt";
  SUBMIT.id = "submit_group_icon";

  GROUP_CONTAINER.append(FORM);
  FORM.append(CANCEL);
  FORM.append(INPUT);
  FORM.append(SUBMIT);
};

const RENDER_TASK = (task, tasks_container) => {
  // debugger;
  const LABEL_VALUE = task.label;
  const PRIORITY_VALUE = task.priority;
  const DUE_DATE_VALUE = task.due_date.slice(0, 10);
  const YEAR = DUE_DATE_VALUE.slice(0, 4);
  const MONTH = DUE_DATE_VALUE.slice(5, 7);
  const DAY = DUE_DATE_VALUE.slice(8, 10);
  const NOTES_VALUE = task.notes;
  const ID = task.id;

  let difference, due;

  DUE_DATE_VALUE === ""
    ? (difference = 0)
    : (difference = differenceInDays(
        new Date(YEAR, MONTH - 1, DAY),
        new Date()
      ));

  if (difference === 0) {
    due = "Today";
  } else if (difference === 1) {
    due = "Tomorrow";
  } else {
    due = `${difference} days`;
  }

  const TASK_CONTAINER = document.createElement("div");
  const LABEL = document.createElement("h2");
  const PRIORITY = document.createElement("div");
  const DUE_CONTAINER = document.createElement("div");
  const DUE_LABEL = document.createElement("div");
  const DUE_DATE = document.createElement("div");
  const NOTES_CONTAINER = document.createElement("div");
  const NOTES_LABEL = document.createElement("div");
  const NOTES = document.createElement("div");
  const DELETE_TASK_ICON = document.createElement("i");

  TASK_CONTAINER.classList = "task";
  TASK_CONTAINER.setAttribute("data-id", ID);
  LABEL.classList = "task_label";
  DUE_CONTAINER.classList = "due_container";
  NOTES_CONTAINER.classList = "notes_container";
  NOTES.classList = "note";
  DELETE_TASK_ICON.classList = "delete_task_icon fa fa-trash";
  DELETE_TASK_ICON.id = ID;
  if (NOTES_VALUE === "") {
    NOTES_CONTAINER.style.visibility = "hidden";
  }

  LABEL.innerText = LABEL_VALUE;
  DUE_LABEL.innerText = "Due:";
  DUE_DATE.innerText = due;
  NOTES_LABEL.innerText = "Notes:";
  NOTES.innerText = NOTES_VALUE;

  ATTACH_DELETE_TASK_LISTENER(DELETE_TASK_ICON);

  tasks_container.append(TASK_CONTAINER);
  TASK_CONTAINER.append(LABEL);
  TASK_CONTAINER.append(DUE_CONTAINER);
  DUE_CONTAINER.append(DUE_LABEL);
  DUE_CONTAINER.append(DUE_DATE);
  TASK_CONTAINER.append(NOTES_CONTAINER);
  NOTES_CONTAINER.append(NOTES_LABEL);
  NOTES_CONTAINER.append(NOTES);
  TASK_CONTAINER.append(DELETE_TASK_ICON);
};

const RENDER_GROUP = (event, name) => {
  const GROUP_NAME = name || event.target.getAttribute("data-group-text");
  const TASKS_CONTAINER = document.createElement("div");

  const ADD_TASK_ICON = RENDER_ADD_TASK_BUTTON(GROUP_NAME, TASKS_CONTAINER);

  ATTACH_ADD_TASK_LISTENER(ADD_TASK_ICON);

  const TASKS = groups[GROUP_NAME].map((task) => {
    RENDER_TASK(task, TASKS_CONTAINER);
  });

  TASKS_CONTAINER.classList = "tasks_container";
  TASKS_CONTAINER.setAttribute("data-group-tasks", GROUP_NAME);

  document.getElementsByTagName("main")[0].append(TASKS_CONTAINER);
  document.getElementById("header").innerText = GROUP_NAME;
};

const REMOVE_CURRENT_GROUP = () => {
  const TASK_CONTAINER = [
    ...document.getElementsByClassName("tasks_container"),
  ];
  if (TASK_CONTAINER.length !== 0) {
    TASK_CONTAINER[0].remove();
  }
};

const RENDER_ADD_TASK_BUTTON = (group_name, task_container) => {
  const BUTTON = document.createElement("div");
  const PLUS_ICON = document.createElement("i");

  BUTTON.setAttribute("data-add-task", group_name);
  BUTTON.classList = "task add_task_button";
  PLUS_ICON.classList = "fas fa-plus add_task_icon";

  task_container.append(BUTTON);
  BUTTON.append(PLUS_ICON);

  return BUTTON;
};

const RENDER_ADD_TASK_FORM = (group_name) => {
  const CURRRENT_CONTAINER = document.getElementById("task_form_container");

  if (CURRRENT_CONTAINER === null) {
    document.getElementsByTagName("header")[0].style.filter = "blur(.4em)";
    document.getElementsByTagName("main")[0].style.filter = "blur(.4em)";

    const TASK_FORM_CONTAINER = document.createElement("div");
    const TASK_FORM = document.createElement("form");
    const LABEL_INPUT = document.createElement("input");
    const PRIORITY_INPUT = document.createElement("select");
    const DUE_DATE_INPUT = document.createElement("input");
    const NOTES_INPUT = document.createElement("input");
    const CANCEL_APPLY_CONTAINER = document.createElement("div");
    const CANCEL_ADD_TASK_ICON = document.createElement("i");
    const APPLY_ADD_TASK_ICON = document.createElement("i");
    const INPUTS = [LABEL_INPUT, PRIORITY_INPUT, DUE_DATE_INPUT, NOTES_INPUT];
    const IDS = [
      "label_input",
      "priority_input",
      "due_date_input",
      "notes_input",
    ];
    const INNERTEXT = ["Label", "Priority", "Due date", "Notes"];
    const PRIORITY_OPTIONS = ["low", "medium", "high"];

    TASK_FORM_CONTAINER.id = "task_form_container";
    TASK_FORM_CONTAINER.setAttribute("data-group", group_name);
    TASK_FORM.id = "add_task_form";
    for (let i = 0; i < 4; i++) {
      INPUTS[i].id = IDS[i];
      INPUTS[i].setAttribute("name", IDS[i]);
      INPUTS[i].classList = "task_input";
      if (i !== 1) {
        INPUTS[i].setAttribute("type", "text");
      }
      if (i === 2) {
        INPUTS[i].setAttribute("type", "date");
      }
    }
    CANCEL_ADD_TASK_ICON.classList = "far fa-times-circle";
    CANCEL_ADD_TASK_ICON.id = "cancel_add_task_icon";
    APPLY_ADD_TASK_ICON.classList = "far fa-check-circle";
    APPLY_ADD_TASK_ICON.id = "apply_add_task_icon";
    CANCEL_APPLY_CONTAINER.id = "cancel_apply_container";

    APPLY_ADD_TASK(APPLY_ADD_TASK_ICON);
    CANCEL_ADD_TASK(CANCEL_ADD_TASK_ICON);

    document.body.append(TASK_FORM_CONTAINER);
    TASK_FORM_CONTAINER.append(TASK_FORM);
    for (let i = 0; i < 4; i++) {
      const INPUT_CONTAINER = document.createElement("div");
      const LABEL = document.createElement("label");

      INPUT_CONTAINER.classList = "task_input_container";
      LABEL.setAttribute("for", IDS[i]);
      LABEL.classList = "task_input_label";
      LABEL.innerText = INNERTEXT[i];

      TASK_FORM.append(INPUT_CONTAINER);
      INPUT_CONTAINER.append(LABEL);
      INPUT_CONTAINER.append(INPUTS[i]);
    }
    for (let i = 0; i < 3; i++) {
      const OPTION = document.createElement("option");
      OPTION.setAttribute("value", PRIORITY_OPTIONS[i]);
      OPTION.innerText = PRIORITY_OPTIONS[i];
      PRIORITY_INPUT.append(OPTION);
    }
    TASK_FORM.append(CANCEL_APPLY_CONTAINER);
    CANCEL_APPLY_CONTAINER.append(CANCEL_ADD_TASK_ICON);
    CANCEL_APPLY_CONTAINER.append(APPLY_ADD_TASK_ICON);
    LABEL_INPUT.focus();
  }
};

const REMOVE_ADD_TASK_FORM = () => {
  const ADD_TASK_FORM = document.getElementById("task_form_container");
  ADD_TASK_FORM.remove();
  document.getElementsByTagName("header")[0].style.filter = "";
  document.getElementsByTagName("main")[0].style.filter = "";
};

export {
  HEADER,
  META_DATA,
  NAV_BAR,
  MENU_BUTTON,
  RENDER_NAV_BAR_GROUPS,
  ADD_GROUP_INPUT,
  REMOVE_CURRENT_GROUP,
  RENDER_ADD_TASK_BUTTON,
  RENDER_ADD_TASK_FORM,
  REMOVE_ADD_TASK_FORM,
  RENDER_GROUP,
  RENDER_TASK,
};
