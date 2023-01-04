import http from "../http-common";

class InformationDataService{
    getAll(id){
        return http.get(`/id/${id}`);
    }

    createPost(data){
        return http.post("/review",data);
    }

    updatePost(data){
        return http.put("/review", data);
    }

    deletePost(id){
        return http.delete(`/review?id=${id}`);
    }

    getAboutPost(){
        return http.get(`/aboutGET`);
    }
    updateAboutPost(data){
        return http.put("/aboutUPDATE", data);
    }
}

export default new InformationDataService();