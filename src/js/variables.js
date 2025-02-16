const getVariables = (function(){
    const board = document.getElementById("board-container");
    const form = document.getElementById("form");
    const modal = document.getElementById("modal");
    const modalEdit = document.getElementById("modal-edit");
    const btnCloseModal = modal.querySelector(".modal__close");
    const overlay = document.getElementById("overlay");
    const btnAdd = document.getElementById("add-btn");
    const containerTask = document.querySelectorAll('#board-container [data-item="container"]');
    const defaultMessage = document.getElementById("default-message");
    const MAX_LENGTH = 100;
    const KEY = "task";
    const STATUS_PENDING = "pending";
    const STATUS_INPROGRESS = "progress";
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

    const maxLength = ()=> MAX_LENGTH;
    const key = ()=>KEY;
    const pending = ()=> STATUS_PENDING;
    const progress = ()=> STATUS_INPROGRESS;
    const actions = ()=> ACTIONS;
   
   
    return {containerTask,modal,overlay,btnAdd, form, maxLength, board, key, pending,progress, defaultMessage, actions,btnCloseModal, modalEdit};
    
})();
export default getVariables;