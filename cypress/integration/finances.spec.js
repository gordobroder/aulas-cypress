/// <reference types="cypress" />
import { format, prepareLocalStorage } from '../support/utils'

context('Dev finances Agilizei', () => {

    // hooks 
    // são trechos de código que executam antes e depois do teste
    // before -> antes de todos os testes
    // beforeEach -> antes de cada teste
    // after -> depois de todos os testes
    // afterEach -> depois de cada teste
    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
    });

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click() // aqui eu pego pelo id + classe
        cy.get('#description').type('Pagamento Antecipado') // nesse eu pego só pelo id
        cy.get('[name=amount]').type(50) // exemplo de busca pelo atributo
        cy.get('[type=date]').type('2021-03-17'); // atributo
        cy.get('button').contains('Salvar').click() // esse aqui é onde pega pelo texto do botão

        cy.get('#data-table tbody tr').should('have.length', 3) // aqui pega a table das transações e espera o resultado de 1 item na lista

        //remover entradas e saídas

    });

    it('Cadastrar Saídas', () => {

        cy.get('#transaction .button').click() // aqui eu pego pelo id + classe
        cy.get('#description').type('Cobrança') // nesse eu pego só pelo id
        cy.get('[name=amount]').type(-12) // exemplo de busca pelo atributo
        cy.get('[type=date]').type('2021-03-17'); // atributo
        cy.get('button').contains('Salvar').click() // esse aqui é onde pega pelo texto do botão

        cy.get('#data-table tbody tr').should('have.length', 3) // aqui pega a table das transações e espera o resultado de 3 item na lista
        
    });

    it('Remover entradas e saídas', () => {

        // estrategia 1: voltar para o elemento pai e avançar para o td img attr

        // cy.get('td.description')
        // .contains(entrada)
        // .parent()
        // .find('img[onClick*=remove]')
        // .click()

        // estrategia 2: busca os elementos que são irmãos e então busca pela img + attr

        cy.get('td.description')
        .contains("Saque caixa 24hrs")
        .siblings()
        .children('img[onclick*=remove]')
        .click()

        cy.get('#data-table tbody tr').should('have.length', 1)

    });

    it('Validar saldo com diversas transações', () => {

        // steps:
        // - capturar as linhas com as transações
        // - capturar o texto dessas colunas(nome, valores etc)
        // - formatar os valores das linhas(eles tem caracteres especiais)
        // - capturar o texto do total
        // - comparar o somatório de todas as entradas e saídas com o valor do total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }
                cy.log('entradas', incomes)
                cy.log('saidas', expenses)
            })


        })

        cy.get('#totalDisplay').invoke('text').then(text => {
            
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)

        });



    });

});