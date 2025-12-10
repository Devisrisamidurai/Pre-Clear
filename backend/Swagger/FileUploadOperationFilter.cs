using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace PreClear.Api.Swagger
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Detect IFormFile params or DTOs containing IFormFile
            var hasFileUpload = context.ApiDescription.ParameterDescriptions
                .Any(p =>
                    p.Type == typeof(IFormFile) ||
                    (p.ModelMetadata?.ModelType != null &&
                     p.ModelMetadata.ModelType.GetProperties()
                        .Any(prop => prop.PropertyType == typeof(IFormFile)))
                );

            if (!hasFileUpload)
                return;

            // Force Swagger to treat request as multipart/form-data
            operation.RequestBody = new OpenApiRequestBody
            {
                Required = true,
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = new Dictionary<string, OpenApiSchema>
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary",
                                    Description = "Upload file"
                                }
                            },
                            Required = new HashSet<string> { "file" }
                        }
                    }
                }
            };
        }
    }
}
