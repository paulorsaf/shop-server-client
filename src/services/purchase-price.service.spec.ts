import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CupomRepository } from '../repositories/cupom.repository';
import { DeliveryService } from './delivery.service';
import { PurchasePriceService } from './purchase-price.service';

describe('PurchasePriceService', () => {

  let cupomRepository: CupomRepositoryMock;
  let service: PurchasePriceService;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule
      ],
      providers: [
        PurchasePriceService,

        CupomRepository,
        DeliveryService
      ]
    })
    .overrideProvider(CupomRepository).useValue(cupomRepository)
    .overrideProvider(DeliveryService).useValue(new DeliveryServiceMock())
    .compile();

    service = module.get<PurchasePriceService>(PurchasePriceService);
  });

  it('given purchase doesnt have products, then return 0', async () => {
    const params = {
      products: []
    } as any;

    const response = await service.calculatePrice(params);

    expect(response).toEqual({
      productsPrice: 0,
      deliveryPrice: 0,
      discount: 0,
      paymentFee: 0,
      totalPrice: 0,
      totalWithPaymentFee: 0
    });
  })

  describe('given purchase has products', () => {

    let params: any;

    beforeEach(() => {
      params = {
        company: {

        },
        products: [{amount: 2, price: 100, priceWithDiscount: 50}]
      };
    })

    it('when products dont have discount, then return products normal price', async () => {
      params.products[0].priceWithDiscount = null;

      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 200,
        deliveryPrice: 0,
        discount: 0,
        paymentFee: 0,
        totalPrice: 200,
        totalWithPaymentFee: 200
      });
    })

    it('when producs have discount, then return products with discounted price', async () => {
      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 100,
        deliveryPrice: 0,
        discount: 0,
        paymentFee: 0,
        totalPrice: 100,
        totalWithPaymentFee: 100
      });
    })

    it('when cupom found, then calculate price with cupom', async () => {
      params.cupom = "ANY_CUPOM";
      params.products[0].priceWithDiscount = null;
      cupomRepository._response = 10;

      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 200,
        deliveryPrice: 0,
        discount: 20,
        paymentFee: 0,
        totalPrice: 180,
        totalWithPaymentFee: 180
      });
    })

    it('when is delivery, then calculate total price with delivery fee', async () => {
      params.address = {
        destinationZipCode: "anyDestination",
        originZipCode: "anyOrigin"
      }
      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 100,
        deliveryPrice: 25,
        discount: 0,
        paymentFee: 0,
        totalPrice: 125,
        totalWithPaymentFee: 125
      });
    })

    it('when is payment with credit card, then add credit card fee', async () => {
      params.paymentType = "CREDIT_CARD";
      params.payment = {
        creditCard: {
          fee: {
            percentage: 15,
            value: 2
          }
        }
      }
      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 100,
        deliveryPrice: 0,
        discount: 0,
        paymentFee: 17,
        totalPrice: 100,
        totalWithPaymentFee: 117
      });
    })

    it('when full payment, then add credit card fee', async () => {
      params.address = {
        destinationZipCode: "anyDestination",
        originZipCode: "anyOrigin"
      };
      params.paymentType = "CREDIT_CARD";
      params.payment = {
        creditCard: {
          fee: {
            percentage: 15,
            value: 2
          }
        }
      };
      const response = await service.calculatePrice(params);
  
      expect(response).toEqual({
        productsPrice: 100,
        deliveryPrice: 25,
        discount: 0,
        paymentFee: 20.75,
        totalPrice: 125,
        totalWithPaymentFee: 145.75
      });
    })

  })

});

class DeliveryServiceMock {
  calculateDelivery() {
    return 25;
  }
}

class CupomRepositoryMock {
  _response;
  findPercentage() {
    return this._response || 0;
  }
}