using Microsoft.AspNetCore.Http;

namespace PreClear.Api.Models
{
    public class FileUploadRequest
    {
        public IFormFile File { get; set; }
    }
}
