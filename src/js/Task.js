import { generateHTML, toDateString, cutText, currentDate, calculateRemainingTime,dateNotDay,toUpper, scrollToTarget, resetValues } from "./utilities";
import getVariables from "./variables";
import imgMenu from "../img/context-menu.svg";
import imgView from "../img/info.svg";
import imgCheck from "../img/check.svg";
import imgRemove from "../img/delete.svg";
import contentTask from "./content-task";
import iconStatus from "../img/toggle-status.svg";
import iconPriority from "../img/toggle-priority.svg";
import iconAddNote from "../img/add-notes.svg";
import iconMore from "../img/more-notes.svg";
import iconDeleteNotes from "../img/delete-notes.svg";
import { storage } from "./storage";

export default class Task{
    constructor({title,description,duedate = undefined,priority,note ="",id,date,status, dateCompleted =undefined, isNew, timeDuedate = undefined, completedDuedate=undefined, sortDate = ""}){

        this.title = toUpper(title);
        this.description = toUpper(description);
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
        this.sortDate = sortDate || new Date();
    }
    

    menuView = ()=>{
        const imgInfo = generateHTML("IMG","","",imgView,"Icon view");
        const infoView= generateHTML("P","","View/Edit");
        const menuFieldView = generateHTML("DIV","task__modal__menu__option","","","",imgInfo,infoView);
        menuFieldView.dataset.action = getVariables.actions().view;
        return menuFieldView;
    }
    menuStatus = ()=>{
        const infoStatus =generateHTML("P","","Change Status");
        const imgToggleStatus = generateHTML("IMG","","",iconStatus,"Icon Status");
        const menuFieldStatus = generateHTML("DIV","task__modal__menu__option","","","",imgToggleStatus,infoStatus);
        menuFieldStatus.dataset.action = getVariables.actions().switchStatus;
        return menuFieldStatus;
    }
    menuPriority = ()=>{
        
        if(this.status !== "completed"){
            const infoPriority =generateHTML("P","","Change Priority");
            const imgPriority = generateHTML("IMG","","",iconPriority,"Icon Priority");
            const menuFieldPriority = generateHTML("DIV","task__modal__menu__option","","","",imgPriority,infoPriority);
            menuFieldPriority.dataset.action = getVariables.actions().switchPriority;
            return menuFieldPriority;
        }
        return "";
    }
    menuCompleted = ()=>{
        if(this.status !== "completed"){
            const imgCompleted = generateHTML("IMG","","",imgCheck,"Icon Completed");
            const infoCompleted = generateHTML("P","","Mark as Completed");
            const menuFieldCompleted = generateHTML("DIV","task__modal__menu__option","","","",imgCompleted,infoCompleted);
            menuFieldCompleted.dataset.action = getVariables.actions().completed;
            return menuFieldCompleted;
        }
        return "";
        
    }
    menuRemove = ()=>{
        const imgDelete = generateHTML("IMG","","",imgRemove,"Icon Remove");
        const infoDelete = generateHTML("P","","Remove");
        const menuFieldRemove = generateHTML("DIV","task__modal__menu__option","","","",imgDelete,infoDelete);
        menuFieldRemove.dataset.action = getVariables.actions().deleteTask;
        return menuFieldRemove;
    }
    blockMenu = ()=>{
        const imgModalTask = generateHTML("IMG","","",imgMenu,"Icon Menu");
        const taskModalMenu = generateHTML("DIV","task__modal__menu disabled");
        taskModalMenu.append(this.menuView(),this.menuStatus(),this.menuPriority(),this.menuCompleted(),this.menuRemove());
        taskModalMenu.classList.add("task__modal__menu","disabled");
        const taskModal = generateHTML("DIV","task__modal","","","",imgModalTask,taskModalMenu); 
        imgModalTask.dataset.action = getVariables.actions().openMenu;
        return taskModal; 
    }

    subBlockDate = ()=>{

        const contentDateAdded = generateHTML("SPAN", "", this.date);
        const dateAdded = generateHTML("P", "", "Date Added","","",contentDateAdded);
        const divDataAdded = generateHTML("DIV", "task__date__current","","","",dateAdded);  
        const blockDates = generateHTML("DIV", "task__date","","","",divDataAdded);
        
        
        if (this.completedDuedate && this.status !== "completed") {
            const dateDuedate = generateHTML("DIV", "task__date__duedate");
            const remainingTime = calculateRemainingTime(this.completedDuedate);

            if (remainingTime.days !== 0) {
                const remainingDays = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.days);
                const labelRemaningDays = generateHTML("P", "", "Days");
                const remainingFieldDays = generateHTML("DIV", "task__date__duedate__field","","","",remainingDays,labelRemaningDays);
                dateDuedate.append(remainingFieldDays);
            }

             if (remainingTime.hours !== 0) {
                const remainingHours = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.hours);
                const labelRemaningHours = generateHTML("P", "", "Hours");
                const remainingFieldHours = generateHTML("DIV", "task__date__duedate__field","","","",remainingHours,labelRemaningHours);
                dateDuedate.appendChild(remainingFieldHours);
            }

             if (remainingTime.minutes !== 0) {           
                const remainingMinutes = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.minutes);
                const labelRemaningMinutes = generateHTML("P", "", "Minutes");
                const remainingFieldMinutes = generateHTML("DIV", "task__date__duedate__field","","","",remainingMinutes,labelRemaningMinutes);
                dateDuedate.appendChild(remainingFieldMinutes);
            }

            if (remainingTime.days<= 0 && remainingTime.hours<= 0 && remainingTime.minutes<= 0 && remainingTime.seconds > 0) {        
                const remainingSeconds = generateHTML("SPAN", "task__date__duedate__field__time", remainingTime.seconds);
                const labelRemaningSeconds = generateHTML("P", "", "Seconds");
                const remainingFieldSeconds = generateHTML("DIV", "task__date__duedate__field","","","",remainingSeconds,labelRemaningSeconds);
                dateDuedate.appendChild(remainingFieldSeconds);
            }
        
            (remainingTime.days <= 0 && remainingTime.hours <= 0 && remainingTime.minutes <= 0 && remainingTime.seconds<= 0)? false : blockDates.appendChild(dateDuedate);
        }
        
        return blockDates;
    }
    subBlockTitle = ()=>{
     const contentTitle = generateHTML("SPAN","",cutText(this.title,getVariables.maxLengthViewport()));
     const title = generateHTML("P","","Title","","",contentTitle);
     return title;
    }
    subBlockDescription = ()=>{
        const contentDescription = generateHTML("SPAN","",cutText(this.description,getVariables.maxLengthViewport()));
        const description = generateHTML("P","","Description","","",contentDescription);
        return description;
    }
    subBlockNotes = ()=>{
        const notesImg = generateHTML("IMG","task__notes__container__img","",iconAddNote,"Icon Note");
        const titleNotes = generateHTML("P","","Notes");
        const notesContainer = generateHTML("DIV","task__notes__container");
        const taskNotes = generateHTML("DIV","task__notes","","","",titleNotes,notesContainer);
        notesImg.dataset.action = getVariables.actions().addNote;
        
        if(this.status ==="completed"){
            this.note.splice(0,this.note.length);
            notesImg.classList.add("disabled__widget");
        }

        if(this.note.length>=1){

            this.note.forEach((note,index) => {
                if(index<5){
                    const contentNote = generateHTML("SPAN","",index+1);
                    const notes = generateHTML("DIV","task__notes__block__note","","","",contentNote);
                    const imgDelete = generateHTML("IMG","","",iconDeleteNotes,"Icon Delete Notes");
                    const deleteNotes = generateHTML("DIV","task__notes__block__delete","","","",imgDelete);
                    const blockNote = generateHTML("DIV","task__notes__block","","","",notes,deleteNotes);
                    note.id = index+1;
                    blockNote.dataset.id = note.id;
                    notes.dataset.action = getVariables.actions().openNote;
                    deleteNotes.dataset.action =getVariables.actions().deleteNote;

                    if(note.isNew){
                        blockNote.classList.add("appear");
                        note.isNew = false;
                    };
                    notesContainer.appendChild(blockNote); 
                }
                else if(index === 5) {
                    const more = generateHTML("IMG","icon__note__more","",iconMore,"Icon more notes");
                    note.countNote !== this.note.length && more.classList.add("appear");
                    notesContainer.appendChild(more)
                }

                note.countNote = this.note.length;
            })
            storage.setStorage(contentTask.getTask());

        }
       
        notesContainer.append(notesImg);
        return taskNotes;
    }
    blockInfo = ()=> generateHTML("DIV","task__info","","","",this.subBlockDate(),this.subBlockTitle(),this.subBlockDescription(),this.subBlockNotes());
    

    completedResults = ()=>{
        if(this.status ==="completed"){
            const dateCompleted = generateHTML("SPAN", "",this.dateCompleted);
            const completedText = generateHTML("P","task__completed__date","Task Completed on: ","","",dateCompleted);
            return completedText;
        }
        return "";
       
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

    priorityEL = ()=>{
        if(this.status !=="completed"){
            const priority = generateHTML("SPAN","task__priority",this.priority);
            this.checkPriority(priority);
            return priority;
        }
        return "";
    }

    create = ()=>{
        const task = generateHTML("DIV","task","","","",this.priorityEL(),this.completedResults(),this.blockInfo(),this.blockMenu());
        task.dataset.id = this.id;
        this.logicPropertiesCompleted(task);
    
        getVariables.containerTask.forEach(container => {
            if(container.id === this.status){
                container.appendChild(task);
            }
        })

        if(this.isNew){
            task.classList.add("task__anim");
            scrollToTarget(task);
            this.isNew = false;
            setTimeout(()=>task.classList.remove("task__anim"),500);
            storage.setStorage(contentTask.getTask());
        }
      
    }

    
    delete = ()=>{
        const filterTask = contentTask.getTask().filter(task => task.id !== this.id);
        storage.setStorage(filterTask);
        contentTask.getUpdateTask();
    }

    edit = (data)=>{
        if(!data)return;
       
        for(const prop in data){
            const propUpdate = prop.split("-")[1];
           
            if(this.hasOwnProperty(propUpdate) && propUpdate !== "date"){
               this[propUpdate] = data[prop];
            }
        }
        contentTask.updateDataTask(); 
    }
    
    markAsCompleted= ()=>{
        this.status = "completed";
        this.dateCompleted = dateNotDay();
        contentTask.updateDataTask();
    }

    
    switchStatus= (value)=>{
        if (this.status !== value) {  
        
        this.status = value;
        contentTask.updateDataTask(); 
        }
    }

    switchPriority = (value)=>{
        if(this.priority !== value) {  
        this.priority = value;
        contentTask.updateDataTask(); 
        }
    }

    dataPriority = ()=> [1,2,3].filter(num => num !== this.priority).map(num => {
        if(num === 1)return "High";
        if(num === 2)return "Medium";
        if(num === 3)return "Low"; 
    });
    
    getStatus = ()=>{
        return this.status;
    }

    setValueNew = (value)=>{
        this.isNew = value;
    }

    pushNote = (input)=>{
        if(input === "")return;
        this.note.push({note:toUpper(input), isNew: true});
        contentTask.updateDataTask();
    }

    deleteNote = (noteDOM)=>{
        const filterTask = this.note.filter(note => note.id !== parseInt(noteDOM.dataset.id));
        this.note = [...filterTask];
        contentTask.updateDataTask();
    }

    viewNote = (noteDOM)=> this.note[this.note.findIndex(note => note.id === (parseInt(noteDOM.dataset.id)))].note;

    getNotes = ()=> this.note.length;

    logicPropertiesCompleted = (task)=>{
        if(this.status ==="completed"){
            resetValues(this.duedate,this.timeDuedate,this.completedDuedate);
            task.classList.add("task__completed");
        }
        else if(this.status !== "completed" && this.dateCompleted){
            this.dateCompleted = "";
        }
    }
}