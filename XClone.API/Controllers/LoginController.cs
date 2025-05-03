//using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.Google;
//using Microsoft.AspNetCore.Mvc;
//using XClone.API.Data;
//using XClone.API.Models;
//using System.Security.Claims;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.EntityFrameworkCore;

//namespace XClone.API.Controllers;

//[Route("api/[controller]")]
//[ApiController]
//public class LoginController : ControllerBase
//{
//    private readonly AppDbContext _db;

//    public LoginController(AppDbContext db)
//    {
//        _db = db;
//    }

//    // This endpoint triggers the Google OAuth flow
//    [HttpGet("google-login")]
//    public IActionResult GoogleLogin()
//    {
//        var redirectUrl = Url.Action("GoogleResponse", "Login");
//        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
//        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
//    }

//    // This endpoint handles the callback from Google after authentication
//    [HttpGet("google-response")]
//    public async Task<IActionResult> GoogleResponse()
//    {
//        // Authenticate the user with Google
//        var authenticateResult = await HttpContext.AuthenticateAsync();
//        var externalLogin = authenticateResult?.Principal?.Identities?.FirstOrDefault();

//        if (externalLogin != null)
//        {
//            var email = externalLogin?.FindFirst(ClaimTypes.Email)?.Value;
//            var name = externalLogin?.FindFirst(ClaimTypes.Name)?.Value;

//            // Look for an existing user in the database
//            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

//            if (user == null)
//            {
//                // Create a new user if not found
//                user = new User
//                {
//                    Email = email,
//                    Name = name,
//                    CreatedAt = DateTime.UtcNow
//                };

//                _db.Users.Add(user);
//                await _db.SaveChangesAsync();
//            }

//            // You can generate a JWT or session cookie here if needed for subsequent authenticated requests

//            return Ok(new { message = "Login successful", user });
//        }

//        return Unauthorized("Authentication failed");
//    }
//}
