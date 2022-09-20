import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";
import * as SendingBlue from "@sendinblue/client";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailRepository {

    async sendNewPurchaseToClient(purchase: Purchase){
        const smtpEmail = await this.createNewPurchaseEmailForClient(purchase);

        this.sendTransactionEmail(smtpEmail);

        return Promise.resolve({});
    }

    async sendNewPurchaseToCompany(purchase: Purchase){
        const smtpEmail = await this.createNewPurchaseEmailForCompany(purchase);

        this.sendTransactionEmail(smtpEmail);
        
        return Promise.resolve({});
    }

    async sendPaymentSuccessToClient(purchase: Purchase){
        const smtpEmail = await this.createPaymentSuccessEmailForClient(purchase);

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

    async getNewPurchaseEmailForCompanyHtmlContent(purchase: Purchase) {
        const mainContent = await this.getTemplateContent("new-purchase-for-company.template.html");

        return await this.createTemplate({
            mainContent,
            purchase
        });
    }

    async getNewPurchaseEmailForClientHtmlContent(purchase: Purchase) {
        const mainContent = await this.getTemplateContent("new-purchase-for-client.template.html");

        return await this.createTemplate({
            mainContent,
            purchase
        });
    }

    async getPaymentSuccessEmailFormClientHtmlContent(purchase: Purchase) {
        const mainContent = await this.getTemplateContent("payment-success-for-client.template.html");

        return await this.createTemplate({
            mainContent,
            purchase
        });
    }

    private async createNewPurchaseEmailForCompany(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Nova compra criada";
        smtpEmail.sender = {
            email: "paulorsaf@gmail.com",
            name: "Shop"
        };
        smtpEmail.to = [{email: purchase.company.email}];
        smtpEmail.htmlContent = await this.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        return smtpEmail;
    }

    private async createNewPurchaseEmailForClient(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Recebemos sua compra";
        smtpEmail.sender = {
            email: purchase.company.email,
            name: purchase.company.name
        };
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = await this.getNewPurchaseEmailForClientHtmlContent(purchase);
        return smtpEmail;
    }

    private async createPaymentSuccessEmailForClient(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = "Pagamento confirmado";
        smtpEmail.sender = {
            email: purchase.company.email,
            name: purchase.company.name
        };
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = await this.getPaymentSuccessEmailFormClientHtmlContent(purchase);
        return smtpEmail;
    }

    private async getTemplateContent(template: string){
        const file = `${process.cwd()}/src/modules/email/repositories/templates/${template}`;
        return await fs.readFileSync(file, 'utf8');
    }

    private async createTemplate(data: TemplateData) {
        const {addressContent, paymentContent, purchasesContent } = await this.getPartials();

        const template = handlebars.compile(data.mainContent);
        handlebars.registerPartial('addressContent', addressContent);
        handlebars.registerPartial('paymentContent', paymentContent);
        handlebars.registerPartial('purchasesContent', purchasesContent);
        handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });
        handlebars.registerHelper('paymentType', (type) => {
            if (type === "MONEY") {
                return "Dinheiro";
            }
            if (type === "CREDIT_CARD") {
                return "Cartão de crédito";
            }
            return type;
        })
        handlebars.registerHelper('price', ({price, priceWithDiscount}) => (priceWithDiscount || price).toFixed(2))
        handlebars.registerHelper('toFixed', (value: number) => value.toFixed(2));
        
        return template({purchase: data.purchase});
    }

    private async getPartials() {
        const addressContent = await this.getTemplateContent("partials/address-content.template.html");
        const paymentContent = await this.getTemplateContent("partials/payment-content.template.html");
        const purchasesContent = await this.getTemplateContent("partials/purchases-content.template.html");

        return {addressContent, paymentContent, purchasesContent};
    }

}

type TemplateData = {
    mainContent: string,
    purchase: Purchase,
}