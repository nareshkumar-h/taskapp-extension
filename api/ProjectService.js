class TodoistApi  {

    apiUrl = "https://api.todoist.com/rest/v2";

    constructor(authToken) {
        this.authToken = authToken;
    }

    createProject(){
        let url = `${this.apiUrl}/projects`;
        return axios.post(url);
    }

    getProjects(){
        let url = `${this.apiUrl}/projects`;
        return axios.get(url);
    }

    getProject(projectId){
        let url = `${this.apiUrl}/projects/${projectId}`;
        return axios.get(url);
    }

    getTasks(projectId){
        let url = `${this.apiUrl}/tasks?project_id=${projectId}`;
        return axios.get(url);
    }

    getTask(taskId){
        let url = `${this.apiUrl}/tasks/${taskId}`;
        return axios.get(url);
    }

    addTask(task){
        let url = `${this.apiUrl}/tasks`;
        return axios.post(url,task);
    }

    updateTask(task){
        let url = `${this.apiUrl}/tasks`;
        return axios.post(url,task);
    }
}