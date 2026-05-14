import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";
import { RefObject } from "react";


export function usePost() {

    // Obtenir une liste de publication à afficher sur la page d'accueil
    async function getFeedPosts(feed: string, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/GetPosts/" + feed + "/" + sorting);
        console.log(x.data);

        return x.data;

    }

    // Recherche les publications qui contiennent un texte demandé
    async function searchPosts(query: string, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/SearchPosts/" + query + "/" + sorting);
        console.log(x.data);

        return x.data

    }

    // Créer une publication
    async function postPost(hubId: string, postTitle : string, postText : string, file: RefObject<HTMLInputElement | null>) {

        const formData = new FormData();

        const hub : string  = hubId;
        
        const title : string | null = postTitle;

        const text : string | null = postText;

        

        formData.append("hubId", hub)
        formData.append("postTitle", title)
        formData.append("postText", text)

        //On vérifie si le file input est null
        if(file.current == null || file.current.files == null){
        const formData = new FormData();

        const x = await raidite.post(apiDomain + "api/Posts/PostPost/" + hubId, formData);
        console.log(x.data);

        return x.data;
    }
        let i = 1;
        for(let f of file.current.files){
         formData.append("image" + i, f); 
         i++;
        }

        const x = await raidite.post(apiDomain + "api/Posts/PostPost/" + hubId, formData);
        console.log(x.data);

        return x.data;
    }

    // Obtenir une publication et ses commentaires
    async function getFullPost(postId: number, sorting: string) {

        const x = await raidite.get(apiDomain + "api/Posts/GetFullPost/" + postId + "/" + sorting);
        console.log(x.data);

        return x.data;

    }


    async function savePost(postId : number){



    }

    async function getSavedPosts(){

        

    }

    return { getFeedPosts, searchPosts, postPost, getFullPost, savePost, getSavedPosts };

}