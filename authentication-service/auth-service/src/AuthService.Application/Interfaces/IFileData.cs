namespace AuthService.Application.Interfaces;

/*Interfaz donde se fine acciones, variables, metodos. para obtener informacion
de la imagan que vamos a tener.*/
public interface IFileData
{
    byte[] Data { get; }
    string ContentType { get; }
    string FileName { get; }
    long Size { get; }
}
