using System.Text.Json;

namespace PreClear.Api.Utils
{
    public static class JsonConverters
    {
        // Safe wrapper for expression-tree friendly conversions
        public static string? SerializeJsonDocument(JsonDocument? doc)
        {
            if (doc is null) return null;
            return JsonSerializer.Serialize(doc);
        }

        public static JsonDocument? ParseJsonDocument(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            return JsonDocument.Parse(json);
        }
    }
}
