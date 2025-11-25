//Atividade 3 : Sistema de Pagamento

// 1. CLASSE ContaBancaria

class ContaBancaria {
    //Proteção de Dados: Esses atributos são 'private', ou seja, SÓ PODEM ser alterados
    // ou lidos por MÉTODOS dentro desta classe. (Encapsulamento)
    private titular: string;
    private numeroConta: string;
    private _saldo: number; 
    private historicoMovimentacoes: string[]; 

    // chamada do constructor na criação do objeto para garantir que ele comece com valores válidos.
    constructor(titular: string, numeroConta: string, saldoInicial: number) {
        this.titular = titular;
        this.numeroConta = numeroConta;
        this._saldo = saldoInicial;
        this.historicoMovimentacoes = [`Criação da conta com saldo inicial de R$ ${saldoInicial.toFixed(2)}`];
    }

    // MÉTODO GETTER: Permite que o código externo LEIA o nome, de forma segura.
    public get titularConta(): string {
        return this.titular;
    }

    //  MÉTODO GETTER: Permite ler o número da conta, mas impede que seja alterado diretamente.
    public get numConta(): string {
        return this.numeroConta;
    }

    // MÉTODO GETTER: Deixa o saldo ser lido publicamente. O '_' é omitido para clareza externa.
    public get saldo(): number {
        return this._saldo;
    }

    // MÉTODO GETTER: Expõe o histórico para consulta.
    public get historico(): string[] {
        return this.historicoMovimentacoes;
    }

    // uma função AUXILIAR interna da classe, que só ela pode usar.
    private registrarMovimentacao(descricao: string): void {
        this.historicoMovimentacoes.push(`[${new Date().toLocaleTimeString()}] ${descricao}`);
    }

    // Método de Negócio: Debitar
    public debitar(valor: number, descricao: string): boolean {
        // Lógica de TRAVA: Só executa se o saldo atual for maior ou igual ao valor.
        if (this._saldo >= valor) {
            this._saldo -= valor; // Altera o atributo privado.
            this.registrarMovimentacao(`Débito de R$ ${valor.toFixed(2)} - ${descricao}`);
            return true;
        }
        // Se a condição falhar, o débito é negado.
        this.registrarMovimentacao(`FALHA ao tentar debitar R$ ${valor.toFixed(2)} - Saldo insuficiente.`);
        return false;
    }

    // Método de Negócio: Creditar
    public creditar(valor: number, descricao: string): void {
        this._saldo += valor;
        this.registrarMovimentacao(`Crédito de R$ ${valor.toFixed(2)} - ${descricao}`);
    }
}

// 2. INTERFACE MeioPagamento: O Contrato. (Abstração)


// A interface é a ABSTRAÇÃO PURA: ela define O QUE precisa ser feito (o contrato), 
// sem dizer COMO. Esconde os detalhes da implementação das classes que a utilizam.
interface MeioPagamento {
    // O sistema só vai chamar esta função, independentemente da classe real.
    processarPagamento(conta: ContaBancaria, valor: number): boolean;
}


// 3. ABSTRAÇÃO E ENCAPSULAMENTO - Classes Concretas
// Cada classe abaixo implementa o contrato 'MeioPagamento' com sua lógica ÚNICA.

//Cartão de Crédito
class CartaoCredito implements MeioPagamento {
    // Dados sensíveis PRIVADOS por segurança (Encapsulamento).
    private numeroCartao: string;
    private cvv: string;
    private limiteDisponivel: number; 

    constructor(numero: string, cvv: string, limite: number) {
        this.numeroCartao = numero;
        this.cvv = cvv;
        this.limiteDisponivel = limite;
    }

    // Implementação do Contrato.
    processarPagamento(conta: ContaBancaria, valor: number): boolean {
        console.log(`\nProcessando CC R$ ${valor.toFixed(2)} da conta ${conta.numConta}`);
        
        // Validação Exclusiva: Lógica única do Cartão de Crédito.
        if (valor > this.limiteDisponivel) {
            console.log(`\t FALHA CC: Limite de R$ ${this.limiteDisponivel.toFixed(2)} excedido.`);
            return false;
        }

        // Relacionamento (Uso): Usa a ContaBancaria para registrar o Crédito (o pagamento entra na conta).
        conta.creditar(valor, `Pagamento recebido via Cartão de Crédito`);
        this.limiteDisponivel -= valor; // Reduz o limite 

        console.log(`\t SUCESSO CC. Novo limite: R$ ${this.limiteDisponivel.toFixed(2)}`);
        return true;
    }
}

// Cartão de Débito
class CartaoDebito implements MeioPagamento {
    private numeroCartao: string;
    private senhaHash: string; // Simulação de dado sensível privado.

    constructor(numero: string, senha: string) {
        this.numeroCartao = numero;
        this.senhaHash = `HASH-${senha}`; 
    }

    // Implementação do Contrato.
    processarPagamento(contaOrigem: ContaBancaria, valor: number): boolean {
        console.log(`\nProcessando CD R$ ${valor.toFixed(2)} da conta ${contaOrigem.numConta}`);

        // Validação Exclusiva + Relacionamento (Uso): Usa o método 'debitar' da Conta.
        // O débito só ocorre se o saldo for suficiente
        if (contaOrigem.debitar(valor, `Pagamento via Cartão de Débito`)) {
            console.log(`\t SUCESSO CD. Débito realizado na conta ${contaOrigem.numConta}.`);
            return true;
        }

        // Se o débito falhar.
        console.log(`\t FALHA CD: Saldo insuficiente na conta de origem.`);
        return false;
    }
}

// Boleto Bancário
class BoletoBancario implements MeioPagamento {
    private linhaDigitavel: string;
    private dataVencimento: Date; 

    constructor(vencimento: Date) {
        this.linhaDigitavel = `34191... ${Math.floor(Math.random() * 999999)}`;
        this.dataVencimento = vencimento;
    }

    // Implementação do Contrato.
    processarPagamento(contaRecebedora: ContaBancaria, valor: number): boolean {
        console.log(`\nProcessando Boleto R$ ${valor.toFixed(2)} (Venc.: ${this.dataVencimento.toLocaleDateString()})`);
        
        // Validação: Lógica única de Boleto (verifica se está vencido).
        if (new Date() > this.dataVencimento) {
            console.log(`\t FALHA Boleto: Boleto VENCIDO.`);
            return false;
        }
        
        // Relacionamento (Uso): Credita o valor na conta.
        contaRecebedora.creditar(valor, `Pagamento recebido via Boleto (compensado)`);
        console.log(`\t SUCESSO Boleto. Crédito compensado na conta ${contaRecebedora.numConta}.`);
        return true;
    }
}

// PIX
class Pix implements MeioPagamento {
    private chavePix: string; // Dado privado.

    constructor(chave: string) {
        this.chavePix = chave;
    }

    // Implementação do Contrato.
    processarPagamento(contaRecebedora: ContaBancaria, valor: number): boolean {
        console.log(`\nProcessando PIX R$ ${valor.toFixed(2)} (Chave: ${this.chavePix})`);
        
        // Validação Exclusiva: Validações simples de PIX (valor).
        if (valor <= 0) {
            console.log(`\t FALHA PIX: Valor de PIX deve ser maior que zero.`);
            return false;
        }

        // Relacionamento (Uso): Crédito instantâneo.
        contaRecebedora.creditar(valor, `Transferência PIX recebida`);
        console.log(`\t SUCESSO PIX. Transferência instantânea realizada.`);
        return true;
    }
}


// 5. INSTANCIAÇÃO E 6. SIMULAÇÃO

// Criando contas bancárias para movimentação.
const contaCliente = new ContaBancaria("Cliente A", "1001-X", 500.00);
const contaLoja = new ContaBancaria("Loja B", "2002-Y", 1000.00);
const contaFornecedor = new ContaBancaria("Fornecedor C", "3003-Z", 50.00);
const contaSalario = new ContaBancaria("Salário D", "4004-W", 0.00);

// Criando instâncias dos meios de pagamento.
const cc = new CartaoCredito("1234...", "456", 800.00);
const cd = new CartaoDebito("5678...", "1234");
// Boleto OK (vence daqui a 3 dias)
const boletoOk = new BoletoBancario(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
// Boleto VENCIDO (venceu ontem)
const boletoVencido = new BoletoBancario(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000));
const pix = new Pix("email@exemplo.com");


console.log('\n======================================================');
console.log('INÍCIO DA SIMULAÇÃO: MOVIMENTAÇÕES DE PAGAMENTO');
console.log(`Saldo inicial Cliente A: R$ ${contaCliente.saldo.toFixed(2)}`);
console.log(`Saldo inicial Loja B: R$ ${contaLoja.saldo.toFixed(2)}`);
console.log('======================================================');

// O sistema usa a ABSTRAÇÃO da interface MeioPagamento, tratando todos os objetos de forma unificada.

// SIMULAÇÃO 1: Débito bem-sucedido (Cliente A paga à Loja B)
if (cd.processarPagamento(contaCliente, 50.00)) {
    contaLoja.creditar(50.00, "Venda via Cartão de Débito (simulação)");
}

// SIMULAÇÃO 2: Crédito bem-sucedido (Fornecedor C recebe o pagamento)
cc.processarPagamento(contaFornecedor, 700.00);

// SIMULAÇÃO 3: TRAVA - CC (Limite Excedido)
// A validação do limite (lógica do CC) impede a transação.
cc.processarPagamento(contaLoja, 200.00); 

// SIMULAÇÃO 4: TRAVA - CD (Saldo Insuficiente)
// A trava de segurança do método debitar (Encapsulamento da Conta) impede a transação.
cd.processarPagamento(contaCliente, 500.00);

// SIMULAÇÃO 5: Boleto Válido (Salário D recebe)
boletoOk.processarPagamento(contaSalario, 150.00);

// SIMULAÇÃO 6: TRAVA - Boleto Vencido
// A validação da data de vencimento (lógica do Boleto) impede o processamento.
boletoVencido.processarPagamento(contaLoja, 10.00);

// SIMULAÇÃO 7: PIX (Loja B recebe)
pix.processarPagamento(contaLoja, 50.00);


// 7. LOG FINAL E DEMONSTRAÇÃO DO HISTÓRICO
console.log('\n======================================================');
console.log('VERIFICAÇÃO FINAL DE SALDOS E HISTÓRICOS');
console.log('======================================================');

[contaCliente, contaLoja, contaFornecedor, contaSalario].forEach(conta => {
    // Uso do GETTER público para ler os dados encapsulados.
    console.log(`\nConta: ${conta.titularConta} (${conta.numConta})`); 
    console.log(`SALDO FINAL: R$ ${conta.saldo.toFixed(2)}`);
    console.log('--- Histórico de Movimentações ---');
    // Exibição do histórico de logs da conta.
    conta.historico.forEach(mov => console.log(`\t- ${mov}`));
});