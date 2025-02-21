import variables from "./variables";
import task from "./content-task";
import { calculateRemainingTime } from "./utilities";
import { showMessage } from "./interface";


const status = task => (variables.formFilter.filterStatus.value || task.status) === task.status;
  
const priority = task => (Number(variables.formFilter.filterPriority.value) || task.priority) === task.priority;

const date = (task) => {
    const taskDate = new Date(task.sortDate).setHours(0, 0, 0, 0);
    const currentDate = new Date().setHours(0, 0, 0, 0); 

    const { days } = calculateRemainingTime(task.sortDate);
    const selectedFilter = variables.formFilter.filterDate.value;

    switch (selectedFilter) {
        
        case "today":
         
            return taskDate === currentDate;
           
        case "week":
            return days >= 0 && days <= 7; 

        case "month":
            return days >= 0 && days <= 30; 

        case "before-month":
            return days > 30; 
            
        default:
        return true; 
    }

    // POR SI EL OTRO CODIGO NO FUNCIONA
    // const date = (task) => {
    //     const selectedFilter = variables.formFilter.filterDate.value;
    
    //     // Solo tomamos la fecha sin hora
    //     const taskDate = new Date(task.sortDate).setHours(0, 0, 0, 0); // Fecha de la tarea sin hora
    //     const currentDate = new Date().setHours(0, 0, 0, 0); // Fecha actual sin hora
    
    //     // Calculamos las fechas para los filtros de los 7 y 30 días atrás
    //     const sevenDaysAgo = new Date(currentDate);
    //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 7 días atrás
    
    //     const thirtyDaysAgo = new Date(currentDate);
    //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 días atrás
    
    //     switch (selectedFilter) {
    //         case "today":
    //             // Solo devuelve true si la tarea fue creada hoy
    //             return taskDate === currentDate;
               
    //         case "week":
    //             // Tarea registrada dentro de los últimos 7 días
    //             return taskDate >= sevenDaysAgo && taskDate <= currentDate;
    
    //         case "month":
    //             // Tarea registrada dentro de los últimos 30 días
    //             return taskDate >= thirtyDaysAgo && taskDate <= currentDate;
    
    //         case "before-month":
    //             // Tarea registrada hace más de 30 días
    //             return taskDate < thirtyDaysAgo;
    
    //         default:
    //             return true; // Si no hay filtro seleccionado, devuelve todas las tareas
    //     }
    // };
};

const filterResult = (e)=>{
    const results = task.getTask().filter(status).filter(priority).filter(date);
    
    results.length === 0 && showMessage("notification",document.body,"No results found. Try another search or reset the filters");

    task.printTask(results);
    
}

variables.formFilter.addEventListener("change", filterResult);


