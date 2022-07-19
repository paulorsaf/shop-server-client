export class QueryBusMock {

    executedWith: any;

    execute(params: any) {
        this.executedWith = params;
    }

}