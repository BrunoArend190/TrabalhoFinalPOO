// 1. ABSTRAÇÃO E INTERFACES (Contratos)
// Interface: Define o CONTRATO básico para qualquer notificação(Abstração).
interface INotificacao {
    // Qualquer classe que implementar esta interface DEVE ter este método.
    enviar(mensagem: string, destinatario: string): void;
}

// Classe Concreta: Implementa o contrato, focada apenas em mandar a notificação para o console
class NotificacaoConsole implements INotificacao {
    // Implementação do método do contrato.
    enviar(mensagem: string, destinatario: string): void {
        console.log(`[NOTIFICAÇÃO para ${destinatario}]: ${mensagem}`);
    }
}

// 2. CLASSES DE DOMÍNIO (Encapsulamento e Responsabilidade Única)

// Classe Livro: Responsável APENAS por gerenciar seus dados e estado de disponibilidade.
class Livro {
    // Encapsulamento: Atributos privados protegidos de acesso externo direto.
    constructor(
        private _id: number,
        private _titulo: string,
        private _autor: string,
        private _preco: number,
        private _quantidadeTotal: number,
        private _quantidadeDisponivel: number
    ) {}

    // Getter: Permite que o ID seja lido 
    public get id(): number { return this._id; }
    // Getter: Permite ler o título.
    public get titulo(): string { return this._titulo; }
    // Getter: Fornece o status de disponibilidade do livro.
    public get disponivel(): boolean { return this._quantidadeDisponivel > 0; }

    // Método: Altera o estado interno
    public emprestar(): boolean {
        if (this._quantidadeDisponivel > 0) {
            this._quantidadeDisponivel--;
            return true;
        }
        return false;
    }

    // Método: Altera o estado interno
    public devolver(): void {
        // Trava para não exceder o total de cópias.
        if (this._quantidadeDisponivel < this._quantidadeTotal) {
            this._quantidadeDisponivel++;
        }
    }

    // Método: Retorna uma string detalhada do livro.
    public detalhes(): string {
        return `${this._titulo} por ${this._autor} (Disp: ${this._quantidadeDisponivel})`;
    }
}

// 3. HERANÇA E POLIMORFISMO (Usuários e Regras)

// Classe Base Abstrata: Define a estrutura e métodos comuns a todos os usuários.
abstract class Usuario {
    // Atributo privado que armazena o total de multas.
    protected multas: number = 0;

    // Construtor: Inicializa dados básicos do usuário.
    constructor(
        private _id: number,
        private _nome: string,
        protected _email: string // Protected para possível acesso futuro em herança.
    ) {}

    // Getter para ID.
    public get id(): number { return this._id; }
    // Getter para Nome.
    public get nome(): string { return this._nome; }
    // Getter para Multas.
    public get totalMultas(): number { return this.multas; }
    // Getter para status
    public get estaAtivo(): boolean { return true; } 

    // Método: Adiciona multa ao total.
    public aplicarMulta(valor: number): void {
        this.multas += valor;
    }

    // Métodos Abstratos: OBRIGAM as classes filhas a definir suas regras (POLIMORFISMO)
    // elimina os grandes blocos 'if/else' do código original
    abstract get limiteEmprestimos(): number;
    abstract get diasPrazoDevolucao(): number;
    abstract get taxaMultaDiaria(): number;
}

// Subclasse Estudante: Implementa as regras específicas do Estudante.
class Estudante extends Usuario {
    // Polimorfismo: Retorna o limite específico do Estudante.
    get limiteEmprestimos(): number { return 3; }
    // Polimorfismo: Retorna o prazo específico do Estudante.
    get diasPrazoDevolucao(): number { return 14; }
    // Polimorfismo: Retorna a multa específica do Estudante.
    get taxaMultaDiaria(): number { return 0.50; }
}

// Subclasse Professor: Implementa as regras específicas do Professor.
class Professor extends Usuario {
    // Polimorfismo: Retorna o limite específico do Professor.
    get limiteEmprestimos(): number { return 5; }
    // Polimorfismo: Retorna o prazo específico do Professor.
    get diasPrazoDevolucao(): number { return 30; }
    // Polimorfismo: Retorna a multa específica do Professor.
    get taxaMultaDiaria(): number { return 0.30; }
}

// Subclasse Usuário Comum: Implementa as regras específicas do Usuário Comum.
class UsuarioComum extends Usuario {
    // Polimorfismo: Retorna o limite específico do Comum.
    get limiteEmprestimos(): number { return 2; }
    // Polimorfismo: Retorna o prazo específico do Comum.
    get diasPrazoDevolucao(): number { return 7; }
    // Polimorfismo: Retorna a multa específica do Comum.
    get taxaMultaDiaria(): number { return 1.00; }
}

// 4. CLASSE DE ASSOCIAÇÃO (Empréstimo)

// Classe Emprestimo: Responsável por gerenciar os dados de uma ÚNICA transação.
class Emprestimo {
    private dataDevolucaoPrevista: Date;
    private devolvido: boolean = false;

    constructor(
        private _id: number,
        private _usuario: Usuario, // Relacionamento: Associa um Usuário
        private _livro: Livro,     // Relacionamento: Associa um Livro
        private _dataEmprestimo: Date = new Date()
    ) {
        // Calcula a data de devolução usando o prazo da regra do usuário (Polimorfismo).
        this.dataDevolucaoPrevista = new Date(_dataEmprestimo);
        this.dataDevolucaoPrevista.setDate(this.dataDevolucaoPrevista.getDate() + _usuario.diasPrazoDevolucao);
    }

    // Getter para ID.
    public get id(): number { return this._id; }
    // Getter para Livro.
    public get livro(): Livro { return this._livro; }
    // Getter para Usuário.
    public get usuario(): Usuario { return this._usuario; }
    // Getter para status de devolução.
    public get foiDevolvido(): boolean { return this.devolvido; }

    // Método: Finaliza o empréstimo e calcula multas.
    public finalizarDevolucao(): number {
        this.devolvido = true;
        this._livro.devolver(); // Notifica o Livro que uma cópia voltou (Encapsulamento).
        
        const hoje = new Date();
        //  Verifica se há atraso.
        if (hoje > this.dataDevolucaoPrevista) {
            // Cálculo: Diferença de tempo em milissegundos.
            const diffTime = Math.abs(hoje.getTime() - this.dataDevolucaoPrevista.getTime());
            // Conversão para dias.
            const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Cálculo Polimórfico: Usa a taxa de multa específica da classe de usuário.
            const multa = diasAtraso * this._usuario.taxaMultaDiaria;
            this._usuario.aplicarMulta(multa); // Aplica a multa no objeto Usuário (Encapsulamento).
            return multa;
        }
        return 0; // Devolve 0 se não houver multa.
    }
}

//// 5. GERENCIADOR

// Classe Biblioteca: Atua como a fachada do sistema, ORQUESTRANDO as interações.
class Biblioteca {
    // Coleções privadas, acessadas apenas por métodos de busca (Encapsulamento).
    private livros: Livro[] = [];
    private usuarios: Usuario[] = [];
    private emprestimos: Emprestimo[] = [];
    private notificador: INotificacao; // Abstração: Depende da Interface, não da classe concreta.

    // Construtor: Exige um objeto que implemente INotificacao.
    constructor(notificador: INotificacao) {
        this.notificador = notificador;
    }

    // Método: Adiciona um objeto Livro à coleção.
    public adicionarLivro(livro: Livro): void {
        this.livros.push(livro);
    }

    // Método: Adiciona um objeto Usuário à coleção.
    public registrarUsuario(usuario: Usuario): void {
        this.usuarios.push(usuario);
    }

    // Método Refatorado: Focado apenas na orquestração e nas validações de fluxo.
    public realizarEmprestimo(usuarioId: number, livroId: number): void {
        // Busca de objetos (uso de find no lugar de loops for gigantes).
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        const livro = this.livros.find(l => l.id === livroId);

        // Validações 
        if (!usuario || !livro) {
            console.log("Usuário ou Livro não encontrado.");
            return;
        }

        if (!livro.disponivel) { // Usa o getter 'disponivel' do objeto Livro (Encapsulamento).
            console.log(`O livro "${livro.titulo}" não está disponível.`);
            return;
        }

        // Validação de Multas (uso do getter 'totalMultas').
        if (usuario.totalMultas > 0) {
            console.log(`Usuário possui multa pendente de R$ ${usuario.totalMultas.toFixed(2)}.`);
            return;
        }

        // Verifica o limite de empréstimos ativos.
        const emprestimosAtivos = this.emprestimos.filter(e => e.usuario.id === usuario.id && !e.foiDevolvido).length;
        // Uso do Polimorfismo: Acessa o limite específico da classe de usuário.
        if (emprestimosAtivos >= usuario.limiteEmprestimos) { 
            console.log(`Usuário atingiu o limite de ${usuario.limiteEmprestimos} empréstimos.`);
            return;
        }

        // Executa a transação (delegação de responsabilidade).
        if (livro.emprestar()) {
            const novoEmprestimo = new Emprestimo(this.emprestimos.length + 1, usuario, livro);
            this.emprestimos.push(novoEmprestimo);
            
            // Abstração: Chama o método genérico do Notificador (sem saber se é SMS ou Email).
            this.notificador.enviar(
                `Empréstimo de "${livro.titulo}" realizado. Devolução em ${usuario.diasPrazoDevolucao} dias.`, 
                usuario.nome
            );
        }
    }

    // Método: Orquestra a devolução.
    public realizarDevolucao(emprestimoId: number): void {
        const emprestimo = this.emprestimos.find(e => e.id === emprestimoId);
        
        if (!emprestimo || emprestimo.foiDevolvido) {
            console.log("Empréstimo inválido ou já devolvido.");
            return;
        }

        // Delegação de Responsabilidade: A multa e a devolução do livro são feitas pelo objeto Emprestimo.
        const multa = emprestimo.finalizarDevolucao();
        
        if (multa > 0) {
            console.log(`Devolução com atraso. Multa: R$ ${multa.toFixed(2)}. Total Pendente: R$ ${emprestimo.usuario.totalMultas.toFixed(2)}`);
            this.notificador.enviar(`Multa de R$ ${multa.toFixed(2)} aplicada.`, emprestimo.usuario.nome);
        } else {
            console.log("Devolução realizada dentro do prazo.");
        }
    }
}

// 6. SIMULAÇÃO DE USO (Código de Teste)

// Instancia a Biblioteca, injetando o tipo de notificação a ser usado.
const sistema = new Biblioteca(new NotificacaoConsole()); 

// Cria e adiciona Livros
sistema.adicionarLivro(new Livro(1, "Clean Code", "Robert Martin", 89.90, 3, 3));
sistema.adicionarLivro(new Livro(2, "1984", "George Orwell", 45.00, 2, 2));

// Cria e registra Usuários de diferentes tipos (Polimorfismo).
const aluno = new Estudante(1, "Ana Silva", "ana@email.com");
const prof = new Professor(2, "Carlos Santos", "carlos@email.com");
const comum = new UsuarioComum(3, "Bia Comum", "bia@email.com");

sistema.registrarUsuario(aluno);
sistema.registrarUsuario(prof);
sistema.registrarUsuario(comum);


console.log("--- Teste de Empréstimo ---");
sistema.realizarEmprestimo(1, 1); // Ana (Estudante, 14 dias) pega Clean Code
sistema.realizarEmprestimo(2, 2); // Carlos (Professor, 30 dias) pega 1984
sistema.realizarEmprestimo(3, 1); // Bia (Comum, 7 dias) tenta pegar Clean Code (falha, pois já está emprestado)

console.log("\n--- Teste de Devolução ---");
sistema.realizarDevolucao(1); // Devolução do empréstimo 1 (Clean Code)

console.log("\n--- Teste de Empréstimo após Devolução ---");
sistema.realizarEmprestimo(3, 1); // Bia consegue pegar Clean Code