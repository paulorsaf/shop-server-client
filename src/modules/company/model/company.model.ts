export class Company {
    
    private readonly id: string;
    private readonly name: string;
    private readonly pixKey: string;

    constructor(params: CompanyParams){
        this.id = params.id;
        this.name = params.name;
        this.pixKey = params.pixKey;
    }

}

type CompanyParams = {
    id: string;
    name: string;
    pixKey: string;
}