export type Product = {
    companyId: string;
    description: string;
    id: string;
    price: number;
    priceWithDiscount: number;
    name: string;
};

export type StockOption = {
    color: string;
    id: string;
    quantity: number;
    size: string;
}