
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

    // MÉTODO devolver(): Tenta mudar o estado do livro para disponível.
    public devolver(): boolean {
        // Lógica: Só podemos devolver se o livro estiver indisponível (this.disponivel é false).
        if (!this.disponivel) {
            this.disponivel = true; // Altera o estado para disponível.
            // Retorna true para indicar que a devolução foi um sucesso.
            return true;
        }
        // Se cair aqui, significa que this.disponivel já era true (erro na lógica externa ou tentativa de devolução duplicada).
        return false; // Retorna false para indicar falha na devolução.
    }
}

// Classe Membro
class Membro {
    public nome: string;
    public identificacao: string;
    // O atributo livrosEmprestados é uma (lista) de objetos do tipo Livro.
    public livrosEmprestados: Livro[]; 

    // CONSTRUTOR: Inicializa o Membro com nome e ID.
    constructor(nome: string, identificacao: string) {
        this.nome = nome;
        this.identificacao = identificacao;
        // Toda lista de livros emprestados começa vazia.
        this.livrosEmprestados = []; 
    }

    // MÉTODO pegarEmprestado(): Adiciona o livro à lista do membro e atualiza o livro.
    public pegarEmprestado(livro: Livro): void {
        console.log(`\n--- TENTATIVA de empréstimo: ${livro.titulo} para ${this.nome} ---`);

        // Interagindo com a classe Livro: Chamamos o método emprestar() do objeto Livro.
        if (livro.emprestar()) {
            // Lógica: Se o livro estava disponível e o método emprestar() retornou true,
            // adicionamos o objeto Livro à lista de livrosEmprestados do Membro.
            this.livrosEmprestados.push(livro);
            console.log(`SUCESSO: Livro "${livro.titulo}" emprestado. [Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}]`);
            console.log(`Livros com ${this.nome}: ${this.livrosEmprestados.length}`);
        } else {
            // Lógica: Se o método emprestar() retornou false, o livro já estava emprestado.
            console.log(`FALHA: Livro "${livro.titulo}" JÁ ESTÁ EMPRESTADO.`);
            console.log(`Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}`);
        }
    }

    // MÉTODO devolverLivro(): Remove o livro da lista do membro e atualiza o livro.
    public devolverLivro(livro: Livro): void {
        console.log(`\n--- TENTATIVA de devolução: ${livro.titulo} por ${this.nome} ---`);

        // 1. Verifica se o membro realmente possui este livro para evitar erros.
        // O método findIndex() procura o índice do objeto Livro na lista.
        const index = this.livrosEmprestados.findIndex(l => l.titulo === livro.titulo);

        if (index !== -1) {
            // O livro foi encontrado na lista do membro (index é diferente de -1).

            // 2. Interage com a classe Livro: Chama o método devolver() do objeto Livro.
            if (livro.devolver()) {
                // Lógica: Se a devolução na classe Livro foi bem-sucedida,
                // removemos o objeto Livro da lista de livrosEmprestados do Membro.
                this.livrosEmprestados.splice(index, 1);
                console.log(`SUCESSO: Livro "${livro.titulo}" devolvido. [Status Livro: ${livro.disponivel ? 'Disponível' : 'Emprestado'}]`);
                console.log(`Livros com ${this.nome}: ${this.livrosEmprestados.length}`);
            } else {
                // Lógica: Se o método devolver() retornou false, houve um erro de estado do livro.
                console.log(`FALHA: Livro "${livro.titulo}" já está na estante (erro de estado do livro).`);
            }
        } else {
            // Lógica: O livro não foi encontrado na lista de posse do membro.
            console.log(`TRAVA: Membro ${this.nome} não possui o livro "${livro.titulo}".`);
        }
    }
}
// Instanciando livros
console.log('***** INSTANCIANDO LIVROS *****');
const livro1 = new Livro("A Bússola de Ouro", "Philip Pullman", "Rocco", 1995);
const livro2 = new Livro("O Alquimista", "Paulo Coelho", "Sextante", 1988);
const livro3 = new Livro("Clean Code: Habilidades", "Robert C. Martin", "Alta Books", 2008);
const livro4 = new Livro("O Guia do Mochileiro", "Douglas Adams", "Arqueiro", 1979);

console.log(`Estado Inicial do Livro 1: "${livro1.titulo}" - Disponível: ${livro1.disponivel}`);

// Instanciando membros
console.log('\n***** INSTANCIANDO MEMBROS *****');
const membroA = new Membro("Bruno", "M1001");
const membroB = new Membro("Ana", "M1002");
const membroC = new Membro("Carlos", "M1003");


// ------------------------------------
// OPERAÇÃO 1: Empréstimo BEM-SUCEDIDO
// ------------------------------------
membroA.pegarEmprestado(livro3); 
// Resultado: Sucesso. O livro3 agora está na lista de membroA e livro3.disponivel é false.

// ------------------------------------
// OPERAÇÃO 2: Empréstimo BEM-SUCEDIDO
// ------------------------------------
membroA.pegarEmprestado(livro1); 
// Resultado: Sucesso. membroA agora tem 2 livros.

// ------------------------------------
// OPERAÇÃO 3: TENTATIVA de empréstimo (TRAVA)
// ------------------------------------
membroB.pegarEmprestado(livro3); 
// Resultado: FALHA. O método verifica que livro3.disponivel é false e impede o empréstimo.

// ------------------------------------
// OPERAÇÃO 4: Empréstimo BEM-SUCEDIDO
// ------------------------------------
membroB.pegarEmprestado(livro2); 
// Resultado: Sucesso. livro2 foi emprestado para membroB.

// ------------------------------------
// OPERAÇÃO 5: Devolução BEM-SUCEDIDA
// ------------------------------------
membroA.devolverLivro(livro3); 
// Resultado: Sucesso. livro3 é removido da lista de membroA e livro3.disponivel volta a ser true.

// ------------------------------------
// OPERAÇÃO 6: TENTATIVA de devolução (TRAVA: Membro errado)
// ------------------------------------
membroB.devolverLivro(livro1); 
// Resultado: TRAVA. O membroB não tem o livro1 na sua lista, mesmo o livro estando emprestado (para membroA).

// ------------------------------------
// OPERAÇÃO 7: Empréstimo BEM-SUCEDIDO (livro liberado na Operação 5)
// ------------------------------------
membroC.pegarEmprestado(livro3); 
// Resultado: Sucesso. O livro3, que foi devolvido por membroA, é agora emprestado para membroC.

// ------------------------------------
// OPERAÇÃO 8: Empréstimo BEM-SUCEDIDO
// ------------------------------------
membroC.pegarEmprestado(livro4); 
// Resultado: Sucesso. membroC agora tem 2 livros.

// ------------------------------------
// OPERAÇÃO 9: Devolução BEM-SUCEDIDA
// ------------------------------------
membroB.devolverLivro(livro2); 
// Resultado: Sucesso. livro2 é devolvido, voltando a ficar disponível.

// ------------------------------------
// OPERAÇÃO 10: TENTATIVA de Devolução (TRAVA: Livro já disponível)
// ------------------------------------
// Tenta devolver o livro2, que acabou de ser devolvido na Operação 9.
membroB.devolverLivro(livro2); 
// Resultado: TRAVA. O livro2 já está disponível na estante. A lógica impede que ele seja devolvido novamente.

console.log('\n======================================================');
console.log('VERIFICAÇÃO FINAL DE ESTADOS:');
console.log('======================================================');
console.log(`LIVRO 1 ("${livro1.titulo}") - Disponível: ${livro1.disponivel}`); // Deve ser false (com membroA)
console.log(`LIVRO 3 ("${livro3.titulo}") - Disponível: ${livro3.disponivel}`); // Deve ser false (com membroC)
console.log(`LIVRO 2 ("${livro2.titulo}") - Disponível: ${livro2.disponivel}`); // Deve ser true (devolvido)

console.log(`\nESTADO FINAL MEMBRO A (${membroA.nome}): ${membroA.livrosEmprestados.length} livro(s).`);
console.log(`ESTADO FINAL MEMBRO B (${membroB.nome}): ${membroB.livrosEmprestados.length} livro(s).`);
console.log(`ESTADO FINAL MEMBRO C (${membroC.nome}): ${membroC.livrosEmprestados.length} livro(s).`);