using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var profile = await _db.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateProfile(Guid userId, [FromBody] Profile updated)
    {
        var profile = await _db.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return NotFound();

        profile.Bio = updated.Bio;
        profile.ProfilePictureUrl = updated.ProfilePictureUrl;

        await _db.SaveChangesAsync();
        return Ok(profile);
    }
}
