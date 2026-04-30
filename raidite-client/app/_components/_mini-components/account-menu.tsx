"use client";

import { AccountContext } from "@/app/(home)/layout";
import { useAccount } from "@/app/_hooks/use-account";
import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiDomain } from "@/next.config";
import { Ellipsis, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function AccountMenu() {

    const { loggedIn, setLoggedIn, username, setUsername } = useContext(AccountContext);

    const account = useAccount();

    // Déconnexion
    function disconnect() {

        // « Vider » le AccountContext
        setLoggedIn(false);
        setUsername("");

        // Le hook va vider le stockage de session et réactualiser la page
        account.logout();

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {loggedIn ?
                    <div className="cursor-pointer p-1 hover:bg-gray-100 rounded-full">

                        {/* Affichage de l'avatar si on est connecté */}
                        <Avatar className="overflow-visible">
                            <AvatarImage src="/images/avatar.png" alt="Placeholder" className="rounded-full" />
                            <AvatarBadge className="bg-green-600" />
                        </Avatar>
                    </div>
                    : <button className="p-2 rounded-full cursor-pointer hover:bg-gray-100 focus:outline-none"><Ellipsis /></button>
                }

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="end">
                <DropdownMenuGroup className="[&>*]:cursor-pointer">
                    {loggedIn && <Link href="/account/profile"><DropdownMenuItem><User />Profil</DropdownMenuItem></Link>}
                    {!loggedIn && <Link href="/account/login"><DropdownMenuItem><LogIn />Connexion</DropdownMenuItem></Link>}
                    {!loggedIn && <Link href="/account/register"><DropdownMenuItem><User />Inscription</DropdownMenuItem></Link>}
                    {loggedIn && <DropdownMenuItem variant="destructive" onClick={disconnect}><LogOut />Déconnexion</DropdownMenuItem>}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    );

}