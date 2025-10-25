
class Livro {
    // Atributos (Propriedades) da classe Livro.
    public titulo: string;          
    public autor: string;           
    public editora: string;         
    public anoPublicacao: number;   
    public disponivel: boolean;
    
    // CONSTRUTOR: Método especial chamado ao criar um novo objeto Livro.
    constructor(titulo: string, autor: string, editora: string, anoPublicacao: number) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
        // Todo livro começa como disponível por padrão.
        this.disponivel = true; 
    }

    // MÉTODO emprestar(): Tenta mudar o estado do livro para indisponível.
    public emprestar(): boolean {
        // Lógica: Só podemos emprestar se o livro estiver disponível (this.disponivel é true).
        if (this.disponivel) {
            this.disponivel = false; // Altera o estado para emprestado.
            // Retorna true para indicar que o empréstimo foi um sucesso.
            return true;
        }
        // Se cair aqui, significa que this.disponivel é false.
        return false; 
    }
}