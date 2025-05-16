using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace XClone.API.Models;

//public class User
//{
//    public Guid Id { get; set; }
//    public string Name { get; set; }
//    public string Email { get; set; }
//    public DateTime CreatedAt { get; set; }
//}

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ProfilePictureUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public byte[]? ProfileImage { get; set; }
}

