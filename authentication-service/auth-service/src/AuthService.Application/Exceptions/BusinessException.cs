namespace AuthService.Application.Exceptions;

/*Esta clase sirve para trabajar las exceptiones de manera personalizada
,hereda de expectiom*/
public class BusinessException : Exception
{
    public string ErrorCode { get; }

    public BusinessException(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }

    public BusinessException(string errorCode, string message, Exception innerException)
        : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}
