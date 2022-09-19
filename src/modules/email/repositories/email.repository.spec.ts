import { Test, TestingModule } from '@nestjs/testing';
import { EmailRepository } from './email.repository';
import * as fs from 'fs';
import * as path from 'path';

xdescribe('EmailRepository', () => {

  let repository: EmailRepository;
  let purchase: any;

  beforeEach(async () => {
    purchase = {
      "products":[
        {
          "name":"Produto teste 1",
          "stock":{
              "color":"#ff0000",
              "companyId":"TOQx2rIfbZ5tav2nS2fg",
              "productId":"Eg7cZN86twyVkO3evQ0M",
              "quantity":51,
              "size":"GG",
              "id":"7I9fkVumTj6vDVI6dSLD"
          },
          "totalPrice":100,
          "amount":1,
          "id":"Eg7cZN86twyVkO3evQ0M",
          "price":100,
          "priceWithDiscount":0,
          "weight":0.8,
          "companyId":"TOQx2rIfbZ5tav2nS2fg"
        },
        {
          "weight":0.8,
          "totalPrice":200,
          "price":100,
          "companyId":"TOQx2rIfbZ5tav2nS2fg",
          "id":"Eg7cZN86twyVkO3evQ0M",
          "name":"Produto teste 1",
          "priceWithDiscount":0,
          "amount":2,
          "stock":{
            "id":"gi3S00dnVtR7VdaV9Qe6",
            "productId":"Eg7cZN86twyVkO3evQ0M",
            "quantity":61,
            "color":"#000000",
            "size":"G",
            "companyId":"TOQx2rIfbZ5tav2nS2fg"
          }
        }
      ],
      "user":{
        "email":"paulorsaf@gmail.com",
        "id":"5S7mFp0roTYZ0kDNNJP5AlK2IFZ2"
      },
      "price":{
        "paymentFee":10.49,
        "totalWithPaymentFee":320.49,
        "products":300,
        "total":310,
        "delivery":10
      },
      "status":"PAID",
      "address":{
        "longitude":-38.4886446,
        "street":"Rua Juiz de Fora",
        "complement":"casa",
        "neighborhood":"Parque Manibura",
        "zipCode":"60.821-700",
        "number":"65",
        "city":"Fortaleza",
        "state":"CE",
        "latitude":-3.7936175
      },
      "companyId":"TOQx2rIfbZ5tav2nS2fg",
      "createdAt":"2022-09-17T06:03:07",
      "payment":{
        "type":"CREDIT_CARD",
        "status":"succeeded",
        "id":"pi_3Liu7SKpQMVMyt0d0ooNTy8I",
        "card":{
          "exp_month":12,
          "last4":"1111",
          "id":"pm_1LiGINKpQMVMyt0dFs51ripz",
          "exp_year":2026,
          "brand":"visa"
        },
        "receiptUrl":"https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTGZrVDFLcFFNVk15dDBkKKTGlZkGMgaMjItaZuI6LBYI6dNJ95KZ6wDb-NU3GWA-6mxCWAy4oiiaaOLPBkF_iGixqR0TApPZVTy-"
      },
      "totalAmount":3,
      "company":{
        "email":"paulorsaf@gmail.com"
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailRepository]
    })
    .compile();

    repository = module.get<EmailRepository>(EmailRepository);
  });

  describe('given company', () => {

    beforeEach(() => {
      purchase.payment.card = null;
      purchase.payment.receiptUrl = null;
    })

    describe('when delivery', () => {
  
      it('send new purchase email to company delivery', async () => {
        const html = await repository.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-company/delivery.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to company pick up', async () => {
        purchase.address = null;
        const html = await repository.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-company/pick-up.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
  
    })
  
    describe('when payment', () => {
  
      it('send new purchase email to company credit card', async () => {
        const html = await repository.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-company/credit-card.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to company pix', async () => {
        purchase.payment.card = undefined;
        purchase.payment.type = "PIX";
        purchase.payment.receiptUrl = "https://storage.googleapis.com/shop-354211.appspot.com/receipts/pix/L35ZnKs6Vyzab1BgJYrK/C9OxKn1vXF609XS508dv/711a8b2a-18be-48fe-9cdd-9fe023289450.png?GoogleAccessId=firebase-adminsdk-7q4i1%40shop-354211.iam.gserviceaccount.com&Expires=32501952000&Signature=qbsN88sy7nCerhO3FxxBUnHJrVFLXW4KBHLLRcUFUQBZK0hmNl3XOasGFp2%2F9WxggiM5i37ZNyOGsoxaXaBoFsa0U7QiUADTSW0qxguNgF5IQZUoeFLcnJ67wS8dkvBo941vSPDSlcH%2F4c9ZaFmcgdE4WByAAH%2F6mLco5v8sFoLughkb83c0PK3WIAMvxG1UeAEzJvEIXf0GsN%2FnCAArWcg0hYmfLFU4858uySj7X2KPLUSXH43FAJNJmMsg3JU4LB%2Fvz2loWPadf4qfGaxI%2BiSqKgICFUpP0Mb%2BvlrEaE2AVZ%2B6Nkxe1pquryLWt%2F2%2BnfqbMktNjfspjkPYo61Pzw%3D%3D";
        const html = await repository.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-company/pix.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to company money', async () => {
        purchase.payment.card = undefined;
        purchase.payment.type = "MONEY";
        purchase.payment.receiptUrl = undefined;
        const html = await repository.getNewPurchaseEmailForCompanyHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-company/money.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
  
    })

  })

  describe('given client', () => {

    beforeEach(() => {
      purchase.payment.card = null;
      purchase.payment.receiptUrl = null;
    })

    describe('when delivery', () => {

      it('send new purchase email to client delivery', async () => {
        const html = await repository.getNewPurchaseEmailForClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-client/delivery.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to client pick up', async () => {
        purchase.address = null;
        const html = await repository.getNewPurchaseEmailForClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-client/pick-up.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
      
    })

    describe('when payment', () => {
  
      it('send new purchase email to client credit card', async () => {
        const html = await repository.getNewPurchaseEmailForClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-client/credit-card.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to client pix', async () => {
        purchase.payment.card = undefined;
        purchase.payment.type = "PIX";
        purchase.payment.receiptUrl = "https://storage.googleapis.com/shop-354211.appspot.com/receipts/pix/L35ZnKs6Vyzab1BgJYrK/C9OxKn1vXF609XS508dv/711a8b2a-18be-48fe-9cdd-9fe023289450.png?GoogleAccessId=firebase-adminsdk-7q4i1%40shop-354211.iam.gserviceaccount.com&Expires=32501952000&Signature=qbsN88sy7nCerhO3FxxBUnHJrVFLXW4KBHLLRcUFUQBZK0hmNl3XOasGFp2%2F9WxggiM5i37ZNyOGsoxaXaBoFsa0U7QiUADTSW0qxguNgF5IQZUoeFLcnJ67wS8dkvBo941vSPDSlcH%2F4c9ZaFmcgdE4WByAAH%2F6mLco5v8sFoLughkb83c0PK3WIAMvxG1UeAEzJvEIXf0GsN%2FnCAArWcg0hYmfLFU4858uySj7X2KPLUSXH43FAJNJmMsg3JU4LB%2Fvz2loWPadf4qfGaxI%2BiSqKgICFUpP0Mb%2BvlrEaE2AVZ%2B6Nkxe1pquryLWt%2F2%2BnfqbMktNjfspjkPYo61Pzw%3D%3D";
        const html = await repository.getNewPurchaseEmailForClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-client/pix.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to client money', async () => {
        purchase.payment.card = undefined;
        purchase.payment.type = "MONEY";
        purchase.payment.receiptUrl = undefined;
        const html = await repository.getNewPurchaseEmailForClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/new-purchase-for-client/money.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
  
    })
  
    describe('when payment success', () => {
  
      it('send new purchase email to company credit card', async () => {
        const html = await repository.getPaymentSuccessEmailFormClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/payment-success-for-client/credit-card.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
    
      it('send new purchase email to company pix', async () => {
        purchase.payment.card = undefined;
        purchase.payment.type = "PIX";
        purchase.payment.receiptUrl = "https://storage.googleapis.com/shop-354211.appspot.com/receipts/pix/L35ZnKs6Vyzab1BgJYrK/C9OxKn1vXF609XS508dv/711a8b2a-18be-48fe-9cdd-9fe023289450.png?GoogleAccessId=firebase-adminsdk-7q4i1%40shop-354211.iam.gserviceaccount.com&Expires=32501952000&Signature=qbsN88sy7nCerhO3FxxBUnHJrVFLXW4KBHLLRcUFUQBZK0hmNl3XOasGFp2%2F9WxggiM5i37ZNyOGsoxaXaBoFsa0U7QiUADTSW0qxguNgF5IQZUoeFLcnJ67wS8dkvBo941vSPDSlcH%2F4c9ZaFmcgdE4WByAAH%2F6mLco5v8sFoLughkb83c0PK3WIAMvxG1UeAEzJvEIXf0GsN%2FnCAArWcg0hYmfLFU4858uySj7X2KPLUSXH43FAJNJmMsg3JU4LB%2Fvz2loWPadf4qfGaxI%2BiSqKgICFUpP0Mb%2BvlrEaE2AVZ%2B6Nkxe1pquryLWt%2F2%2BnfqbMktNjfspjkPYo61Pzw%3D%3D";
        const html = await repository.getPaymentSuccessEmailFormClientHtmlContent(purchase);
        
        const file = `${path.resolve(__dirname)}/templates/results/payment-success-for-client/pix.html`;
        await fs.writeFileSync(file, html, 'utf8');
    
        expect(false).toBeTruthy();
      })
  
    })

  })

});