using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RaiditeServer.Data;
using RaiditeServer.DTOs;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace RaiditeServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly UserManager<User> _userManager;
        private readonly RaiditeServerContext _context;

        public UsersController(UserManager<User> userManager, RaiditeServerContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> ChangeAvatar() 
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                IFormCollection formCollection = await Request.ReadFormAsync();
                IFormFile? file = formCollection.Files.GetFile("image"); 

                if (file == null) return BadRequest(new { Message = "Fournis une image, niochon" });

                Image image = Image.Load(file.OpenReadStream());

                user.FileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                user.MimeType = file.ContentType;

                
                image.Save(Directory.GetCurrentDirectory() + "/images/full/" + user.FileName);

                image.Mutate(i => i.Resize(
                    new ResizeOptions() { Mode = ResizeMode.Min, Size = new Size() { Height = 200 } }));
                image.Save(Directory.GetCurrentDirectory() + "/images/thumbnail/" + user.FileName);

                

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("{size}/{username}")]
        public async Task<ActionResult> GetPicture(string size, string username)
        {
            User? user = await _userManager.FindByNameAsync(username);

            if (user.FileName == null) 
            {
                byte[] bytes2 = System.IO.File.ReadAllBytes(Directory.GetCurrentDirectory() + "/images/hubLogo.png");
                return File(bytes2, "image/png");
            }
            
            // Si la size fournit ne correspond pas à "big" OU "smol", erreur.
            if (!Regex.Match(size, "full|thumbnail").Success) return BadRequest(new { Message = "La taille demandée n'existe pas." });

            // Récupération du fichier sur le disque
            byte[] bytes = System.IO.File.ReadAllBytes(Directory.GetCurrentDirectory() + "/images/" + size + "/" + user.FileName);
            return File(bytes, user.MimeType);
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO register)
        {
            if (register.Password != register.PasswordConfirm)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Les deux mots de passe spécifiés sont différents." });
            }
            User user = new User()
            {
                UserName = register.Username,
                Email = register.Email
            };
            IdentityResult identityResult = await _userManager.CreateAsync(user, register.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Message = "La création de l'utilisateur a échoué." });
            }
            return Ok(new { Message = "Inscription réussie ! 🥳" });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO login)
        {
            User? user = await _userManager.FindByNameAsync(login.Username);
            if (user == null) user = await _userManager.FindByEmailAsync(login.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                IList<string> roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                foreach (string role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                authClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes("LooOOongue Phrase SiNoN Ça ne Marchera PaAaAAAaAas !"));
                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: "https://localhost:7127",
                    audience: "http://localhost:3000",
                    claims: authClaims,
                    expires: DateTime.Now.AddMinutes(300),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                    );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    validTo = token.ValidTo,
                    username = user.UserName,
                    roles = roles
                });
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Le nom d'utilisateur ou le mot de passe est invalide." });
            }
        }
        [HttpPut]
        [Authorize]
        public async Task<ActionResult> ChangePassword(ChangerMotDePasseDTO changerMDP)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (user == null) return Unauthorized();

            if (changerMDP.NewPassword != changerMDP.ConfirmNewPassword)
            return BadRequest(new { Message = "Les deux nouveaux mots de passe ne correspondent pas." });

            IdentityResult result = await _userManager.ChangePasswordAsync(user, changerMDP.OldPassword, changerMDP.NewPassword);

            if (!result.Succeeded)
            return BadRequest(new { Message = "L'ancien mot de passe est incorrect." });

            return Ok(new { Message = "Mot de passe modifié avec succès." });
        }

        [HttpPut("{username}")]
        [Authorize(Roles = "administrateur")]
        public async Task<IActionResult> MakeModerator(string username)
        {
            User? newAdmin = await _userManager.FindByNameAsync(username);
            if (newAdmin == null) return NotFound(new { Message = "Cet utilisateur n'existe pas" });

            await _userManager.AddToRoleAsync(newAdmin, "administrateur");
            return Ok(new { Message = username + " est maintenant admin!" });

        }
    }
}
