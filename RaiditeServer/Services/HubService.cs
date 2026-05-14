using Azure.Core;
using Microsoft.EntityFrameworkCore;
using RaiditeServer.Data;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace RaiditeServer.Services
{
    public class HubService
    {
        private readonly RaiditeServerContext _context;

        public HubService(RaiditeServerContext context)
        {
            _context = context;
        }
        public async Task<Picture?> GetPicture(int id)
        {
            if (IsContextNull()) return null;

            return await _context.Picture.FindAsync(id);
        }

        // Obtenir la liste des hubs rejoints par un utilisateur
        public IEnumerable<Hub>? GetUserHubs(User user)
        {
            if (IsContextNull()) return null;

            if (user.Hubs == null) return new List<Hub>(); // L'utilisateur n'a rejoint aucun Hub

            return user.Hubs;
        }

        // Obtenir un hub spécifique par son id
        public async Task<Hub?> GetHub(int id)
        {
            if (IsContextNull()) return null;

            return await _context.Hub.FindAsync(id);
        }

        // Ajouter / retirer un hub parmi les hubs de l'utilisateur
        public async Task<Hub?> ToggleJoinHub(int id, User user)
        {
            if (IsContextNull()) return null;

            Hub? hub = await _context.Hub.FindAsync(id);
            if (hub == null) return null;

            hub.Users ??= new List<User>();

            if (hub.Users.Contains(user)) hub.Users.Remove(user);
            else hub.Users.Add(user);
            await _context.SaveChangesAsync();

            return hub;
        }

        // Obtenir tous les hubs
        public async Task<IEnumerable<Hub>?> GetAllHubs()
        {
            if (IsContextNull()) return null;

            return await _context.Hub.ToListAsync();
        }

        // Créer un nouvel hub
        public async Task<Hub?> CreateHub(User user, string hubTitle, IFormFile file)
        {
            if (IsContextNull()) return null;

            Image image = Image.Load(file.OpenReadStream());

            Hub hub = new Hub {
                Id = 0, 
                Creator = user, 
                Name = hubTitle,
                FileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName),
                MimeType = file.ContentType
            };

            bool alreadyExists = await _context.Hub.AnyAsync(h => h.Name.ToUpper() == hub.Name.ToUpper());
            if (alreadyExists) return null;

            image.Mutate(i => i.Resize(
                new ResizeOptions() { Mode = ResizeMode.Min, Size = new Size() { Height = 200 } }));
            image.Save(Directory.GetCurrentDirectory() + "/images/hub/" + hub.FileName);

            _context.Hub.Add(hub);
            await _context.SaveChangesAsync();
            return hub;
        }

        private bool IsContextNull() => _context == null || _context.Hub == null;
    }
}
