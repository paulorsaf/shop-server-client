export class Company {
    
    readonly aboutUs: string;
    readonly address: any;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly payment: CompanyPayment;
    readonly facebook: string;
    readonly instagram: string;
    readonly website: string;
    readonly whatsapp: string;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.payment = params.payment;
        this.facebook = params.facebook;
        this.instagram = params.instagram;
        this.website = params.website;
        this.whatsapp = params.whatsapp
    }

}

type CompanyParams = {
    aboutUs: string;
    address: any;
    id: string;
    logo: Image;
    name: string;
    payment: CompanyPayment;
    facebook: string;
    instagram: string;
    website: string;
    whatsapp: string;
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