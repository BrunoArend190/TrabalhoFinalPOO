// Atividade 1: Modelagem de um Sistema de Biblioteca

// CLASSE: É a planta para criar objetos do tipo Livro.
class Livro {
    // Atributos (Propriedades) da classe Livro. Definem o ESTADO do objeto.
    // O modificador 'public' torna esses atributos acessíveis fora da classe.
    public titulo: string;           
    public autor: string;           
    public editora: string;         
    public anoPublicacao: number;   
    public disponivel: boolean;     
    
    // CONSTRUTOR: Método chamado ao usar 'new Livro()' para criar um OBJETO.
    constructor(titulo: string, autor: string, editora: string, anoPublicacao: number) {
        // 'this.' objeto que está sendo criado.
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
        // Todo livro começa como disponível por padrão. Define o estado inicial.
        this.disponivel = true; 
    }

    // MÉTODO emprestar(): Define o COMPORTAMENTO do objeto Livro.
    public emprestar(): boolean {
        // Lógica de validação: Ação só ocorre se a condição for verdadeira.
        if (this.disponivel) {
            this.disponivel = false; // Altera o ESTADO interno do objeto.
            return true; // Indica sucesso na operação.
        }
        // Indica falha, pois o livro já estava emprestado.
        return false; 
    }

    // MÉTODO devolver(): COMPORTAMENTO que altera o estado do objeto.
    public devolver(): boolean {
        // Lógica de validação: Só devolve se o livro NÃO estiver disponível.
        if (!this.disponivel) {
            this.disponivel = true; // Retorna o livro para o ESTADO disponível.
            return true;
        }
        // Falha, pois o livro já parecia estar na estante.
        return false; 
    }
}

// CLASSE: O molde para criar objetos do tipo Membro (Usuário).
class Membro {
    public nome: string;
    public identificacao: string;
    // Atributo que armazena uma lista (Array) de OBJETOS do tipo Livro.
    public livrosEmprestados: Livro[]; 

    // CONSTRUTOR: Cria o objeto Membro.
    constructor(nome: string, identificacao: string) {
        this.nome = nome;
        this.identificacao = identificacao;
        // Inicializa a lista como vazia para evitar erros.
        this.livrosEmprestados = []; 
    }

    // MÉTODO pegarEmprestado(): Adiciona o Livro à lista do Membro e interage com o Livro.
    public pegarEmprestado(livro: Livro): void {
        console.log(`\n--- TENTATIVA de empréstimo: ${livro.titulo} para ${this.nome} ---`);

        // Delegação: O Membro pede ao OBJETO Livro para se emprestar.
        if (livro.emprestar()) {
            // Se o Livro permitiu a ação 
            // O objeto Livro é adicionado à lista do objeto Membro.
            this.livrosEmprestados.push(livro); 
            console.log(`SUCESSO: Livro "${livro.titulo}" emprestado. [Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}]`);
            console.log(`Livros com ${this.nome}: ${this.livrosEmprestados.length}`);
        } else {
            // Se o Livro negou a ação (retornou false).
            console.log(`FALHA: Livro "${livro.titulo}" JÁ ESTÁ EMPRESTADO.`);
            console.log(`Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}`);
        }
    }

    // MÉTODO devolverLivro(): Remove da lista e interage com o Livro.
    public devolverLivro(livro: Livro): void {
        console.log(`\n--- TENTATIVA de devolução: ${livro.titulo} por ${this.nome} ---`);

        // Lógica: Busca a posição do objeto Livro na lista de empréstimos do Membro.
        const index = this.livrosEmprestados.findIndex(l => l.titulo === livro.titulo);

        if (index !== -1) { // Verifica se o objeto Livro foi encontrado na lista.
            // Delegação: O Membro pede ao OBJETO Livro para mudar seu estado para disponível.
            if (livro.devolver()) { 
                // Se a devolução na classe Livro foi bem-sucedida:
                // Remove o objeto Livro da lista de posse do Membro.
                this.livrosEmprestados.splice(index, 1);
                console.log(`SUCESSO: Livro "${livro.titulo}" devolvido. [Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}]`);
                console.log(`Livros com ${this.nome}: ${this.livrosEmprestados.length}`);
            } else {
                // Falha no método devolver do Livro (já estava disponível).
                console.log(`FALHA: Livro "${livro.titulo}" já está na estante (erro de estado do livro).`);
            }
        } else {
            // TRAVA: O Membro não tinha o livro.
            console.log(`TRAVA: Membro ${this.nome} não possui o livro "${livro.titulo}".`);
        }
    }
}
// Instanciando livros (Criação de 4 OBJETOS do tipo Livro)
console.log('***** INSTANCIANDO LIVROS *****');
const livro1 = new Livro("A Bússola de Ouro", "Philip Pullman", "Rocco", 1995);
const livro2 = new Livro("O Alquimista", "Paulo Coelho", "Sextante", 1988);
const livro3 = new Livro("Clean Code: Habilidades", "Robert C. Martin", "Alta Books", 2008);
const livro4 = new Livro("O Guia do Mochileiro", "Douglas Adams", "Arqueiro", 1979);

// Leitura do estado inicial do objeto.
console.log(`Estado Inicial do Livro 1: "${livro1.titulo}" - Disponível: ${livro1.disponivel}`);

// Instanciando membros (Criação de 3 OBJETOS do tipo Membro)
console.log('\n***** INSTANCIANDO MEMBROS *****');
const membroA = new Membro("Bruno", "M1001");
const membroB = new Membro("Ana", "M1002");
const membroC = new Membro("Carlos", "M1003");


// SIMULAÇÃO: Demonstração de interação entre objetos e alteração de estado.

// OPERAÇÃO 1: OBJETO membroA chama o MÉTODO pegarEmprestado com o OBJETO livro3.
membroA.pegarEmprestado(livro3); 

// OPERAÇÃO 3: OBJETO membroB tenta pegar o OBJETO livro3, que já está indisponível.
membroB.pegarEmprestado(livro3); 

// OPERAÇÃO 5: OBJETO membroA chama o MÉTODO devolverLivro com o OBJETO livro3.
membroA.devolverLivro(livro3); 

// OPERAÇÃO 6: OBJETO membroB tenta devolver um livro que não está na sua lista (TRAVA).
membroB.devolverLivro(livro1); 

// OPERAÇÃO 7: OBJETO livro3, agora disponível, é emprestado ao OBJETO membroC.
membroC.pegarEmprestado(livro3); 

// OPERAÇÃO 10: Tenta devolver o livro2, que acabou de ser devolvido na Operação 9 (TRAVA).
membroB.devolverLivro(livro2);