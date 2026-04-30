using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations.Schema;

namespace RaiditeServer.Models
{
    public class User : IdentityUser
    {
        [InverseProperty("Users")]
        public virtual List<Hub> Hubs { get; set; } = new List<Hub>();

        [InverseProperty("Creator")]
        public virtual List<Hub> CreatedHubs { get; set; } = new List<Hub> { };

        [InverseProperty("User")]
        public virtual List<Comment> Comments { get; set; } = new List<Comment> { };

        [InverseProperty("Upvoters")]
        public virtual List<Comment> Upvotes { get; set; } = new List<Comment> { };

        [InverseProperty("Downvoters")]
        public virtual List<Comment> Downvotes { get; set; } = new List<Comment> { };
    }
}
