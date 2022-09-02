import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";
import * as SendingBlue from "@sendinblue/client";

@Injectable()
export class EmailRepository {

    sendNewPurchaseToClient(purchase: Purchase){
        const smtpEmail = this.createNewPurchaseEmailForCompany(purchase);

        this.sendTransactionEmail(smtpEmail);

        return Promise.resolve({});
    }

    sendNewPurchaseToCompany(purchase: Purchase){
        const smtpEmail = this.createNewPurchaseEmailForClient(purchase);

        this.sendTransactionEmail(smtpEmail);
        
        return Promise.resolve({});
    }

    private sendTransactionEmail(smtpEmail: SendingBlue.SendSmtpEmail){
        const apiKey = process.env.SENDINBLUE_API_KEY;
        if (apiKey) {
            const emailsApi = new SendingBlue.TransactionalEmailsApi();
            emailsApi.setApiKey(
                SendingBlue.TransactionalEmailsApiApiKeys.apiKey,
                apiKey
            );

            return emailsApi.sendTransacEmail(smtpEmail);
        }
    }

    private createNewPurchaseEmailForCompany(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Nova compra criada";
        smtpEmail.sender = {
            email: "paulorsaf@gmail.com",
            name: "Shop"
        };
        smtpEmail.to = [{email: purchase.company.email}];
        smtpEmail.htmlContent = this.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        return smtpEmail;
    }

    private createNewPurchaseEmailForClient(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Recebemos sua compra";
        smtpEmail.sender = {
            email: purchase.company.email,
            name: purchase.company.name
        };
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = this.getNewPurchaseEmailForCompanyHtmlClientContent(purchase);
        return smtpEmail;
    }

    private getNewPurchaseEmailForCompanyHtmlContent(purchase: Purchase) {
        return `
            <p>Nova compra feita por <b>${purchase.user.email}</b>.</p>
            ${this.getPurchaseContent(purchase)}
        `;
    }

    private getNewPurchaseEmailForCompanyHtmlClientContent(purchase: Purchase) {
        return `
            <p>
                Recebemos a sua compra.<br/>
                ${
                    purchase.payment.type === "MONEY" ?
                        "Por favor, aguarde enquanto atendemos o seu pedido."
                        : "Por favor, aguarde enquanto confirmamos o seu pagamento."
                }
                ${this.getPurchaseContent(purchase)}
            </p>
        `;
    }

    private getPurchaseContent(purchase: Purchase) {
        return `<fieldset></fieldset>
                    <legend style="font-weigth:600">Detalhes da compra:</legend>
                    ${purchase.products.map(p => 
                        `<div style="padding-bottom:10px;">
                            <div>${p.amount}x ${p.name}</div>
                            <div>
                                R$ ${p.totalPrice.toFixed(2)}
                                (${p.amount}x R$ ${(p.priceWithDiscount || p.price).toFixed(2)})
                            </div>
                            ${p.stock ?
                                p.stock?.color ?
                                    `<div style="width:60px;height:30px;background:${p.stock.color};border-radius:10px;color:white;text-align:center;line-height:30px;">
                                        ${p.stock.size}
                                    </div>`
                                :
                                p.stock?.size ? `<div>Tamanho: ${p.stock.size}</div>` : ''
                            : ''}
                        </div>`
                    ).join('')}
                    <br/>
                    <b>
                        <div>
                            Total:
                            ${purchase.totalAmount} ${purchase.totalAmount === 1 ? "produto" : "produtos"}
                            por R$ ${purchase.totalPrice.toFixed(2)}
                        </div>
                    </b>
                </fieldset>
                <br/>
                <fieldset>
                    <legend style="font-weigth:600">Endereço da entrega:</legend>
                    ${
                        purchase.address ?
                        `Rua: ${purchase.address.street}<br/>
                        Número: ${purchase.address.number}<br/>
                        Bairro: ${purchase.address.neighborhood}<br/>
                        CEP: ${purchase.address.zipCode}<br/>
                        Complemento: ${purchase.address.complement}<br/>
                        Cidade: ${purchase.address.city}<br/>
                        Estado: ${purchase.address.state}`
                        :
                        'Busca na loja'
                    }
                </fieldset>
                <br/>
                <fieldset>
                    <legend style="font-weigth:600">Dados do pagamento:</legend>
                    Tipo de pagamento: ${this.getPaymentDescription(purchase)}<br/>
                    ${purchase.payment.receiptUrl ?
                        `<a href="${purchase.payment.receiptUrl}" target="_blank">Ver recibo</a><br/>`
                        : ''
                    }
                </fieldset>
        `;
    }

    private getPaymentDescription(purchase: Purchase) {
        if (purchase.payment.type === "MONEY") {
            return "Dinheiro";
        }
        return purchase.payment.type;
    }

}