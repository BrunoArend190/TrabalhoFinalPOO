// Atividade 2: Sistema de Funcionarios

// 1. CLASSE BASE ABSTRATA: Funcionario 

// A palavra-chave 'abstract' significa que esta classe é um molde incompleto.
// Ela existe apenas para ser HERDADA e não pode ser instanciada 
abstract class Funcionario {
    // 'protected': Modificador que permite que as classes filhas (Gerente, Dev, Estagiario)
    // acessem esses atributos, mas eles continuam ESCONDIDOS (Encapsulados) para o código externo.
    protected nome: string;
    protected salarioBase: number;
    protected identificacao: string;

    // CONSTRUTOR: Método que inicializa os atributos comuns a TODOS os funcionários.
    constructor(nome: string, salarioBase: number, identificacao: string) {
        this.nome = nome;
        this.salarioBase = salarioBase;
        this.identificacao = identificacao;
    }

    // 2. MÉTODO ABSTRATO: POLIMORFISMO.
    // Este método é declarado, mas sua lógica é deixada para as classes filhas implementarem.
    abstract calcularSalario(): number;

    // Método comum: É herdado por todas as classes filhas.
    public apresentar(): void {
        // Usa template string para formatação dos dados herdados.
        console.log(`- ID: ${this.identificacao}, Nome: ${this.nome}`);
    }
}

// 3. CLASSE DERIVADA 1: Gerente (Implementa a Estrutura do Funcionario)

// 'extends Funcionario' estabelece a HERANÇA: Gerente é um tipo especializado de Funcionario.
class Gerente extends Funcionario {
    // Atributo privado e específico do Gerente para o cálculo de salário.
    private bonusPercentual: number = 0.20;

    // Construtor:
    constructor(nome: string, salarioBase: number, identificacao: string) {
        // 'super': Chama o construtor da classe pai (Funcionario) para inicializar a base.
        super(nome, salarioBase, identificacao);
    }

    // 4. Implementação do Polimorfismo: Lógica Gerente.
    // implementação concreta do método abstrato 'calcularSalario()'.
    calcularSalario(): number {
        // Lógica: Salário base + 20% de bônus (cálculo exclusivo do Gerente).
        const salarioFinal = this.salarioBase * (1 + this.bonusPercentual);
        // Formata o resultado.
        return parseFloat(salarioFinal.toFixed(2));
    }
}

// 3. CLASSE DERIVADA 2: Desenvolvedor (Demonstra o Encapsulamento)

class Desenvolvedor extends Funcionario {
    // Atributo 'private': Acessível SOMENTE dentro desta classe (Proteção de Dados / Encapsulamento).
    private projetosEntregues: number;
    private bonusPorProjeto: number = 0.10;

    constructor(nome: string, salarioBase: number, identificacao: string, projetosEntregues: number) {
        // Inicializa atributos herdados.
        super(nome, salarioBase, identificacao);
        // Inicializa atributo específico do Desenvolvedor.
        this.projetosEntregues = projetosEntregues;
    }

    // MÉTODO GETTER PÚBLICO: A forma correta de LER o atributo 'private'.
    public getProjetosEntregues(): number {
        return this.projetosEntregues;
    }

    // 4. Implementação do Polimorfismo: Lógica Desenvolvedor.
    //implementação concreta de 'calcularSalario()'.
    calcularSalario(): number {
        // Lógica: Bônus variável baseado em projetos (cálculo exclusivo do Desenvolvedor).
        const bonusTotal = this.salarioBase * this.bonusPorProjeto * this.projetosEntregues;
        const salarioFinal = this.salarioBase + bonusTotal;
        return parseFloat(salarioFinal.toFixed(2));
    }
}

// 3. CLASSE DERIVADA 3: Estagiario

class Estagiario extends Funcionario {
    constructor(nome: string, salarioBase: number, identificacao: string) {
        // Inicializa atributos herdados.
        super(nome, salarioBase, identificacao);
    }

    // 4. Implementação do Polimorfismo: Lógica Estagiário.
    //implementação concreta de 'calcularSalario()'.
    calcularSalario(): number {
        // Lógica: Salário é fixo (apenas o salário base), sem bônus (cálculo exclusivo do Estagiário).
        return this.salarioBase;
    }
}

// 5. INSTANCIAÇÃO E LISTA POLIMÓRFICA

console.log('***** INSTANCIAÇÃO DE FUNCIONÁRIOS *****');

// Lista Polimórfica: A lista é tipada como Funcionario[] (a classe base/abstrata),
// mas armazena objetos de suas classes filhas
const listaFuncionarios: Funcionario[] = [
    
    new Gerente("Maria Gerente", 12000, "G001"),
    new Gerente("João Gerente", 15000, "G002"),
    new Gerente("Pedro Gerente", 10000, "G003"),
    new Gerente("Luisa Gerente", 18000, "G004"),

    new Desenvolvedor("Carlos Dev", 8000, "D001", 3), 
    new Desenvolvedor("Ana Dev", 9500, "D002", 5),     
    new Desenvolvedor("Fernando Dev", 7000, "D003", 0), 
    new Desenvolvedor("Beatriz Dev", 8500, "D004", 2), 

    new Estagiario("Rafael Estag.", 2000, "E001"),
    new Estagiario("Sofia Estag.", 2100, "E002"),
    new Estagiario("Lucas Estag.", 1800, "E003"),
    new Estagiario("Gabriela Estag.", 2200, "E004"),
];

// 6. SIMULAÇÃO: Percorrer a Lista e Demonstrar o POLIMORFISMO

console.log('\n======================================================');
console.log('SIMULAÇÃO DE CÁLCULO SALARIAL (POLIMORFISMO)');
console.log('======================================================');

// Percorremos a lista de objetos do tipo genérico 'Funcionario'.
listaFuncionarios.forEach(func => {
    // Ponto crucial do Polimorfismo: A chamada é a mesma para todos (func.calcularSalario()).
    // Descobre se 'func' é um Gerente, um Desenvolvedor ou um Estagiário e executa a lógica correta (diferente) para aquele objeto.
    const salarioFinal = func.calcularSalario();

    let tipo: string;
    
    // Usamos 'instanceof' para identificar o tipo real do objeto
    if (func instanceof Gerente) {
        tipo = 'Gerente';
    } else if (func instanceof Desenvolvedor) { 
        // objeto 'func' é definitivamente um Desenvolvedor, permitindo acessar o GETTER público.
        tipo = `Desenvolvedor (Projetos: ${(func as Desenvolvedor).getProjetosEntregues()})`;
    } else if (func instanceof Estagiario) {
        tipo = 'Estagiário';
    } else {
        tipo = 'Desconhecido';
    }
    
    // Log final. Chama o método apresentar() (herdado) e exibe o salário calculado polimorficamente.
    console.log(`[${tipo}] ${func.apresentar()} Salário Final: R$ ${salarioFinal.toFixed(2)}`);
});