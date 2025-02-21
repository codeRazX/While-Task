import variables from "./variables";
import task from "./content-task";
import { showMessage } from "./interface";


const status = task => (variables.formFilter.filterStatus.value || task.status) === task.status;
const priority = task => (Number(variables.formFilter.filterPriority.value) || task.priority) === task.priority;

const date = (task) => {
    const selectedFilter = variables.formFilter.filterDate.value;
  
    const taskDate = new Date(task.sortDate).setHours(0, 0, 0, 0); 
    const currentDate = new Date().setHours(0, 0, 0, 0); 

   
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); 

    switch (selectedFilter) {
        case "today":
            return taskDate === currentDate;
           
        case "week":
            console.log(sevenDaysAgo);
            return taskDate >= sevenDaysAgo && taskDate <= currentDate;

        case "month":
            return taskDate >= thirtyDaysAgo && taskDate <= currentDate;

        case "before-month":
            return taskDate < thirtyDaysAgo;

        default:
            return true; 
    }
};


const filterResult = ()=>{
    if(task.getTask().length === 0)return;
    const results = task.getTask().filter(status).filter(priority).filter(date);
    
    results.length === 0 && showMessage("notification",document.body,"No results found. Try another search or reset the filters");

    task.printTask(results);
}

variables.formFilter.addEventListener("change", filterResult);


