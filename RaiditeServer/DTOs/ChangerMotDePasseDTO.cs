using System.ComponentModel.DataAnnotations;
namespace RaiditeServer.DTOs
{
    public class ChangerMotDePasseDTO
    {
        [Required]
        public string OldPassword { get; set; } = null!;
        [Required]
        public string NewPassword { get; set; } = null!;
        [Required]
        public string ConfirmNewPassword { get; set; } = null!;
    }
}
