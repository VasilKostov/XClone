namespace XClone.API.Models;

public class Profile
{
    public Guid Id { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string ProfilePictureUrl { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; }
}

