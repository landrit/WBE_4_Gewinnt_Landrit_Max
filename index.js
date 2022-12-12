import { setStore, getStore } from "./lib/storage.js";
import { render } from "./lib/suiweb.js";
import { connect4Winner } from "./lib/winner.js";
import { setInList } from "./lib/immutable.js";

const defaultState = {
  board: [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ],
  current: "b",
  next: "r",
  winner: "",
};

let state = JSON.parse(JSON.stringify(defaultState));

const stateSeq = [];

const App = () => [Board, { board: state.board }];

const Board = ({ board }) => {
  let flatBoard = [].concat(...board);
  let fields = flatBoard.map((type, index) => [
    Field,
    { type },
    { props: { id: index } },
  ]);
  return ["div", { className: "board" }, ...fields];
};

const Field = ({ type, props }) => {
  switch (type) {
    case "":
      return ["div", { className: "field", id: props.id }];
    case "b":
      return [
        "div",
        { className: "field", id: props.id },
        ["div", { className: "piece blue" }],
      ];
    case "r":
      return [
        "div",
        { className: "field", id: props.id },
        ["div", { className: "piece red" }],
      ];
  }
};

function start() {
  const app = show();
  attachEventHandler(app);
}

function attachEventHandler(app) {
  app.addEventListener("click", (e) => {
    if (state.winner) return;
    addHistory();
    if (addPiece(e)) {
      checkWinner();
      changePlayer();
      show();
    } else {
      stateSeq.pop();
    }
  });

  function addPiece(e) {
    const target = e.target;
    let field = null;
    if (target.classList.contains("field")) {
      field = target;
    } else if (target.classList.contains("piece")) {
      field = target.parentElement;
    } else {
      return;
    }
    const id = field.getAttribute("id");
    const index = parseInt(id);
    const column = index % state.board[0].length;
    for (let row = state.board.length - 1; row >= 0; row--) {
      if (state.board[row][column] == "") {
        state.board[row][column] = state.current;
        return true;
      }
    }
    return false;
  }
}

function checkWinner() {
  if (connect4Winner(state.current, state.board)) {
    state.winner = state.current;
    alert(`${state.winner === "b" ? "Blue" : "Red"} won!`);
  }
}

function changePlayer() {
  const next = state.next;
  state.next = state.current;
  state.current = next;
}

function addHistory() {
  stateSeq.push(JSON.parse(JSON.stringify(state)));
}

function show() {
  const app = document.querySelector("#app");
  render([App], app);
  return app;
}

function load() {
  addHistory();
  state = getStore("state");
  show();
}

function save() {
  setStore("state", state);
}

function undo() {
  if (stateSeq && stateSeq.length > 0) {
    state = stateSeq.pop();
    show();
  }
}

function restart() {
  addHistory();
  state = JSON.parse(JSON.stringify(defaultState));
  show();
}

export { start, load, save, undo, restart };
