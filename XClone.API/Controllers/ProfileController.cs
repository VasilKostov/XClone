using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Security.Claims;
using XClone.API.Data;
using XClone.API.Models;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProfileController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("getprofile")]
    public async Task<IActionResult> GetProfile([FromBody]Guid profileId)
    {
        try
        {
            string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized("Invalid user ID in token.");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("User not found.");

            var profile = await _db.Users.FindAsync(profileId);
            if (profile == null)
                return NotFound();

            var posts = await _db.Posts
                .Include(p => p.User)
                .Where(p=>p.UserId == profileId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Content,
                    p.CreatedAt,
                    p.User.Name,
                    p.User.Email,
                    UserId = p.User.Id,
                    profileImage = p.User.ProfileImage,
                })
                .ToListAsync();
            var sameUser = user.Id == profile.Id;
            return Ok(new { user, profile, posts, sameUser });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("editprofile")]
    public async Task<IActionResult> EditProfile([FromForm] string name, [FromForm] IFormFile? profilePicture)
    {
        try
        {
            string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized("Invalid user ID in token.");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("User not found.");

            if (!string.IsNullOrWhiteSpace(name))
            {
                user.Name = name;
            }

            if (profilePicture != null)
            {
                if (profilePicture.Length > 5 * 1024 * 1024)
                    return BadRequest("Profile picture size must be less than 5MB.");

                using var memoryStream = new MemoryStream();
                await profilePicture.CopyToAsync(memoryStream);
                user.ProfileImage = memoryStream.ToArray();
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
