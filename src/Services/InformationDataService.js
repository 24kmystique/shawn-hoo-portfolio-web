import http from "../http-common";

class InformationDataService{
    //Generic
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
    //About
    getAboutPost(){
        return http.get(`/aboutGET`);
    }
    updateAboutPost(data){
        return http.put("/aboutUPDATE", data);
    }
    //Contact
    getContactPost(){
        return http.get(`/contactGET`);
    }
    updateContactPost(data){
        return http.put("/contactUPDATE", data);
    }
    //Publications
    getPublicationPost(){
        return http.get(`/publicationGET`);
    }
    //Blog
    getBlogPost(){
        return http.get(`/blogGET`);
    }
    updateBlogPost(data){
        return http.put("/blogUPDATE", data);
    }
    createBlogPost(data){
        return http.post("/blogCREATE",data);
    }
    deleteBlogPost(id){
        return http.delete(`/blogDELETE?id=${id}`);
    }
    //Book
    getBookPost(){
        return http.get(`/booksGET`);
    }
    updateBookPost(data){
        return http.put("/bookUPDATE", data);
    }
    createBookPost(data){
        return http.post("/bookCREATE",data);
    }
    deleteBookPost(id){
        return http.delete(`/bookDELETE?id=${id}`);
    }
}

export default new InformationDataService();