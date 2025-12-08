namespace PreClear.Api.Interfaces
{
    public interface IAiService
    {
        System.Threading.Tasks.Task<PreClear.Api.Models.AiResultDto> AnalyzeAsync(string description);
    }
}
