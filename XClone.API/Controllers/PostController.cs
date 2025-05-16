using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using XClone.API.Data;
using XClone.API.Models;
using XClone.API.Models.DTOs;

[ApiController]
[Route("api/posts")]
public class PostController : ControllerBase
{
    private readonly AppDbContext _db;

    public PostController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetFeed()
    {
        try
        {
            string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized("Invalid user ID in token.");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("User not found.");

            var posts = await _db.Posts
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Content,
                    p.CreatedAt,
                    p.User.Name,
                    p.User.Email,
                    UserId = p.User.Id,
                })
                .ToListAsync();

            return Ok(new { user, posts });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddPost([FromBody] PostDTO postDto)
    {
        try
        {
            string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized("Invalid user ID in token.");

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("User not found.");

            var post = new Post
            {
                Content = postDto.Content,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                User = user
            };

            _db.Posts.Add(post);
            await _db.SaveChangesAsync();

            return Ok(post);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
