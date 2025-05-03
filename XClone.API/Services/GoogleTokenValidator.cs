
using Google.Apis.Auth;
using XClone.API.Data;
using XClone.API.Models;

namespace XClone.API.Services;

public class GoogleTokenValidator
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public GoogleTokenValidator(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    //public async Task<User> ValidateTokenAsync(string idToken)
    //{
    //    var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
    //    var user = _db.Users.FirstOrDefault(u => u.GoogleId == payload.Subject);

    //    if (user is null)
    //    {
    //        user = new User
    //        {
    //            GoogleId = payload.Subject,
    //            Email = payload.Email,
    //            DisplayName = payload.Name,
    //            Profile = new Profile()
    //        };
    //        _db.Users.Add(user);
    //        await _db.SaveChangesAsync();
    //    }

    //    return user;
    //}
}

