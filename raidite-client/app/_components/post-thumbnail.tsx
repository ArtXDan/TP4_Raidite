"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Post } from "../_types/post";
import CommentStats from "./_mini-components/comment-stats";
import { useRouter } from "next/navigation";
import { apiDomain } from "@/next.config";
import { AccountContext } from "../(home)/layout";
import { useContext } from "react";

export default function PostThumbnail(props: { post: Post, showUser: boolean }) {
    
    // Contexts
        const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    // Hooks
    const router = useRouter();

    // Simple constante pour raccourcir l'accès à props.post
    const post = props.post;

    // Visiter la publication cliquée
    function visitPost() {

        router.push("/post/" + post.id);

    }

    return (

        <div>
            <hr className="my-2" />
            {post && post.mainComment &&
                <div className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer flex " onClick={visitPost}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">

                            {/* Affichage de l'avatar de l'auteur OU de l'icône du forum, selon la situation */}
                            {props.showUser ?
                                <Avatar size="sm">
                                    <AvatarImage src={apiDomain + 'api/Users/GetPicture/thumbnail/' + post.mainComment.username} alt="Placeholder" />
                                </Avatar> :
                                <img src={`https://localhost:7127/api/Hubs/GetPicture/` + post.hubId} alt={post.hubName} className="h-[24px] w-[24px] object-cover rounded-full inline" />
                            }
                            
                            <div className="font-bold">{props.showUser ? ('u/' + post.mainComment.username) : ('r/' + post.hubName)} •</div>
                            <div>{new Date(post.mainComment.date).toLocaleString("fr")}</div>
                        </div>
                        <div className="text-xl font-bold my-2">{post.title}</div>
                        <div className="text-sm">{post.mainComment.text.substring(0, Math.min(post.mainComment.text.length, 200))}</div>
                        <CommentStats comment={post.mainComment} />
                    </div>
                    
                        <div className="h-[120px]">
                            {post.mainComment.listeIdsImages?.length > 0 ? (<img className="h-full max-w-[150px] object-cover rounded-lg" src={`https://localhost:7127/api/Posts/GetPicture/thumbnail/` + post.mainComment.listeIdsImages[0]} alt="Miniature" /> ) : null}
                        </div>

                </div>
            }

        </div>

    );

}