import { generateHTML, toDateString, cutText, currentDate, calculateRemainingTime,dateNotDay } from "./utilities";
import getVariables from "./variables";
import imgMenu from "../img/context-menu.svg";
import imgView from "../img/info.svg";
import imgCheck from "../img/check.svg";
import imgRemove from "../img/delete.svg";
import contentTask from "./content-task";
import iconStatus from "../img/toggle-status.svg";
import iconPriority from "../img/toggle-priority.svg";
import iconAddNote from "../img/add.svg";

import { storage } from "./storage";

export default class Task{
    constructor({title,description,duedate = undefined,priority,note ="",id,date,status, dateCompleted =undefined, isNew, timeDuedate = undefined, completedDuedate=undefined, completedDate = ""}){
       
        this.title = title;
        this.description = description;
        this.duedate = duedate || toDateString(duedate);
        this.priority = parseInt(priority);
        this.note = note;
        this.id = id || Date.now();
        this.date = date || currentDate();
        this.status = status || "pending";
        this.dateCompleted = dateCompleted;
        this.timeDuedate = timeDuedate;
        this.isNew = (isNew !== undefined) ? isNew : true; 
        this.completedDuedate = completedDuedate || (duedate && timeDuedate ? `${duedate} ${timeDuedate}` : duedate || timeDuedate);   
        this.completedDate = completedDate || new Date();
        
    }
    

    
    getStatus = ()=>{
        return this.status;
    }

    blockDate = ()=>{

        const blockDates = generateHTML("DIV", "task__date");

        const divDataAdded = generateHTML("DIV", "task__date__current");
        const dateAdded = generateHTML("P", undefined, "Date Added");
        const contentDateAdded = generateHTML("SPAN", undefined, this.date);
        dateAdded.appendChild(contentDateAdded);
        divDataAdded.appendChild(dateAdded);
        
        blockDates.append(divDataAdded);
        
        if (this.completedDuedate && this.status !== "completed") {
            const dateDuedate = generateHTML("DIV", "task__date__duedate");

            const remainingTime = calculateRemainingTime(this.completedDuedate);
            if (remainingTime.days !== 0) {
                const remainingFieldDays = generateHTML("DIV", "task__date__duedate__field");
                const remainingDays = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.days);
                const labelRemaningDays = generateHTML("P", undefined, "Days");
                remainingFieldDays.append(remainingDays, labelRemaningDays);
                dateDuedate.append(remainingFieldDays);
            }
             if (remainingTime.hours !== 0) {
                const remainingFieldHours = generateHTML("DIV", "task__date__duedate__field");
                const remainingHours = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.hours);
                const labelRemaningHours = generateHTML("P", undefined, "Hours");
                remainingFieldHours.append(remainingHours, labelRemaningHours);
                dateDuedate.appendChild(remainingFieldHours);
            }
             if (remainingTime.minutes !== 0) {
                const remainingFieldMinutes = generateHTML("DIV", "task__date__duedate__field");
                const remainingMinutes = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.minutes);
                const labelRemaningMinutes = generateHTML("P", undefined, "Minutes");
                remainingFieldMinutes.append(remainingMinutes, labelRemaningMinutes);
                dateDuedate.appendChild(remainingFieldMinutes);
            }

            if (remainingTime.minutes === 0 && remainingTime.seconds !== 0) {
                const remainingFieldSeconds = generateHTML("DIV", "task__date__duedate__field");
                const remainingSeconds = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.seconds);
                const labelRemaningSeconds = generateHTML("P", undefined, "Seconds");
                remainingFieldSeconds.append(remainingSeconds, labelRemaningSeconds);
                dateDuedate.appendChild(remainingFieldSeconds);
            }
        
            
            if (remainingTime.days === 0 && remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds=== 0) {
                return;
            }
            else{
                blockDates.appendChild(dateDuedate);
            }
           
        }
        
      
        return blockDates;
        
    }


    create = ()=>{
       
        const task = generateHTML("DIV","task");
        const priority = generateHTML("SPAN","task__priority",this.priority);
        const taskInfo = generateHTML("DIV","task__info");
        const title = generateHTML("P",undefined,"Title");
        const contentTitle = generateHTML("SPAN",undefined,cutText(this.title,getVariables.maxLength()));
        const description = generateHTML("P",undefined,"Description");
        const contentDescription = generateHTML("SPAN",undefined,cutText(this.description,getVariables.maxLength()));
        const taskNotes = generateHTML("DIV","task__notes");
        const titleNotes = generateHTML("P",undefined,"Notes");
        const notesContainer = generateHTML("DIV","task__notes__container");
        const notesImg = generateHTML("IMG");
        const taskModal = generateHTML("DIV","task__modal");
        const imgModalTask = generateHTML("IMG");
        const taskModalMenu = generateHTML("DIV");

        const menuFieldView = generateHTML("DIV","task__modal__menu__option");
        const menuFieldCompleted = generateHTML("DIV","task__modal__menu__option");
        const menuFieldRemove = generateHTML("DIV","task__modal__menu__option");
        const menuFieldStatus = generateHTML("DIV","task__modal__menu__option");
        const menuFieldPriority = generateHTML("DIV","task__modal__menu__option");

        const infoPriority =generateHTML("P",undefined,"Change Priority");
        const imgPriority = generateHTML("IMG");
        const infoStatus =generateHTML("P",undefined,"Change Status");
        const imgToggleStatus = generateHTML("IMG");
        const imgInfo = generateHTML("IMG");
        const infoText = generateHTML("P",undefined,"View/Edit");
        const imgCompleted = generateHTML("IMG", undefined);
        const infoCompleted = generateHTML("P",undefined,"Mark as Completed");
        const imgDelete = generateHTML("IMG");
        const infoDelete = generateHTML("P",undefined,"Remove");
        const completedText = generateHTML("P","task__completed__date","Task Completed on: ");
        const dateCompleted = generateHTML("SPAN", undefined,this.dateCompleted);
    
     
        title.appendChild(contentTitle);
        description.appendChild(contentDescription);
        taskInfo.append(this.blockDate(),title,description,taskNotes);      
        taskNotes.append(titleNotes,notesContainer);
        taskModalMenu.append(menuFieldView,menuFieldStatus,menuFieldPriority,menuFieldCompleted,menuFieldRemove);
        menuFieldView.append(imgInfo,infoText);
        menuFieldStatus.append(imgToggleStatus,infoStatus);
        menuFieldCompleted.append(imgCompleted,infoCompleted);
        menuFieldPriority.append(imgPriority,infoPriority);
        menuFieldRemove.append(imgDelete,infoDelete);
        taskModal.append(imgModalTask, taskModalMenu);
        completedText.appendChild(dateCompleted);

        if(this.status === "completed"){
           
            menuFieldCompleted.remove();
            priority.style.backgroundColor = "#000";
            task.classList.add("task__completed");
            task.append(priority,completedText,taskInfo,taskModal);
            menuFieldPriority.remove();
        }
        else{
            imgCompleted.src = imgCheck;
            imgCompleted.alt = "Icon Check";
            menuFieldCompleted.dataset.action = "completed";
            this.checkPriority(priority);
            completedText.remove();
            task.append(priority,taskInfo,taskModal);
            
        }

       
        
       
        taskModalMenu.classList.add("task__modal__menu","disabled");
        task.dataset.id = this.id;
        imgModalTask.alt = "Icon Task";
        imgModalTask.dataset.action = "open-menu";
        imgInfo.alt = "Icon Info";
        imgDelete.alt = "Icon Remove";
        imgToggleStatus.alt ="Icon Status";
        imgPriority.alt = "Icon Priority";
        imgModalTask.src= imgMenu; 
        imgInfo.src = imgView; 
        imgDelete.src = imgRemove;
        imgToggleStatus.src = iconStatus;
        imgPriority.src = iconPriority;
        menuFieldRemove.dataset.action = "delete";
        menuFieldView.dataset.action = "view";
        menuFieldStatus.dataset.action = "switch-status";
        menuFieldPriority.dataset.action = "switch-priority"
        
        if(this.note.length<= 0){
            taskNotes.remove();
            titleNotes.remove();
            notesImg.remove();
            notesContainer.remove();
        }
        else if(this.note.length>=1){
            notesImg.src = iconAddNote;
            notesImg.atl = "Icon Add Note";
            this.note.forEach((note,index) => {
                //Añadir evento a las notas en el que al pasar el raton
                //se habra un modal con la info de la nota..
                const notes = generateHTML("DIV","note");
                const contentNote = generateHTML("SPAN",undefined,index+1);
                notes.appendChild(contentNote);
                notesContainer.appendChild(notes,notesImg);
            })
        }

        getVariables.containerTask.forEach(container => {
            if(container.id === this.status){
                container.appendChild(task);
               
            }
        })

        if(this.isNew){
            task.classList.add("task__anim");
            setTimeout(()=>task.classList.remove("task__anim"),1000);
            this.isNew = false;
            storage.setStorage(contentTask.getTask());
        }
      
    }

    checkPriority = (priority)=>{
       
        if(this.priority === 1){
            priority.textContent = "high";
            priority.style.backgroundColor = "#fc412c";
        }
        else if(this.priority ===2){
            priority.textContent = "medium";
            priority.style.backgroundColor = "#ffae19";
        }
        else if(this.priority === 3){
            priority.textContent = "low";
            priority.style.backgroundColor = "#9ad4fa";
        }
    }
    
    delete = ()=>{
        const filterTask = contentTask.getTask().filter(task => task.id !== this.id);
        storage.setStorage(filterTask);
        contentTask.getUpdateTask();
    }

    markAsCompleted= ()=>{

        this.status = "completed";
        this.duedate = "";
        this.timeDuedate = "";
        this.completedDuedate = "";
        this.dateCompleted = dateNotDay();
        contentTask.updateDataTask(contentTask.getTask());
    }

    switchStatus= (value)=>{
        if (this.status !== value) {  
        this.status = value;
        contentTask.updateDataTask(contentTask.getTask()); 
        }
    }

    switchPriority = (value)=>{
        if(this.priority !== value) {  
        this.priority = value;
        contentTask.updateDataTask(contentTask.getTask()); 
        }
    }

    dataPriority = ()=> [1,2,3].filter(num => num !== this.priority).map(num => {
        if(num === 1)return "High";
        if(num === 2)return "Medium";
        if(num === 3)return "Low"; 
    });
    
    setValueNew = (value)=>{
        this.isNew = value;
    }
}