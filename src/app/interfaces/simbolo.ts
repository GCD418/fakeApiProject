export interface Simbolo {
    nombre: string;
}

export interface SimboloDetails extends Simbolo {
    base_currency: string;
    quote_currency: string;
    tick_size: number;
    quote_increment: number;
    min_order_size: string;
    status: string;
    wrap_enabled: boolean;
    product_type: string;
    contract_type: string;
    contract_price_currency: string;
}
