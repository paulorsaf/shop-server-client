export class Company {
    
    readonly aboutUs: string;
    readonly address: any;
    readonly id: string;
    readonly name: string;
    readonly pixKey: string;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.id = params.id;
        this.name = params.name;
        this.pixKey = params.pixKey;
    }

}

type CompanyParams = {
    aboutUs: string;
    address: any;
    id: string;
    name: string;
    pixKey: string;
}