const getVariables = (function(){
    
    const board = document.getElementById("board-container");
    const form = document.getElementById("form");
    const modal = document.getElementById("modal");
    const modalEdit = document.getElementById("modal-edit");
    const formEdit = modalEdit.querySelector("#form__edit");
    const btnCloseModal = modal.querySelector(".modal__close");
    const overlay = document.getElementById("overlay");
    const btnAdd = document.getElementById("add-btn");
    const containerTask = board.querySelectorAll('[data-item="container"]');
    const defaultMessage = document.getElementById("default-message");
    const addNoteEdit = document.getElementById("add-notes-edit");
    const subtmitBtnEdit = document.getElementById("edit-submit");
    const dateCompletedEdit = document.getElementById("edit-dateCompleted");
    const boardPanel = document.getElementById("board-panel");
    const formFilter = boardPanel.querySelector("#form-filter");
    const titlesHeader = document.getElementById("nav-header").querySelectorAll("H2");


    const MAX_LENGTH_VIEWPORT = 100;
    const MAX_LENGTH_TITLE = 250;
    const MAX_LENGTH_DESCRIPTION = 1000;
    const MAX_LENGTH_NOTE = 1500;
    const offsetScroll = 10;
    const KEY = "task";
    const STATUS_PENDING = "pending";
    const STATUS_INPROGRESS = "progress";

    const PROPERTIES = {
        title: "title",
        description : "description",
        priority: "priority",
        duedate: "duedate",
        timeDuedate: "timeDuedate",
        status: "status",
        note:"note",
    }

    const ACTIONS = {
        openMenu: "openMenu",
        view: "view",
        completed: "completed",
        deleteTask : "deleteTask",
        switchStatus: "switchStatus",
        switchPriority: "switchPriority",
        addNote: "addNote",
        openNote: "openNote",
        deleteNote: "deleteNote",
    };

    const maxLengthViewport = ()=> MAX_LENGTH_VIEWPORT;
    const maxLengthTitle = ()=> MAX_LENGTH_TITLE;
    const maxLengthDescription = ()=> MAX_LENGTH_DESCRIPTION;
    const maxLengthNote = ()=> MAX_LENGTH_NOTE;
    const key = ()=>KEY;
    const pending = ()=> STATUS_PENDING;
    const progress = ()=> STATUS_INPROGRESS;
    const actions = ()=> ACTIONS;
    const properties = ()=> PROPERTIES;
   
    return {containerTask,modal,overlay,btnAdd, form, maxLengthViewport,maxLengthTitle,maxLengthDescription, board, key, pending,progress, defaultMessage, actions,btnCloseModal, modalEdit,formEdit, maxLengthNote,offsetScroll,addNoteEdit,subtmitBtnEdit,dateCompletedEdit, boardPanel,formFilter,titlesHeader, properties};
    
})();
export default getVariables;