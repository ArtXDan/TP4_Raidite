"use client";

import OrangeButton from "@/app/_components/_mini-components/orange-button";
import CommentBox from "@/app/_components/comment-box";
import { useAccount } from "@/app/_hooks/use-account";
import { useComment } from "@/app/_hooks/use-comment";
import useInputBinding from "@/app/_hooks/use-input-binding";
import { Comment } from "@/app/_types/comment";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "../../layout";
import { apiDomain } from "@/next.config";
import { Post } from "@/app/_types/post";
import PostThumbnail from "@/app/_components/post-thumbnail";
import { usePost } from "@/app/_hooks/use-post";

export default function Profile() {

    // Hooks
    const accountAPI = useAccount();
    const postAPI = usePost();
    const commentAPI = useComment();

    // Contexts
    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // États
    const [feedback, setFeedback] = useState("");

    const [comments, setComments] = useState<Comment[]>([]); // Pour stocker les commentaires signalés
    const [posts, setPosts] = useState<Post[]>([]); // Pour stocker les publications favorites

    const oldPass = useInputBinding("");
    const newPass = useInputBinding("");
    const conNewPass = useInputBinding("");

    const moderatorName = useInputBinding("");

    async function changeAvatar() {

        setFeedback("");
        
        // Glisser le code pour préparer l'avatar et appeler la requête ici !

        setFeedback("Avatar modifié ! Réactualisez la page pour voir le nouvel avatar.");

    }

    async function changePassword() {

        setFeedback("");
        
        // Glisser le code pour appeler la requête ici !

        setFeedback("Mot de passe modifié.");

    }

    async function makeModerator() {

        setFeedback("");
        
        // Glisser le code pour appeler la requête ici !

        setFeedback("Modérateur créé.");

    }

    function clearFeedback(){ setFeedback("") }

    return (

        <div className="flex justify-center">
            <div className="w-2xl mt-3 bg-white p-3 rounded-xl">
                <div className="flex items-center gap-2">

                    {/* Avatar et nom d'utilisateur */}
                    <Avatar size="lg">
                        <AvatarImage src="/images/avatar.png" alt="Placeholder" />
                    </Avatar>
                    <div>
                        <div className="text-xl font-bold">{username}</div>
                        <div className="text-sm font-bold text-gray-400">u/{username}</div>
                    </div>

                </div>
                <Tabs defaultValue="avatar">

                    {/* Les 5 onglets possibles (dont deux qui devront être exclusifs à un certain rôle) */}
                    <TabsList variant="line">
                        <TabsTrigger onClick={clearFeedback} value="avatar">Avatar</TabsTrigger>
                        <TabsTrigger onClick={clearFeedback} value="password">Sécurité</TabsTrigger>
                        <TabsTrigger onClick={clearFeedback} value="saves">Favoris</TabsTrigger>
                        <TabsTrigger onClick={clearFeedback} value="moderator">Modération</TabsTrigger>
                        <TabsTrigger onClick={clearFeedback} value="admin">Administration</TabsTrigger>
                    </TabsList>

                    {/* Avatar */}
                    <TabsContent value="avatar" className="pt-2">

                        <img src="/images/avatarPlaceholder.png" alt="Avatar prévisualisé" className="rounded-lg mb-2 m-auto h-[200px]" />
                        <div className="p-2 px-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-full flex items-center">
                            <input type="file" accept="image/*"/>
                        </div>
                        <div className="flex mt-2">
                            <OrangeButton fct={changeAvatar}>Modifier</OrangeButton>
                        </div>

                    </TabsContent>

                    {/* Publication favorites */}
                    <TabsContent value="saves" className="pt-2">
                        {posts.map(p =>
                            <PostThumbnail key={p.id} post={p} showUser={false} />
                        )}
                    </TabsContent>

                    {/* Mot de passe */}
                    <TabsContent value="password" className="pt-2 flex flex-col gap-2">
                        <input {...oldPass} type="text" placeholder="Ancien mot de passe" className="border-gray-300 border-1 p-2 rounded-xl w-full outline-none" />
                        <input {...newPass} type="text" placeholder="Nouveau mot de passe" className="border-gray-300 border-1 p-2 rounded-xl w-full outline-none" />
                        <input {...conNewPass} type="text" placeholder="Confirmer le nouveau mot de passe" className="border-gray-300 border-1 p-2 rounded-xl w-full outline-none" />
                        <div className="flex">
                            <OrangeButton fct={changePassword}>Modifier</OrangeButton>
                        </div>
                    </TabsContent>

                    {/* Modération */}
                    <TabsContent value="moderator" className="pt-2 flex flex-col gap-2">
                        {comments.length == 0 ?
                            <div className="text-sm text-gray-600">Aucun commentaire signalé pour le moment.</div> :
                            <div>
                                <div className="text-sm text-gray-600">Voici la liste des commentaires signalés.</div>
                                {
                                    comments.map(c =>
                                        <CommentBox key={c.id} comment={c} showSubComments={false} isSubComment={false} />
                                    )
                                }
                            </div>
                        }
                    </TabsContent>

                    {/* Administration */}
                    <TabsContent value="admin" className="pt-2 flex flex-col gap-2">
                        <input {...moderatorName} type="text" placeholder="Nom d'utilisateur" className="border-gray-300 border-1 p-2 rounded-xl w-full outline-none" />
                        <div className="flex">
                            <OrangeButton fct={makeModerator}>Ajouter le modérateur</OrangeButton>
                        </div>
                    </TabsContent>

                </Tabs>
                {feedback != "" &&
                    <div className="my-2 text-green-600 text-sm">{feedback}</div>
                }
            </div>
        </div>

    );

}