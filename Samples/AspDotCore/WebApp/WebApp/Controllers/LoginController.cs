using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace WebApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class LoginController : Controller
    {
		private IConfiguration _config;

		public LoginController(IConfiguration config)
		{
			_config = config;
		}

		[AllowAnonymous]
		[HttpGet("~/GetToken")]
		public IActionResult GetToken(string username, string password)
		{
			var login = new UserModel{ Username = username, Password = password };
			IActionResult response = Unauthorized();
			var user = AuthenticateUser(login);

			if (user != null)
			{
				var tokenString = GenerateJSONWebToken(user);
				response = Ok(new { token = tokenString });
			}

			return response;
		}

		[HttpGet]
		[Authorize]
		public ActionResult<IEnumerable<string>> Get()
		{
			return new string[] { "value1", "value2", "value3", "value4", "value5" };
		}

		private string GenerateJSONWebToken(UserModel userInfo)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(_config["Jwt:Issuer"],
			  _config["Jwt:Issuer"],
			  null,
			  expires: DateTime.Now.AddMinutes(120),
			  signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		private UserModel AuthenticateUser(UserModel login)
		{
			UserModel user = null;

			if (login.Username == "admin" && login.Password == "admin")
			{
				user = new UserModel { Username = "Test", EmailAddress = "test@test.com" };
			}
			return user;
		}
	}

	public class UserModel
	{
		public string Username { get; set; }
		public string EmailAddress { get; set; }
		public string Password { get; set; }
	}
}