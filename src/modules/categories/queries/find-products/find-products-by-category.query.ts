export class FindProductsByCategoryQuery {
    constructor(
        public readonly companyId: string,
        public readonly categoryId: string
    ){}
}