export class Company {
    
    readonly aboutUs: string;
    readonly address: any;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly payment: CompanyPayment;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.payment = params.payment;
    }

}

type CompanyParams = {
    aboutUs: string;
    address: any;
    id: string;
    logo: Image;
    name: string;
    payment: CompanyPayment;
}

type CompanyPayment = {
    creditCard: {
        flags: string[]
    }
    pixKey: string;
}

type Image = {
    imageUrl: string;
}