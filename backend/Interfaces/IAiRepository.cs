using System.Threading.Tasks;
using PreClear.Api.Models;

namespace PreClear.Api.Interfaces
{
    public interface IAiRepository
    {
        System.Threading.Tasks.Task SaveFindingAsync(AiFinding finding);
    }
}
