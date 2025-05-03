using System.Text.Json.Serialization;
using XClone.API.Models;

public class Post
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; } // Use Guid here
    public required User User { get; set; }
}