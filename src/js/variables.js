const getVariables = (function(){
    const board = document.getElementById("board-container");
    const form = document.getElementById("form");
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");
    const btnAdd = document.getElementById("add-btn");
    const containerTask = document.querySelectorAll('#board-container [data-action="container"]');
    const defaultMessage = document.getElementById("default-message");
    const MAX_LENGTH = 100;
    const KEY = "task";
    const STATUS_PENDING = "pending";
    const STATUS_INPROGRESS = "progress";
   
    const maxLength = ()=> MAX_LENGTH;
    const key = ()=>KEY;
    const pending = ()=> STATUS_PENDING;
    const progress = ()=> STATUS_INPROGRESS;
    
   
   
    return {containerTask,modal,overlay,btnAdd, form, maxLength, board, key, pending,progress, defaultMessage};
    
})();
export default getVariables;