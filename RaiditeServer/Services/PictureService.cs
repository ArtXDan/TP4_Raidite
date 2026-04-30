
using RaiditeServer.Data;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace RaiditeServer.Services
{
    public class PictureService
    {
        private readonly RaiditeServerContext _context;

        public PictureService(RaiditeServerContext context)
        {
            _context = context;
        }

        private bool IsContextNull() => _context == null || _context.Picture == null;

        public async Task<Picture?> GetPicture(int id)
        {
            if (IsContextNull()) return null;

            return await _context.Picture.FindAsync(id);
        }
    }
}
