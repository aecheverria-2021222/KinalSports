using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AuthService.Domain.Constants;

namespace AuthService.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserManagementService _userManagementService;
        private readonly IRefreshTokenService _refreshTokenService;

        public AuthController(IAuthService authService, IUserManagementService userManagementService, IRefreshTokenService refreshTokenService)
        {
            _authService = authService;
            _userManagementService = userManagementService;
            _refreshTokenService = refreshTokenService;
        }
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
        {
            var result = await _refreshTokenService.RotateAsync(dto.RefreshToken);
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshRequestDto dto)
        {
            await _refreshTokenService.RevokeAsync(dto.RefreshToken);
            return Ok(new { message = "Sesión cerrada" });
        }

        private async Task<bool> CurrentUserIsAdmin()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (string.IsNullOrEmpty(userId)) return false;
            var roles = await _userManagementService.GetUserRolesAsync(userId);
            return roles.Contains(RoleConstants.ADMIN_ROLE);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<object>> GetProfile()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByIdAsync(userIdClaim.Value);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                success = true,
                message = "Perfil obtenido exitosamente",
                data = user
            });
        }

        [HttpPost("profile/by-id")]
        [EnableRateLimiting("ApiPolicy")]
        public async Task<ActionResult<object>> GetProfileById([FromBody] GetProfileByIdDto request)
        {
            if (string.IsNullOrEmpty(request.UserId))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "El userId es requerido"
                });
            }

            var user = await _authService.GetUserByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Usuario no encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Perfil obtenido exitosamente",
                data = user
            });
        }
        [HttpPost("register")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB límite
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            // Devolver 201 Created para registro
            return StatusCode(201, result);
        }

        [HttpPost("login")]
        [IgnoreAntiforgeryToken]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        [HttpPost("verify-email")]
        [EnableRateLimiting("ApiPolicy")]
        public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
        {
            var result = await _authService.VerifyEmailAsync(verifyEmailDto);
            return Ok(result);
        }

        [HttpPost("resend-verification")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
        {
            var result = await _authService.ResendVerificationEmailAsync(resendDto);

            // Return appropriate status code based on result
            if (!result.Success)
            {
                if (result.Message.Contains("no encontrado", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(result);
                }
                if (result.Message.Contains("ya ha sido verificado", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("ya verificado", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(result);
                }
                // Email sending failed - Service Unavailable
                return StatusCode(503, result);
            }

            return Ok(result);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

            // ForgotPassword always returns success for security (even if user not found)
            // But if email sending fails, return 503
            if (!result.Success)
            {
                return StatusCode(503, result);
            }

            return Ok(result);
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);
            return Ok(result);
        }

        [HttpGet("users")]
        [Authorize]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            if (!await CurrentUserIsAdmin())
            {
                return StatusCode(403, new { success = false, message = "Forbidden" });
            }

            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}
