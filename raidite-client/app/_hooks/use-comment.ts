import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";
import { FileInput } from "lucide-react";
import { RefObject } from "react";

export function useComment(){

    // Posivoter
    async function upvote(commentId : number){

        const x = await raidite.put(apiDomain + "api/Comments/UpvoteComment/" + commentId);
        console.log(x.data);

    }

    // Négavoter
    async function downvote(commentId : number){

        const x = await raidite.put(apiDomain + "api/Comments/DownvoteComment/" + commentId);
        console.log(x.data);

    }

    // Créer un commentaire
    async function postComment(parentCommentId : number, commentText : string, monFileInput : RefObject<HTMLInputElement | null>){

        //Vérification de la référence vers le input
        if(monFileInput.current == null || monFileInput.current.files == null){
            const formdata = new FormData();
            //Ajout du texte au formdata
            formdata.append("commentText",commentText);
            
            const x = await raidite.post(apiDomain + "api/Comments/PostComment/" + parentCommentId, formdata);
            console.log(x.data);

            return x.data;
        }

        

        //On ajoute les images dans le formdata
        const formdata = new FormData();
        let i = 1;
        for(let e of monFileInput.current.files)
        {
            formdata.append("image"+i,e);
            i++;
        }

        //Ajout du texte au formdata
        formdata.append("commentText",commentText);

        const x = await raidite.post(apiDomain + "api/Comments/PostComment/" + parentCommentId, formdata);
        console.log(x.data);

        return x.data;

    }

    // Modifier un commentaire
    async function editComment(commentId : number, text : string){

        const x = await raidite.put(apiDomain + "api/Comments/PutComment/" + commentId, { text : text});
        console.log(x.data);

        return x.data;

    }

    // Supprimer un commentaire
    async function deleteComment(commentId : number){

        const x = await raidite.delete(apiDomain + "api/Comments/DeleteComment/" + commentId);
        console.log(x.data);

    }

    async function reportComment(commentId : number){



    }

    async function deletePicture(pictureId : number){



    }

    async function getReportedComments(){



    }

    return { postComment, editComment, deleteComment, upvote, downvote, reportComment, deletePicture, getReportedComments };

}