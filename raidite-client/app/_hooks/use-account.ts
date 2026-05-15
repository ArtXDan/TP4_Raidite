import { apiDomain } from "@/next.config";
import { raidite } from "../raidite-interceptor";

export function useAccount(){

    // Inscription
    async function register(name : string, email : string, pass : string, passCon : string){

        const x = await raidite.post(apiDomain + "api/Users/Register", {
            username : name,
            email : email,
            password : pass,
            passwordConfirm : passCon
        });
        console.log(x.data);

    }

    // Connexion
    async function login(name : string, pass : string){

        const x = await raidite.post(apiDomain + "api/Users/Login", {
            username : name,
            password : pass
        });
        console.log(x.data);
        sessionStorage.setItem("token", x.data.token);
        sessionStorage.setItem("username", x.data.username);
        sessionStorage.setItem("roles", JSON.stringify(x.data.roles));
        return x.data;

    }

    // Déconnexion
    async function logout(){

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        location.reload();

    }

    async function changeAvatar(formData : any){

        const x = await raidite.post(apiDomain + "api/Users/ChangeAvatar/", formData);
        console.log(x.data);

        return x.data;

    }

    async function changePassword(oldPass : string, newPass : string, conNewPass : string){

        const x = await raidite.post(apiDomain + "api/Users/ChangePassword", {
        oldPassword: oldPass,
        newPassword: newPass,
        confirmNewPassword: conNewPass
    });
    return x.data;

    }

    async function makeModerator(username : string){



    }

    return { register, login, logout, changeAvatar, changePassword, makeModerator };

}