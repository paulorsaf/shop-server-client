import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";
import * as SendingBlue from "@sendinblue/client";
import { Company } from "../model/company.model";

@Injectable()
export class EmailRepository {

    sendNewPurchaseToCompany(purchase: Purchase){
        const smtpEmail = this.createEmail(purchase);

        const apiKey = process.env.SENDINBLUE_API_KEY;
        if (apiKey) {
            const emailsApi = new SendingBlue.TransactionalEmailsApi();
            emailsApi.setApiKey(
                SendingBlue.TransactionalEmailsApiApiKeys.apiKey,
                apiKey
            );

            return emailsApi.sendTransacEmail(smtpEmail);
        }
        return Promise.resolve({});
    }

    private createEmail(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Nova compra criada";
        smtpEmail.sender = this.getSender(purchase.company);
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = this.getHtmlContent(purchase);
        return smtpEmail;
    }

    private getSender(company: Company) {
        return {
            email: company.email,
            name: company.name
        }
    }

    private getHtmlContent(purchase: Purchase) {
        return `
            <p>Nova compra feita por <b>${purchase.user.email}</b>.</p>
            <fieldset>
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