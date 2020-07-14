using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using WebApp.Hubs;
using Microsoft.OpenApi.Models;
using System;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace WebApp
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options => options.AddPolicy("Cors", builder =>
			{
				builder
					.AllowAnyMethod()
					.AllowAnyHeader()
					.AllowCredentials()
					.WithOrigins(
									"http://localhost:8080",
									"http://127.0.0.1:8080",
									"https://gourav-d.github.io");
			}));

			//services.AddAuthentication()
			//.AddJwtBearer(options => {
			//	options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
			//	{
			//		OnTokenValidated = cotext => {

			//			return Task.CompletedTask;
			//		},
			//		OnMessageReceived = context =>
			//		{
			//			var accessToken = context.Request.Query["access_token"];
			//			if (string.IsNullOrEmpty(accessToken) == false)
			//			{
			//				context.Token = accessToken;
			//			}
			//			return Task.CompletedTask;
			//		}
			//	};
			//});

			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = Configuration["Jwt:Issuer"],
					ValidAudience = Configuration["Jwt:Issuer"],
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
				};

				options.Events = new JwtBearerEvents
				{
					//OnTokenValidated = cotext =>
					//{

					//	return Task.CompletedTask;
					//},
					OnMessageReceived = context =>
					{
						//This is used for SignalR authentication
						var accessToken = context.Request.Query["access_token"];
						if (string.IsNullOrEmpty(accessToken) == false)
						{
							context.Token = accessToken;
						}
						return Task.CompletedTask;
					}
				};
			});

			// Register the Swagger generator, defining 1 or more Swagger documents
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo
				{
					Version = "v1",
					Title = "ToDo API",
					Description = "A simple example ASP.NET Core Web API",
					TermsOfService = new Uri("https://example.com/terms"),
					Contact = new OpenApiContact
					{
						Name = "Shayne Boyer",
						Email = string.Empty,
						Url = new Uri("https://twitter.com/spboyer"),
					},
					License = new OpenApiLicense
					{
						Name = "Use under LICX",
						Url = new Uri("https://example.com/license"),
					}
				});
			});

			services.Configure<CookiePolicyOptions>(options =>
			{
				// This lambda determines whether user consent for non-essential cookies is needed for a given request.
				options.CheckConsentNeeded = context => true;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});

			services.AddSignalR();
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			// Enable middleware to serve generated Swagger as a JSON endpoint.
			app.UseSwagger();

			// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
			// specifying the Swagger JSON endpoint.
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
			});

			app.UseCors("Cors");

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new PhysicalFileProvider(
				Path.Combine(env.ContentRootPath, "SignalRWebClient")),
				RequestPath = "/SignalRWebClient"
			});

			app.UseAuthentication();

			app.UseSignalR(option => {
				option.MapHub<SampleHub>(new PathString("/Test/Hub"), options =>
				{
					//options.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.ServerSentEvents;
				});

				option.MapHub<SecuredHub>(new PathString("/Secured/Hub"));
			});

			//app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseCookiePolicy();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Index}/{id?}");
			});
		}
	}
}
