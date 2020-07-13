using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        // GET: api/Test
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Test/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok("value");
        }

        // POST: api/Test
        [HttpPost]
        public IActionResult Post([FromBody] string value)
        {
			return Ok($"Deleted {value}");
		}

        // PUT: api/Test/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] string value)
        {
			return Ok($"Put {id}, {value}");
		}

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
			return Ok($"Deleted {id}");
        }
    }
}
