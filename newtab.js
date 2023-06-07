const apiToken = "1ad259fdb9dd030eba190d49952464b66b17d1c1";
axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

const api = new TodoistApi(apiToken);
selectProject('ETS');
// const navMenu = document.querySelector("#projects-nav");
// window.addEventListener('')
function selectProject(projectName){
    api.getProjects().then(res=>{
        const projects = res.data;
        
        let project = getProject(projects,projectName);
        console.log(project);
        localStorage.setItem('SELECTED_PROJECT',JSON.stringify(project));
        loadTasks();
    });
}




function getProject(projects, name){
    return projects.find(obj=>obj.name==name);
}


document.addEventListener("DOMContentLoaded", function () {

    document.querySelector("#taskTbl").innerHTML = "";
 

   
});

function getWidgetData(color,label,value){
    let colorTheme = "";
    if (color =='red'){
        colorTheme ='red-intense';
    }else if (color =='green'){
        colorTheme ='green-haze';
    }else if (color =='purple'){
        colorTheme ='purple-plum';
    }else{
        colorTheme = 'blue-madison';
    }
    
    return `
    <div class="col-2" id="reportData">
                            <div class="dashboard-stat ${colorTheme}">
                                <div class="visual">

                                </div>
                                <div class="details">
                                    <div class="number">
                                        ${value}
                                    </div>
                                    <div class="desc">
                                        ${label}
                                    </div>
                                </div>
                            </div>
                        </div>
    `;
}

function taskReportData(tasks){
    document.querySelector("#reportData").innerHTML = "";
    const reportDataDiv = document.querySelector("#reportData");
    let priorityHigh = tasks.filter(t=>t.priority==1);
    let priorityMedium = tasks.filter(t=>t.priority==2);
    let priorityLow = tasks.filter(t=>t.priority==3);
    let delayedTasks = tasks.filter(t=>t.timeLeft < 0);
    let content =  "";        
    content+= getWidgetData('green','Tasks',tasks.length);
    // content+= getWidgetData('red','Pending',tasks.length);
    content+= getWidgetData('red','High Priority',priorityHigh.length);
    content+= getWidgetData('blue','Medium Priority',priorityMedium.length);
    content+= getWidgetData('purple','Low Priority',priorityLow.length);
    content+= getWidgetData('red','Delay',delayedTasks.length);
    reportDataDiv.innerHTML = content;
}

function getPriorityBadge(priority){
    let badgeName = "";
    let label="";
    if(priority==1){
        badgeName = 'danger';
        label ='High';
    }
    else if(priority==2){
        badgeName = 'info';
        label = 'Medium';
    }
    else{
        badgeName = 'primary';
        label = 'Low';
    }
    return `
    <span class="badge bg-${badgeName}">${label}</span>
    `
}

function getStatusBadge(status){
    let badgeName = "";
    let label="";
    if(status==1){
        badgeName = 'success';
        label ='Completed';
    }
    else{
        badgeName = 'danger';
        label = 'Pending';
    }
    return `
    <span class="badge bg-${badgeName}">${label}</span>
    `
}

function displayTasks(projectName,tasks){
    
    document.querySelector("#projectTitle").innerHTML = projectName + " Tasks";
    document.querySelector("#taskTbl").innerHTML = "";
    let content = "";
    let i = 0;
    for(let p of tasks) {
        i++;
        let deadlineDate = p.due ? p.due.date:null;
        let dueDate = p.due!=null ?moment(p.due.date).format('MMM Do YYYY'): "";
        let timeLeft = 0;
        if (deadlineDate){
            let daysLeft = dayjs(deadlineDate).diff(dayjs(),'day');
            let hours = 8;
            timeLeft = hours * daysLeft;
        }
        p.timeLeft = timeLeft;
        content+=`
        <tr>
            <td>${i}</td>
            <td>${p.content}</td>
            <td>${getPriorityBadge(p.priority)}</td>
            <td>${getStatusBadge(p.is_completed)}</td>           
            <td>${ dueDate}</td>
            <td>${timeLeft!=0?timeLeft:''}</td>
            <td>${moment(p.created_at).format('MMM Do YYYY')}</td>
        </tr>
        `
    }

    taskReportData(tasks);

    document.querySelector("#taskTbl").innerHTML = content;

  
}

function loadTasks(){
        
        let project = JSON.parse(localStorage.getItem('SELECTED_PROJECT'));
        console.log(project);
        api.getTasks(project.id).then(res=>{    
            let tasks = res.data;   
            console.log(tasks);
            displayTasks(project.name, tasks);
         });

}