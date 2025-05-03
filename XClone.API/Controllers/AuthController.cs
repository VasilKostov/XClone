using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using XClone.API.Data;
using XClone.API.Models;
using XClone.API.Models.DTOs;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private const string DefaultProfilePictureUrl = "https://example.com/default-profile.png";

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        try
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already in use.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Id = new Guid(),
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Name = dto.Name,
                ProfilePictureUrl = DefaultProfilePictureUrl
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Registration successful", token = GenerateJwtToken(user) });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            return Ok(new { message = "Login successful", token = GenerateJwtToken(user) });
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
            // Add more claims if needed
        };

        // Use a 256-bit key (32 characters) for HS256
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super_secret_key_12345678901234567890123456789012"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "yourIssuer",
            audience: "yourAudience",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}
