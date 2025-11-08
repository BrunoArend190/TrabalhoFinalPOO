//Atividade 2 : Sistema de Funcionarios

// 1. CLASSE BASE ABSTRATA: Funcionario (Define o contrato e a Herança)


// A palavra-chave 'abstract' impede que se crie objetos diretamente desta classe (new Funcionario()).
abstract class Funcionario {
    // 'protected' permite que classes filhas (herança) acessem, mas proíbe código externo.
    protected nome: string;
    protected salarioBase: number;
    protected identificacao: string;

    // CONSTRUTOR: Executado ao criar qualquer objeto filho (Gerente, Dev, Estagiario).
    constructor(nome: string, salarioBase: number, identificacao: string) {
        this.nome = nome;
        this.salarioBase = salarioBase;
        this.identificacao = identificacao;
    }

    // 2. MÉTODO ABSTRATO: O coração do POLIMORFISMO.
    // Obriga cada classe filha a ter sua PRÓPRIA implementação.
    abstract calcularSalario(): number;

    // Método comum (herdado por todos) para exibir dados.
    public apresentar(): void {
        // Usa template string para formatação.
        console.log(`- ID: ${this.identificacao}, Nome: ${this.nome}`);
    }
}

// 3. CLASSE DERIVADA 1: Gerente (Herança)

// 'extends Funcionario' estabelece a HERANÇA. Gerente é um tipo de Funcionario.
class Gerente extends Funcionario {
    // Atributo específico do Gerente.
    private bonusPercentual: number = 0.20;

    // Construtor do Gerente.
    constructor(nome: string, salarioBase: number, identificacao: string) {
        // 'super' chama o construtor da classe pai (Funcionario) para inicializar nome, salarioBase e identificacao.
        super(nome, salarioBase, identificacao);
    }

    // 4. Implementação do Polimorfismo: Lógica Gerente.
    // Define a lógica específica para Gerentes, cumprindo a obrigação do método abstrato.
    calcularSalario(): number {
        // Salário base + 20% de bônus (cálculo exclusivo do Gerente).
        const salarioFinal = this.salarioBase * (1 + this.bonusPercentual);
        return parseFloat(salarioFinal.toFixed(2));
    }
}


// 3. CLASSE DERIVADA 2: Desenvolvedor (Melhor Prática de Encapsulamento)


class Desenvolvedor extends Funcionario {
    // Atributo 'private': Acessível SOMENTE dentro desta classe (Encapsulamento).
    private projetosEntregues: number;
    private bonusPorProjeto: number = 0.10;

    constructor(nome: string, salarioBase: number, identificacao: string, projetosEntregues: number) {
        // Inicializa atributos herdados.
        super(nome, salarioBase, identificacao);
        // Inicializa atributo específico.
        this.projetosEntregues = projetosEntregues;
    }

    // MÉTODO GETTER PÚBLICO: Permite ler o atributo 'private' de forma controlada.
    public getProjetosEntregues(): number {
        return this.projetosEntregues;
    }

    // 4. Implementação do Polimorfismo: Lógica Desenvolvedor.
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
    calcularSalario(): number {
        // Lógica: Salário é fixo, sem bônus (cálculo exclusivo do Estagiário).
        return this.salarioBase;
    }
}

// 5. INSTANCIAÇÃO 

console.log('***** INSTANCIAÇÃO DE FUNCIONÁRIOS *****');

// Lista Polimórfica: A lista é tipada como Funcionario[], mas armazena objetos de Gerente, Desenvolvedor e Estagiario (Herança).
const listaFuncionarios: Funcionario[] = [
    // Criação de 12 objetos, 4 de cada tipo.
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

// Percorremos a lista sem saber o tipo específico do objeto.
listaFuncionarios.forEach(func => {
    // Ponto de Polimorfismo: A chamada é a mesma (func.calcularSalario()), 
    // mas o resultado é diferente, pois o método EXECUTADO 
    // é o da CLASSE REAL do objeto (Gerente, Dev ou Estagiario).
    const salarioFinal = func.calcularSalario();

    let tipo: string;
    
    // Usamos 'instanceof' para descobrir a classe real para fins de log.
    if (func instanceof Gerente) {
        tipo = 'Gerente';
    } else if (func instanceof Desenvolvedor) { 
        // Aqui usamos o Casting '(func as Desenvolvedor)' para acessar o método GETTER
        // que expõe o atributo 'private' de forma segura.
        tipo = `Desenvolvedor (Projetos: ${(func as Desenvolvedor).getProjetosEntregues()})`;
    } else if (func instanceof Estagiario) {
        tipo = 'Estagiário';
    } else {
        tipo = 'Desconhecido';
    }
    
    // Log final. Chama o método apresentar() (herdado) e exibe o salário calculado polimorficamente.
    console.log(`[${tipo}] ${func.apresentar()} Salário Final: R$ ${salarioFinal.toFixed(2)}`);
});