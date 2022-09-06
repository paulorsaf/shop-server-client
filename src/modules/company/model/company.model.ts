export class Company {
    
    private readonly address: any;
    private readonly id: string;
    private readonly name: string;
    private readonly pixKey: string;

    constructor(params: CompanyParams){
        this.address = params.address;
        this.id = params.id;
        this.name = params.name;
        this.pixKey = params.pixKey;
    }

}

type CompanyParams = {
    address: any;
    id: string;
    name: string;
    pixKey: string;
}